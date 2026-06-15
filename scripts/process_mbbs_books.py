import os
import json
import sys
import fitz
import requests
import base64
from tqdm import tqdm
from PIL import Image

# Configure Tesseract path if needed
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
os.environ["PATH"] += os.pathsep + r'C:\Program Files\Tesseract-OCR'

OLLAMA_URL = "http://localhost:11434/api/generate"

def check_ollama_status():
    """Checks if Ollama is running and has moondream loaded."""
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        if response.status_code == 200:
            models = [m.get("name") for m in response.json().get("models", [])]
            print(f"Ollama is running. Available models: {models}")
            return "moondream:latest" in models or "moondream" in models
    except Exception as e:
        print(f"Warning: Could not connect to Ollama at localhost:11434. VLM descriptions will be skipped. ({e})")
    return False

def get_vlm_description(image_path):
    """Call Ollama VLM (Moondream) for image description."""
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

def process_books(pilot=False):
    mbbs_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "raw", "MBBS")
    master_jsonl_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "processed")
    quality_report_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "config", "mbbs_quality_report.json")
    
    # Check Ollama
    has_vlm = check_ollama_status()
    
    # Load quality report
    quality_report = {}
    if os.path.exists(quality_report_path):
        print(f"Loading quality report from {quality_report_path}...")
        try:
            with open(quality_report_path, "r", encoding="utf-8") as f:
                quality_report = json.load(f)
            print(f"Loaded quality profiles for {len(quality_report)} books.")
        except Exception as e:
            print(f"Error reading quality report: {e}. Will fall back to dynamic page detection.")
    else:
        print("Warning: Quality report not found! Will fall back to dynamic page checks.")

    # Gather PDFs
    pdf_files = []
    
    allowed_subjects = [
        "ENT",
        "Embryology",
        "NEUROSCIENCE",
    ]
    
    for root, dirs, files in os.walk(mbbs_dir):
        for file in files:
            if file.lower().endswith(".pdf"):
                full_path = os.path.join(root, file)
                rel = os.path.relpath(root, mbbs_dir)
                parts = rel.split(os.sep)
                if len(parts) >= 2 and parts[0] == "books":
                    subject = parts[1]
                else:
                    subject = rel if rel != "." else "general"
                
                if subject not in allowed_subjects:
                    continue
                
                pdf_files.append({
                    "subject": subject,
                    "book": file,
                    "path": full_path
                })
                
    pdf_files = sorted(pdf_files, key=lambda x: (x["subject"], x["book"]))
    
    if pilot:
        print("\n=== PILOT MODE ACTIVE ===")
        print("Restricting processing to 1 book per subject, and 2 clean pages per book.")
        # Group by subject and pick first book
        pilot_books = {}
        for b in pdf_files:
            if b["subject"] not in pilot_books:
                pilot_books[b["subject"]] = b
        pdf_files = list(pilot_books.values())
        print(f"Pilot set contains {len(pdf_files)} books.")

    # Process books subject-wise
    # To keep files separate, we open output file descriptors for each subject
    subject_files = {}
    
    for idx, book_info in enumerate(pdf_files):
        book_name = book_info["book"]
        subject = book_info["subject"]
        path = book_info["path"]
        
        book_clean = clean_filename(book_name.replace(".pdf", ""))
        subject_clean = clean_filename(subject)
        
        # Setup output directories for page images
        # Images MUST be saved inside 'd:\sample chatbot\data' for fastapi to serve them
        img_out_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "mbbs_processed", subject_clean, book_clean)
        os.makedirs(img_out_dir, exist_ok=True)
        
        # Open output JSONL file
        jsonl_name = f"mbbs_{subject_clean}.jsonl"
        jsonl_path = os.path.join(master_jsonl_dir, jsonl_name)
        
        # If running full, we append. In pilot, we overwrite.
        mode = "w" if pilot else "a"
        
        print(f"\n[{idx+1}/{len(pdf_files)}] Processing book: {book_name} under subject: {subject}")
        
        # Retrieve excluded pages
        book_profile = quality_report.get(book_name, {})
        excluded_pages = set()
        if book_profile:
            excluded_pages.update(book_profile.get("blank_pages", []))
            excluded_pages.update(book_profile.get("toc_pages", []))
            excluded_pages.update(book_profile.get("index_pages", []))
            excluded_pages.update(book_profile.get("copyright_preface_pages", []))
            excluded_pages.update(book_profile.get("blurry_pages", []))
            print(f"  - Quality report: Excluded {len(excluded_pages)} non-useful pages (blurry, blank, indices, TOC, copyright).")
        
        try:
            doc = fitz.open(path)
            total_pages = doc.page_count
        except Exception as e:
            print(f"  Error opening PDF {book_name}: {e}")
            continue
            
        processed_count = 0
        
        # Write to JSONL
        with open(jsonl_path, mode, encoding="utf-8") as f_out:
            for page_idx in tqdm(range(total_pages), desc=f"Processing {book_clean[:30]}"):
                page_num = page_idx + 1
                
                # Check exclusions
                if page_num in excluded_pages:
                    continue
                
                # Dynamic check fallback if quality report was missing
                page = doc[page_idx]
                text = page.get_text().strip()
                text_len = len(text)
                
                if not book_profile:
                    # Basic dynamic filters
                    if text_len < 50 and len(page.get_images()) == 0:
                        continue # Blank
                    # Simple keyword checks for TOC / Index
                    text_lower = text.lower()
                    if "table of contents" in text_lower or ("index" in text_lower and page_num > total_pages - 10):
                        continue # Skip index/TOC
                
                # Extract clean page content
                # If page is scanned, we can run OCR (Pytesseract), otherwise PyMuPDF text is used
                combined_content = text
                has_images = len(page.get_images()) > 0
                
                # Render page image for the UI and VLM
                img_name = f"page_{page_num:04d}.png"
                img_path = os.path.join(img_out_dir, img_name)
                
                # Render page to file
                try:
                    pix = page.get_pixmap(dpi=150) # high enough quality for UI reading
                    pix.save(img_path)
                except Exception as ex:
                    print(f"  Warning: failed to render page image {page_num}: {ex}")
                
                # Run OCR if there's no text but there is a scanned image
                if text_len < 100 and has_images:
                    try:
                        ocr_text = pytesseract.image_to_string(Image.open(img_path))
                        if ocr_text.strip():
                            combined_content = ocr_text
                    except Exception as ocr_err:
                        combined_content = f"OCR Failed: {ocr_err}"
                
                # Add VLM description if page has images and Ollama is active
                vlm_desc = "No visual data"
                if has_images and has_vlm:
                    vlm_desc = get_vlm_description(img_path)
                
                if vlm_desc and vlm_desc != "No visual data":
                    combined_content += f"\n\nVISUAL DATA:\n{vlm_desc}"
                
                # Construct page dictionary
                page_data = {
                    "subject": subject,
                    "book_name": book_name,
                    "page_number": f"{page_num:04d}",
                    "image_path": os.path.abspath(img_path),
                    "content": combined_content,
                    "category": subject
                }
                
                f_out.write(json.dumps(page_data) + "\n")
                f_out.flush()
                
                processed_count += 1
                
                if pilot and processed_count >= 2:
                    break
        
        doc.close()
        print(f"  Successfully processed {processed_count} pages for {book_name}.")

    print("\nProcessing session completed.")

if __name__ == "__main__":
    is_pilot = "--pilot" in sys.argv or True # default to pilot mode unless specified, wait let's make it check argv
    # Let's inspect argv to determine pilot
    is_pilot = "--full" not in sys.argv
    process_books(pilot=is_pilot)
