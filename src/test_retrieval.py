import warnings
warnings.filterwarnings('ignore')
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings

def test_retrieval(query):
    print("Loading vector database...")
    embeddings = OllamaEmbeddings(model='nomic-embed-text:latest')
    db = Chroma(persist_directory='vector_store', embedding_function=embeddings)

    print(f"\nQuery: '{query}'")
    # Using similarity search with score (lower score is generally better depending on the distance metric, usually L2)
    results = db.similarity_search_with_score(query, k=3)

    print("\n" + "="*50)
    print("TOP 3 RETRIEVED TEXTBOOK PASSAGES")
    print("="*50)
    for i, (doc, score) in enumerate(results, 1):
        print(f"\n--- Result {i} (Distance Score: {score:.4f}) ---")
        print(f"Book: {doc.metadata.get('book_name', 'Unknown')}")
        print(f"Page: {doc.metadata.get('page_number', 'Unknown')}")
        
        # Clean up newlines and handle unicode safely for Windows terminal
        content = doc.page_content.replace('\n', ' ').encode('ascii', 'ignore').decode('ascii')
        print(f"\nContent Snippet:\n{content[:300]}...")
        print("-" * 50)

if __name__ == "__main__":
    test_retrieval("Differentiate Bartter syndrome from Gitelman syndrome, detailing the specific defective ion transporters in the nephron, the resulting electrolyte imbalances, and how their pathophysiology mimics specific classes of diuretics.")
