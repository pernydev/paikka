"""
Main file containing all the REST API endpoints and starting the server.
Socketio is handled in the socketio.py file.
"""
import os
from flask import Flask
from flask_socketio import SocketIO
from backend import socket_router

app = Flask(__name__)
app.config['SECRET_KEY'] = '23oip9hn9+3r42uy89e43qh43wt98ht240j+89yu43+98fj'
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route('/')
def index():
    """Just a test endpoint"""
    return "Hello World!"


socketio.on_event('connect', socket_router.connect)
socketio.on_event('place', socket_router.place)


def run():
    """This function starts the entire backend server"""
    debug = os.getenv("DEBUG", "false") == "true"
    port = int(os.getenv("PORT", "8000"))
    socketio.run(app, debug=debug, port=port)