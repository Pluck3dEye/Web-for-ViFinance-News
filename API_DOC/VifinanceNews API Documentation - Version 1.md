# VifinanceNews API Documentation - Version 1.0.0

**Include:** API Structure (route-path)

---

_This documentation includes the detailed description for the API Structure of the VifinanceNews project - updated on 17 May 2025 with Version 1.0.0_

---

To inspect the details of the API Structure, click on the toggle to read more on the API.

---

## **SearchService**

### `/api/get_cached_result`

- **URL:** `http://localhost:7001/api/get_cached_result`
- **Method:** `POST`

#### Input JSON Format

- `query` (**required**) — a search term to retrieve cached articles related to the topic.
- Adding the `Session_ID` (to check if the user is logged in).

```json
{
  "query": "giá xăng dầu"
}
```

#### Data Structure (Stored in Cache of the Article Object)

```json
{
  "message": "success",
  "data": [
    {
      "author": "string",
      "title": "string",
      "url": "string (valid URL)",
      "image_url": "string (valid image URL)",
      "date_publish": "string (YYYY-MM-DD)",
      "main_text": "string (optional, not returned in this response)",
      "brief_des_batches": "string (10–50 words, short article summary in Vietnamese)",
      "tags": [
        "string", "string", "string", "string"
      ],
      "upvotes": 0,
      "vote_type": 0
    }
    // ...
  ]
}
```

> **Note:** The `vote_type` field is deprecated.

#### Field Descriptions

| Field              | Type     | Description                                                        | Deprecated? |
|--------------------|----------|--------------------------------------------------------------------|-------------|
| message            | string   | Status of the response ("success" or "error").                     | No          |
| data               | array    | List of article objects.                                           | No          |
| author             | string   | Name of the article’s author.                                      | No          |
| title              | string   | Title of the article.                                              | No          |
| url                | string   | Direct link to the article.                                        | No          |
| image_url          | string   | Link to the article’s cover image.                                 | No          |
| date_publish       | string   | Date the article was published (in YYYY-MM-DD format).             | No          |
| brief_des_batches  | string   | A short, generated summary of the article (10–50 words).           | No          |
| tags               | array    | Exactly 4 tags describing the article.                             | No          |
| upvotes            | integer  | Number of upvotes (default 0).                                     | No          |
| vote_type          | integer  | Type of vote (0 = NEUTRAL, other values as defined).               | Yes         |

#### Example (Single Article)

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

#### Output (on success): (A list of article objects)

```json
{
  "message": "success",
  "data": [
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
      "upvotes": 0
    }
    // ...more articles
  ]
}
// CODE: 200 OK
```

#### Error Responses

**Content Safety Violation**  
`400 Bad Request`
```json
{
  "error": "Yêu cầu tìm kiếm của bạn vi phạm về điều khoản tìm kiếm nội dung an toàn của chúng tôi"
}
```

**No Results Found**  
`404 Not Found`
```json
{
  "error": "No results found"
}
```

**Internal Server Error**  
`500 Internal Server Error`
```json
{
  "error": "Server error",
  "details": "Error message here"
}
```

---

### `/api/save`

- **URL:** `http://localhost:7001/api/save`
- **Method:** `POST`

#### Input JSON Format

- The URL to navigate to the selected article
- The user’s `SESSION_ID` received from the cache

```json
{
  "url": "https://example.com/article"
}
```

- `url` is **required** — It can be a single URL or a list of URLs to save to the database.
- `SESSION_ID` is required for saving action

#### Output

**Success Response**
```json
{
  "message": "success"
}
// CODE: 200 OK
```

#### Error Responses

**Missing Required Field (`url`)**  
`400 Bad Request`
```json
{
  "error": "Invalid input, 'url' is required"
}
```

**Internal Server Error**  
`500 Internal Server Error`
```json
{
  "error": "..."
}
```

**Session not found or expired**  
`401 Session not found or expired`
```json
{
  "error": "Session not found or expired."
}
```

**Unauthorized – No userId in session**  
`401 Unauthorized – No userId in session`
```json
{
  "error": "Unauthorized – No userId in session"
}
```

**Invalid input, 'url' is required**  
`400 Invalid input, 'url' is required`
```json
{
  "error": "Invalid input, 'url' is required"
}
```

---

### `/api/get_up_vote`

- **URL:** `http://localhost:7001/api/get_up_vote`
- **Method:** `POST`

