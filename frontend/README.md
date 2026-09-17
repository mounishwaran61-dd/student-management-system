# StudentHub Frontend Client

Modern, responsive client dashboard interface for the Student Management System.

## Features
- **Live Student Directory**: Search, filter by department, filter by academic year, sort by various criteria.
- **Switchable Views**: Table View and Grid Card View.
- **CRUD Operations**: Add student, edit student, delete student with real-time validation and confirmation modal.
- **Real-Time Analytics**: Metric cards displaying total students, department counts, cohort averages, and API connectivity health.
- **CSV Data Export**: Instant download of filtered student records as CSV files.
- **Theme Switcher**: Dark and Light theme with automatic persistence.
- **Configurable API Client**: Easily connects to the backend Django REST Framework API (`/api/students/`), with fallback demo mode when offline.

## Running the Frontend

You can serve the frontend folder using any static file server:

### Option 1: Using Python's built-in HTTP server
```bash
# Inside frontend directory:
python -m http.server 3000
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Using Node / npx
```bash
npx serve .
```

### Option 3: Direct Browser Access / VS Code Live Server
Open `index.html` directly in your browser or with VS Code Live Server extension.
