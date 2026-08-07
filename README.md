# Job Portal

A MERN stack job portal with employer and candidate roles.

## Features
- Register and login as employer or candidate
- Employer can post, update, and delete jobs
- Candidate can browse jobs and apply
- Employer can review and update application status

## Setup
1. Start MongoDB locally.
2. Backend:
   - cd backend
   - npm install
   - npm run seed
   - npm start
3. Frontend:
   - cd frontend
   - npm install
   - npm run dev

## Demo Accounts
- Employer: employer@example.com / 123456
- Candidate: candidate@example.com / 123456

## Environment Variables
### Backend
- PORT=5000
- MONGODB_URI=mongodb://127.0.0.1:27017/jobportal
- JWT_SECRET=jobportal-secret-key
- JWT_EXPIRE=7d

### Frontend
- VITE_API_BASE_URL=http://localhost:5000/api

## API Endpoints
- POST /api/auth/register
- POST /api/auth/login
- POST /api/jobs
- GET /api/jobs
- GET /api/jobs/:id
- PUT /api/jobs/:id
- DELETE /api/jobs/:id
- POST /api/applications
- GET /api/applications/my
- GET /api/applications/job/:jobId
- PATCH /api/applications/:id