#### Input JSON Format

```json
{
  "url": "https://example.com/news/article"
}
```

- `url` is **required** — The URL of the article being upvoted.
- `vote_type` is **required** — The type of vote. (1 for upvote, 0 for neutral, -1 for downvote.)
- `SESSION_ID` is required - Ensure the user is logged in

#### Output

**Success Response**
```json
{
  "vote_type": 1
}
// CODE: 200 OK
```

#### Error Responses

**Missing the SESSION_ID**  
`401 Please log in to continue`
```json
{
  "error": "Please log in to continue"
}
```

**Internal Server Error**  
`500 Internal Server Error`
```json
{
  "status": "error",
  "message": "Error message here"
}
```

---

### `/api/get_down_vote`

- **URL:** `http://localhost:7001/api/get_down_vote`
- **Method:** `POST`

#### Input JSON Format

```json
{
  "url": "https://example.com/news/article"
}
```

- `url` is **required** — The URL of the article being upvoted.
- `vote_type` is **required** — The type of vote. (1 for upvote, 0 for neutral, -1 for downvote.)
- `SESSION_ID` is required - Ensure the user is logged in

#### Output

**Success Response**
```json
{
  "vote_type": -1
}
// CODE: 200 OK
```

#### Error Responses

**Missing the SESSION_ID**  
`401 Please log in to continue`
```json
{
  "error": "Please log in to continue"
}
```

**Internal Server Error**  
`500 Internal Server Error`
```json
{
  "status": "error",
  "message": "Error message here"
}
```

---

## **Summariser Service**

### `/api/summarize/`

- **URL:** `http://localhost:7002/summarize/`
- **Method:** `POST`

#### Input JSON Format

```json
{
  "url": "https://vnexpress.net/bai-viet-4866570.html?commentid=59194192"
}
```

| Field | Type   | Required | Description                        |
|-------|--------|----------|------------------------------------|
| url   | string | yes      | URL of the article to summarize   |

#### Output JSON Format

**Success Response**
```json
{
  "summary": "Giá xăng RON 95-III phổ biến..."
}
```

#### Field Descriptions

| Field    | Type   | Description                        |
|----------|--------|------------------------------------|
| summary  | string | Extractive summary of the article. |

#### Error Responses

**Invalid Input Format (Malformed JSON or Invalid Field)**  
`400 Bad Request`
```json
{
  "error": "Invalid input format"
}
```

**Internal Server Error**  
`500 Internal Server Error`
```json
{
  "error": "..."
}
```

---

### `/api/synthesis/`

- **URL:** `http://localhost:7002/synthesis/`
- **Method:** `POST`

#### Input JSON Format

```json
[
  "https://vneconomy.vn/...",
  "https://vnexpress.net/..."
]
```

| Type      | Required | Description                        |
|-----------|----------|------------------------------------|
| string[]  | yes      | A list of article URLs for synthesis |

#### Output JSON Format

