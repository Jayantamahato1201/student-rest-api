# Student REST API

A clean and practical Node.js and Express.js REST API built for student record management with MongoDB & Mongoose.

---

## 📁 Project Structure

```text
├── config/
│   └── db.ts                   # MongoDB connection configuration
├── controllers/
│   └── studentController.ts    # CRUD controller logic for students
├── middleware/
│   ├── errorHandler.ts         # Centralized error-handling middleware
│   └── validateStudent.ts      # Payload validation middleware
├── models/
│   └── Student.ts              # Mongoose schema and model definition
├── routes/
│   └── studentRoutes.ts        # Express router mapping /api/students
├── .env.example                # Environment variables template
├── package.json                # Project dependencies and scripts
├── server.ts                   # Express server entry point
└── README.md                   # Documentation and API reference
```

---

## ⚙️ Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and configure your settings:
```bash
cp .env.example .env
```

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/student_management_db
```

### 3. Run the Application
- **Development mode:**
  ```bash
  npm run dev
  ```
- **Production build & start:**
  ```bash
  npm run build
  npm start
  ```

Server will run at `http://localhost:3000`.

---

## 📋 Student Model Schema

| Field | Type | Required | Constraints |
| :--- | :--- | :--- | :--- |
| `id` | String | Auto | MongoDB ObjectId / unique identifier |
| `name` | String | Yes | Non-empty string |
| `email` | String | Yes | Valid email format (`user@domain.com`) |
| `course` | String | Yes | Non-empty string |
| `marks` | Number | Yes | Integer/Float between `0` and `100` |
| `createdAt` | Date | Auto | ISO timestamp |
| `updatedAt` | Date | Auto | ISO timestamp |

---

## 🚀 API Endpoints & Examples

### 1. GET /api/students
Retrieves a list of all students.

**Response (`200 OK`):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Aarav Sharma",
      "email": "aarav.sharma@example.com",
      "course": "Computer Science",
      "marks": 88,
      "createdAt": "2026-08-21T06:20:00.000Z",
      "updatedAt": "2026-08-21T06:20:00.000Z"
    }
  ]
}
```

---

### 2. GET /api/students/:id
Retrieves a single student by their unique ID.

**Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Aarav Sharma",
    "email": "aarav.sharma@example.com",
    "course": "Computer Science",
    "marks": 88,
    "createdAt": "2026-08-21T06:20:00.000Z",
    "updatedAt": "2026-08-21T06:20:00.000Z"
  }
}
```

**Error Response (`404 Not Found`):**
```json
{
  "success": false,
  "error": "Student with ID 64f1a2b3c4d5e6f7a8b9c0d9 not found"
}
```

**Error Response (`400 Bad Request`):**
```json
{
  "success": false,
  "error": "Invalid student ID format: invalid-id-123"
}
```

---

### 3. POST /api/students
Creates a new student record.

**Request Body (`application/json`):**
```json
{
  "name": "Priya Nair",
  "email": "priya.nair@example.com",
  "course": "Artificial Intelligence",
  "marks": 92
}
```

**Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d4",
    "name": "Priya Nair",
    "email": "priya.nair@example.com",
    "course": "Artificial Intelligence",
    "marks": 92,
    "createdAt": "2026-08-24T06:25:00.000Z",
    "updatedAt": "2026-08-24T06:25:00.000Z"
  }
}
```

**Validation Error Response (`400 Bad Request`):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "Please provide a valid email format (e.g., student@example.com)",
    "Marks must be a number between 0 and 100"
  ]
}
```

---

### 4. PUT /api/students/:id
Updates an existing student's details.

**Request Body (`application/json`):**
```json
{
  "name": "Priya Nair",
  "email": "priya.nair@example.com",
  "course": "Machine Learning",
  "marks": 96
}
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d4",
    "name": "Priya Nair",
    "email": "priya.nair@example.com",
    "course": "Machine Learning",
    "marks": 96,
    "updatedAt": "2026-08-24T06:26:00.000Z"
  }
}
```

---

### 5. DELETE /api/students/:id
Deletes a student record by ID.

**Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Student deleted successfully",
  "data": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d4"
  }
}
```

---

## 🛡️ Validation Rules

- **Name:** Required, string, trimmed.
- **Email:** Required, trimmed, lowercase, valid email format regex (`user@domain.com`).
- **Course:** Required, string, trimmed.
- **Marks:** Required, number, min: `0`, max: `100`.
- **Student ID:** Checked for valid MongoDB ObjectId format, returns `400` for malformed IDs and `404` when ID does not exist.
- **Status Codes:**
  - `200 OK`: Successful retrieval, update, or deletion.
  - `201 Created`: Successful creation.
  - `400 Bad Request`: Payload validation failures or invalid ID format.
  - `404 Not Found`: Student record does not exist.
  - `500 Internal Server Error`: Unhandled server-side exceptions caught by central error middleware.
