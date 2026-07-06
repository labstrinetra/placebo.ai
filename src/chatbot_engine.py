from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_astradb import AstraDBVectorStore
import os
import re

# Astra DB Constants (Now securely loaded from environment variables)
ASTRA_DB_API_ENDPOINT = os.getenv("ASTRA_DB_API_ENDPOINT")
ASTRA_DB_APPLICATION_TOKEN = os.getenv("ASTRA_DB_APPLICATION_TOKEN")
ASTRA_COLLECTION_NAME = "medical_documents"
from langchain_classic.chains import ConversationalRetrievalChain
from langchain_classic.memory import ConversationBufferMemory
from langchain_core.prompts import PromptTemplate
from langchain_core.retrievers import BaseRetriever
from langchain_core.callbacks import CallbackManagerForRetrieverRun
from typing import List
from langchain_core.documents import Document

class MedicalChatbot:
    def __init__(self):
        print("Initializing Cloud-Native Medical Chatbot Engine...")
        
        self.embeddings = HuggingFaceEmbeddings(
            model_name="nomic-ai/nomic-embed-text-v1.5",
            model_kwargs={'trust_remote_code': True}
        )
        
        # Connect directly to Astra DB (No local database required!)
        print("Connecting to Astra Vector Cloud...")
        self.vectorstore = AstraDBVectorStore(
            embedding=self.embeddings,
            collection_name=ASTRA_COLLECTION_NAME,
            api_endpoint=ASTRA_DB_API_ENDPOINT,
            token=ASTRA_DB_APPLICATION_TOKEN,
        )
        print("Astra DB Connected Successfully!")
        
        # Use Llama 3 for grounded inference via Groq
        self.llm = ChatGroq(
            model_name="llama-3.1-8b-instant",
            temperature=0.0, # Zero creativity for clinical safety
            streaming=True,
            groq_api_key=os.getenv("GROQ_API_KEY")
        )
        
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            output_key="answer"
        )
        
        self.prompt_template = """
        You are 'Placebo AI', a specialized Medical Knowledge Retrieval Assistant. 
        Your primary role is to extract and summarize medical information with 100% fidelity.

        STRICT CLINICAL PROTOCOLS:
        1. GROUNDING: Provide information ONLY from the provided CONTEXT. 
        2. DATA PRECISION: Preserve all numerical values, chemical formulas, and dosages EXACTLY as written.
        3. STRUCTURE & FORMATTING: 
           - **Pain Points & Symptoms**: Always bold key issues, pathological symptoms, patient pain points, or critical clinical risks (e.g., **severe nausea**, **respiratory depression**).
           - **Reactions & Mechanisms**: Stated clearly, using step-by-step reaction pathways, equations, or numbered sequences to detail chemical or physiological mechanisms.
           - Use Markdown Tables for data comparisons.
           - Use Bullet Points for lists.
        4. CITATION: You MUST end every factual statement with its source in [Book Name, Page #] format.
        5. FALLBACK: If the answer is truly not present in the context, say: "I'm sorry, but I couldn't find specific details on this topic in the current medical textbook library."

        CONTEXT: 
        {context}
        
        CHAT HISTORY: 
        {chat_history}
        
        QUESTION: 
        {question}
        
        PLACEBO AI RESPONSE (Start with 'Based on the clinical data in the textbooks:'):
        Based on the clinical data in the textbooks:
        """
        
        self.QA_PROMPT = PromptTemplate(
            template=self.prompt_template,
            input_variables=["context", "chat_history", "question"]
        )

        # Custom Retriever Logic for Exhaustive Reference Search
        class KeywordAugmentedRetriever(BaseRetriever):
            vectorstore: AstraDBVectorStore
            k: int = 10
            track_filter_state: str = "unified"
            
            def _get_relevant_documents(
                self, query: str, *, run_manager: CallbackManagerForRetrieverRun
            ) -> List[Document]:
                return self.get_relevant_documents_with_filter(query, track_filter=self.track_filter_state)

            def get_relevant_documents_with_filter(
                self, query: str, track_filter: str = "unified"
            ) -> List[Document]:
                # Build filter dictionary
                filter_dict = None
                if track_filter == "mbbs":
                    filter_dict = {"track": "mbbs"}
                elif track_filter == "pharmacy":
                    filter_dict = {"track": "pharmacy"}
                
                # 1. Vector Search (MMR for diversity)
                docs = self.vectorstore.max_marginal_relevance_search(
                    query, k=self.k, fetch_k=50, lambda_mult=0.3, filter=filter_dict
                )
                                    
                return docs

        self.custom_retriever = KeywordAugmentedRetriever(vectorstore=self.vectorstore, k=10)

        self.chain = ConversationalRetrievalChain.from_llm(
            llm=self.llm,
            retriever=self.custom_retriever,
            memory=self.memory,
            combine_docs_chain_kwargs={"prompt": self.QA_PROMPT},
            return_source_documents=True
        )

    def ask(self, query, mode="unified"):
        """
        Processes a medical query using exhaustive retrieval and returns a verified response.
        Routes to the correct domain track.
        """
        self.custom_retriever.track_filter_state = mode
        result = self.chain.invoke({"question": query})
        answer = result["answer"]
        
        # Deduplicate and format clinical sources
        seen_sources = set()
        formatted_sources = []
        
        for doc in result["source_documents"]:
            book = doc.metadata.get("book_name", "Unknown Source")
            page = doc.metadata.get("page_number", "N/A")
            source_key = f"{book}_P{page}"
            
            if source_key not in seen_sources:
                formatted_sources.append({
                    "book": book,
                    "page": page,
                    "subject": doc.metadata.get("subject", "General"),
                    "image_path": doc.metadata.get("image_path"),
                    "snippet": doc.page_content[:200] + "..."
                })
                seen_sources.add(source_key)
            
        return {
            "answer": answer,
            "sources": formatted_sources,
            "citation_footer": "\n\n---\n**Verified Clinical Sources:**\n" + \
                                "\n".join([f"- {s['book']} (Page {s['page']})" for s in formatted_sources])
        }

if __name__ == "__main__":
    # Internal test check
    try:
        bot = MedicalChatbot()
        print("Medical Chatbot Initialized Successfully.")
    except Exception as e:
        print(f"Chatbot wait-state: {e}")
