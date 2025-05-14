from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True, origins="*")

@app.route('/health', methods=['GET'])
def health():
    # Implement dummy health

@app.route('/log', methods=['POST'])
def log():
    # Implement dummy log

@app.route('/exception', methods=['POST'])
def exception():
    # Implement dummy exception

@app.route('/event', methods=['POST'])
def event():
    # Implement dummy event

if __name__ == '__main__':
    app.run(port=7004, host="0.0.0.0", debug=True)
