"""
Initializes all database connections. .env file is already loaded in backend_start.py
"""

import os
from pymongo import MongoClient
import redis

# Load environment variables
MONGO_URI = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
MONGO_DB = os.getenv("MONGO_DB", "test")

REDIS_URI = os.getenv("REDIS_URL", "redis://localhost:6379/0")


def get_mongo_db() -> MongoClient:
    """Returns a MongoDB connection"""
    client = MongoClient(MONGO_URI)
    database = client[MONGO_DB]
    return database


def get_redis_db() -> redis.Redis:
    """Returns a Redis connection"""
    client = redis.Redis.from_url(REDIS_URI)
    return client