**Success Response**
```json
{
    "synthesis": 
        {
    "synthesis_paragraph": "Giá vàng liên tục biến động trong giai đoạn 2024-2025, chịu tác động của nhiều yếu tố kinh tế và chính trị. Vào tháng 4/2025, giá vàng miếng SJC đạt đỉnh mới, trong khi giá vàng nhẫn trơn SJC có xu hướng ổn định ([VnExpress, 2025a]). Tuy nhiên, đến giữa tháng 5/2025, giá vàng miếng SJC lại tăng đáng kể, gần 3 triệu đồng/lượng ([VnExpress, 2025b]).  Chênh lệch giá giữa vàng miếng và giá vàng thế giới cũng nới rộng, có lúc lên đến gần 20 triệu đồng/lượng ([VnExpress, 2025c]). Các chuyên gia dự báo về khả năng giảm giá trong tuần tiếp theo ([VnExpress, 2025d]). Giá vàng thế giới cũng có sự biến động, với xu hướng giảm trở lại vào tháng 5/2025 ([VnExpress, 2025e]), nhưng sau đó lại tăng mạnh ([VnExpress, 2025f]).  Các yếu tố như đồng đô la yếu, căng thẳng thương mại, và tình hình địa chính trị toàn cầu (xung đột ở châu Âu, Trung Đông) có ảnh hưởng đáng kể đến giá vàng ([VnExpress, 2025a]; [Nguyễn, 2024]).  Trong dài hạn, các chuyên gia UOB dự báo giá vàng có thể lên 3.000 USD/ounce, do nhiều yếu tố thúc đẩy ([Nguyễn, 2024]). Các sự kiện như khủng bố 11/9/2001, đại dịch COVID-19 và chiến tranh Nga-Ukraine cũng góp phần làm tăng giá vàng ([Đức Anh, 2024]).",
    "reference": {
        "1": {
            "title": "Giá vàng hôm nay 22/4: Lập đỉnh mới",
            "url": "https://vnexpress.net/gia-vang-mieng-sjc-lap-dinh-moi-121-trieu-dong-mot-luong-4877056.html"
        },
        "2": {
            "title": "Giá vàng miếng SJC tăng gần 3 triệu đồng một lượng",
            "url": "https://vnexpress.net/gia-vang-mieng-sjc-tang-gan-3-trieu-dong-mot-luong-4886685.html"
        },
        "3": {
            "title": "Giá vàng hôm nay: Chênh lệch vàng miếng và thế giới lên gần 20 triệu đồng một lượng",
            "url": "https://vnexpress.net/chenh-lech-vang-mieng-va-the-gioi-len-gan-20-trieu-dong-mot-luong-4886293.html"
        },
        "4": {
            "title": "Giá vàng hôm nay: Chuyên gia dự báo giá vàng giảm tuần tới",        
            "url": "https://vnexpress.net/chuyen-gia-du-bao-gia-vang-giam-tuan-toi-4887411.html"
        },
        "5": {
            "title": "Giá vàng hôm nay ngày 17/5: Giá vàng thế giới giảm trở lại",        
            "url": "https://vnexpress.net/gia-vang-the-gioi-giam-tro-lai-4887088.html"    
        },
        "6": {
            "title": "Giá vàng hôm nay ngày 21/5: Giá vàng thế giới tăng mạnh",
            "url": "https://vnexpress.net/gia-vang-the-gioi-lay-lai-moc-3-300-usd-4888520.html"
        },
        "7": {
            "title": "Chuyên gia UOB dự báo: Giá vàng có khả năng lên 3.000 USD/ounce trong dài hạn - Nhịp sống kinh tế Việt Nam & Thế giới",
            "url": "https://vneconomy.vn/chuyen-gia-uob-du-bao-gia-vang-co-kha-nang-len-3-000-usd-ounce-trong-dai-han.htm"
        },
        "8": {
            "title": "Giá vàng dưới các thời tổng thống Mỹ - Nhịp sống kinh tế Việt Nam & Thế giới",
            "url": "https://vneconomy.vn/gia-vang-duoi-cac-thoi-tong-thong-my.htm"        
        }
    }
}
}

// This is a example of apu for synthesis
// CODE: 200 OK
```

#### Field Descriptions

| Field      | Type   | Description                                                  |
|------------|--------|-------------------------------------------------------------|
| synthesis  | string | Synthesis paragraph (with citations), text includes Unicode |

#### Error Responses

**Article Fetch Failure**  
`404 Not Found`
```json
{
  "error": "Some articles could not be retrieved"
}
```

**Invalid Input (Expected List of URLs)**  
`400 Bad Request`
```json
{
  "error": "Invalid input: Expected a list of URLs"
}
```

---

## **AnalysisService**

### `/api/factcheck/`

- **URL:** `http://localhost:7003/api/factcheck/`
- **Method:** `POST`

#### Input JSON

```json
{
  "url": "https://vnexpress.net/bai-viet-4866570.html?commentid=59194192"
}
```

#### Output JSON

