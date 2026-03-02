import os
import numpy as np
from datetime import datetime
from database.mongo_client import get_db
from data_processor import DataProcessor
from models.lstm_model import create_lstm_model

class Trainer:
    def __init__(self, username, ip, measure):
        self.username = username
        self.ip = ip
        self.measure = measure
        self.db = get_db()
        self.processor = DataProcessor()

    def fetch_history(self, limit=1000):
        # Fetch data from collection named after the measure (e.g., temperatures)
        collection = self.db[self.measure]
        cursor = collection.find(
            {"username": self.username, "ip": self.ip},
            {"value": 1, "timestamp": 1}
        ).sort("timestamp", 1).limit(limit)
        
        return [doc['value'] for doc in cursor]

    def train(self):
        data = self.fetch_history()
        if not data or len(data) < 20:
            print(f"Not enough data to train for {self.username} - {self.ip}")
            return False

        X, y, _ = self.processor.prepare_data(data)
        if X is None:
            return False

        # Reshape for LSTM: (samples, time_steps, features)
        X = np.reshape(X, (X.shape[0], X.shape[1], 1))

        model = create_lstm_model((X.shape[1], 1))
        model.fit(X, y, epochs=20, batch_size=32, verbose=0)
        
        # Save model
        model_path = f"models/{self.username}_{self.ip}_{self.measure}.h5"
        os.makedirs("models", exist_ok=True)
        model.save(model_path)
        print(f"Model saved to {model_path}")
        return True
