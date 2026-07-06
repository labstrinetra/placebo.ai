import os
import time
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from astrapy import DataAPIClient

# ==============================================================================
# ASTRA DB CONFIGURATION
# ==============================================================================
ASTRA_DB_API_ENDPOINT = "https://3e33f29f-e580-478c-a815-000e7bc734c7-us-east-2.apps.astra.datastax.com"
ASTRA_DB_APPLICATION_TOKEN = "AstraCS:fOGHSlgSpeEFPwZFXFPxPjGw:ac67504cf6ed2d20462ad5f92d5b4626156fe3adf48a596c204476c7d16d53db"
ASTRA_COLLECTION_NAME = "medical_documents"

def main():
    print("Initializing local Chroma database...")
    local_db_path = os.path.join(os.path.dirname(__file__), "db", "vector_store")
    
    # We load the embedding function just to initialize Chroma, but we WON'T compute embeddings!
    embeddings = HuggingFaceEmbeddings(
        model_name="nomic-ai/nomic-embed-text-v1.5",
        model_kwargs={'trust_remote_code': True}
    )
    
    local_chroma = Chroma(
        persist_directory=local_db_path,
        embedding_function=embeddings
    )
    
    print("Connecting to Astra DB directly...")
    client = DataAPIClient()
    db = client.get_database(api_endpoint=ASTRA_DB_API_ENDPOINT, token=ASTRA_DB_APPLICATION_TOKEN)
    
    # Create the collection if it doesn't exist (768 dimensions for nomic-embed)
    try:
        db.create_collection(ASTRA_COLLECTION_NAME, dimension=768)
        print(f"Created collection {ASTRA_COLLECTION_NAME}")
    except Exception as e:
        print(f"Collection {ASTRA_COLLECTION_NAME} likely exists.")
        
    collection = db.get_collection(ASTRA_COLLECTION_NAME)
    
    print("Fetching all 1.3 million document IDs from local Chroma...")
    all_data = local_chroma.get(include=[])
    all_ids = all_data['ids']
    
    print(f"Successfully loaded {len(all_ids)} IDs! Starting direct Vector upload...")
    
    batch_size = 5000
    id_chunks = [all_ids[i:i + batch_size] for i in range(0, len(all_ids), batch_size)]
    
    for i, batch_ids in enumerate(id_chunks):
        print(f"Fetching batch {i+1}/{len(id_chunks)} from local Chroma with raw vectors...")
        
        # We explicitly ask for 'embeddings' so we can copy them directly without recomputing!
        result = local_chroma.get(
            ids=batch_ids,
            include=['documents', 'metadatas', 'embeddings']
        )
        
        docs = result.get('documents', [])
        metadatas = result.get('metadatas', [])
        embs = result.get('embeddings', [])
        
        astra_docs = []
        for doc_id, doc, meta, emb in zip(batch_ids, docs, metadatas, embs):
            # Convert NumPy ndarray to standard Python list for JSON serialization
            vector_list = emb.tolist() if hasattr(emb, "tolist") else emb
            
            astra_docs.append({
                "_id": doc_id,
                "$vector": vector_list,
                "content": doc,
                "metadata": meta
            })
            
        print(f"Uploading {len(astra_docs)} raw vectors to Astra DB...")
        try:
            # concurrency=20 makes the network upload extremely fast
            collection.insert_many(astra_docs, concurrency=20)
        except Exception as e:
            print(f"Error uploading batch: {e}")

if __name__ == "__main__":
    main()
