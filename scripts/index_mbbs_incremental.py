import os
import json
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from tqdm import tqdm

def run_incremental_indexing(textbooks, base_dir, persist_directory="vector_store", batch_size=50):
    print("=" * 70)
    print("STARTING INCREMENTAL INDEXING FOR MBBS TEXTBOOKS")
    print("=" * 70)
    
    # Initialize embeddings
    embeddings = OllamaEmbeddings(model="nomic-embed-text:latest")
    
    # Connect to the existing vector store
    if not os.path.exists(persist_directory):
        print(f"Error: Vector store not found at {persist_directory}. Please run a full setup first.")
        return
        
    print(f"Connecting to existing Chroma DB at {persist_directory}...")
    vectorstore = Chroma(
        persist_directory=persist_directory,
        embedding_function=embeddings
    )
    print(f"Connected. Current chunk count: {vectorstore._collection.count():,}")
    
    # Initialize Text Splitter
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
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

        print(f"Reading data from {textbook}...")
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
                        "track": "mbbs"
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
        print("No new documents to index.")
        return

    print(f"Adding {total_docs} new chunks to the vector database in batches of {batch_size}...")
    
    # Add documents in batches
    for i in tqdm(range(0, total_docs, batch_size), desc="Adding chunks"):
        batch = all_documents[i : i + batch_size]
        vectorstore.add_documents(batch)
    
    # Get updated count
    updated_count = vectorstore._collection.count()
    print(f"\nIncremental Indexing Complete!")
    print(f"Previous Chunk Count: {updated_count - total_docs:,}")
    print(f"Added Chunks:         {total_docs:,}")
    print(f"New Total Chunks:     {updated_count:,}")
    print("=" * 70)

if __name__ == "__main__":
    import os
    BASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "processed")
    VECTOR_DB_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "db", "vector_store")
    
    # Find only the MBBS jsonl files in the BASE_DIR
    TEXTBOOKS = ["mbbs_ENT.jsonl", "mbbs_Embryology.jsonl", "mbbs_NEUROSCIENCE.jsonl"]
    
    if not TEXTBOOKS:
        print("No MBBS jsonl files found. Run process_mbbs_books.py first.")
    else:
        print(f"Found {len(TEXTBOOKS)} MBBS textbooks to index: {', '.join(TEXTBOOKS)}")
        run_incremental_indexing(TEXTBOOKS, BASE_DIR, VECTOR_DB_DIR, batch_size=50)
