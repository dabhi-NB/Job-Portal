# Frontend — Job Portal

React + Vite frontend for the Job Portal application.

## Setup
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables
Create a `.env` file in the `frontend/` folder:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Tech Stack
- React 19
- React Router 7
- Axios
- Vite 8
- Plain CSS (responsive)

## Pages
- **Home** — Browse and search/filter jobs
- **Login** — Login with email and password
- **Register** — Register as employer or candidate
- **Job Detail** — View full job info, apply (candidate), edit/delete (employer owner)
- **Post Job** — Create or edit a job (employer only)
- **Employer Dashboard** — Manage posted jobs and review applications
- **Candidate Dashboard** — Track applied jobs and their status

## Components
- **Navbar** — Navigation with role-based links
- **ProtectedRoute** — Role-based route guard
- **JobCard** — Reusable job summary card
- **SearchFilterBar** — Search and filter controls
- **Loader** — Reusable loading spinner
- **ErrorMessage** — Reusable error display
