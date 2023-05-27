"""
Initializes all database connections. .env file is already loaded in backend_start.py
"""

import os
from pymongo import MongoClient
import redis

# Load environment variables
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB")

REDIS_URI = os.getenv("REDIS_URI")

print("Connecting to MongoDB at", MONGO_URI)


def get_mongo_db() -> MongoClient:
    """Returns a MongoDB connection"""
    client = MongoClient(MONGO_URI)
    database = client[MONGO_DB]
    return database


def get_redis_db() -> redis.Redis:
    """Returns a Redis connection"""
    client = redis.Redis.from_url(REDIS_URI)
    return client
