from flask import Flask, request, jsonify, session
from flask_cors import CORS

import random
import datetime

app = Flask(__name__)
app.secret_key = "secret123"  # for session
CORS(app, supports_credentials=True)  # allow cookies to pass through

users = {}  # key: username, value: {'password': ..., 'email': ..., 'name': ..., 'otp': None, 'avatar': None}

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    name = data.get('name')

    if not username or not password or not email or not name:
        return jsonify({'message': 'All fields are required'}), 400

    if username in users:
        return jsonify({'message': 'Username already exists'}), 400

    users[username] = {'password': password, 'email': email, 'name': name, 'otp': None, 'avatar': None}
    return jsonify({'message': 'User registered successfully'}), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    login_val = data.get('login')
    password = data.get('password')

    if not login_val or not password:
        return jsonify({'message': 'Username/email and password required'}), 400

    user = None
    username_found = None
    for username, u in users.items():
        if username == login_val or u.get('email') == login_val:
            user = u
            username_found = username
            break

    if user and user['password'] == password:
        # Generate OTP and store it, do NOT set session yet
        otp = "{:06d}".format(random.randint(0, 999999))
        users[username_found]['otp'] = otp
        print(f"OTP for {username_found}: {otp}")  # For demo/testing
        session.pop('username', None)  # Ensure not logged in yet
        session['pending_username'] = username_found
        return jsonify({'otp_required': True, 'message': 'OTP sent'}), 200

    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/send-otp', methods=['POST'])
def send_otp():
    data = request.get_json() or {}
    username = session.get('pending_username') or data.get('username')
    if not username or username not in users:
        return jsonify({'message': 'No user for OTP'}), 400
    otp = "{:06d}".format(random.randint(0, 999999))
    users[username]['otp'] = otp
    print(f"OTP for {username}: {otp}")  # For demo/testing
    return jsonify({'message': 'OTP resent'}), 200

@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    otp_input = data.get('otp')
    username = None
    for uname, u in users.items():
        if u.get('otp') == otp_input:
            username = uname
            break
    if not username:
        return jsonify({'message': 'Invalid OTP'}), 400
    users[username]['otp'] = None  # Invalidate OTP after use
    session['username'] = username
    session.pop('pending_username', None)
    user = users[username]
    return jsonify({'message': 'OTP verified', 'username': username, 'name': user['name'], 'email': user['email']}), 200

@app.route('/api/user', methods=['GET'])
def get_user():
    username = session.get('username')
    if not username:
        return jsonify({'message': 'Not logged in'}), 401
    user = users.get(username)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    # Return avatar as well if set
    return jsonify({'username': username, 'name': user['name'], 'email': user['email'], 'avatar': user.get('avatar')}), 200

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    session.pop('pending_username', None)
    return jsonify({'message': 'Logged out'}), 200

# --- Profile update endpoints for testing profile editor ---

@app.route('/api/profile', methods=['POST'])
def update_profile():
    username = session.get('username')
    if not username or username not in users:
        return jsonify({'message': 'Not logged in'}), 401
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    if name:
        users[username]['name'] = name
    if email:
        users[username]['email'] = email
    return jsonify({'message': 'Profile updated', 'name': users[username]['name'], 'email': users[username]['email']}), 200

@app.route('/api/change-password', methods=['POST'])
def change_password():
    username = session.get('username')
    if not username or username not in users:
        return jsonify({'message': 'Not logged in'}), 401
    data = request.get_json()
    current = data.get('currentPassword')
    new = data.get('newPassword')
    if not current or not new:
        return jsonify({'message': 'Missing fields'}), 400
    if users[username]['password'] != current:
        return jsonify({'message': 'Current password incorrect'}), 400
    users[username]['password'] = new
    return jsonify({'message': 'Password changed'}), 200

@app.route('/api/avatar', methods=['POST'])
def upload_avatar():
    username = session.get('username')
    if not username or username not in users:
        return jsonify({'message': 'Not logged in'}), 401
    data = request.get_json()
    avatar_data = data.get('avatar')
    if not avatar_data:
        return jsonify({'message': 'No avatar data'}), 400
    users[username]['avatar'] = avatar_data
    return jsonify({'message': 'Avatar updated'}), 200

@app.route('/api/delete-account', methods=['POST'])
def delete_account():
    username = session.get('username')
    if not username or username not in users:
        return jsonify({'message': 'Not logged in'}), 401
    users.pop(username)
    session.pop('username', None)
    return jsonify({'message': 'Account deleted'}), 200


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