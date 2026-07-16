# Docker instructions for criminal-backend

This document explains how to build and run the backend inside Docker.

Prerequisites
- Docker (and optionally docker-compose) installed on your host.

Build the image

From the repo root:

```bash
docker build -t criminal-backend:latest -f backend/Dockerfile backend
```

Run with Docker

```bash
# Create folders for media and the sqlite DB if not present
mkdir -p backend/media
touch backend/db.sqlite3

docker run --rm -p 8000:8000 \
  -v $(pwd)/backend/media:/app/media \
  -v $(pwd)/backend/db.sqlite3:/app/db.sqlite3 \
  -e DJANGO_SETTINGS_MODULE=project.settings \
  -e SECRET_KEY=dev-secret \
  criminal-backend:latest
```

Run with docker-compose (recommended for local dev)

```bash
docker-compose up --build
```

Notes
- The Docker image pre-downloads InsightFace models during build (into the image filesystem). This avoids runtime downloads that fail on serverless hosts.
- For production, do NOT use SQLite. Configure a proper database (Postgres) and object storage (S3) for `MEDIA`.
- Set `DEBUG=0` and provide a secure `SECRET_KEY` in production.
- If you deploy to a container hosting provider (AWS ECS, Render, DigitalOcean App Platform, etc.), the same Dockerfile can be used.

Production notes
---------------
- Use Postgres instead of SQLite. Set `DATABASE_URL` to your Postgres connection string.
- Use S3 (or your provider's object storage) for `MEDIA` by setting `USE_S3=1` and the `AWS_*` env vars.
- Copy `project/settings_prod_example.py` to `project/settings_prod.py`, set `DJANGO_SETTINGS_MODULE=project.settings_prod` in your production environment, and provide `SECRET_KEY` and other creds via environment variables.
- Add these environment variables to your host or Render service:
  - `SECRET_KEY`, `DATABASE_URL`, `USE_S3` (1 to enable), `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_STORAGE_BUCKET_NAME`, `AWS_S3_REGION_NAME`, `ALLOWED_HOSTS`.

