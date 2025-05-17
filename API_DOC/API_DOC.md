# API Documentation

---

## SearchService

### /get_cached_result

URL: `http://localhost:7001/get_cached_result`  
Method: `POST`

#### Input JSON Format

```json
{
  "query": "string"
}
```

- `query` (required): a search term to retrieve cached articles related to the topic.

#### Success Response

```json
{
  "message": "success",
  "data": [
    {
      "author": "string",
      "title": "string",
      "url": "string",
      "image_url": "string",
      "date_publish": "string",
      "brief_des_batches": "string",
      "tags": ["string", "string", "string", "string"],
      "upvotes": 0,
      "vote_type": 0
    }
    // ...more articles
  ]
}
```
CODE: 200 OK

#### Example Article

```json
{
  "author": "VnExpress",
  "title": "Giá xăng hôm nay 24/4: Giá xăng RON 95 vượt 19.000 đồng một lít",
  "url": "https://vnexpress.net/gia-xang-moi-nhat-hom-nay-24-4-4878155.html",
  "image_url": "https://...jpg",
  "date_publish": "2025-04-24",
  "brief_des_batches": "Giá xăng dầu trong nước ngày 24/4/2025 đồng loạt tăng mạnh, xăng RON 95 vượt 19.000 đồng/lít.",
  "tags": [
    "Giá xăng 24/4",
    "RON 95 vượt 19k",
    "Dầu đắt thêm",
    "Tồn kho Mỹ"
  ],
  "upvotes": 0,
  "vote_type": 0
}
```

#### Error Responses

- Content Safety Violation  
  CODE: 400 Bad Request
  ```json
  {
    "error": "string"
  }
  ```

- No Results Found  
  CODE: 404 Not Found
  ```json
  {
    "error": "string"
  }
  ```

- Internal Server Error  
  CODE: 500 Internal Server Error
  ```json
  {
    "error": "string",
    "details": "string"
  }
  ```

---

### /save

URL: `http://localhost:7001/save`  
Method: `POST`

#### Input JSON Format

```json
{
  "url": "string or string[]"
}
```

- `url` (required): It can be a single URL or a list of URLs to save to the database.

#### Success Response

```json
{
  "message": "success"
}
```
CODE: 200 OK

#### Error Responses

- Missing Required Field (`url`)  
  CODE: 400 Bad Request
  ```json
  {
    "error": "string"
  }
  ```

- Internal Server Error  
  CODE: 500 Internal Server Error
  ```json
  {
    "error": "string"
  }
  ```

---

### /vote

URL: `http://localhost:7001/vote`  
Method: `POST`

#### Input JSON Format

```json
{
  "url": "string",
  "vote_type": 1
}
```

- `url` (required): The URL of the article being upvoted.
- `vote_type` (required): The type of vote. (1 for upvote, 0 for neutral, -1 for downvote.)

#### Success Response

```json
{
  "status": "success"
}
```
CODE: 200 OK

#### Error Responses

- Missing Required Fields  
  CODE: 400 Bad Request
  ```json
  {
    "status": "error",
    "message": "string"
  }
  ```

- Article Not Found in Cache  
  CODE: 404 Not Found
  ```json
  {
    "status": "error",
    "message": "string"
  }
  ```

- Internal Server Error  
  CODE: 500 Internal Server Error
  ```json
  {
    "status": "error",
    "message": "string"
  }
  ```

---

## Summariser Service

### /summarize/

URL: `http://localhost:7002/summarize/`  
Method: `POST`

#### Input JSON Format

```json
{
  "url": "string"
}
```

- `url` (required): URL of the article to summarize.

#### Success Response

```json
{
  "summary": "string"
}
```
CODE: 200 OK

#### Error Responses

- Invalid Input Format  
  CODE: 400 Bad Request
  ```json
  {
    "error": "string"
  }
  ```

- Internal Server Error  
  CODE: 500 Internal Server Error
  ```json
  {
    "error": "string"
  }
  ```

---

### /synthesis/

URL: `http://localhost:7002/synthesis/`  
Method: `POST`

#### Input JSON Format

```json
[
  "string",
  "string"
]
```

- Type: `string[]` (required): A list of article URLs for synthesis.

#### Success Response

```json
{
  "synthesis": "string"
}
```
CODE: 200 OK

#### Error Responses

