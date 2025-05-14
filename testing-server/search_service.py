from flask import Flask, request, jsonify
from flask_cors import CORS
import random, datetime

app = Flask(__name__)
CORS(app, supports_credentials=True, origins="*")

@app.route('/get_cached_result', methods=['POST'])
def get_cached_result():
    data = request.json
    query = data.get('query', '')
    if not query:
        return jsonify({"error": "Missing required field: query"}), 400

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
    }), 200

@app.route('/save', methods=['POST'])
def save():
    data = request.json
    url = data.get('url')
    if not url:
        return jsonify({"error": "Missing required field: url"}), 400

    # Dummy save logic
    if isinstance(url, list):
        saved_urls = url
    else:
        saved_urls = [url]

    return jsonify({"message": "success", "saved_urls": saved_urls}), 200

@app.route('/vote', methods=['POST'])
def vote():
    data = request.json
    url = data.get('url')
    vote_type = data.get('vote_type')

    if not url or vote_type is None:
        return jsonify({"error": "Missing required fields"}), 400

    if vote_type not in [-1, 0, 1]:
        return jsonify({"error": "Invalid vote_type"}), 400

    # Dummy vote logic
    return jsonify({"status": "success", "url": url, "vote_type": vote_type}), 200

if __name__ == '__main__':
    app.run(port=7001, host="0.0.0.0", debug=True)