import os
import json
import fitz
from tqdm import tqdm

def process_missing_books():
    anatomy_dir = r"d:\sample chatbot\MBBS\books\anatomy"
    json_path = r"d:\sample chatbot\anatomy_data.json"
    
    if os.path.exists(json_path):
        print(f"Loading existing data from {json_path}...")
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    else:
        print(f"Creating new data list.")
        data = []

    processed_books = set(item.get("book_name") for item in data)
    print(f"Found {len(processed_books)} books already in JSON.")

    new_items_added = 0

    for root, dirs, files in os.walk(anatomy_dir):
        for filename in files:
            if not filename.lower().endswith(".pdf"):
                continue
            if filename.startswith("._"):
                continue

            if filename in processed_books:
                continue

            pdf_path = os.path.join(root, filename)
            print(f"Processing missing book: {filename}")
            
            try:
                doc = fitz.open(pdf_path)
                total_pages = doc.page_count
                
                for page_idx in tqdm(range(total_pages), desc=f"Extracting {filename}"):
                    page = doc[page_idx]
                    text = page.get_text().strip()
                    
                    if len(text) < 50:
                        continue
                        
                    page_data = {
                        "book_name": filename,
                        "page_number": page_idx + 1,
                        "content": text,
                        "track": "mbbs",
                        "subject": "anatomy"
                    }
                    data.append(page_data)
                    new_items_added += 1
                    
                doc.close()
                processed_books.add(filename)
            except Exception as e:
                print(f"Error processing {filename}: {e}")

    if new_items_added > 0:
        print(f"Added {new_items_added} new pages. Saving to {json_path}...")
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print("Save complete.")
    else:
        print("No new books found. JSON is up to date.")

if __name__ == "__main__":
    process_missing_books()
