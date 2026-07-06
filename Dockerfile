# Use the official lightweight Python image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .

# Install dependencies (no cache to keep image small)
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire app into the container
COPY . .

# Expose the port HuggingFace Spaces expects (7860)
EXPOSE 7860

# Run the FastAPI server on the HuggingFace Spaces port
CMD ["uvicorn", "src.app:app", "--host", "0.0.0.0", "--port", "7860"]
