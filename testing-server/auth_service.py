from flask import Flask, request, jsonify, session
from flask_cors import CORS
import random

app = Flask(__name__)
app.secret_key = "secret123"
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

users = {}  # key: email, value: {'password': ..., 'userName': ..., 'bio': ..., 'avatarLink': ..., 'otp': None}

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    bio = data.get('bio', '')
    avatarLink = data.get('avatarLink', '')
    if not email or not password:
        return jsonify({"error": "Missing required fields"}), 400
    if email in users:
        return jsonify({"error": "Email already exists"}), 400
    users[email] = {
        'password': password,
        'userName': '',  # Set to empty string or remove if not used elsewhere
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

if __name__ == '__main__':
    app.run(port=6999, debug=True)