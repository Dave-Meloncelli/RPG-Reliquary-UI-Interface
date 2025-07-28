# API Documentation

This document outlines the HTTP endpoints exposed by the FastAPI backend. All responses are in JSON and no authentication is currently required.

**Base URL:** `http://localhost:8000`

## Health Check

### `GET /health`
Returns the running status of the API.

**Response**
```json
{ "status": "healthy", "message": "AZ Interface API is running" }
```

## Tasks

Tasks represent work items tracked by the system.

### Task Object
```json
{
  "id": 1,
  "title": "Example",
  "description": "Optional description",
  "status": "pending"
}
```

### `GET /tasks`
Fetch a list of all tasks.

**Response**
```json
[
  {
    "id": 1,
    "title": "Example",
    "description": "Optional description",
    "status": "pending"
  }
]
```

### `POST /tasks`
Create a new task.

**Request Body**
```json
{
  "title": "Example",
  "description": "Optional description",
  "status": "pending"
}
```
**Response** – the created task object including its generated `id`.

### `GET /tasks/{task_id}`
Retrieve a specific task by ID.

**Response** – the corresponding task object or `404` if not found.

## Authentication

The development server does not implement authentication. All endpoints are open when running locally. If deploying in a production environment, you should add proper authentication and authorization mechanisms.
