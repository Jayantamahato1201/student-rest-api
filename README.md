# Student REST API

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
