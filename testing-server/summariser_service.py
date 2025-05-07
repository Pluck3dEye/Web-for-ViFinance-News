from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

@app.route('/summarize/', methods=['POST'])
def summarize():
    data = request.get_json(force=True)
    url = data.get('url')
    # Dummy summary
    return jsonify({
        'summary': f"This is a summary for article: {url}. It covers the main points and findings."
    })

@app.route('/synthesis/', methods=['POST'])
def synthesis():
    urls = request.get_json(force=True)
    print("Received URLs for synthesis:", urls)
    if not isinstance(urls, list) or not all(isinstance(u, str) for u in urls):
        return jsonify({'message': 'Invalid input'}), 400
    # Dummy synthesis result
    return jsonify({
        'synthesis': 'Giá xăng dầu tại Việt Nam được điều chỉnh định kỳ dựa trên biến động của thị trường thế giới và các yếu tố trong nước. Các bài báo liên quan cho thấy xu hướng tăng nhẹ trong thời gian gần đây.'
    })

if __name__ == '__main__':
    app.run(port=7002, debug=True)