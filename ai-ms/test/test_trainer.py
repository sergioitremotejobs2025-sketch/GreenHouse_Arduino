import pytest
from unittest.mock import MagicMock, patch
from trainer import Trainer
import numpy as np

def test_trainer_not_enough_data(mock_mongo):
    # Setup mock data in mongo (less than 20 records)
    collection = mock_mongo['temperatures']
    collection.insert_one({"username": "test_user", "ip": "1.1.1.1", "value": 25.0, "timestamp": 1})
    
    trainer = Trainer("test_user", "1.1.1.1", "temperatures")
    result = trainer.train()
    
    assert result is False

@patch('trainer.create_lstm_model')
@patch('os.makedirs')
def test_trainer_success(mock_makedirs, mock_create_model, mock_mongo):
    # Setup mock data (25 records)
    collection = mock_mongo['temperatures']
    for i in range(25):
        collection.insert_one({
            "username": "test_user", 
            "ip": "1.1.1.1", 
            "value": float(i), 
            "timestamp": i
        })
    
    # Mock model behaviors
    mock_model = MagicMock()
    mock_create_model.return_value = mock_model
    
    trainer = Trainer("test_user", "1.1.1.1", "temperatures")
    result = trainer.train()
    
    assert result is True
    assert mock_create_model.called
    assert mock_model.fit.called
    assert mock_model.save.called

def test_trainer_processor_returns_none(mock_mongo):
    trainer = Trainer("user", "ip", "measure")
    # Mock processor to return None
    trainer.processor.prepare_data = MagicMock(return_value=(None, None, None))
    # Fill with enough data to pass the first check
    trainer.fetch_history = MagicMock(return_value=[1.0]*30)
    
    assert trainer.train() is False
