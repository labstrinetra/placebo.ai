# Medical Chatbot Implementation Plan (100% Local)

Build a high-accuracy, multimodal medical chatbot for "Analysis" and "Anatomy" subjects that is 100% searchable and responds in under 6 seconds, using only local resources.

## User Review Required

> [!IMPORTANT]
> **Local Resources**: This plan uses **Ollama** to run models locally. Ensure you have Ollama installed and enough VRAM (8GB+ recommended) to run Llama 3 and Moondream.
> 
> **Processing Time**: Extraction of 1000+ pages using a local VLM (Moondream) will take significant time (several hours) compared to an API.
> 
> **Storage Space**: Converting large medical PDFs (e.g., 150MB Tortora) to high-resolution images will require significant disk space (~1-2GB per book).

## Open Questions
- Do you have a specific vector database preference (e.g., Pinecone for cloud, Chroma/FAISS for local)? I recommend **ChromaDB** for local persistence and ease of use with LangChain.

## Proposed Changes

### 1. Data Preparation Component

#### [NEW] [pdf_processor.py](file:///d:/sample%20chatbot/pdf_processor.py)
- Utility to convert PDF pages to high-quality PNGs using `PyMuPDF`.
- Handles extraction of subject/book names from directory structures.

#### [NEW] [vlm_extractor.py](file:///d:/sample%20chatbot/vlm_extractor.py)
- Multimodal extraction engine using **Ollama (Moondream)**.
- For each page image, it will:
    - Extract all text (OCR).
    - Describe diagrams and flowcharts in detail.
    - Format tables into Markdown.
- Outputs a structured `data.jsonl` file.

---

### 2. RAG Pipeline (LangChain + Local Models)

#### [NEW] [indexer.py](file:///d:/sample%20chatbot/indexer.py)
- Uses LangChain to load `data.jsonl`.
- Splits content into semantic chunks.
- Indexes into **ChromaDB** using a local embedding model (e.g., `sentence-transformers/all-MiniLM-L6-v2`).

#### [NEW] [chatbot_engine.py](file:///d:/sample%20chatbot/chatbot_engine.py)
- LangChain `ConversationalRetrievalChain` using **Ollama (Llama 3)**.
- Custom prompt tailored for medical accuracy and citation.
- Optimized for < 6s response time using streaming and local quantization.

---

### 3. User Interface

#### [NEW] [app.py](file:///d:/sample%20chatbot/app.py)
- FastAPI or Flask backend to serve the chatbot.
- Integration with the LangChain engine.

#### [NEW] [index.html](file:///d:/sample%20chatbot/static/index.html) & [style.css](file:///d:/sample%20chatbot/static/style.css)
- Premium, state-of-the-art UI.
- Medical theme: Glassmorphism, teal/indigo gradients, smooth animations.
- Real-time streaming response display.

## Verification Plan

### Automated Tests
- Test extraction accuracy on a sample page with a diagram and a table.
- Measure end-to-end latency for a standard medical query.

### Manual Verification
- Verify that the chatbot can correctly identify and describe a specific diagram from the Anatomy book.
- Verify that citations point to the correct page numbers.
