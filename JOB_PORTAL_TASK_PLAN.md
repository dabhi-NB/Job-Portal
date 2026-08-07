# Job Portal — Practical Task Plan & Progress Tracker

**Candidate:** Nikita Dabhi | **Position:** MERN Stack Developer
**Deadline:** 08-Aug-2026, 7:00 PM

> Is file ka use: jab bhi ek step complete karo, `[ ]` ko `[x]` kar dena. Isse pata chalega kitna kaam bacha hai aur kitna ho gaya. Har file ke andar kya code/logic aana chahiye wo bhi neeche detail me likha hai — koi bhi is file ko follow karke pura project bana sakta hai.

---

## 0. Task ka Flow Samajhna (Overview)

Ye ek **Job Portal** hai jisme 2 roles hain: **Employer** aur **Candidate**.

- **Employer** → job post karta hai, apni jobs manage karta hai, aur jo candidates apply karte hain unko dekh kar unka status (accept/reject) change karta hai.
- **Candidate** → jobs browse/search karta hai, apply karta hai, aur apni applications ka status track karta hai.

**Data flow (high level):**
1. User register/login karta hai → role choose karta hai (employer ya candidate) → JWT token milta hai.
2. Token localStorage me store hota hai → har protected API call me `Authorization: Bearer <token>` header jaata hai.
3. Employer job post karta hai → wo job DB me save hoti hai with `postedBy` = us employer ki id.
4. Candidate Home page pe jobs dekhta hai (search/filter ke sath) → kisi job pe apply karta hai → Application create hoti hai with status `pending`.
5. Employer apne dashboard me us job ki applications dekhta hai → status change karta hai (accepted/rejected).
6. Candidate apne dashboard me apni applications aur unka status dekhta hai.

**3 Models ka relation:**
```
User (employer/candidate)
  │
  ├── posts ──> Job (postedBy: User._id)
  │
User (candidate)
  │
  └── applies ──> Application (jobId: Job._id, candidateId: User._id)
```

---

## 1. Project Structure (Overall)

```
job-portal/                  ← tumhara already bana hua folder
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   └── applicationController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── errorMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   └── applicationRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env
│   ├── .gitignore
│   ├── server.js
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── JobCard.jsx
│   │   │   ├── SearchFilterBar.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── JobDetail.jsx
│   │   │   ├── PostJob.jsx
│   │   │   ├── EmployerDashboard.jsx
│   │   │   └── CandidateDashboard.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── index.html
│   ├── package.json
│   └── README.md
│
├── postman/
│   └── JobPortal.postman_collection.json
│
├── .gitignore (root, optional)
└── README.md (root — overall setup instructions)
```

---

## 2. BACKEND — Step by Step

### Step B1 — Folder & base setup
- [ ] `backend/` folder ke andar `package.json` init (npm)
- [ ] Zaroori packages install: `express`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `dotenv`, `cors`
- [ ] Dev package: `nodemon`
- [ ] `.env` file banao (values `.env` me — code me kabhi bhi hardcode mat karna)
- [ ] `.gitignore` banao (`node_modules`, `.env` isme add karo)

### Step B2 — `config/db.js`
- [ ] Mongoose connect function likho jo `MONGODB_URI` se connect kare
- [ ] Connection success/fail dono pe console log ho, fail hone pe `process.exit(1)`

### Step B3 — Models

**`models/User.js`**
- [ ] Fields: `name` (String, required), `email` (String, required, unique), `password` (String, required), `role` (String, enum: `["employer","candidate"]`, required), `createdAt` (Date, default now)
- [ ] Mongoose pre-save hook: save hone se pehle password ko bcrypt se hash karo (agar password modify hua ho)
- [ ] Ek instance method `matchPassword(enteredPassword)` banao jo `bcrypt.compare` use kare

**`models/Job.js`**
- [ ] Fields: `title`, `company`, `description`, `location`, `salary` (Number), `skills` (Array of String), `postedBy` (ObjectId, ref `User`), `createdAt`