**Success**
```json
{
  "fact-check": {
    "Danh sách các dẫn chứng": {
      "[1]": {
        "publisher": string,
        "title": string,
        "url": string
      },
      "[2]": {
        "publisher": string,
        "title": string,
        "url": string
      },
      "[3]": {
        "publisher": string,
        "title": string,
        "url": string
      }
    },
    "Giải thích": string,
    "Kết luận": string,
    "Lời khuyên cho người dùng về cách nhìn nhận hiện tại": string,
    "Mức độ tin cậy": "C3 - Khá Đáng Tin Cậy và Có Thể Đúng",
    "Phân tích bằng chứng": string,
    "Tổng Hợp Cuối Cùng": string
  }
}
// CODE: 200
```
#### Example
```json
{
	"fact-check": {
		"Danh sách các dẫn chứng": {
			"[1]": {
				"publisher": "Nhịp sống kinh tế Việt Nam & Thế giới",
				"title": "Đà tăng giá chung cư Hà Nội chững lại trong quý 1/2025 - Nhịp sống kinh tế Việt Nam & Thế giới",
				"url": "https://vneconomy.vn/da-tang-gia-chung-cu-ha-noi-chung-lai-trong-quy-1-2025.htm"
			},
			"[2]": {
				"publisher": "Nhịp sống kinh tế Việt Nam & Thế giới",
				"title": "Giá chung cư tại Hà Nội tiếp tục “bay bổng” - Nhịp sống kinh tế Việt Nam & Thế giới",
				"url": "https://vneconomy.vn/gia-chung-cu-tai-ha-noi-tiep-tuc-bay-bong.htm"
			},
			"[3]": {
				"publisher": "VnExpress",
				"title": "Khác biệt giữa phở Nam Định và phở Hà Nội - Báo VnExpress Du lịch",
				"url": "https://vnexpress.net/khac-biet-giua-pho-nam-dinh-va-pho-ha-noi-4780799.html"
			}
		},
		"Giải thích": "Đánh giá là C3 vì các nguồn tin là VnEconomy và VnExpress (khá đáng tin cậy - C). Bài viết [1] cung cấp thông tin từ CBRE, một nguồn đáng tin cậy trong lĩnh vực bất động sản, về thị trường căn hộ Hà Nội trong quý 1/2025. Tuy nhiên, thông tin này có thể không hoàn toàn chính xác (có thể đúng - 3) do phụ thuộc vào dữ liệu thu thập và phân tích của CBRE. Bằng chứng [2] cũng đến từ CBRE, tuy nhiên thông tin không trực tiếp liên quan đến thời điểm quý 1/2025. Bằng chứng [3] không liên quan đến bất động sản.",
		"Kết luận": "Trung lập",
		"Lời khuyên cho người dùng về cách nhìn nhận hiện tại": "Thông tin về sự chững lại của giá chung cư Hà Nội trong quý 1/2025 cần được xem xét kỹ lưỡng. Hãy tham khảo thêm các nguồn tin khác từ các công ty nghiên cứu thị trường bất động sản và các chuyên gia để có cái nhìn toàn diện hơn.",
		"Mức độ tin cậy": "C3 - Khá Đáng Tin Cậy và Có Thể Đúng",
		"Phân tích bằng chứng": "Bằng chứng [1] trích dẫn thông tin từ CBRE về thị trường căn hộ Hà Nội trong quý 1/2025, đề cập đến việc nguồn cung mới giảm và tốc độ tăng giá chững lại. Bằng chứng [2] cũng trích dẫn thông tin từ CBRE, cho thấy giá chung cư Hà Nội đang tăng, tuy nhiên không trực tiếp đề cập đến quý 1/2025. Bằng chứng [3] thảo luận về sự khác biệt giữa phở Hà Nội và Nam Định, không liên quan đến mệnh đề. Do đó, mặc dù có bằng chứng về sự chững lại của giá chung cư, các bằng chứng không đủ mạnh để kết luận một cách dứt khoát về sự việc này.",
"Tổng Hợp Cuối Cùng": "Các bằng chứng cung cấp thông tin về thị trường bất động sản Hà Nội, bao gồm nguồn cung, giá cả và xu hướng. Chúng cũng đưa ra một số so sánh về đặc điểm của phở Hà Nội và Nam Định. Tuy nhiên, không có bằng chứng nào trực tiếp xác nhận hay bác bỏ mệnh đề về sự chững lại của giá chung cư Hà Nội trong quý 1/2025."
	}
}
```



**Invalid request format**
```json
{
  "message": "Invalid request format. Expected JSON with a \"url\" key."
}
// CODE: 400
```

**Article not found**
```json
{
  "message": "Article not found in cache"
}
// CODE: 404
```

**Server error**
```json
{
  "data": null,
  "message": "Server error",
  "details": "..."
}
// CODE: 500
```

| Field      | Type   | Description                                 |
|------------|--------|---------------------------------------------|
| fact-check | string | A natural-language summary of fact-checking |

---

### `/api/toxicity_analysis/`

- **URL:** `http://localhost:7003/api/toxicity_analysis/`
- **Method:** `POST`

#### Input JSON

```json
{
  "url": "https://vnexpress.net/bai-viet-4866570.html?commentid=59194192"
}
```

