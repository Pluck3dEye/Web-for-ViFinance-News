# UserService API Documentation

Base URL: `http://172.8.8.122:6998`

## Authentication

All endpoints require a valid session cookie (`SESSION_ID`) for authentication unless otherwise noted.

---

## Endpoints

### 1. Get User Profile

- **URL:** `/api/user/profile`
- **Method:** `GET`
- **Auth:** Required (session cookie)
- **Request:** None
- **Response:** `200 OK`
    ```json
    {
      "accountId": "string",
      "userName": "string",
      "avatarLink": "string|null",
      "bio": "string|null"
    }
    ```
- **Errors:**
    - `401 Unauthorized` if not authenticated
    - `404 Not Found` if user does not exist

---

### 2. Update Username & Bio

- **URL:** `/api/user/update-info`
- **Method:** `PUT`
- **Auth:** Required
- **Request Body:** (JSON)
    ```json
    {
      "userName": "string",   // optional, but not blank if present
      "bio": "string"         // optional
    }
    ```
- **Response:** `200 OK`  
  `"Username and/or bio updated"`
- **Errors:**
    - `400 Bad Request` if neither field is provided or username is blank
    - `401 Unauthorized` if not authenticated

---

### 3. Update Avatar

- **URL:** `/api/user/avatar`
- **Method:** `PUT`
- **Auth:** Required
- **Request Body:** (JSON)
    ```json
    {
      "avatarLink": "string" // required, URL to the uploaded avatar
    }
    ```
- **Response:** `200 OK`  
  `"Avatar updated"`
- **Errors:**
    - `400 Bad Request` if avatarLink is missing or blank
    - `401 Unauthorized` if not authenticated

---

### 4. Upload Avatar Image

- **URL:** `/api/avatar/upload`
- **Method:** `POST`
- **Auth:** Optional (guests allowed, but userId preferred)
- **Request:** `multipart/form-data`
    - Field: `avatar` (file, image, max 5MB)
- **Response:** `200 OK`
    ```json
    {
      "message": "Avatar uploaded successfully",
      "avatarUrl": "string"
    }
    ```
- **Errors:**
    - `400 Bad Request` if file missing, not an image, or too large
    - `500 Internal Server Error` on upload failure

---

### 5. Change Password

- **URL:** `/api/user/change-password`
- **Method:** `PUT`
- **Auth:** Required
- **Request Body:** (JSON)
    ```json
    {
      "currentPassword": "string",
      "newPassword": "string"
    }
    ```
- **Response:** `200 OK`  
  `"Password changed successfully."`
- **Errors:**
    - `400 Bad Request` if fields missing or invalid
    - `401 Unauthorized` if not authenticated

---

### 6. Delete Account (Soft Delete)

- **URL:** `/api/user/delete`
- **Method:** `DELETE`
- **Auth:** Required
- **Request:** None
- **Response:** `200 OK`  
  `"Your account has been deactivated for 30 days before permanent deletion. You can restore it during this period."`
- **Errors:**
    - `401 Unauthorized` if not authenticated
    - `400 Bad Request` on failure

---

## Notes

- All endpoints expect and return JSON unless otherwise specified.
- For avatar upload, first upload the image (`/api/avatar/upload`), then update the profile with the returned URL (`/api/user/avatar`).
- Session management is via cookies (`SESSION_ID`).

---
