# VifinanceNews AuthService API Documentation

## Base URL

```
http://localhost:6999/
```

---

## Authentication Endpoints

### Register

- **POST** `/api/register`
- Registers a new user.
- **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "yourPassword",      // Required for local login
      "userName": "yourUsername",
      "loginMethod": "local"           // or "google"
    }
    ```
- **Responses:**
    - `201 Created`  
      ```json
      { "message": "Registration successful" }
      ```
    - `400 Bad Request`  
      ```json
      { "error": "Missing required fields" }
      ```
    - `400 Bad Request`  
      ```json
      { "error": "Registration failed" }
      ```
    - `500 Internal Server Error`  
      ```json
      { "error": "Internal server error", "details": "..." }
      ```

---

### Verify Credentials

- **POST** `/api/verify`
- Verifies user credentials (for login or email verification).
- **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "yourPassword"
    }
    ```
- **Responses:**
    - `200 OK`  
      ```json
      { "message": "OTP sent (or not required for Google login)" }
      ```
    - `401 Unauthorized`  
      ```json
      { "error": "Invalid email or password" }
      ```
    - `500 Internal Server Error`  
      ```json
      { "error": "Server error", "details": "..." }
      ```

---

### Login

- **POST** `/api/login`
- Authenticates a user and starts a session.
- **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "otp": "123456"
    }
    ```
- **Responses:**
    - `200 OK`  
      ```json
      { "message": "Login successful", "userId": "..." }
      ```
      or (if account is soft-deleted)
      ```json
      {
        "message": "Account is in reactivation period",
        "actionRequired": "reactivate",
        "userId": "..."
      }
      ```
    - `401 Unauthorized`  
      ```json
      { "message": "Invalid OTP or login failed" }
      ```
    - `403 Forbidden`  
      ```json
      { "message": "Account permanently deleted. Reactivation not possible." }
      ```

---

### Logout

- **POST** `/api/logout`
- Logs out the current user.
- **Responses:**
    - `200 OK`  
      ```json
      { "message": "Logout successful" }
      ```

---

### Check Authentication Status

- **GET** `/api/auth-status`
- Checks if the user is authenticated.
- **Responses:**
    - `200 OK`  
      ```json
      { "loggedIn": true, "userId": "..." }
      ```
      or
      ```json
      { "loggedIn": false }
      ```

---

### Reactivate Account

- **POST** `/api/reactivate-account`
- Reactivates a deactivated user account.
- **Headers:**  
  Requires `SESSION_ID` cookie.
- **Responses:**
    - `200 OK`  
      ```json
      { "message": "Account reactivated successfully" }
      ```
    - `400 Bad Request`  
      ```json
      { "error": "Failed to reactivate account" }
      ```
    - `401 Unauthorized`  
      ```json
      { "error": "Unauthorized" }
      ```

---

### Forgot Password

- **POST** `/api/forgot-password`
- Initiates password reset process.
- **Request Body:**
    ```json
    { "email": "user@example.com" }
    ```
- **Responses:**
    - `200 OK`  
      ```json
      { "message": "OTP sent to email" }
      ```
    - `404 Not Found`  
      ```json
      { "error": "User not found or not eligible" }
      ```
    - `400 Bad Request`  
      ```json
      { "error": "Email is required" }
      ```

---

### Reset Password

- **POST** `/api/reset-password`
- Resets the user's password.
- **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "otp": "123456",
      "newPassword": "newPassword"
    }
    ```
- **Responses:**
    - `200 OK`  
      ```json
      { "message": "Password reset successful" }
      ```
    - `400 Bad Request`  
      ```json
      { "error": "Password reset failed. Check OTP or email." }
      ```
    - `400 Bad Request`  
      ```json
      { "error": "Missing required fields" }
      ```

---

## Google Authentication

### Google Login

- **POST** `/api/google-login`
- Authenticates a user via Google OAuth.
- **Request Body:**
    ```json
    { "idToken": "GOOGLE_ID_TOKEN" }
    ```
- **Responses:**
    - `200 OK`  
      ```json
      { "message": "Google login successful", "userId": "..." }
      ```
      or (if account is soft-deleted)
      ```json
      {
        "message": "Account is in reactivation period",
        "actionRequired": "reactivate",
        "userId": "..."
      }
      ```
    - `401 Unauthorized`  
      ```json
      { "error": "Invalid Google token" }
      ```
    - `400 Bad Request`  
      ```json
      { "error": "Google login failed" }
      ```
    - `500 Internal Server Error`  
      ```json
      { "error": "Google login error", "details": "..." }
      ```

---

## Guest Endpoints

- See `GuestController.registerRoutes(app)` for guest-specific routes.
- Example:
    - **GET** `/`
        - Redirects to `/login`.

---

## Session & Security Notes

- All endpoints support CORS.
- Session timeout is set via a cookie (`session_timeout`).
- Session ID is stored in a cookie named `SESSION_ID` (valid for 1 hour).
- Static files are served from `/static` at the root URL.
- Most endpoints require a valid session (cookie-based authentication).

---

## Error Response Format

All error responses use the following format:
```json
{ "error": "Error message", "details": "Optional details" }
```

---

