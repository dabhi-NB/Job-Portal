# Backend — Job Portal

Node.js + Express + MongoDB backend for the Job Portal application.

## Setup
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
npm run seed   # seeds demo accounts and sample jobs
npm start      # production
npm run dev    # development with nodemon
```

## Tech Stack
- Node.js
- Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs

## API Endpoints

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | /api/auth/register | Register user | No |
| POST | /api/auth/login | Login user | No |
| POST | /api/jobs | Create job | Employer |
| GET | /api/jobs | Get all jobs (search/filter) | No |
| GET | /api/jobs/:id | Get job by ID | No |
| PUT | /api/jobs/:id | Update job (owner only) | Employer |
| DELETE | /api/jobs/:id | Delete job (owner only) | Employer |
| POST | /api/applications | Apply for job | Candidate |
| GET | /api/applications/my | Get my applications | Candidate |
| GET | /api/applications/job/:jobId | Get applications for job | Employer |
| PATCH | /api/applications/:id | Update application status | Employer |
