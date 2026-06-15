import os
import json
import sys
import fitz
import requests
import base64
from tqdm import tqdm
from PIL import Image

import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
os.environ["PATH"] += os.pathsep + r'C:\Program Files\Tesseract-OCR'

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"

def check_ollama_status():
    try:
        response = requests.get("http://127.0.0.1:11434/api/tags", timeout=5)
        if response.status_code == 200:
            models = [m.get("name") for m in response.json().get("models", [])]
            print(f"Ollama is running. Available models: {models}")
            return "moondream:latest" in models or "moondream" in models
    except Exception as e:
        print(f"Warning: Could not connect to Ollama at localhost:11434. VLM descriptions will be skipped. ({e})")
    return False

def get_vlm_description(image_path):
    prompt = (
        "Describe any anatomical diagrams, histology slides, physiological pathways, clinical charts, "
        "flowcharts, medical algorithms, or dosage tables on this page. If you see a process or cycle, "
        "extract it as a step-by-step logical sequence (Step 1 -> Step 2). Keep descriptions concise and medical-grade. "
        "Do not write long paragraphs. If none, say 'No visual data'."
    )
    try:
        with open(image_path, "rb") as image_file:
            img_str = base64.b64encode(image_file.read()).decode('utf-8')
        
        payload = {
            "model": "moondream",
            "prompt": prompt,
            "images": [img_str],
            "stream": False
        }
        
        response = requests.post(OLLAMA_URL, json=payload, timeout=90)
        if response.status_code == 200:
            return response.json().get("response", "").strip()
        else:
            return f"Ollama VLM Error: {response.status_code}"
    except Exception as e:
        return f"VLM skipped: {e}"

def clean_filename(name):
    return name.replace(" ", "_").replace("&", "and").replace("'", "").replace("(", "").replace(")", "").replace("[", "").replace("]", "").replace(",", "")

def process_anatomy(pilot=False):
    anatomy_dir = r"d:\sample chatbot\MBBS\books\anatomy"
    master_jsonl_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "processed")
    
    has_vlm = check_ollama_status()
    
    pdf_files = []
    for root, dirs, files in os.walk(anatomy_dir):
        for file in files:
            if file.lower().endswith(".pdf") and not file.startswith("._"):
                pdf_files.append({
                    "book": file,
                    "path": os.path.join(root, file)
                })
                
    pdf_files = sorted(pdf_files, key=lambda x: x["book"])
    
    if pilot:
        print("\n=== PILOT MODE ACTIVE ===")
        print("Restricting processing to 1 book, and 2 pages per book.")
        if pdf_files:
            pdf_files = [pdf_files[0]]
            
    jsonl_name = "anatomy_vlm_data.jsonl"
    jsonl_path = os.path.join(master_jsonl_dir, jsonl_name)
    mode = "w" if pilot else "a"
    
    print(f"Total anatomy books to process: {len(pdf_files)}")
    
    for idx, book_info in enumerate(pdf_files):
        book_name = book_info["book"]
        path = book_info["path"]
        
        book_clean = clean_filename(book_name.replace(".pdf", ""))
        subject_clean = "anatomy"
        
        img_out_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "mbbs_processed", subject_clean, book_clean)
        os.makedirs(img_out_dir, exist_ok=True)
        
        print(f"\n[{idx+1}/{len(pdf_files)}] Processing book: {book_name}")
        
        try:
            doc = fitz.open(path)
            total_pages = doc.page_count
        except Exception as e:
            print(f"  Error opening PDF {book_name}: {e}")
            continue
            
        processed_count = 0
        
        with open(jsonl_path, mode, encoding="utf-8") as f_out:
            for page_idx in tqdm(range(total_pages), desc=f"Processing {book_clean[:30]}"):
                page_num = page_idx + 1
                
                page = doc[page_idx]
                text = page.get_text().strip()
                text_len = len(text)
                
                if text_len < 50 and len(page.get_images()) == 0:
                    continue
                    
                combined_content = text
                has_images = len(page.get_images()) > 0
                
                img_name = f"page_{page_num:04d}.png"
                img_path = os.path.join(img_out_dir, img_name)
                
                try:
                    pix = page.get_pixmap(dpi=150)
                    pix.save(img_path)
                except Exception as ex:
                    print(f"  Warning: failed to render page image {page_num}: {ex}")
                
                if text_len < 100 and has_images:
                    try:
                        ocr_text = pytesseract.image_to_string(Image.open(img_path))
                        if ocr_text.strip():
                            combined_content = ocr_text
                    except Exception as ocr_err:
                        combined_content = f"OCR Failed: {ocr_err}"
                
                vlm_desc = "No visual data"
                if has_images and has_vlm:
                    vlm_desc = get_vlm_description(img_path)
                
                if vlm_desc and vlm_desc != "No visual data":
                    combined_content += f"\n\nVISUAL DATA:\n{vlm_desc}"
                
                page_data = {
                    "subject": "anatomy",
                    "book_name": book_name,
                    "page_number": page_num,
                    "image_path": os.path.abspath(img_path),
                    "content": combined_content,
                    "category": "anatomy",
                    "track": "mbbs"
                }
                
                f_out.write(json.dumps(page_data, ensure_ascii=False) + "\n")
                f_out.flush()
                
                processed_count += 1
                
                if pilot and processed_count >= 2:
                    break
        
        doc.close()
        print(f"  Successfully processed {processed_count} pages for {book_name}.")

if __name__ == "__main__":
    is_pilot = "--full" not in sys.argv
    process_anatomy(pilot=is_pilot)
