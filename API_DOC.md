# ViFinanceNews API Documentation

This document describes all available API endpoints for the ViFinanceNews backend (see `testing-server/app.py`). All endpoints are prefixed with `/api`.

---

## Authentication & User

### `POST /api/register`
Register a new user.

**Request JSON:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string",
  "name": "string"
}
```
**Response:**
- `200 OK`: `{ "message": "User registered successfully" }`
- `400 Bad Request`: `{ "message": "All fields are required" }` or `{ "message": "Username already exists" }`

---

### `POST /api/login`
Login with username or email and password. Triggers OTP process.

**Request JSON:**
```json
{
  "login": "username or email",
  "password": "string"
}
```
**Response:**
- `200 OK`: `{ "otp_required": true, "message": "OTP sent" }`
- `401 Unauthorized`: `{ "message": "Invalid credentials" }`

---

### `POST /api/send-otp`
Resend OTP to the user after login attempt.

**Request JSON:** (optional)
```json
{
  "username": "string" // optional if session has pending_username
}
```
**Response:**
- `200 OK`: `{ "message": "OTP resent" }`
- `400 Bad Request`: `{ "message": "No user for OTP" }`

---

### `POST /api/verify-otp`
Verify the OTP code.

**Request JSON:**
```json
{
  "otp": "6-digit string"
}
```
**Response:**
- `200 OK`: `{ "message": "OTP verified", "username": "...", "name": "...", "email": "..." }`
- `400 Bad Request`: `{ "message": "Invalid OTP" }`

---

### `GET /api/user`
Get current logged-in user info.

**Response:**
- `200 OK`: `{ "username": "...", "name": "...", "email": "...", "avatar": "..." }`
- `401 Unauthorized`: `{ "message": "Not logged in" }`
- `404 Not Found`: `{ "message": "User not found" }`

---

### `POST /api/logout`
Logout current user.

**Response:**
- `200 OK`: `{ "message": "Logged out" }`

---

## Profile Management

### `POST /api/profile`
Update user profile (name, email).

**Request JSON:**
```json
{
  "name": "string (optional)",
  "email": "string (optional)"
}
```
**Response:**
- `200 OK`: `{ "message": "Profile updated", "name": "...", "email": "..." }`
- `401 Unauthorized`: `{ "message": "Not logged in" }`

---

### `POST /api/change-password`
Change user password.

**Request JSON:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```
**Response:**
- `200 OK`: `{ "message": "Password changed" }`
- `400 Bad Request`: `{ "message": "Missing fields" }` or `{ "message": "Current password incorrect" }`
- `401 Unauthorized`: `{ "message": "Not logged in" }`

---

### `POST /api/avatar`
Upload or update user avatar.

**Request JSON:**
```json
{
  "avatar": "base64 string"
}
```
**Response:**
- `200 OK`: `{ "message": "Avatar updated" }`
- `400 Bad Request`: `{ "message": "No avatar data" }`
- `401 Unauthorized`: `{ "message": "Not logged in" }`

---

### `POST /api/delete-account`
Delete the current user's account.

**Response:**
- `200 OK`: `{ "message": "Account deleted" }`
- `401 Unauthorized`: `{ "message": "Not logged in" }`

---

## Article & Analysis

### `GET /api/get_cached_result?query=...`
Get a list of dummy articles for a given query.

**Query Params:**
- `query`: string

**Response:**
- `200 OK`:
```json
{
  "message": "success",
  "data": [
    {
      "author": "...",
      "title": "...",
      "url": "...",
      "image_url": "...",
      "date_publish": "...",
      "brief_des_batches": "...",
      "tags": ["...", "..."],
      "upvotes": 0,
      "vote_type": 0
    },
    ...
  ]
}
```

---

### `POST /api/synthesis/`
Synthesize information from multiple article URLs.

**Request JSON:**
```json
["url1", "url2", ...]
```
**Response:**
- `200 OK`: `{ "synthesis": "..." }`
- `400 Bad Request`: `{ "message": "Invalid input" }`

---

### `POST /api/summarize/`
Summarize a single article.

**Request JSON:**
```json
{ "url": "article_url" }
```
**Response:**
- `200 OK`: `{ "summary": "..." }`

---

### `POST /api/toxicity_analysis/`
Analyze toxicity of an article.

**Request JSON:**
```json
{ "url": "article_url" }
```
**Response:**
- `200 OK`:
```json
{
  "toxicity_analysis": {
    "Công kích danh tính": float,
    "Mức Độ Thô Tục": float,
    "Tính Xúc Phạm": float,
    "Tính Đe Doạ": float,
    "Tính Độc Hại": float
  }
}
```

---

### `POST /api/sentiment_analysis/`
Analyze sentiment of an article.

**Request JSON:**
```json
{ "url": "article_url" }
```
**Response:**
- `200 OK`:
```json
{
  "sentiment_analysis": {
    "sentiment_label": "Very Negative|Negative|Neutral|Positive|Very Positive",
    "sentiment_score": float
  }
}
```

---

### `POST /api/factcheck/`
Fact-check an article.

**Request JSON:**
```json
{ "url": "article_url" }
```
**Response:**
- `200 OK`: `{ "fact-check": "..." }`

---

## Notes

- All endpoints expect and return JSON.
- Most endpoints require authentication (via session/cookie).
- For demo/testing, OTP is printed to the server console.

---
