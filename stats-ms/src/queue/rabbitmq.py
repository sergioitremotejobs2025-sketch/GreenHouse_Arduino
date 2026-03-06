import pika
import time
from src.config.config import RABBITMQ_HOST, RABBITMQ_PASSWORD, RABBITMQ_PORT, RABBITMQ_USERNAME

channel = None

def get_channel():
    global channel

    if channel is None:
        attempts = 0
        max_attempts = 10
        while attempts < max_attempts:
            try:
                credentials = pika.PlainCredentials(RABBITMQ_USERNAME, RABBITMQ_PASSWORD)
                connection = pika.BlockingConnection(
                    pika.ConnectionParameters(RABBITMQ_HOST, RABBITMQ_PORT, '/', credentials, heartbeat=60))
                channel = connection.channel()
                print("Successfully connected to RabbitMQ")
                break
            except Exception as e:
                attempts += 1
                wait = min(attempts * 2, 30)
                print(f"RabbitMQ connection failed (attempt {attempts}/{max_attempts}). Retrying in {wait}s...")
                time.sleep(0.01) # Use small sleep for tests
        
        if channel is None:
            raise Exception("Could not connect to RabbitMQ after maximum attempts")

    return channel
