# Student Management System

A full-stack Student Management System structured cleanly with separated **Frontend** and **Backend** directories.

## Architecture

```
student_management_system_project_1/
├── backend/                  # Django & Django REST Framework Backend
│   ├── config/               # Project settings, URL routers, ASGI/WSGI
│   ├── students/             # Student models, views, serializers, APIs
│   ├── manage.py             # Django CLI manager
│   ├── requirements.txt      # Python dependencies
│   ├── build_files.sh        # Deployment build script
│   └── README.md             # Backend documentation
├── frontend/                 # Standalone Frontend Client
│   ├── css/
│   │   └── style.css         # Modern, responsive stylesheet & theme
│   ├── js/
│   │   ├── api.js            # REST API client & error handling
│   │   └── app.js            # UI logic, state, and event controllers
│   ├── index.html            # Main dashboard application
│   └── README.md             # Frontend documentation
├── .gitignore                # Git ignore rules
├── vercel.json               # Deployment routing config
└── README.md                 # Project root documentation
```

---

## Getting Started

### 1. Backend Setup (Django & DRF)

```bash
# 1. Navigate to backend
cd backend

# 2. Activate virtual environment
..\venv\Scripts\activate       # On Windows
# or: source ../venv/bin/activate  # On macOS/Linux

# 3. Install requirements
pip install -r requirements.txt

# 4. Run migrations
python manage.py migrate

# 5. Start the backend server
python manage.py runserver 8000
```
Backend API will be live at: [http://127.0.0.1:8000/api/students/](http://127.0.0.1:8000/api/students/)

---

### 2. Frontend Setup

Open `frontend/index.html` in your browser or run a lightweight local server:

```bash
# Navigate to frontend
cd frontend

# Run local web server on port 3000
python -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Features
- **Decoupled Architecture**: Clean separation between DRF API backend and frontend interface.
- **RESTful Endpoints**: Full CRUD support for student records (`GET`, `POST`, `PUT`, `DELETE`).
- **CORS Enabled**: `django-cors-headers` configured for seamless client-server communication.
- **Rich Dashboard UI**: Live search, filtering by department and academic year, sorting, stats analytics, and table/grid view modes.
- **Data Export**: Export student listings as CSV files.
- **Dark/Light Theme**: Built-in modern theme switcher with local storage persistence.
