import json
import os
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from tqdm import tqdm

def run_indexing(textbooks, base_dir, persist_directory="vector_store", batch_size=50):
    # Initialize embeddings
    embeddings = OllamaEmbeddings(model="nomic-embed-text:latest")
    
    # Initialize Text Splitter
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=150,
        length_function=len,
        is_separator_regex=False,
    )
    
    all_documents = []
    
    for textbook in textbooks:
        jsonl_path = os.path.join(base_dir, textbook)
        if not os.path.exists(jsonl_path):
            print(f"Skipping {textbook} (Not found)...")
            continue

        print(f"Loading data from {textbook}...")
        with open(jsonl_path, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    data = json.loads(line)
                    content = data.get("content", "")
                    if not content:
                        continue
                    
                    base_metadata = {
                        "subject": data.get("subject"),
                        "book_name": data.get("book_name"),
                        "page_number": data.get("page_number"),
                        "category": data.get("category"),
                        "image_path": data.get("image_path"),
                        "track": "pharmacy"
                    }

                    header = f"SUBJECT: {data.get('subject')} | BOOK: {data.get('book_name')} | PAGE: {data.get('page_number')}\n"
                    chunks = text_splitter.split_text(content)
                    
                    for chunk in chunks:
                        doc = Document(
                            page_content=header + chunk,
                            metadata=base_metadata
                        )
                        all_documents.append(doc)
                        
                except Exception as e:
                    print(f"Error parsing line: {e}")

    total_docs = len(all_documents)
    if total_docs == 0:
        print("No documents to index.")
        return

    # Delete old vector store to ensure clean merge
    if os.path.exists(persist_directory):
        import shutil
        print(f"Cleaning old vector store at {persist_directory}...")
        try:
            shutil.rmtree(persist_directory)
        except Exception as e:
            print(f"Warning: Could not delete old vector store: {e}. Please ensure no other process is using it.")
            return

    print(f"Starting batch indexing: {total_docs} chunks created, batch size {batch_size}...")
    
    # Initialize the store with the first batch
    first_batch = all_documents[:batch_size]
    vectorstore = Chroma.from_documents(
        documents=first_batch,
        embedding=embeddings,
        persist_directory=persist_directory
    )
    
    # Add remaining batches
    for i in tqdm(range(batch_size, total_docs, batch_size), desc="Indexing progress"):
        batch = all_documents[i : i + batch_size]
        vectorstore.add_documents(batch)
    
    print(f"\nIndexing complete! {total_docs} chunks indexed into: {persist_directory}")

if __name__ == "__main__":
    import os
    BASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "processed")
    VECTOR_DB_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "db", "vector_store")
    
    # Dynamically find all jsonl files in the BASE_DIR
    TEXTBOOKS = [f for f in os.listdir(BASE_DIR) if f.endswith(".jsonl")]
    
    print(f"Found {len(TEXTBOOKS)} textbooks for indexing: {', '.join(TEXTBOOKS)}")
    
    run_indexing(TEXTBOOKS, BASE_DIR, VECTOR_DB_DIR, batch_size=100)
