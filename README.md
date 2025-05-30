# 🔐 Login Authentication Template (Full Stack)

A simple yet powerful full-stack login authentication template built with **Node.js/Express + TypeScript** on the backend and **React + TypeScript + Vite** on the frontend. This project serves as a foundational boilerplate to quickly spin up an authentication system that can be modified or extended based on your application’s requirements.

---

## 📌 Overview

This template implements essential authentication features including:

- User registration
- Secure password hashing
- JWT-based login
- Profile access via authentication
- Auto logout based on session timeout
- Clean and styled UI with React + Material UI
- TypeScript support on frontend for scalability and type-safe application

---

## 🎯 Purpose of Template

The purpose of this template is to:

- Provide a **starting point** for applications needing user authentication.
- Serve as a **learning resource** for full-stack authentication flow.
- Offer **clean separation** of backend and frontend logic.
- Allow **easy extension** to support roles, sessions, tokens, refresh tokens, etc.

---

## 🛠️ Backend (Node.js + Express)

### 📁 Structure

server/

├── config/

│ └── database.ts

│ └── index.ts

├── src/

│ ├── middleware/

│ │ └── passport-mechanism.ts

│ ├── routes/

│ │ └── UserRouter.ts

├── app.ts

├── server.ts

### ✅ Functionality

- **User Registration**

  - Route: `POST /user/register`
  - Saves user with hashed password using `bcrypt`.

- **User Login**

  - Route: `POST /user/login`
  - Validates user credentials.
  - Generates and returns a JWT.

- **User Logout**

  - Route: `POST /user/logout`
  - On frontend, token is removed; logout endpoint can be expanded.

- **Protected Profile**

  - Route: `GET /user/profile`
  - Requires `Authorization: Bearer <token>`.
  - Returns user details if token is valid.

- **Middleware**
  - `authMiddleware.js` verifies JWT and protects routes.

---

## 💻 Frontend (React + Vite + TypeScript + MUI)

### 📁 Structure

client/

├── src/

│ ├── App.tsx

│ └── main.tsx

└── .env

### ✅ Functionality

- **User Registration & Login Forms**

  - Data managed with React state
  - Validates input before sending requests

- **JWT Token Management**

  - Token stored in `localStorage` upon login
  - Automatically included in authenticated requests

- **Auto Logout**

  - Automatically logs user out after 2 minutes of inactivity for rapid testing purpose (can be customized)

- **User Status Display**

  - Shows whether a user is logged in and current session status
  - Allows logout

- **Environment-Based API Config**
  - Uses `VITE_BASE_API` from `.env` for backend URL

---

## ⚙️ Environment Setup

### Backend `.env`

```env
JWT_SECRET=jwt_secret
PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=registration_login_system
PG_PASSWORD=password
PG_PORT=5432
SALTS=10
EXPRESS_PORT=3000
```

VITE_BASE_API=http://localhost:3000

🚀 Getting Started

1. Clone the repo
   bash
   Copy
   Edit
   git clone https://github.com/PiyushBadhe/jwt-auth-boilerplate.git
   cd auth-template
2. Start the Backend
   bash
   Copy
   Edit
   cd server
   npm install
   npm start
3. Start the Frontend
   bash
   Copy
   Edit
   cd client
   npm install
   npm run dev
   🔄 Available Extensions
   This template is intentionally minimal but can be extended to include:

   Role-based access (admin/user)

   Refresh tokens

   OAuth (Google, GitHub, etc.)

   Email verification

   Password reset

   Persistent sessions (cookies instead of localStorage)

Multi-page routing with React Router

📄 License

This project is open-source.

🙌 Contributions

Pull requests and feedback are welcome. If you have improvements, feel free to fork and contribute!

---
