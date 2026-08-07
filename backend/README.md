# Backend README

## Setup
1. cd backend
2. npm install
3. Create a .env file with the values from .env
4. npm start

## Tech Stack
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Main Endpoints
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
