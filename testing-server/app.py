from flask import Flask, request, jsonify, session
from flask_cors import CORS

import random
import datetime

app = Flask(__name__)
app.secret_key = "secret123"  
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

users = {}  # key: email, value: {'password': ..., 'userName': ..., 'bio': ..., 'avatarLink': ..., 'otp': None}

# --- AUTH SERVICE ---

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    userName = data.get('userName')
    bio = data.get('bio', '')
    avatarLink = data.get('avatarLink', '')
    if not email or not password or not userName:
        return jsonify({"error": "Missing required fields"}), 400
    if email in users:
        return jsonify({"error": "Email already exists"}), 400
    users[email] = {
        'password': password,
        'userName': userName,
        'bio': bio,
        'avatarLink': avatarLink,
        'otp': None
    }
    return jsonify({"message": "Registration successful"}), 201

@app.route('/api/verify', methods=['POST'])
def verify():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    user = users.get(email)
    if not user or user['password'] != password:
        return jsonify({"error": "Invalid Email or Password"}), 401
    # Generate OTP and store in session
    otp = str(random.randint(100000, 999999))
    user['otp'] = otp
    session['pending_email'] = email
    # For demo: print OTP to server console
    print(f"OTP for {email}: {otp}")
    return jsonify({"message": "OTP sent to email"}), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    otp = data.get('otp')
    user = users.get(email)
    if not user or not otp:
        return jsonify({"error": "Invalid request"}), 401
    if user['otp'] != otp:
        return jsonify({"error": "Invalid OTP"}), 401
    # OTP correct, log in user
    session['user_email'] = email
    user['otp'] = None
    return jsonify({
        "message": "Login successful",
        "user": {
            "userId": email
        }
    }), 200

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_email', None)
    return jsonify({"message": "Logged out"}), 200

@app.route('/api/auth-status', methods=['GET'])
def auth_status():
    email = session.get('user_email')
    if email and email in users:
        return jsonify({"loggedIn": True, "userId": email}), 200
    return jsonify({"loggedIn": False}), 200

@app.route('/api/auth/google-login', methods=['POST'])
def google_login():
    # For demo, just accept any idToken and log in as a dummy user
    data = request.json
    id_token = data.get('idToken')
    if not id_token:
        return jsonify({"error": "Missing idToken"}), 400
    # In real app, verify id_token with Google
    email = "googleuser@example.com"
    users[email] = users.get(email, {
        'password': None,
        'userName': "GoogleUser",
        'bio': "",
        'avatarLink': "",
        'otp': None
    })
    session['user_email'] = email
    return jsonify({"message": "Google login successful"}), 200

@app.route('/api/get_cached_result')
def get_cached_result():
    query = request.args.get('query', '')
    # Dummy articles for testing
    dummy_articles = []
    num_articles = random.randint(5, 10)
    for i in range(num_articles):
        dummy_articles.append({
            "author": f"Tác giả {i+1}",
            "title": f"Bài viết về {query} số {i+1}",
            "url": f"https://example.com/article-{query}-{i+1}",
            "image_url": "https://via.placeholder.com/300x200.png?text=Article",
            "date_publish": (datetime.date.today() - datetime.timedelta(days=i)).isoformat(),
            "brief_des_batches": f"Đây là tóm tắt ngắn gọn về bài viết số {i+1} liên quan đến '{query}'.",
            "tags": [f"tag{i+1}", "kinh tế", "tin tức", "phân tích"],
            "upvotes": 0,
            "vote_type": 0
        })
    return jsonify({
        "message": "success",
        "data": dummy_articles
    })

@app.route('/api/synthesis/', methods=['POST'])
def synthesis():
    urls = request.get_json(force=True)
    print("Received URLs for synthesis:", urls)
    if not isinstance(urls, list) or not all(isinstance(u, str) for u in urls):
        return jsonify({'message': 'Invalid input'}), 400
    # Dummy synthesis result
    return jsonify({
        'synthesis': 'Giá xăng dầu tại Việt Nam được điều chỉnh định kỳ dựa trên biến động của thị trường thế giới và các yếu tố trong nước. Các bài báo liên quan cho thấy xu hướng tăng nhẹ trong thời gian gần đây.'
    })

@app.route('/api/summarize/', methods=['POST'])
def summarize():
    data = request.get_json(force=True)
    url = data.get('url')
    # Dummy summary
    return jsonify({
        'summary': f"This is a summary for article: {url}. It covers the main points and findings."
    })

@app.route('/api/toxicity_analysis/', methods=['POST'])
def toxicity_analysis():
    data = request.get_json(force=True)
    # Dummy toxicity values
    return jsonify({
        'toxicity_analysis': {
            'Công kích danh tính': round(random.uniform(0, 1), 2),
            'Mức Độ Thô Tục': round(random.uniform(0, 1), 2),
            'Tính Xúc Phạm': round(random.uniform(0, 1), 2),
            'Tính Đe Doạ': round(random.uniform(0, 1), 2),
            'Tính Độc Hại': round(random.uniform(0, 1), 2)
        }
    })

@app.route('/api/sentiment_analysis/', methods=['POST'])
def sentiment_analysis():
    data = request.get_json(force=True)
    # Dummy sentiment
    sentiments = ["Very Negative", "Negative", "Neutral", "Positive", "Very Positive"]
    label = random.choice(sentiments)
    score = round(random.uniform(0.5, 1.0), 3)
    return jsonify({
        'sentiment_analysis': {
            'sentiment_label': label,
            'sentiment_score': score
        }
    })

@app.route('/api/factcheck/', methods=['POST'])
def factcheck():
    data = request.get_json(force=True)
    # Dummy fact-check
    return jsonify({
        'fact-check': 'Final Synthesis: Based on available evidence, the article is generally accurate, but some claims require further verification.'
    })

if __name__ == '__main__':
    app.run(debug=True)



