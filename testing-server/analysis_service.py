from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

@app.route('/factcheck/', methods=['POST'])
def factcheck():
    data = request.get_json(force=True)
    # Dummy fact-check
    return jsonify({
        'fact-check': 'Final Synthesis: Based on available evidence, the article is generally accurate, but some claims require further verification.'
    })

@app.route('/toxicity_analysis/', methods=['POST'])
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

@app.route('/sentiment_analysis/', methods=['POST'])
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

@app.route('/biascheck/', methods=['POST'])
def biascheck():
    data = request.get_json(force=True)
    # Dummy bias-check
    return jsonify({
        'data': {
            'bias-check': {
                'bias_type': 'Political',
                'impact_level': 'High',
                'analysis': 'The article shows a significant bias towards a specific political viewpoint.',
                'socratic_questions': [
                    'What evidence supports the claims made in the article?',
                    'How might the author’s perspective influence the interpretation of the facts?'
                ]
            }
        },
        'message': 'Bias analysis completed successfully.'
    })

if __name__ == '__main__':
    app.run(port=7003, debug=True)