- Article Fetch Failure  
  CODE: 404 Not Found
  ```json
  {
    "error": "string"
  }
  ```

- Invalid Input  
  CODE: 400 Bad Request
  ```json
  {
    "error": "string"
  }
  ```

---

## AnalysisService

### /factcheck/

URL: `http://localhost:7003/factcheck/`  
Method: `POST`

#### Input JSON Format

```json
{
  "url": "string"
}
```

- `url` (required): URL of the article to fact-check.

#### Success Response

```json
{
  "fact-check": "string"
}
```
CODE: 200 OK

#### Error Responses

- Invalid Request Format  
  CODE: 400 Bad Request
  ```json
  {
    "message": "string"
  }
  ```

- Article Not Found in Cache  
  CODE: 404 Not Found
  ```json
  {
    "message": "string"
  }
  ```

- Internal Server Error  
  CODE: 500 Internal Server Error
  ```json
  {
    "data": null,
    "message": "string",
    "details": "string"
  }
  ```

---

### /toxicity_analysis/

URL: `http://localhost:7003/toxicity_analysis/`  
Method: `POST`

#### Input JSON Format

```json
{
  "url": "string"
}
```

- `url` (required): URL of the article (cached).

#### Success Response

```json
{
  "toxicity_analysis": {
    "Công kích danh tính": 0.0,
    "Mức Độ Thô Tục": 0.0,
    "Tính Xúc Phạm": 0.0,
    "Tính Đe Doạ": 0.0,
    "Tính Độc Hại": 0.0
  }
}
```
CODE: 200 OK

#### Error Responses

- Invalid Request Format  
  CODE: 400 Bad Request
  ```json
  {
    "data": null,
    "message": "string"
  }
  ```

- Article Not Found in Cache  
  CODE: 404 Not Found
  ```json
  {
    "data": null,
    "message": "string"
  }
  ```

- Internal Server Error  
  CODE: 500 Internal Server Error
  ```json
  {
    "data": null,
    "message": "string",
    "details": "string"
  }
  ```

---

### /sentiment_analysis/

URL: `http://localhost:7003/sentiment_analysis/`  
Method: `POST`

#### Input JSON Format

```json
{
  "url": "string"
}
```

- `url` (required): URL of the article for sentiment analysis.

#### Success Response

```json
{
  "sentiment_analysis": {
    "sentiment_label": "string",
    "sentiment_score": 0.0
  }
}
```
CODE: 200 OK

#### Error Responses

- Article Not Found in Cache  
  CODE: 404 Not Found
  ```json
  {
    "error": "string"
  }
  ```

- Internal Server Error  
  CODE: 500 Internal Server Error
  ```json
  {
    "error": "string"
  }
  ```

---

### /biascheck/

URL: `http://localhost:7003/biascheck/`  
Method: `POST`

#### Input JSON Format

```json
{
  "url": "string"
}
```

- `url` (required): used to retrieve the article content from Redis cache.

#### Success Response

```json
{
  "data": {
    "bias-check": {
      "bias_type": "string",
      "impact_level": "string",
      "analysis": "string",
      "socratic_questions": ["string", "string"]
    }
  },
  "message": "string"
}
```
CODE: 200 OK

#### Error Responses

- Invalid Request Format  
  CODE: 400 Bad Request
  ```json
  {
    "data": null,
    "message": "string"
  }
  ```

- Article Not Found in Cache  
  CODE: 404 Not Found
  ```json
  {
    "data": null,
    "message": "string"
  }
  ```

- Internal Server Error  
  CODE: 500 Internal Server Error
  ```json
  {
    "data": null,
    "message": "string",
    "details": "string"
  }
  ```

---

## AuthService

### /api/register

URL: `http://localhost:6999/api/register`  
Method: `POST`

#### Input JSON Format

```json
{
  "email": "string",
  "password": "string",
  "userName": "string",
  "bio": "string",
  "avatarLink": "string"
}
```

#### Success Response

```json
{
  "message": "Registration successful"
}
```
CODE: 201 Created

#### Error Responses

- Registration Failed  
  CODE: 400 Bad Request
  ```json
  {
    "error": "string"
  }
  ```

- Internal Server Error  
  CODE: 500 Internal Server Error
  ```json
  {
    "error": "string",
    "details": "string"
  }
  ```

---

### /api/verify

URL: `http://localhost:6999/api/verify`  
Method: `POST`

