from flask import Flask, render_template, request, jsonify
from sentiment import analyze_sentiment

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data["text"]

    result = analyze_sentiment(text)

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)