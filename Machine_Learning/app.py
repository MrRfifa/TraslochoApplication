from flask import Flask, request, jsonify
from Models.Sentiments.Sentiment_Model import SentimentModel
from Models.FaceDetection.face_detector import FaceDetector
from Helpers.bad_word_service import BadWordService
import subprocess

app = Flask(__name__)

# Initialize the BadWordService
bad_word_service = BadWordService('./Data/BadWords')

# Initialize the sentiment model
sentiment_model = SentimentModel('./Models/Sentiments/logistic_regression_sentiment_model.pkl', 
                       './Models/Sentiments/vectorizer.pkl')

# Initialize the face detector
face_detector = FaceDetector()

# Route for prediction
@app.route('/predict-sentiment', methods=['POST'])
def predict():
    data = request.json
    text = data.get('text', '')

    # Check if text is provided
    if not text:
        return jsonify({'error': 'No text provided'}), 400

    # Check for bad words in the review
    if bad_word_service.contains_bad_words(text):
        return jsonify({'error': 'Your review contains inappropriate language. Please respect others.'}), 400

    # Predict sentiment using the model
    sentiment = sentiment_model.predict(text)

    return jsonify({'sentiment': sentiment})

# Route for face detection
@app.route('/detect-face', methods=['POST'])
def detect_face():
    # Get the image from the POST request (assuming it's in base64 format)
    data = request.json
    base64_image = data.get('imageBase64', '')

    # Check if the image is provided
    if not base64_image:
        return jsonify({'status': 'fail', 'message': 'No image provided'}), 400

    # Use the FaceDetector to check for a human face
    if face_detector.is_human_face(base64_image):
        return jsonify({'status': 'success', 'message': 'Human face detected.'})
    else:
        return jsonify({'status': 'fail', 'message': 'AI unable to detect face'}), 400


# Route for prediction
@app.route('/return-hello', methods=['GET'])
def return_hello():
    return jsonify({'message': "hello"})

if __name__ == "__main__":
    app.run(debug=True)



# Route for retraining the model
# @app.route('/retrain', methods=['POST'])
# def retrain():
#     try:
#         subprocess.run(["python", "Models/Sentiments/train_model.py"], check=True)

#         return jsonify({'message': 'Model retrained successfully.'}), 200
#     except subprocess.CalledProcessError as e:
#         return jsonify({'error': f'Model retraining failed: {str(e)}'}), 500