**`models/Application.js`**
- [ ] Fields: `jobId` (ObjectId, ref `Job`), `candidateId` (ObjectId, ref `User`), `resume` (String — file path ya URL), `status` (String, enum: `["pending","accepted","rejected"]`, default `"pending"`), `createdAt`

### Step B4 — Utils

**`utils/generateToken.js`**
- [ ] Function jo `userId` aur `role` le kar `jsonwebtoken.sign()` se JWT banaye
- [ ] `JWT_SECRET` aur `JWT_EXPIRE` `.env` se use karo

### Step B5 — Middleware

**`middleware/authMiddleware.js`**
- [ ] Header se `Authorization: Bearer <token>` nikaalo
- [ ] Token verify karo (`jwt.verify`) — fail ho to 401 error
- [ ] Verify hone pe user ki id/role `req.user` me daal do, `next()` call karo

**`middleware/roleMiddleware.js`**
- [ ] Ek function `authorizeRoles(...roles)` banao jo check kare `req.user.role` allowed roles me hai ya nahi — nahi to 403 error

**`middleware/errorMiddleware.js`**
- [ ] Central error handler — try/catch me jo errors throw honge unko yahan catch karke proper JSON response (`{ success: false, message }`) bhejo

### Step B6 — Controllers (business logic)

**`controllers/authController.js`**
- [ ] `registerUser` → body se `name, email, password, role` lo → email already exist check karo → naya user create karo → token generate karke response me bhejo
- [ ] `loginUser` → email se user dhoondo → `matchPassword` se check karo → sahi ho to token bhejo, galat ho to 401

**`controllers/jobController.js`**
- [ ] `createJob` → sirf employer (role check middleware se already ho chuka) → body se job data lo, `postedBy = req.user.id` set karo → save karo
- [ ] `getAllJobs` → query params se filters lo: `search` (title/company regex), `location`, `skills`, `minSalary`, `maxSalary` → filtered list return karo (pagination optional but achha rahega — `page`, `limit`)
- [ ] `getJobById` → param se `id` lo → job dhoondo, na mile to 404
- [ ] `updateJob` → job dhoondo → check `job.postedBy === req.user.id` (owner hi update kar sake) → update karo
- [ ] `deleteJob` → same owner check → delete karo

**`controllers/applicationController.js`**
- [ ] `applyForJob` → sirf candidate → body se `jobId, resume` lo → check karo ki candidate ne pehle se to apply nahi kiya (duplicate na ho) → naya application create karo with `candidateId = req.user.id`
- [ ] `getMyApplications` → `candidateId = req.user.id` se saari applications lao, job details bhi populate karo
- [ ] `getApplicationsForJob` → sirf employer, aur sirf apni job ki applications (job.postedBy check karo) → `jobId` param se saari applications lao, candidate details populate karo
- [ ] `updateApplicationStatus` → sirf employer, apni job ki application hi → body se `status` lo, update karo

### Step B7 — Routes

**`routes/authRoutes.js`**
- [ ] `POST /register` → `registerUser`
- [ ] `POST /login` → `loginUser`

**`routes/jobRoutes.js`**
- [ ] `POST /` → `authMiddleware, authorizeRoles("employer")` → `createJob`
- [ ] `GET /` → `getAllJobs` (public)
- [ ] `GET /:id` → `getJobById` (public)
- [ ] `PUT /:id` → `authMiddleware, authorizeRoles("employer")` → `updateJob`
- [ ] `DELETE /:id` → `authMiddleware, authorizeRoles("employer")` → `deleteJob`

**`routes/applicationRoutes.js`**
- [ ] `POST /` → `authMiddleware, authorizeRoles("candidate")` → `applyForJob`
- [ ] `GET /my` → `authMiddleware, authorizeRoles("candidate")` → `getMyApplications`
- [ ] `GET /job/:jobId` → `authMiddleware, authorizeRoles("employer")` → `getApplicationsForJob`
- [ ] `PATCH /:id` → `authMiddleware, authorizeRoles("employer")` → `updateApplicationStatus`

