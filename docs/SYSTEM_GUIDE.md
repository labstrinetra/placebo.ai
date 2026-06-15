# Placebo AI: System Operations Guide

This document provides a technical overview and execution guide for the **Placebo AI** platform—a high-precision, source-grounded medical intelligence system.

---

## 1. System Overview
Placebo AI uses a **Multimodal RAG (Retrieval-Augmented Generation)** architecture. Unlike standard chatbots, it "sees" medical textbooks using Vision-Language Models (VLM) to extract text, tables, and diagrams with clinical accuracy.

### Core Technologies:
*   **Backend**: FastAPI (Python)
*   **Frontend**: Vanilla HTML5/CSS3/JS (No Framework)
*   **Vision Model**: Moondream (via Ollama)
*   **Inference Model**: Llama 3 (via Ollama)
*   **Vector Database**: ChromaDB / FAISS

---

## 2. Prerequisites
Ensure the following are installed on the host Windows system:
1.  **Python 3.10+**
2.  **Ollama**: Download from [ollama.com](https://ollama.com)
3.  **Models**: Run the following in your terminal:
    ```bash
    ollama pull moondream:latest
    ollama pull llama3:latest
    ```

---

## 3. Installation
Navigate to the project root (`d:\sample chatbot`) and install the required Python libraries:
```bash
pip install fastapi uvicorn langchain ollama pillow tqdm chromadb sentence-transformers
```

---

## 4. Execution Workflow

### Step 1: Document Preparation (PDF to Image)
Converts raw medical PDFs into high-resolution PNGs for AI analysis.
```bash
python pdf_processor.py
```

### Step 2: AI Semantic Extraction (VLM)
Uses Moondream to "read" every page and identify clinical content, tables, and diagrams.
```bash
python vlm_extractor.py
```

### Step 3: Vector Indexing
Converts the extracted AI data into searchable mathematical vectors.
```bash
python indexer.py
```

### Step 4: Launching the Platform
Starts the FastAPI backend and the web interface.
```bash
python app.py
```
*   **URL**: `http://localhost:8000`

---

## 5. Maintenance & Quality
*   **Cleanup**: To fix any AI timeouts or empty pages, run the cleanup script:
    ```bash
    python indexer_cleanup.py
    ```
*   **Audit**: To check searchability percentages:
    Check the terminal output of `indexer.py` or use the audit commands provided in the agent logs.

---

## 6. Branding & Design
*   **UI/UX**: Custom CSS-based **Bento Grid** system for the About and Docs pages.
*   **Loader**: High-performance **Spider Cursor** animation in `static/spider-loader.js`.
*   **Assets**: All medical visuals are custom-generated and located in `/static`.

---
**Placebo AI | Medical Intelligence Platform**
