from flask import Flask, request, jsonify, session
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = "secret123"
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

# ... AuthService endpoints only ...

if __name__ == '__main__':
    app.run(port=6999, debug=True)