| Field | Type   | Required | Description                        |
|-------|--------|----------|------------------------------------|
| url   | string | yes      | URL of the article (cached)        |

#### Output JSON

**Success**
```json
{
  "toxicity_analysis": {
    "Công kích danh tính": 0.1,
    "Mức Độ Thô Tục": 0.2,
    "Tính Xúc Phạm": 0.3,
    "Tính Đe Doạ": 0.4,
    "Tính Độc Hại": 0.5
  }
}
// CODE: 200
```

**Invalid request format**
```json
{
  "data": null,
  "message": "Invalid request format. Expected JSON with a \"url\" key."
}
// CODE: 400
```

**Article not found**
```json
{
  "data": null,
  "message": "Article not found in cache"
}
// CODE: 404
```

**Server error**
```json
{
  "data": null,
  "message": "Server error",
  "details": "..."
}
// CODE: 500
```

---

### `/api/sentiment_analysis/`

- **URL:** `http://localhost:7003/api/sentiment_analysis/`
- **Method:** `POST`

#### Input JSON

```json
{
  "url": "https://vnexpress.net/bai-viet-4866570.html?commentid=59194192"
}
```

#### Output JSON

**Success**
```json
{
  "sentiment_analysis": {
    "sentiment_label": "Very Negative",
    "sentiment_score": 0.5602148175239563
  }
}
// CODE: 200
```

**Article not found**
```json
{
  "error": "Article not found in cache"
}
// CODE: 404
```

**Internal server error**
```json
{
  "error": "Error message here"
}
// CODE: 500
```

| Field           | Type   | Description                        |
|-----------------|--------|------------------------------------|
| sentiment_label | string | Label: “Positive”, “Negative”, etc.|
| sentiment_score | float  | Confidence score (0–1)             |

---

### `/api/biascheck/`

- **URL:** `http://localhost:7003/api/biascheck/`
- **Method:** `POST`

#### Input JSON Format

```json
{
  "url": "https://example.com/news/article"
}
```

#### Output

**Success**
```json
{
    "bias-check": {
	    "Câu hỏi phản biện": [
        "What sources are being omitted that could offer a different perspective?",
        "Is the argument presented in this article supported by factual evidence, or does it rely on emotional appeal?",
        "What are the potential consequences of framing this issue in this particular way?",
        "How could the article be rewritten to present a more balanced view?"
      ],
      "Loại thiên kiến": string,
      "Mức độ ảnh hưởng": string, 
      "Phân tích ngắn gọn": string,
       
    }
}
// This is example, Câu hỏi phản biện ís a array òf string
// CODE: 200
```

**Invalid request format**
```json
{
  "data": null,
  "message": "Invalid request format. Expected JSON with a \"url\" key."
}
// CODE: 400
```

**Article not found**
```json
{
  "data": null,
  "message": "Article not found in cache"
}
// CODE: 404
```

**No content**
```json
{
  "data": null,
  "message": "⚠️ Bài viết không có nội dung. Vui lòng cung cấp bài viết hợp lệ để phân tích."
}
// CODE: 200
```

**Server error**
```json
{
  "data": null,
  "message": "Server error",
  "details": "Error message here"
}
// CODE: 500
```

---

## **AuthService**

### `/api/register`

- **URL:** `http://localhost:6999/api/register`
- **Method:** `POST`

#### Input JSON Format

```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "userName": "user123",
  "bio": "Short bio (optional)",
  "avatarLink": "https://yourcdn.com/avatars/user123.png"
}
```

| Field      | Type   | Required | Description                  | Default Value |
|------------|--------|----------|------------------------------|---------------|
| email      | string | yes      | User email                   | MUST HAVE     |
| password   | string | yes      | User password                | MUST HAVE     |
| userName   | string | yes      | Username                     | MUST HAVE     |
| bio        | string | optional | User bio                     | NULL          |
| avatarLink | string | optional | Link to uploaded avatar image| NULL          |

#### Output JSON Format

**Registration Successful**
```json
{
  "message": "Registration successful"
}
// CODE: 201 Created
```

**Registration Failed**
```json
{
  "error": "Registration failed"
}
// CODE: 400 Bad Request
```

**Internal Server Error**
```json
{
  "error": "Internal server error",
  "details": "Error message or details here"
}
// CODE: 500 Internal Server Error
```

---

### `/api/verify`

