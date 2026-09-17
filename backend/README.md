# StudentHub Backend API (Django & DRF)

Django REST Framework backend providing database models, RESTful endpoints, and administrative management.

## Tech Stack
- **Framework**: Django 6.x & Django REST Framework
- **CORS Support**: `django-cors-headers`
- **Database**: SQLite (Development) / PostgreSQL (Production ready)
- **Static Management**: WhiteNoise

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/students/` | List all students |
| `POST` | `/api/students/` | Create a new student |
| `GET` | `/api/students/{id}/` | Retrieve a specific student |
| `PUT` | `/api/students/{id}/` | Update student details |
| `DELETE` | `/api/students/{id}/` | Remove a student record |
| `GET` | `/admin/` | Django Administration portal |

## Running the Backend

1. **Activate Virtual Environment**:
   ```bash
   # From the project root or backend folder:
   ..\venv\Scripts\activate   # Windows
   # or
   source ../venv/bin/activate  # macOS / Linux
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run Migrations**:
   ```bash
   python manage.py migrate
   ```

4. **Start Development Server**:
   ```bash
   python manage.py runserver 8000
   ```
   The backend API will be live at `http://127.0.0.1:8000/api/students/`.
