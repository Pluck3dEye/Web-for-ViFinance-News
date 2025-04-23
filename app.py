from flask import Flask, request, jsonify, session
from flask_cors import CORS

import random

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

if __name__ == '__main__':
    app.run(debug=True)