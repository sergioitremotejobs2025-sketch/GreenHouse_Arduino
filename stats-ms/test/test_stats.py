import json
import pytest
from src.measures.humidity import Humidity
from src.measures.light import Light
from src.measures.temperature import Temperature

def load_test_data(filename):
    with open(f'test/{filename}', 'r') as f:
        return json.load(f)

def test_humidity():
    humidity = Humidity('humidities', 60)
    assert humidity.queue == 'humidities'
    assert humidity.max_items == 60

    data = load_test_data('humidities.json')
    stats = humidity.calculate_stats(data)
    
    assert stats['measure'] == 'humidity'
    assert stats['n_samples'] == 2
    assert stats['max_value'] == 40
    assert stats['min_value'] == 20
    assert stats['mean_value'] == 30.0
    assert stats['std_deviation'] == 14.1

def test_light():
    light = Light('lights', 60)
    assert light.queue == 'lights'
    assert light.max_items == 60

    data = load_test_data('lights.json')
    stats = light.calculate_stats(data)
    
    assert stats['measure'] == 'light'
    assert stats['n_samples'] == 2
    assert stats['mean_value'] == 0.5
    assert stats['digital_values'] == [1, 0]

def test_temperature():
    temperature = Temperature('temperatures', 60)
    assert temperature.queue == 'temperatures'
    assert temperature.max_items == 60

    data = load_test_data('temperatures.json')
    stats = temperature.calculate_stats(data)
    
    assert stats['measure'] == 'temperature'
    assert stats['n_samples'] == 2
    assert stats['max_value'] == 25.4
    assert stats['min_value'] == 22.4
    assert stats['mean_value'] == 23.9
    assert stats['std_deviation'] == 2.1