### Step B8 — `server.js`
- [ ] Express app banao, `cors()`, `express.json()` middleware lagao
- [ ] `connectDB()` call karo (Step B2 wala)
- [ ] Routes mount karo: `/api/auth`, `/api/jobs`, `/api/applications`
- [ ] Error middleware sabse last me lagao
- [ ] `app.listen(process.env.PORT)`

### Step B9 — Backend testing
- [ ] Har endpoint Postman/Thunder Client se manually test karo (register, login, job CRUD, application flow)
- [ ] Edge cases check karo: bina token ke protected route hit karna, wrong role se access karna, duplicate email register, duplicate application

### Step B10 — Postman Collection
- [ ] Sab endpoints Postman me add karo, ek collection `JobPortal.postman_collection.json` export karo → `postman/` folder me daalo
- [ ] Collection me environment variables use karo (`baseUrl`, `token`) taaki koi bhi easily import karke turant test kar sake

---

## 3. FRONTEND — Step by Step

### Step F1 — Setup
- [ ] `frontend/` folder me Vite + React project init
- [ ] Packages install: `axios`, `react-router-dom`
- [ ] Styling ke liye Tailwind CSS setup (ya plain CSS — jo bhi comfortable ho, but responsive zaroor rakhna)
- [ ] `.env` me `VITE_API_BASE_URL=http://localhost:5000/api`

### Step F2 — `api/axiosInstance.js`
- [ ] Axios instance banao with `baseURL` from env
- [ ] Request interceptor lagao jo `localStorage` se token nikaal kar har request me `Authorization` header add kare

### Step F3 — `context/AuthContext.jsx`
- [ ] React Context banao jo `user`, `token`, `login()`, `logout()`, `loading` expose kare
- [ ] `login()` → API call → response se token + user data localStorage me save karo → state update
- [ ] `logout()` → localStorage clear karo → state reset
- [ ] App load hote hi localStorage check karo (agar token hai to user ko logged-in treat karo)

### Step F4 — Components

**`components/Navbar.jsx`**
- [ ] Logo/title, links (role ke hisaab se alag dikhein — employer ko "Post Job"/"Dashboard", candidate ko "My Applications")
- [ ] Login/Logout button (context se `user` check karke)

**`components/ProtectedRoute.jsx`**
- [ ] Prop: `allowedRoles`
- [ ] Agar user login nahi hai → `/login` pe redirect
- [ ] Agar role allowed nahi hai → home ya "unauthorized" pe redirect
- [ ] Sahi hone pe children render karo

**`components/JobCard.jsx`**
- [ ] Ek job ki summary dikhao (title, company, location, salary, skills tags) + "View Details" link

**`components/SearchFilterBar.jsx`**
- [ ] Inputs: search text, location, skills, salary range
- [ ] Parent (Home page) ko filters pass karo (via callback/state)

**`components/Loader.jsx`** aur **`components/ErrorMessage.jsx`**
- [ ] Simple reusable spinner aur error-text components — har page me use honge

### Step F5 — Pages

**`pages/Register.jsx`**
- [ ] Form: name, email, password, role (dropdown/radio: employer/candidate)
- [ ] Submit pe API call → success pe login page pe redirect (ya auto-login)
- [ ] Loading + error state dikhana

**`pages/Login.jsx`**
- [ ] Form: email, password
- [ ] Submit pe `AuthContext.login()` call → success pe role ke hisaab se redirect (employer → dashboard, candidate → home)
- [ ] Loading + error state

**`pages/Home.jsx`**
- [ ] `SearchFilterBar` + jobs list (`JobCard` map)
- [ ] `GET /api/jobs` call filters ke sath, loading/error state, empty-state message ("koi job nahi mili")

