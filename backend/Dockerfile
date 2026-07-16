FROM python:3.13-slim

# Prevent Python from writing .pyc files and enable stdout/stderr flushing
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies needed by OpenCV, onnxruntime and others
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    git \
    wget \
    ca-certificates \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
 && rm -rf /var/lib/apt/lists/*

# Copy Python requirements and install
COPY requirements.txt /app/requirements.txt
RUN python -m pip install --upgrade pip
RUN pip install -r /app/requirements.txt
# Ensure gunicorn is available for running Django in production
RUN pip install gunicorn

# Copy project code
COPY . /app

# Pre-download InsightFace models at build time to avoid runtime downloads
RUN python scripts/download_models.py || true

EXPOSE 8000

# Use gunicorn for production; override command in docker-compose for dev if needed
CMD ["gunicorn", "project.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2"]
