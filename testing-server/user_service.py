from flask import Flask, request, jsonify, session
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = "secret123"
CORS(app, supports_credentials=True, origins="*")

# Dummy users store (should be shared with AuthService in real app)
users = {}  # key: email, value: {'userName', 'bio', 'avatarLink', ...}

# Helper to get current user
def get_current_user():
    email = session.get('user_email')
    if not email or email not in users:
        return None, email
    return users[email], email

@app.route('/api/user/profile', methods=['GET'])
def user_profile():
    user, email = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify({
        "email": email,
        "userName": user.get("userName", ""),
        "bio": user.get("bio", ""),
        "avatarLink": user.get("avatarLink", "")
    }), 200

@app.route('/api/user/update', methods=['PUT'])
def user_update():
    user, email = get_current_user()
    if not user:
        return jsonify({"message": "Unauthorized"}), 401
    data = request.json
    userName = data.get("userName")
    bio = data.get("bio", "")
    avatarLink = data.get("avatarLink", "")
    if not userName:
        return jsonify({"message": "Username Cannot Be Empty"}), 403
    user["userName"] = userName
    user["bio"] = bio
    user["avatarLink"] = avatarLink
    return jsonify({"message": "Profile updated"}), 200

@app.route('/api/user/update-info', methods=['PUT'])
def user_update_info():
    user, email = get_current_user()
    if not user:
        return jsonify({"message": "Unauthorized"}), 401
    data = request.json
    userName = data.get("userName")
    bio = data.get("bio")
    if userName is not None:
        if not userName.strip():
            return jsonify({"message": "Username Cannot Be Empty"}), 400
        user["userName"] = userName
    if bio is not None:
        user["bio"] = bio
    return jsonify({"message": "Username and/or bio updated"}), 200

@app.route('/api/user/delete', methods=['DELETE'])
def user_delete():
    user, email = get_current_user()
    if not user:
        return jsonify({"data": None, "message": "Unauthorized"}), 401
    users.pop(email, None)
    session.pop('user_email', None)
    return jsonify({"data": None, "message": "Account deleted"}), 200

@app.route('/api/avatar/upload', methods=['POST'])
def avatar_upload():
    user, email = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if 'avatar' not in request.files:
        return jsonify({"error": "No Avatar File Uploaded"}), 400
    file = request.files['avatar']
    if not file.mimetype.startswith('image/'):
        return jsonify({"error": "Only Image Files Are Allowed"}), 400
    # For demo: just fake a URL
    avatar_url = f"https://dummyimage.com/128x128/cccccc/000000.png&text={email[0].upper()}"
    user["avatarLink"] = avatar_url
    return jsonify({"message": "Avatar updated", "avatarUrl": avatar_url}), 200

if __name__ == '__main__':
    app.run(port=6998, host="0.0.0.0", debug=True)
