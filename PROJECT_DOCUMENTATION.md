# Job Portal — Comprehensive Project Documentation & Architecture Guide

Welcome to the official documentation for the **MERN Stack Job Portal Application**. This document provides an in-depth explanation of the project structure, architectural design, component flow, database schemas, API routes, security mechanisms, and styling systems implemented across both backend and frontend environments.

---

## 📌 1. Project Overview & Tech Stack

The application is a full-stack job portal platform connecting **Employers** and **Job Candidates**.

### **Tech Stack**
- **Frontend**: React 19 (Vite), React Router v7, Axios, **Tailwind CSS v4** (`@tailwindcss/vite` plugin and utility classes for Dark/Light mode theme engine).
- **Backend**: Node.js, Express.js (REST API architecture).
- **Database**: MongoDB with Mongoose ODM.
- **Authentication**: JSON Web Tokens (JWT) stored client-side and verified server-side against MongoDB user records.
- **File Storage**: Multer middleware storing uploaded resume files under `backend/uploads/resumes/` served statically.

---

## 📁 2. File & Directory Structure

```
Job-Portal/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection handler
│   ├── controllers/
│   │   ├── applicationController.js  # Candidate applications logic & employer status updates
│   │   ├── authController.js         # Register, Login, and GET /me token verification
│   │   └── jobController.js          # CRUD operations for job listings
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT Bearer token authentication middleware
│   │   ├── errorMiddleware.js        # Global production error handler (masks stack traces)
│   │   ├── roleMiddleware.js         # Role-Based Access Control (RBAC) middleware
│   │   └── uploadMiddleware.js       # Multer configuration for PDF/DOC/DOCX resume file uploads
│   ├── models/
│   │   ├── Application.js            # Schema for candidate job applications
│   │   ├── Job.js                    # Schema for employer job postings
│   │   └── User.js                   # Schema for users (Candidate/Employer) with bcrypt hashing
│   ├── routes/
│   │   ├── applicationRoutes.js      # Routes for application submission, retrieval, and status patch
│   │   ├── authRoutes.js             # Routes for authentication and user verification
│   │   └── jobRoutes.js              # Routes for job searching, filtering, and CRUD operations
│   ├── uploads/
│   │   └── resumes/                  # Directory for candidate uploaded resume files
│   ├── utils/
│   │   └── generateToken.js          # JWT signing utility function
│   ├── .env.example                  # Environment configuration template
│   ├── package.json                  # Backend dependencies & script definitions
│   ├── seed.js                       # Database seeder script for demo data
│   └── server.js                     # Express application entry point
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg               # Application favicon asset
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js      # Axios instance with request interceptor for Bearer JWT token
│   │   ├── components/
│   │   │   ├── ErrorMessage.jsx      # Reusable error banner component (Tailwind CSS styled)
│   │   │   ├── JobCard.jsx           # Job listing card component with salary tag & skill badges
│   │   │   ├── Loader.jsx            # Reusable loading spinner component (Tailwind animate-spin)
│   │   │   ├── Navbar.jsx            # Top navigation bar with theme icon toggle & user profile badge
│   │   │   ├── ProtectedRoute.jsx    # Route guard component enforcing authentication & roles
│   │   │   └── SearchFilterBar.jsx   # Search & filter component with Reset Filters capability
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Auth state provider with automated /auth/me JWT verification
│   │   │   └── ThemeContext.jsx      # Dark/Light mode theme provider (syncs 'dark' class on <html>)
│   │   ├── pages/
│   │   │   ├── CandidateDashboard.jsx# Candidate application tracker page
│   │   │   ├── EmployerDashboard.jsx # Employer job management & applicant review dashboard
│   │   │   ├── Home.jsx              # Main job browsing page with hero banner & filtering
│   │   │   ├── JobDetail.jsx         # Detailed job view & candidate application dropzone form
│   │   │   ├── Login.jsx             # Redesigned auth login card with eye toggle password field
│   │   │   ├── PostJob.jsx           # Employer job creation & editing form
│   │   │   └── Register.jsx          # User registration form with Candidate/Employer role selector
│   │   ├── App.jsx                   # Main React app router configuration
│   │   ├── index.css                 # Tailwind CSS v4 import, custom variants, and layer directives
│   │   └── main.jsx                  # React DOM root entry point
│   ├── index.html                    # HTML document template
│   ├── package.json                  # Frontend dependencies & build scripts (tailwindcss, @tailwindcss/vite)
│   └── vite.config.js                # Vite build bundler configuration with tailwindcss plugin
│
├── postman/
│   └── JobPortal.postman_collection.json # Complete Postman API collection for testing
├── JOB_PORTAL_TASK_PLAN.md            # Architectural plan & security compliance check report
└── README.md                         # Main repository setup guide
```

---

## ⚙️ 3. Backend Module Explanation

