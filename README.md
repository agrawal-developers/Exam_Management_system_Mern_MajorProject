# Exam Management System

A simple MERN-style exam management system (backend + frontend) for creating exams, submitting answers, and viewing results.

## Repository structure

- `backend/` — Node/Express server and models
- `frontend/` — React app

## Features

- Create and manage exams
- Student submissions and result viewing
- Simple authentication

## Tech stack

- Backend: Node.js, Express, Mongoose
- Frontend: React

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

## Setup

1. Backend

```bash
cd backend
npm install
# create a .env with variables (example below)
node server.js
```

Environment variables (example `.env`):

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/examdb
JWT_SECRET=your_jwt_secret
```

2. Frontend

```bash
cd frontend
npm install
npm start
```

By default the frontend runs on `http://localhost:3000` and will talk to the backend at the backend `PORT` configured above.

## API

Basic routes live under `backend/routes/` (`/auth`, `/exams`, `/submissions`). See the code for request/response shapes.

## Contributing

Feel free to open issues or PRs. Keep changes focused and add tests where appropriate.

---

Made By- Mayank Agrawal
