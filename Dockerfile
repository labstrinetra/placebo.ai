# Use the official lightweight Python image
FROM python:3.11-slim

# HuggingFace Spaces requires a non-root user for security
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copy requirements and install
COPY --chown=user ./requirements.txt requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy the entire app with proper user permissions
COPY --chown=user . /app

# Run the FastAPI server on port 7860
CMD ["uvicorn", "src.app:app", "--host", "0.0.0.0", "--port", "7860"]