### **1. Entry Point & Server (`server.js`)**
- Connects to MongoDB via `connectDB()`.
- Enables `cors()` cross-origin requests.
- Applies JSON body parser middleware capped at `10kb` limit to prevent payload bombing attacks.
- Configures static directory serving: `app.use('/uploads', express.static(...))` so uploaded resume files can be viewed/downloaded by employers in the browser.
- Registers API routers under `/api/auth`, `/api/jobs`, and `/api/applications`.
- Handles global errors via `errorMiddleware`.

### **2. Database Models (`backend/models/`)**
- **`User.js`**: Stores `name`, `email` (lowercase, validated regex), `password` (hashed using `bcryptjs` with salt factor 10), and `role` (`candidate` or `employer`). Implements `matchPassword` method.
- **`Job.js`**: Stores `title`, `company`, `description`, `location`, `salary`, `skills` (array of strings), and `postedBy` (reference to `User`).
- **`Application.js`**: Stores `jobId` (ref `Job`), `candidateId` (ref `User`), `resume` (file path or URL link), `resumeType` (`file` or `link`), `message` (optional cover note), `status` (`pending`, `accepted`, `rejected`), and compound unique index `{ jobId: 1, candidateId: 1 }` to prevent duplicate applications.

### **3. Middleware (`backend/middleware/`)**
- **`authMiddleware.js`**: Extracts Bearer token from `Authorization` header, verifies JWT signature using `process.env.JWT_SECRET`, fetches user from database, and attaches user to `req.user`.
- **`roleMiddleware.js`**: Higher-order function enforcing Role-Based Access Control (RBAC). Returns `403 Forbidden` if `req.user.role` does not match permitted roles.
- **`uploadMiddleware.js`**: Uses `multer.diskStorage` to save incoming resume files into `uploads/resumes/` with a unique timestamped filename. Enforces file extension validation (`.pdf`, `.doc`, `.docx`) and file size limits (5MB max).
- **`errorMiddleware.js`**: Catches unhandled asynchronous errors, log details server-side, and returns clean error messages without exposing sensitive internal stack traces in production.

### **4. Controllers (`backend/controllers/`)**
- **`authController.js`**:
  - `registerUser`: Validates input, hashes password, creates user, generates JWT token.
  - `loginUser`: Authenticates credentials via bcrypt, returns JWT token and user details.
  - `getMe`: Protected endpoint returning authentic user profile fetched directly from MongoDB to verify client JWT validity.
- **`jobController.js`**:
  - `getAllJobs`: Fetches jobs with regex search filtering (`title`, `company`, `location`, `skills`, `minSalary`, `maxSalary`).
  - `getJobById`: Retrieves job details and populates employer name & email.
  - `createJob`: Employer creates a new job listing.
  - `updateJob`: Employer updates an existing job listing owned by them.
  - `deleteJob`: Employer deletes a job listing (owner-only). Cascades to delete all applications tied to that job, preventing orphaned records.
- **`applicationController.js`**:
  - `applyForJob`: Candidate submits an application with uploaded file or verified URL link + cover note via multipart/form-data or JSON.
  - `getMyApplications`: Candidate retrieves their submitted applications with status tags.
  - `getEmployerApplications`: Employer retrieves ALL applications across all their posted jobs.
  - `getApplicationsForJob`: Employer retrieves applications for a specific job ID.
  - `updateApplicationStatus`: Employer updates candidate application status (`pending`, `accepted`, `rejected`).

---

## 🎨 4. Frontend Module Explanation & Tailwind CSS Styling

### **1. Styling Architecture & Tailwind CSS v4 Integration**
- **Vite Integration**: Styled using **Tailwind CSS v4** via `@tailwindcss/vite` plugin registered in `vite.config.js`.
- **`index.css`**: Configured with `@import "tailwindcss";` and `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));`. Defines reusable component directives (`.card`, `.btn`, `.badge`, `.salary-tag`, `.file-dropzone`, `.status-badge`).
- **Dark/Light Mode Engine**: `ThemeContext.jsx` toggles both `data-theme="dark"` and `class="dark"` on `document.documentElement`, allowing native Tailwind `dark:` variants (`dark:bg-slate-900`, `dark:text-slate-100`, `dark:border-slate-800`) to work seamlessly across all pages.

### **2. State Providers & Security (`frontend/src/context/`)**
- **`AuthContext.jsx`**: Manages global user state and token. On application initialization or token load, makes an automated request to `GET /api/auth/me`. If client `localStorage` is tampered with (e.g. manually editing role or token), backend signature verification fails, triggering automatic logout and state reset.
- **`ThemeContext.jsx`**: Manages global Dark/Light mode theme state. Applies `data-theme="dark"` and `class="dark"` to `document.documentElement` and persists preference in `localStorage`.