- **URL:** `http://localhost:6999/api/verify`
- **Method:** `POST`

#### Input JSON Format

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

| Field    | Type   | Required | Description             |
|----------|--------|----------|-------------------------|
| email    | string | yes      | Email for verification  |
| password | string | yes      | Account password        |

#### Output JSON Format

**OTP Sent (or Not Required for Google Login)**
```json
{
  "message": "OTP sent (or not required for Google login)"
}
// CODE: 200 OK
```

**Invalid Email or Password**
```json
{
  "error": "Invalid email or password"
}
// CODE: 401 Unauthorized
```

**Server Error (Database Connection Failed)**
```json
{
  "error": "Server error",
  "details": "Database connection failed"
}
// CODE: 500 Internal Server Error
```

**Server Error (Unknown Error)**
```json
{
  "error": "Server error",
  "details": "Unknown error"
}
// CODE: 500 Internal Server Error
```

---

### `/api/login`

- **URL:** `http://localhost:6999/api/login`
- **Method:** `POST`

#### Input JSON Format

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

| Field | Type   | Required | Description |
|-------|--------|----------|-------------|
| email | string | yes      | Email       |
| otp   | string | yes      | OTP code    |

#### Output JSON Format

**Invalid OTP or General Failure**
```json
{
  "error": "Login failed",
  "details": "Invalid OTP or login failed"
}
// CODE: 401 Unauthorized
```

**Account Permanently Deleted**
```json
{
  "error": "Account deleted",
  "details": "Account permanently deleted. Reactivation not possible."
}
// CODE: 403 Forbidden
```

**Soft-Delete (Reactivation Period)**
```json
{
  "message": "Account is in reactivation period",
  "actionRequired": "reactivate",
  "user": {
    "userId": "..." 
  }
}
// CODE: 200 OK
```

**Login Successful**
```json
{
  "message": "Login successful",
  "user": {
    "userId": "..."
  }
}
// CODE: 200 OK
```

---

### `/api/reactivate-account`

- **URL:** `http://localhost:6999/api/reactivate-account`
- **Method:** `POST`

#### Input

- **Required:** via `SESSION_ID` cookie

#### Output JSON Format

**Success Response**
```json
{
  "message": "Account reactivated successfully"
}
// CODE: 200 OK
```

**400 Bad Request**
```json
{
  "error": "Invalid session user ID"
}
// CODE: 400 Bad Request
```
```json
{
  "error": "Failed to reactivate account"
}
// CODE: 400 Bad Request
```

**401 Unauthorized**
```json
{
  "error": "Unauthorized"
}
// CODE: 401 Unauthorized
```

---

### `/api/logout`

- **URL:** `http://localhost:6999/api/logout`
- **Method:** `POST`

#### Input

- No request body needed

#### Output JSON Format

**Success Response**
```json
{
  "message": "Logout successful"
}
// CODE: 200 OK
```

---

### `/api/auth-status`

- **URL:** `http://localhost:6999/api/auth-status`
- **Method:** `GET`

#### Output JSON Format

**Logged In**
```json
{
  "loggedIn": true,
  "userId": "UUID"
}
// CODE: 200 OK
```

**Not Logged In**
```json
{
  "loggedIn": false
}
// CODE: 200 OK
```

---

### `/api/request-password-reset`

- **URL:** `http://localhost:6999/api/request-password-reset`
- **Method:** `POST`

#### Success Response

`200 OK`
```json
{
  "message": "OTP sent to email"
}
```

#### Client Error Responses

`400 Bad Request` — Missing email
```json
{
  "error": "Email is required"
}
```

`404 Not Found` — Email not found or not eligible
```json
{
  "error": "User not found or not eligible"
}
```

#### Server Error Response

`500 Internal Server Error`
```json
{
  "error": "Server error",
  "details": "Exception message here"
}
```

---

### `/api/reset-password`

- **URL:** `http://localhost:6999/api/reset-password`
- **Method:** `POST`

#### Success Response

`200 OK`
```json
{
  "message": "Password reset successful"
}
```

#### Client Error Responses

`400 Bad Request` — Missing fields
```json
{
  "error": "Missing required fields"
}
```

`400 Bad Request` — OTP or email invalid
```json
{
  "error": "Password reset failed. Check OTP or email."
}
```

#### Server Error Response

`500 Internal Server Error`
```json
{
  "error": "Internal server error",
  "details": "Exception message here"
}
```

