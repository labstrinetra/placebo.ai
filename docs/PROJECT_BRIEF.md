# Project Brief: Placebo AI Medical RAG Chatbot

## 1. Project Overview
**Placebo AI** is a specialized, multimodal Retrieval-Augmented Generation (RAG) chatbot designed specifically for medical students (MBBS). Its primary function is to provide highly accurate, verifiable answers to complex medical queries by dynamically retrieving information from an expansive library of digitized medical textbooks (Anatomy, Physiology, Pharmacology, etc.). 

Unlike standard AI chatbots that suffer from hallucinations, Placebo AI emphasizes **Source Transparency and Clinical Verifiability** by displaying the exact textbook page images alongside its textual answers in an interactive UI gallery.

## 2. Core Objectives
*   **Highly Accurate Medical Retrieval:** Enable students to ask complex medical questions and receive answers strictly grounded in standard MBBS curriculum textbooks.
*   **Visual Context & Verifiability:** Provide an "Inline Citation Gallery" in the chat interface where users can view the actual scanned textbook pages the AI used to generate its answer, ensuring trust and accuracy.
*   **Multimodal Data Understanding:** Go beyond standard text extraction by using Vision-Language Models (VLMs) to "read" and describe complex anatomical diagrams, histology slides, physiological flowcharts, and dosage tables so they can be searched.
*   **High-Performance Ingestion:** Build an automated pipeline capable of processing tens of thousands of PDF pages, handling OCR for scanned books, and chunking data into a highly efficient vector database.

## 3. Target Audience
*   **MBBS / Medical Students:** Seeking quick, reliable reference material for study, revision, and clinical understanding.
*   **Medical Educators:** Looking for a tool to rapidly pull relevant textbook excerpts and diagrams for lectures or assignments.

## 4. Technical Architecture & Stack
The project is built on a fully local, privacy-first tech stack (with the option to deploy to cloud services like Render/HuggingFace):

*   **Data Processing & Ingestion Pipeline (Python):**
    *   *PyMuPDF (`fitz`):* For robust text extraction and PDF rendering.
    *   *Tesseract OCR:* As a fallback for scanned, image-only textbook pages.
    *   *Ollama (Moondream VLM):* To generate rich, searchable textual descriptions of medical diagrams and charts.
*   **Vector Database & Retrieval:**
    *   *ChromaDB:* Local vector store for high-speed semantic search.
    *   *LangChain:* For document chunking (`RecursiveCharacterTextSplitter`) and RAG orchestration.
    *   *Nomic Embeddings:* For creating highly accurate vector representations of medical text.
*   **Application Backend:**
    *   *FastAPI / Python:* To handle API routing, LLM streaming, and serving static reference images.
    *   *Ollama (Llama 3):* Serving as the primary conversational LLM (with easy swapability to Groq/Gemini APIs for cloud deployment).
*   **Frontend UI:**
    *   *HTML/CSS/JS:* A responsive, medical-themed interface featuring a chat window and a dynamic lateral history drawer.
    *   *Inline Gallery Component:* A custom-built UI element that dynamically renders 150 DPI textbook page images alongside the AI's response.

## 5. Current Workflow & Pipeline
1.  **Ingestion:** The system scans the `MBBS/books` directories. It extracts text, uses OCR if necessary, generates a 150 DPI image of the page, and uses a VLM to describe visual diagrams.
2.  **Storage:** This enriched data is saved to consolidated `.jsonl` files (e.g., `anatomy_data.jsonl` or `anatomy_vlm_data.jsonl`).
3.  **Indexing:** The `.jsonl` data is chunked and embedded into the Chroma vector database.
4.  **Querying:** A user asks a question via the web UI. The backend searches ChromaDB, passes the relevant chunks to the LLM, and streams the answer back to the UI while simultaneously displaying the matched textbook pages in the visual gallery.

## 6. Future Roadmap / Next Steps
*   **Cloud Deployment:** Transitioning from heavy local inference to cloud APIs (Gemini/Groq) to allow the app to be hosted for free on platforms like Render or Hugging Face Spaces.
*   **Cache-Augmented Generation (CAG):** Implementing Redis caching for frequently asked medical concepts to reduce LLM API costs and lower response latency.
*   **Expanded Dataset:** Continuing to process and index remaining medical disciplines (Surgery, Pathology, etc.) using the automated VLM scripts.
