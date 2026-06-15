import chromadb
import os
import json

import os
base_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "processed")
db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "db", "vector_store")

client = chromadb.PersistentClient(path=db_path)
collections = client.list_collections()
print(f"Collections: {[c.name for c in collections]}")

if collections:
    collection = collections[0]
    print(f"Using collection: {collection.name}")
    
    # Let's get distinct book names
    # Getting a sample of metadatas
    sample = collection.get(limit=10, include=["metadatas"])
    print(f"Sample metadata: {sample['metadatas']}")
    
    # We will check each jsonl file
    jsonl_files = [f for f in os.listdir(base_dir) if f.endswith(".jsonl")]
    
    unindexed_files = []
    
    for f_name in jsonl_files:
        jsonl_path = os.path.join(base_dir, f_name)
        
        # Read the first valid line to get the book_name or subject
        book_names_in_file = set()
        subjects_in_file = set()
        try:
            with open(jsonl_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line: continue
                    try:
                        data = json.loads(line)
                        if "book_name" in data:
                            book_names_in_file.add(data["book_name"])
                        if "subject" in data:
                            subjects_in_file.add(data["subject"])
                    except:
                        pass
                    if len(book_names_in_file) > 0:
                        break # Just checking the first document is usually enough, but let's say we got one
        except Exception as e:
            print(f"Error reading {f_name}: {e}")
            continue
            
        is_indexed = False
        
        # Check if any book_name from this file exists in the DB
        for bn in book_names_in_file:
            res = collection.get(where={"book_name": bn}, limit=1, include=["metadatas"])
            if res and res["metadatas"]:
                is_indexed = True
                break
                
        # If no book_name, check by subject
        if not is_indexed and not book_names_in_file:
            for sub in subjects_in_file:
                res = collection.get(where={"subject": sub}, limit=1, include=["metadatas"])
                if res and res["metadatas"]:
                    is_indexed = True
                    break
                    
        # If we couldn't find it
        if not is_indexed:
            unindexed_files.append(f_name)
            
    print("\n--- UNINDEXED JSONL FILES ---")
    for f_name in unindexed_files:
        print(f_name)
        
    print(f"\nFound {len(unindexed_files)} unindexed JSONL files out of {len(jsonl_files)}.")
    
    with open("unindexed_files.txt", "w") as out:
        for f in unindexed_files:
            out.write(f + "\n")