---

### `/api/google-login`

- **URL:** `http://localhost:6999/api/google-login`
- **Method:** `POST`

#### Success Response

`200 OK`
```json
{
  "message": "Google login successful",
  "userId": "uuid-string"
}
```

#### Client Error Responses

`401 Unauthorized` — Invalid token
```json
{
  "error": "Invalid Google token"
}
```

`400 Bad Request` — Failed to create or log in user
```json
{
  "error": "Google login failed"
}
```

#### Server Error Response

`500 Internal Server Error`
```json
{
  "error": "Google login error",
  "details": "Exception message here"
}
```

---

## **UserService**

### `/api/user/profile`

- **URL:** `http://localhost:6998/api/user/profile`
- **Method:** `GET`

#### Output

**Success Response**
```json
{
  "email": "user@example.com",
  "userName": "John Doe",
  "bio": "This is a sample bio",
  "avatarLink": "https://example.com/images/avatar.jpg"
}
// CODE: 200 OK
```

**401 Unauthorized**
```json
{
  "error": "Unauthorized"
}
// CODE: 401 Unauthorized
```

**404 Not Found**
```json
{
  "error": "User not found"
}
// CODE: 404 Not Found
```

---

### `/api/user/update-info`

- **URL:** `http://localhost:6998/api/user/update-info`
- **Method:** `PUT`

#### Input JSON Format

```json
{
  "userName": "New Name",
  "bio": "Updated bio",
  "avatarLink": "https://example.com/images/avatar.jpg"
}
```

#### Output

**Success Response**
```json
{
  "message": "Profile updated successfully"
}
// CODE: 200 OK
```

**401 Unauthorized**
```json
{
  "message": "Unauthorized"
}
// CODE: 401 Unauthorized
```

**403 Forbidden**
```json
{
  "message": "Username cannot be empty"
}
// CODE: 403 Forbidden
```

**400 Bad Request**
```json
{
  "message": "Failed to update profile"
}
// CODE: 400 Bad Request
```

---

### `/api/user/delete`

- **URL:** `http://localhost:6998/api/user/delete`
- **Method:** `DELETE`

#### Output

**Success Response**
```json
{
  "data": null,
  "message": "Your account has been deactivated for 30 days before permanent deletion. You can restore it during this period."
}
// CODE: 200 OK
```

**400 Error Response**
```json
{
  "data": null,
  "message": "Failed to soft delete user."
}
// CODE: 400 Bad Request
```

**401 Unauthorized Response**
```json
{
  "data": null,
  "message": "Unauthorized"
}
// CODE: 401 Unauthorized
```

---

### `/api/avatar/upload`

- **URL:** `http://localhost:6998/api/avatar/upload`
- **Method:** `POST`

#### Input

- **Content-Type:** multipart/form-data
- **Form field:** avatar — the image file to upload
- userId is retrieved from session

#### Output

**Success Response**
```json
{
  "message": "Avatar uploaded successfully",
  "avatarUrl": "https://your-storage-service.com/avatars/uuid_filename.jpg"
}
// CODE: 200 OK
```

**400 Error Responses**
```json
{
  "error": "No avatar file uploaded"
}
// CODE: 400 Bad Request
```
```json
{
  "error": "Only image files are allowed"
}
// CODE: 400 Bad Request
```
```json
{
  "error": "File size exceeds the 5MB limit"
}
// CODE: 400 Bad Request
```

**500 Error Responses**
```json
{
  "error": "Failed to upload avatar"
}
// CODE: 500 Internal Server Error
```
```json
{
  "error": "Server error",
  "details": "..."
}
// CODE: 500 Internal Server Error
```

---

### `/api/user/avatar`

- **URL:** `http://localhost:6998/api/user/avatar`
- **Method:** `PUT`

#### Input

```json
{
  "avatarLink": "https://example.com/avatar.jpg"
}
```

#### Output

- `200 OK` — Avatar updated
- `400 Bad Request` — Avatar link is missing or empty / update failed
- `401 Unauthorized` — Session is missing or invalid

---

### `/api/user/saved-articles`

- **URL:** `http://localhost:6998/api/user/saved-articles`
- **Method:** `GET`

#### Input

Query parameters

```
?page=1
```

- `page` (optional): Page number (default = 1)
- Requires session cookie

#### Output

