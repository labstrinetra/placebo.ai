# Placebo AI - Medical Intelligence Platform

Placebo AI is a high-performance, cloud-native medical artificial intelligence platform. It provides instant, medically grounded answers utilizing a massive database of over 1.3 million medical text vectors, powered by a completely serverless and lightweight architecture.

## 🚀 Cloud-Native Architecture

This project was recently migrated from a heavy local-dataset architecture to a **100% Serverless Cloud-Native infrastructure**, ensuring zero memory crashes (OOM) and lightning-fast global deployments.

- **Vector Database:** [DataStax Astra DB](https://astra.datastax.com/) (Serverless Cloud Vector Search)
- **LLM Inference Engine:** [Groq](https://groq.com/) (Llama-3.1-8b-instant for hyper-fast token generation)
- **Asset Storage:** [HuggingFace Datasets](https://huggingface.co/) (Serverless Image & Document retrieval)
- **Backend Framework:** FastAPI (Python)
- **Authentication:** Supabase Auth

## ⚡ Key Features
- **Zero Local Footprint:** The 17GB vector database and 88GB image database have been entirely offloaded to Astra DB and HuggingFace. The application requires virtually zero local disk space to run.
- **Lightning Fast:** Uses Groq's LPU architecture to stream LLM responses instantly.
- **Dynamic Frontend:** A beautiful, responsive, clinical UI built with modern CSS animations and glassmorphism.

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/labstrinetra/placebo.ai.git
   cd placebo.ai
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set Environment Variables:**
   Create a `.env` file and add your credentials:
   ```env
   GROQ_API_KEY=your_groq_api_key
   ASTRA_DB_API_ENDPOINT=your_astra_endpoint
   ASTRA_DB_APPLICATION_TOKEN=your_astra_token
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_key
   ```

4. **Run the Application:**
   ```bash
   python src/app.py
   ```
   The application will be available at `http://localhost:8000`

## 📦 Deployment
Because Placebo AI is completely serverless, you can deploy this exact repository directly to free platforms like **Render**, **Railway**, or **Heroku** without worrying about disk space or RAM limitations.

---
*Developed by Trinetra Labs*
