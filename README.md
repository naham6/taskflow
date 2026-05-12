# Task-Flow

Task-Flow is a simple personal task management web application built to demonstrate clean CRUD operations, RESTful API design and solid full-stack architecture without unnecessary complexity.

---

# Tech Stack 

| Layer | Technology | Reason |
|---|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript | Demonstrates core DOM manipulation, async state management and responsive UI skills without relying on frameworks |
| Backend | FastAPI (Python) | Fast performance, automatic validation with Pydantic and built-in API documentation |
| Database | SQLite + SQLAlchemy ORM | Persistent local storage with zero installation/configuration required |

---

# Features Implemented

## Core Requirements

- [x] View all tasks with status and creation timestamp
- [x] Create tasks with required title and optional description
- [x] Toggle task status (Pending / Completed)
- [x] Delete tasks with confirmation prompt
- [x] Edit tasks using a custom modal interface
- [x] Frontend + Backend validation
- [x] Persistent SQLite database storage
- [x] Task priorities with visual indicators
- [x] Added filtering by Status, Priority

---

# Local Setup Instructions

## Prerequisites

- Python 3.8+
- A modern web browser

---

# Clone the Repository

```bash
git clone [<your-repository-url-here>](https://github.com/naham6/taskflow)
cd task-flow
```

---

# Backend Setup

Navigate to the backend folder:

```bash
cd backend
```


Install required dependencies:

```bash
pip install fastapi uvicorn sqlalchemy pydantic
```

> Note:  
> A `.envexample` file is included for reference.  
> Since this project uses local SQLite storage, no `.env` configuration is required.

---

# Setuping Backend Server

Start the FastAPI development server:

```bash
uvicorn main:app --reload
```

Backend will run at:

```text
http://127.0.0.1:8000
```

Interactive API Documentation:

```text
http://127.0.0.1:8000/docs
```

### Database Seeding
The SQLite database (`tasks.db`) is automatically created when the server starts for the first time.

---

# The Frontend

### Steps

1. Keep the backend server running
2. Open `frontend` -> `index.html`
3. Add/Edit/Delete tasks

---

# API Endpoints Reference

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `GET` | `/api/tasks` | Fetch all tasks | None |
| `POST` | `/api/tasks` | Create a task | `{ title, description, priority }` |
| `PUT` | `/api/tasks/{id}` | Update a task | `{ title, description, priority, status }` |
| `PATCH` | `/api/tasks/{id}/toggle` | Toggle task status | None |
| `DELETE` | `/api/tasks/{id}` | Delete a task | None |

---

### Some unit tests
Unit tests have been written using `pytest` and FastAPI's `TestClient` (`test_main.py`). The following test cases are covered:

| Test Case | Endpoint Assessed | Expected Outcome |
| :--- | :--- | :--- |
| **1. Valid Task Creation** | `POST /api/tasks` | Returns `201 Created` with the generated task ID and correctly saved parameters. |
| **2. Input Validation (Empty Title)** | `POST /api/tasks` | Returns `422 Unprocessable Entity` as Pydantic correctly intercepts the invalid payload. |
| **3. Update Tasks** | `PUT /api/tasks/{id}` | Returns `200 OK` and confirms the existing record reflects the new title and priority.|
| **4. Task Not Found** | `DELETE /api/tasks/{id}` | Returns `404 Not Found` when attempting to delete a task ID that does not exist. |

# 📂 Project Structure

```text
task-flow/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── schemas.py
│   ├── test_main.py 
│   └── .envexample
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
└── README.md
```

