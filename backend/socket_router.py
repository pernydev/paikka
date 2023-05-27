"""
Handles all socket events
"""

import logging
from flask_socketio import emit


def connect():
    """Handles the connect event"""
    logging.info('New client connected')
    emit('message', {'data': 'Connected'})


def place(data):
    """Handles the pixel placement event"""
    print(data)
    return
