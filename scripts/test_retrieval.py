import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from src.chatbot_engine import MedicalChatbot

def test_pure_retrieval():
    print("Connecting to Chroma DB (bypassing Llama 3 generation to save memory)...")
    try:
        bot = MedicalChatbot()
    except Exception as e:
        print(f"Failed to initialize chatbot: {e}")
        return

    question = "What are the key clinical symptoms of acute appendicitis?"
    print(f"\nSearching Database for: '{question}'\n")
    
    try:
        # Bypass the LLM generation and just test the Vector Retriever directly!
        docs = bot.custom_retriever.get_relevant_documents_with_filter(question)
        print("====== RETRIEVAL RESULTS ======")
        for i, doc in enumerate(docs):
            book = doc.metadata.get('book_name', 'Unknown')
            page = doc.metadata.get('page_number', 'N/A')
            subject = doc.metadata.get('subject', 'General')
            print(f"\n[Result {i+1}] Book: {book} | Page: {page} | Subject: {subject}")
            print(f"Snippet: {doc.page_content[:400].strip()}...")
    except Exception as e:
        print(f"Failed to retrieve documents: {e}")

if __name__ == "__main__":
    test_pure_retrieval()