```json
{
  "articles": [
    {
      "title": "Sample Article Title",
      "url": "https://example.com/article"
    }
    // ...
  ],
  "totalCount": 42
}
```

- `200 OK` — Paginated list of saved articles
- `400 Bad Request` — Invalid page or size parameter
- `401 Unauthorized` — Session is missing or invalid

---

## **LoggingService**

### `/api/health`

- **URL:** `http://localhost:7004/health`
- **Method:** `GET`

#### Output

**Success**
```json
{
  "status": "healthy",
  "timestamp": "2025-05-01T10:42:00.123456",
  "services": [
    "SearchService",
    "AuthenticationService",
    "AnalysisService",
    "SummariseService"
  ]
}
// CODE: 200
```

**Missing required fields**
```json
{
  "error": "Missing required fields"
}
// CODE: 400
```

---

### `/api/log`

- **URL:** `http://localhost:7004/log`
- **Method:** `POST`

#### Input JSON Format

```json
{
  "service_name": "SearchService",
  "event_type": "SEARCH_EXECUTED",
  "message": "Search returned 10 results",
  "severity": "info",
  "timestamp": "2025-05-01T10:42:00.123456"
}
```

- `service_name`, `event_type`, `message`, and `severity` are **required**

#### Output

**Success Response**
```json
{
  "status": "success",
  "message": "Log recorded",
  "timestamp": "2025-05-01T10:42:00.123456",
  "service_name": "SearchService"
}
```

**400 Error Responses**
```json
{
  "error": "Missing required fields"
}
// CODE: 400
```
```json
{
  "error": "Invalid service_name. Must be one of {'SearchService', 'AuthenticationService', 'AnalysisService', 'SummariseService'}"
}
// CODE: 400
```
```json
{
  "error": "Invalid severity level"
}
// CODE: 400
```

**500 Internal Server Error**
```json
{
  "error": "Full traceback or error message"
}
// CODE: 500
```

---

### `/api/exception`

- **URL:** `http://localhost:7004/exception`
- **Method:** `POST`

#### Input JSON Format

```json
{
  "service_name": "AnalysisService",
  "error": "IndexError: list index out of range",
  "timestamp": "2025-05-01T10:42:00.123456"
}
```

- `service_name` and `error` are **required**
- `timestamp` is **optional**

#### Output

**Success Response**
```json
{
  "status": "success",
  "message": "Exception recorded",
  "timestamp": "2025-05-01T10:42:00.123456",
  "service_name": "AnalysisService"
}
// CODE: 200 OK
```

**400 Error Responses**
```json
{
  "error": "Missing required fields"
}
// CODE: 400 Bad Request
```
```json
{
  "error": "Invalid service_name. Must be one of {'SearchService', 'AuthenticationService', 'AnalysisService', 'SummariseService'}"
}
// CODE: 400 Bad Request
```

**500 Internal Server Error**
```json
{
  "error": "Full error message here"
}
// CODE: 500 Internal Server Error
```

---

### `/api/event`

- **URL:** `http://localhost:7004/event`
- **Method:** `POST`

#### Input JSON Format

```json
{
  "service_name": "SummariseService",
  "event_name": "SUMMARY_GENERATED",
  "timestamp": "2025-05-01T10:42:00.123456"
}
```

- `service_name` and `event_name` are **required**
- `timestamp` is **optional**

#### Output

**Success Response**
```json
{
  "status": "success",
  "message": "Event recorded",
  "timestamp": "2025-05-01T10:42:00.123456",
  "service_name": "SummariseService"
}
```

**400 Bad Request – Missing required fields**
```json
{
  "error": "Missing required fields"
}
```

**400 Bad Request – Invalid `service_name`**
```json
{
  "error": "Invalid service_name. Must be one of {'SearchService', 'AuthenticationService', 'AnalysisService', 'SummariseService'}"
}
```

**500 Internal Server Error – Unhandled exception**
```json
{
  "error": "Full error message here"
}
```

#### Field Descriptions

| Field         | Type   | Required | Description                                                        |
|---------------|--------|----------|--------------------------------------------------------------------|
| service_name  | string | yes      | Name of the service reporting the event. Must be in predefined set.|
| event_name    | string | yes      | Identifier for the event being logged.                             |
| timestamp     | string | optional | Optional ISO-8601 timestamp. Defaults to current server time.      |
| status        | string | yes      | "success" if log was recorded successfully.                        |
| message       | string | yes      | Summary message explaining the event or status.                    |