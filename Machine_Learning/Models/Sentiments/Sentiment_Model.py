import joblib

class SentimentModel:
    def __init__(self, model_path, vectorizer_path):
        # Load the pre-trained model and vectorizer
        self.model = joblib.load(model_path)  # Load the model from the .pkl file
        self.vectorizer = joblib.load(vectorizer_path)  # Load the vectorizer from the .pkl file

    def predict(self, text):
        # Vectorize the input text
        text_vectorized = self.vectorizer.transform([text])

        # Predict the sentiment
        prediction = self.model.predict(text_vectorized)

        # Return the prediction (e.g., 'positive', 'negative', etc.)
        return prediction[0]
