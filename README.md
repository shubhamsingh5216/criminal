# Criminal Face Match

A Django backend with an industry-grade React frontend.

## Project Layout

- `backend/` — Django backend source, API, and model
- `backend/manage.py` — Django entry point
- `backend/project/` — Django configuration
- `backend/myapp/` — backend API app
- `frontend/` — React frontend source
- `frontend/dist/` — production-built frontend assets

## Requirements

- Python 3.13
- Node.js 20+ and npm
- Windows PowerShell

## Backend Setup

From `c:\Users\shubh\Desktop\project-main\backend`:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

## Frontend Setup

```powershell
cd frontend
npm install
```

## Development Run

### Backend

```powershell
cd c:\Users\shubh\Desktop\project-main\backend
.\.venv\Scripts\Activate
python manage.py migrate
python manage.py runserver 8000
```

### Frontend

```powershell
cd c:\Users\shubh\Desktop\project-main\frontend
npm run dev
```

Open the frontend at `http://localhost:3001` and use the backend API endpoints at `http://127.0.0.1:8000/api/criminals/` and `http://127.0.0.1:8000/api/check-face/`.

## Production Build

```powershell
cd c:\Users\shubh\Desktop\project-main\frontend
npm run build
```

Then deploy the frontend separately (for example, Netlify, Vercel, or static hosting) and the backend separately as an API service.

## Deployment Notes

- Set `DEBUG = False` in `project/settings.py`.
- Add your host(s) to `ALLOWED_HOSTS`.
- Use `python manage.py collectstatic` if the backend serves static assets.
- Run the frontend build and deploy the generated static files independently from the Django API.

## Deployment Notes

- Set `DEBUG = False` in `project/settings.py`.
- Add your host(s) to `ALLOWED_HOSTS`.
- Run `python manage.py collectstatic` before deploying.
- Use a production WSGI server (Gunicorn, uWSGI) or a hosting platform that supports Django.