#### Input JSON Format

```json
{
  "email": "string",
  "password": "string"
}
```

#### Success Response

```json
{
  "message": "string"
}
```
CODE: 200 OK

#### Error Responses

- Invalid Email or Password  
  CODE: 401 Unauthorized
  ```json
  {
    "error": "string"
  }
  ```

- Server Error  
  CODE: 500 Internal Server Error
  ```json
  {
    "error": "string",
    "details": "string"
  }
  ```

---

### /api/login

URL: `http://localhost:6999/api/login`  
Method: `POST`

#### Input JSON Format

```json
{
  "email": "string",
  "otp": "string"
}
```

#### Success Response

```json
{
  "message": "string",
  "user": {
    "userId": "string"
  }
}
```
CODE: 200 OK

#### Error Responses

- Invalid OTP or General Failure  
  CODE: 401 Unauthorized
  ```json
  {
    "error": "string",
    "details": "string"
  }
  ```

- Account Permanently Deleted  
  CODE: 403 Forbidden
  ```json
  {
    "error": "string",
    "details": "string"
  }
  ```

- Soft-Delete (Reactivation Period)  
  CODE: 200 OK
  ```json
  {
    "message": "string",
    "actionRequired": "reactivate",
    "user": {
      "userId": "string"
    }
  }
  ```

---

### /api/reactivate-account

URL: `http://localhost:6999/api/reactivate-account`  
Method: `POST`

#### Input: Required (via SESSION_ID cookie)

No request body required.

#### Success Response

```json
{
  "message": "string"
}
```
CODE: 200 OK

#### Error Responses

- Invalid Session User ID  
  CODE: 400 Bad Request
  ```json
  {
    "error": "string"
  }
  ```

- Failed to Reactivate Account  
  CODE: 400 Bad Request
  ```json
  {
    "error": "string"
  }
  ```

- Unauthorized  
  CODE: 401 Unauthorized
  ```json
  {
    "error": "string"
  }
  ```

---

### /api/logout

URL: `http://localhost:6999/api/logout`  
Method: `POST`

#### Input: No request body needed

#### Success Response

```json
{
  "message": "string"
}
```
CODE: 200 OK

---

### /api/auth-status

URL: `http://localhost:6999/api/auth-status`  
Method: `GET`

#### Input: No request body needed

#### Success Response

```json
{
  "loggedIn": true,
  "userId": "string"
}
```
CODE: 200 OK

#### Success Response (Not Logged In)

```json
{
  "loggedIn": false
}
```
CODE: 200 OK

---

### /api/auth/google-login

URL: `http://localhost:6999/api/auth/google-login`  
Method: `POST`

#### Input JSON Format

```json
{
  "idToken": "string"
}
```

#### Success Response

```json
{
  "message": "string"
}
```
CODE: 200 OK

#### Error Responses

- Invalid Google Token  
  CODE: 400 Bad Request
  ```json
  {
    "error": "string"
  }
  ```

- Google Login Failed  
  CODE: 400 Bad Request
  ```json
  {
    "error": "string"
  }
  ```

- Google Login Error  
  CODE: 500 Internal Server Error
  ```json
  {
    "error": "string",
    "details": "string"
  }
  ```

---

## UserService

### /api/user/profile

URL: `http://172.8.8.122:6998/api/user/profile`  
Method: `GET`

#### Input: None (requires session cookie)

#### Success Response

```json
{
  "email": "string",
  "userName": "string",
  "bio": "string",
  "avatarLink": "string"
}
```
CODE: 200 OK

#### Error Responses

- Unauthorized  
  CODE: 401 Unauthorized
  ```json
  {
    "error": "string"
  }
  ```

- User Not Found  
  CODE: 404 Not Found
  ```json
  {
    "error": "string"
  }
  ```

---

### /api/user/update

URL: `http://172.8.8.122:6998/api/user/update`  
Method: `PUT`

#### Input JSON Format

```json
{
  "userName": "string",
  "bio": "string",
  "avatarLink": "string"
}
```

#### Success Response

```json
{
  "message": "string"
}
```
CODE: 200 OK

#### Error Responses

- Unauthorized  
  CODE: 401 Unauthorized
  ```json
  {
    "message": "string"
  }
  ```

- Username Cannot Be Empty  
  CODE: 403 Forbidden
  ```json
  {
    "message": "string"
  }
  ```