### **3. Shared Components (`frontend/src/components/`)**
- **`Navbar.jsx`**: Sticky header containing logo branding, navigation links, user profile pill (Avatar circle + Name + Role tag), Logout button (`🚪 Logout`), and Theme Toggle Icon Button (`☀️` / `🌙`). Styled with Tailwind flexbox, border, and dark mode variants.
- **`JobCard.jsx`**: Card component displaying job title, company, location, modern SVG dollar salary tag, skills badges, and "View Details →" navigation link with Tailwind hover elevation transition (`hover:-translate-y-1`).
- **`SearchFilterBar.jsx`**: Input controls for Keyword Search, Location, Skills, and Min/Max Salary. Responsive Tailwind grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-5`). Features an intelligent **"🔄 Reset Filters"** button that clears all filter inputs and re-fetches all available job listings.
- **`ProtectedRoute.jsx`**: Higher-order route guard component. Redirects unauthenticated users to `/login` and unauthorized roles to `/`.
- **`Loader.jsx` & `ErrorMessage.jsx`**: Reusable visual feedback components styled with Tailwind CSS (`animate-spin border-4 border-indigo-600 border-t-transparent` spinner and alert banners).

### **4. Application Pages (`frontend/src/pages/`)**
- **`Home.jsx`**: Landing page featuring a Tailwind gradient hero banner (`bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700`), live job count badge, search/filter bar, and responsive job grid layout.
- **`Login.jsx`**: Redesigned authentication card matching modern design specifications (`max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl`), `Email *`, `Password *` with interactive 👁️/🙈 show/hide eye toggle, "Remember Me" checkbox, primary submit button, and `/register` link.
- **`Register.jsx`**: Matching registration card with `Full Name *`, `Email *`, `Password *` (eye toggle), Candidate vs Employer role selection toggle pills, and `/login` link.
- **`JobDetail.jsx`**: Complete job listing details page. For Candidates, presents an interactive **File Upload Dropzone** (`border-2 border-dashed border-indigo-400/50`) for PDF/DOCX resumes (with file preview card and remove option) OR verified URL input, plus an optional Cover Letter textarea.
- **`PostJob.jsx`**: Form for employers to publish or edit job postings with input field validations styled with Tailwind classes.
- **`EmployerDashboard.jsx`**: Centralized employer dashboard showing "My Posted Jobs" (with applicant count badges per job) and "Applications Received" section. Supports filtering by job and status, opening resume URL links (`🌐 Open Link`), opening/downloading uploaded resume files (`📂 View Resume` / `⬇️ Download`), and updating candidate status.
- **`CandidateDashboard.jsx`**: Candidate tracking portal displaying submitted job applications with color-coded status badges (`Pending` ⏳, `Accepted` ✅, `Rejected` ❌).

---

## 🔒 5. Security Implementations

1. **JWT Signature Server Verification**:
   - Client-side `localStorage` data can be inspected by users, but roles are strictly enforced server-side. Every protected request passes through `authMiddleware` which verifies the cryptographic signature of the JWT token. Modifying `localStorage.setItem('user', ...)` has zero effect on permissions.

2. **Strict URL Input Validation**:
   - Resume URL inputs are validated using JavaScript `URL()` parser logic. Plain text entries (e.g. random names or invalid text) are rejected with a clear validation error.

3. **NoSQL Injection & Payload Bombing Defense**:
   - Express JSON body parser is restricted to `10kb`.
   - Query filters use explicit field casting or `$in` whitelisting to prevent operator injection attacks (`$gt`, `$ne`).

4. **Production Error Masking**:
   - `errorMiddleware` log stack traces internally on the server but returns standardized error messages to client browsers to avoid leaking backend internal file paths or database structure.

---

## 📡 6. API Endpoints Reference

| Method | Endpoint | Access / Role | Description |
|---|---|---|---|
| **POST** | `/api/auth/register` | Public | Register new Candidate or Employer account |
| **POST** | `/api/auth/login` | Public | Authenticate user & return signed JWT token |
| **GET** | `/api/auth/me` | Protected (Any) | Verify JWT token & return authentic user profile |
| **GET** | `/api/jobs` | Public | Fetch jobs with optional query search filters |
| **GET** | `/api/jobs/:id` | Public | Fetch detailed job listing by ID |
| **POST** | `/api/jobs` | Employer | Create a new job listing |
| **PUT** | `/api/jobs/:id` | Employer (Owner) | Update an existing job listing |
| **DELETE** | `/api/jobs/:id` | Employer (Owner) | Delete a job listing and its applications |
| **POST** | `/api/applications` | Candidate | Submit job application (file upload or URL + message) |
| **GET** | `/api/applications/my` | Candidate | Fetch candidate's submitted job applications |
| **GET** | `/api/applications/employer` | Employer | Fetch all applications across all jobs for logged-in employer |
| **GET** | `/api/applications/job/:jobId` | Employer (Owner) | Fetch candidate applications for a specific job |
| **PATCH** | `/api/applications/:id` | Employer (Owner) | Update candidate application status (`pending`/`accepted`/`rejected`) |

---

## 🛠️ 7. How to Run Locally

### **1. Prerequisites**
- Node.js (v18+)
- MongoDB (Local instance or MongoDB Atlas URI)

### **2. Backend Setup**
```bash
cd backend
npm install
# Ensure .env has MONGODB_URI, JWT_SECRET, JWT_EXPIRE, and PORT=5000
npm run dev
```

### **3. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

### **4. Access Application**
- Open `http://localhost:5173` (or Vite dev server URL) in your browser.