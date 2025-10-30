from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Load pretrained model once
analyzer = pipeline("sentiment-analysis")

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.json
        text = data.get("text", "")
        result = analyzer(text)[0]
        return jsonify({
            "sentiment": result["label"],
            "score": result["score"]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=9000)

