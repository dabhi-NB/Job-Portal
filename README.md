# Job Portal

A MERN stack job portal with employer and candidate roles.

## Features
- Register and login as employer or candidate
- Employer can post, update, and delete jobs
- Candidate can browse, search, filter and apply for jobs
- Employer can review applications and update status (accept/reject)
- Candidate can track application status

## Tech Stack
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- **Frontend:** React, React Router, Axios, Vite
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`, with dark/light mode theme support)

## Setup

### Prerequisites
- Node.js (v18+)
- MongoDB running locally

### 1. Clone the repo
```bash
git clone https://github.com/dabhi-NB/Job-Portal
cd job-portal
```

### 2. Backend
```bash
cd backend
npm install
```
Create a `.env` file (see `.env.example`):
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/job-portal
JWT_SECRET=your-strong-secret-here
JWT_EXPIRE=7d
```
```bash
npm run seed   # seeds demo data
npm start      # or npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
```
Create a `.env` file (see `.env.example`):
```
VITE_API_BASE_URL=http://localhost:5000/api
```
```bash
npm run dev
```

## Demo Accounts
| Role | Email | Password |
|---|---|---|
| Employer | employer@example.com | 123456 |
| Candidate | candidate@example.com | 123456 |

## API Endpoints

| Method | Path | Description | Auth Required |
|---|---|---|---|
| POST | /api/auth/register | Register a new user | No |
| POST | /api/auth/login | Login and get JWT token | No |
| POST | /api/jobs | Create a new job | Employer |
| GET | /api/jobs | Get all jobs (search/filter/paginate) | No |
| GET | /api/jobs/:id | Get a single job by ID | No |
| PUT | /api/jobs/:id | Update a job (owner only) | Employer |
| DELETE | /api/jobs/:id | Delete a job (owner only) | Employer |
| POST | /api/applications | Apply for a job | Candidate |
| GET | /api/applications/my | Get my applications | Candidate |
| GET | /api/applications/job/:jobId | Get applications for a job (owner only) | Employer |
| PATCH | /api/applications/:id | Update application status (owner only) | Employer |

## Project Structure
```
job-portal/
├── backend/
│   ├── config/db.js
│   ├── models/ (User, Job, Application)
│   ├── controllers/ (auth, job, application)
│   ├── middleware/ (auth, role, error)
│   ├── routes/ (auth, job, application)
│   ├── utils/generateToken.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── api/axiosInstance.js
│       ├── context/AuthContext.jsx
│       ├── components/ (Navbar, ProtectedRoute, JobCard, SearchFilterBar, Loader, ErrorMessage)
│       └── pages/ (Home, Login, Register, JobDetail, PostJob, EmployerDashboard, CandidateDashboard)
├── postman/JobPortal.postman_collection.json
└── README.md
```
