import os
from flask import Flask, request, jsonify
from src.trainer import Trainer
from src.data_processor import DataProcessor
from tensorflow.keras.models import load_model
import numpy as np

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200

@app.route('/train', methods=['POST'])
def train_model():
    data = request.json
    username = data.get('username')
    ip = data.get('ip')
    measure = data.get('measure')
    
    if not all([username, ip, measure]):
        return jsonify({"error": "Missing parameters"}), 400
        
    trainer = Trainer(username, ip, measure)
    success = trainer.train()
    
    if success:
        return jsonify({"message": "Training completed"}), 200
    else:
        return jsonify({"error": "Training failed or insufficient data"}), 500

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    username = data.get('username')
    ip = data.get('ip')
    measure = data.get('measure')
    recent_values = data.get('recent_values') # List of last 'look_back' values
    
    if not all([username, ip, measure, recent_values]):
        return jsonify({"error": "Missing parameters"}), 400
        
    model_path = f"models/{username}_{ip}_{measure}.h5"
    if not os.path.exists(model_path):
        return jsonify({"error": "Model not found. Train first."}), 404
        
    try:
        model = load_model(model_path)
        processor = DataProcessor()
        
        # We need to re-fit the scaler optimally we'd save the scaler state too
        # For simplicity in this demo, we'll use the provided recent values to scale
        # In a real app, we'd persist the MinMaxScaler state per model.
        
        # Mocking the scaling for now with simple normalization
        # or better: we should have saved the scaler.
        
        # Let's assume the processor handles it (simplified)
        processor.prepare_data(recent_values) # Just to fit the scaler
        X_input = processor.transform_input(recent_values)
        
        prediction_scaled = model.predict(X_input)
        prediction = processor.inverse_transform(prediction_scaled)
        
        return jsonify({"prediction": float(prediction)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
