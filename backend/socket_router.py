"""
Handles all socket events
"""

import logging
from flask_socketio import emit
from backend.databases import get_mongo_db, get_redis_db

mongo = get_mongo_db()
redis = get_redis_db()


def connect():
    """Handles the connect event"""
    logging.info('New client connected')

    # Get all the keys
    keys = redis.keys("block:*")
    # Get all the blocks from redis
    blocks = redis.mget(keys)

    # Now we need to parse the keys into coordinates
    # block:0:0 -> (0, 0)
    # block:0:1 -> (0, 1)
    # block:1:0 -> (1, 0)
    # block:1:1 -> (1, 1)

    # We can use a list comprehension to do this
    blocks = [
        {
            "x": int(key.decode().split(":")[1]),
            "y": int(key.decode().split(":")[2]),
            "block": block.decode()
        }
        for key, block in zip(keys, blocks)
    ]

    # Send the blocks to the client
    emit('blocks', blocks)



def place(data):
    """
    Handles the pixel placement event

    Data should look like this:
    {
        "x": 0,
        "y": 0,
        "block": "grass",
        "token": "token" # We can ignore this for now
    }

    In redis, blocks are stored as a string in the following format:
    "block:x:y"
    """

    print(data)

    # Check if the coordinates are valid
    if data["x"] < 0 or data["x"] > 30 or data["y"] < 0 or data["y"] > 30:
        emit('message', {'data': 'Invalid coordinates'})
        return

    block = data["block"]
    coord_x = data["x"]
    coord_y = data["y"]
    # TODO: Check if the user can place
    # TODO: Check if the block is valid

    redis.set(f"block:{coord_x}:{coord_y}", block)
    emit('place', {'x': coord_x, 'y': coord_y, 'block': block}, broadcast=True)