**`pages/JobDetail.jsx`**
- [ ] `GET /api/jobs/:id` se ek job ki full detail dikhao
- [ ] Candidate logged in ho to "Apply" button (resume input/link ke sath) → `POST /api/applications`
- [ ] Employer + owner ho to "Edit"/"Delete" buttons

**`pages/PostJob.jsx`** (employer only)
- [ ] Form: title, company, description, location, salary, skills (comma-separated ya tags input)
- [ ] Submit → `POST /api/jobs` → success pe Employer Dashboard pe redirect
- [ ] Yehi form "Edit Job" ke liye bhi reuse ho sakta hai (pre-filled data ke sath)

**`pages/EmployerDashboard.jsx`**
- [ ] Tabs/sections: "My Jobs" (apni posted jobs, edit/delete options) aur "Applications Received" (job select karke uski applications dekhna, status change dropdown)

**`pages/CandidateDashboard.jsx`**
- [ ] "My Applications" list — job title, company, applied date, status (color-coded: pending/accepted/rejected)

### Step F6 — Routing (`App.jsx`)
- [ ] `react-router-dom` se routes setup:
  - `/` → Home (public)
  - `/login`, `/register` → public
  - `/jobs/:id` → JobDetail (public, but apply button conditional)
  - `/post-job` → ProtectedRoute (employer)
  - `/employer-dashboard` → ProtectedRoute (employer)
  - `/candidate-dashboard` → ProtectedRoute (candidate)
- [ ] `Navbar` sab pages me common rahe (layout wrapper)

### Step F7 — Polish
- [ ] Responsive design check (mobile/tablet/desktop — Tailwind breakpoints ya media queries)
- [ ] Sab API calls me loading spinner aur error message consistent rakho
- [ ] Form validations (empty fields, email format, password length) frontend pe bhi

---

## 4. Documentation & Submission

### Step D1 — `backend/README.md` + `frontend/README.md` (ya ek root README)
- [ ] Project ka short description
- [ ] Setup instructions (clone → install → env → run) — **ye tum khud likhogi apne actual steps ke hisaab se**
- [ ] `.env` me kaunse variables chahiye, unka example (`.env.example` file bhi bana sakti ho)
- [ ] API endpoints ki list (table format — jaisa task PDF me tha)
- [ ] Tech stack mention

### Step D2 — Git & GitHub
- [ ] Root me ek hi git repo (backend + frontend dono isi repo ke andar, 2 folders)
- [ ] Meaningful commits (ek hi bada commit mat karna — feature-wise commit karo: "backend: auth done", "frontend: job listing done" etc.)
- [ ] `.env` files commit na ho (`.gitignore` double check)
- [ ] GitHub pe push karo, repo link ready rakho

### Step D3 — Final Checklist (submission se pehle)
- [ ] Backend locally chal raha hai bina error ke
- [ ] Frontend locally chal raha hai, backend se connect ho raha hai
- [ ] Register/Login dono roles ke sath test kiya
- [ ] Job create/update/delete (owner check) test kiya
- [ ] Apply + status change flow test kiya
- [ ] Search & filter kaam kar raha hai
- [ ] Postman collection file repo me hai
- [ ] README complete hai
- [ ] Repo link submit karne ke liye ready

---

## 5. Progress Summary (khud update karti raho)

| Section | Status |
|---|---|
| Backend — Models & Config | ☐ Not started |
| Backend — Auth (register/login/JWT) | ☐ Not started |
| Backend — Job CRUD | ☐ Not started |
| Backend — Application flow | ☐ Not started |
| Frontend — Auth pages + Context | ☐ Not started |
| Frontend — Home/Search/JobDetail | ☐ Not started |
| Frontend — Dashboards (Employer/Candidate) | ☐ Not started |
| Postman Collection | ☐ Not started |
| README + Git push | ☐ Not started |

*(☐ Not started → ◐ In progress → ✅ Done — jaise jaise karti jao yahan update karti jaana)*
