import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

def train_model():
    # Load your dataset
    data = pd.read_csv('../../Data/Sentiments/sentiments.csv')  # Replace with your actual dataset file

    # Preprocess the data (add any necessary preprocessing steps)
    data['text'] = data['text'].str.lower()  # Example preprocessing

    # Split into features and labels
    X = data['text']
    y = data['sentiment']

    # Split into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Vectorize the text data
    vectorizer = CountVectorizer()
    X_train_vectorized = vectorizer.fit_transform(X_train)

    # Train the Random Forest model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_vectorized, y_train)

    # Save the trained model and vectorizer
    joblib.dump(model, '../../Models/Sentiments/random_forest_sentiment_model.pkl')
    joblib.dump(vectorizer, '../../Models/Sentiments/vectorizer.pkl')

    # Optionally evaluate the model
    X_test_vectorized = vectorizer.transform(X_test)
    y_pred = model.predict(X_test_vectorized)
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print("Classification Report:\n", classification_report(y_test, y_pred))

if __name__ == "__main__":
    train_model()