- Failed to Update Profile  
  CODE: 400 Bad Request
  ```json
  {
    "message": "string"
  }
  ```

---

### /api/user/delete

URL: `http://172.8.8.122:6998/api/user/delete`  
Method: `DELETE`

#### Input: None

#### Success Response

```json
{
  "data": null,
  "message": "string"
}
```
CODE: 200 OK

#### Error Responses

- Failed to Soft Delete User  
  CODE: 400 Bad Request
  ```json
  {
    "data": null,
    "message": "string"
  }
  ```

- Unauthorized  
  CODE: 401 Unauthorized
  ```json
  {
    "data": null,
    "message": "string"
  }
  ```

---

### /api/avatar/upload

URL: `http://172.8.8.122:6998/api/avatar/upload`  
Method: `POST`

#### Input: multipart/form-data

#### Success Response

```json
{
  "message": "string",
  "avatarUrl": "string"
}
```
CODE: 200 OK

#### Error Responses

- No Avatar File Uploaded  
  CODE: 400 Bad Request
  ```json
  {
    "error": "string"
  }
  ```

- Only Image Files Are Allowed  
  CODE: 400 Bad Request
  ```json
  {
    "error": "string"
  }
  ```

- File Size Exceeds Limit  
  CODE: 400 Bad Request
  ```json
  {
    "error": "string"
  }
  ```

- Failed to Upload Avatar  
  CODE: 500 Internal Server Error
  ```json
  {
    "error": "string"
  }
  ```

---

## LoggingService

### /health

URL: `http://localhost:7004/health`  
Method: `GET`

#### Input: None

#### Success Response

```json
{
  "status": "string",
  "timestamp": "string",
  "services": ["string"]
}
```
CODE: 200 OK

#### Error Responses

- Missing Required Fields  
  CODE: 400 Bad Request
  ```json
  {
    "error": "string"
  }
  ```

---

### /log

URL: `http://localhost:7004/log`  
Method: `POST`

#### Input JSON Format

```json
{
  "service_name": "string",
  "event_type": "string",
  "message": "string",
  "severity": "string",
  "timestamp": "string"
}
```

#### Success Response

```json
{
  "status": "string",
  "message": "string",
  "timestamp": "string",
  "service_name": "string"
}
```
CODE: 200 OK

#### Error Responses

- Missing Required Fields  
  CODE: 400 Bad Request
  ```json
  {
    "error": "string"
  }
  ```

- Invalid Service Name  
  CODE: 400 Bad Request
  ```json
  {
    "error": "string"
  }
  ```

- Invalid Severity Level  
  CODE: 400 Bad Request
  ```json
  {
    "error": "string"
  }
  ```

- Internal Server Error  
  CODE: 500 Internal Server Error
  ```json
  {
    "error": "string"
  }
  ```

---

### /exception

URL: `http://localhost:7004/exception`  
Method: `POST`

#### Input JSON Format

```json
{
  "service_name": "string",
  "error": "string",
  "timestamp": "string"
}
```

#### Success Response

```json
{
  "status": "string",
  "message": "string",
  "timestamp": "string",
  "service_name": "string"
}
```
CODE: 200 OK

#### Error Responses

- Missing Required Fields  
  CODE: 400 Bad Request
  ```json
  {
    "error": "string"
  }
  ```

- Invalid Service Name  
  CODE: 400 Bad Request
  ```json
  {
    "error": "string"
  }
  ```

- Internal Server Error  
  CODE: 500 Internal Server Error
  ```json
  {
    "error": "string"
  }
  ```

---

### /event

URL: `http://localhost:7004/event`  
Method: `POST`

#### Input JSON Format

```json
{
  "service_name": "string",
  "event_name": "string",
  "timestamp": "string"
}
```

#### Success Response

```json
{
  "status": "string",
  "message": "string",
  "timestamp": "string",
  "service_name": "string"
}
```
CODE: 200 OK

#### Error Responses

- Missing Required Fields  
  CODE: 400 Bad Request
  ```json
  {
    "error": "string"
  }
  ```

- Invalid Service Name  
  CODE: 400 Bad Request
  ```json
  {
    "error": "string"
  }
  ```

- Internal Server Error  
  CODE: 500 Internal Server Error
  ```json
  {
    "error": "string"
  }
  ```

---
````markdown