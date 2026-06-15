import os
import json
import fitz
from PIL import Image
import pytesseract
from concurrent.futures import ProcessPoolExecutor, as_completed
from tqdm import tqdm

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def clean_filename(name):
    return name.replace(" ", "_").replace("&", "and").replace("'", "").replace("(", "").replace(")", "").replace("[", "").replace("]", "").replace(",", "")

def process_page(args):
    pdf_path, page_num, book_name = args
    try:
        doc = fitz.open(pdf_path)
        page = doc[page_num]
        text = page.get_text().strip()
        
        has_images = len(page.get_images()) > 0
        
        book_clean = clean_filename(book_name.replace(".pdf", ""))
        subject_clean = "anatomy"
        
        img_out_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "mbbs_processed", subject_clean, book_clean)
        # Create directories safely
        os.makedirs(img_out_dir, exist_ok=True)
        img_name = f"page_{page_num+1:04d}.png"
        img_path = os.path.join(img_out_dir, img_name)
        
        # Save image for UI Gallery
        pix = page.get_pixmap(dpi=150)
        pix.save(img_path)
        
        if len(text) < 100 and has_images:
            # Use OCR if not enough text
            img = Image.open(img_path)
            ocr_text = pytesseract.image_to_string(img)
            if ocr_text.strip():
                text = ocr_text
                
        doc.close()
        
        if len(text.strip()) < 50:
            return None
            
        return {
            "book_name": book_name,
            "page_number": page_num + 1,
            "image_path": os.path.abspath(img_path),
            "content": text.strip(),
            "category": "anatomy",
            "track": "mbbs",
            "subject": "anatomy"
        }
    except Exception as e:
        return None

def main():
    anatomy_dir = r"d:\sample chatbot\MBBS\books\anatomy"
    output_jsonl = r"d:\sample chatbot\anatomy_data.jsonl"
    
    if os.path.exists(output_jsonl):
        print(f"Removing existing {output_jsonl} to start fresh...")
        os.remove(output_jsonl)
        
    tasks = []
    print("Gathering PDF info...")
    for root, dirs, files in os.walk(anatomy_dir):
        for filename in files:
            if not filename.lower().endswith(".pdf"):
                continue
            if filename.startswith("._"):
                continue
            
            pdf_path = os.path.join(root, filename)
            try:
                doc = fitz.open(pdf_path)
                total_pages = doc.page_count
                doc.close()
                for i in range(total_pages):
                    tasks.append((pdf_path, i, filename))
            except Exception as e:
                print(f"Failed to open {filename}: {e}")
                
    print(f"Total pages to process: {len(tasks)}")
    
    with open(output_jsonl, 'a', encoding='utf-8') as f_out:
        with ProcessPoolExecutor(max_workers=os.cpu_count() or 4) as executor:
            futures = [executor.submit(process_page, task) for task in tasks]
            
            for future in tqdm(as_completed(futures), total=len(futures), desc="Processing pages"):
                res = future.result()
                if res:
                    f_out.write(json.dumps(res, ensure_ascii=False) + "\n")
                    f_out.flush()
                    
    print(f"Finished! Data saved to {output_jsonl}")

if __name__ == "__main__":
    main()
