"""
Main file containing all the REST API endpoints and starting the server.
Socketio is handled in the socketio.py file.

Also serves the frontend endpoint.
"""
import os
from flask import Flask, render_template
from flask_socketio import SocketIO
from backend import socket_router
from backend.databases import get_mongo_db, get_redis_db

mongo = get_mongo_db()
redis = get_redis_db()

app = Flask(__name__)
app.config['SECRET_KEY'] = '23oip9hn9+3r42uy89e43qh43wt98ht240j+89yu43+98fj'
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route('/')
def index():
    """Serve the only publicly available endpoint, the frontend"""
    return render_template('base.html')


socketio.on_event('connect', socket_router.connect)
socketio.on_event('place', socket_router.place)


def run():
    """This function starts the entire backend server"""
    # Try writing to redis
    redis.set("test", "test")
    redis.get("test")

    debug = os.getenv("DEBUG") == "true"
    port = int(os.getenv("PORT"))
    socketio.run(app, debug=debug, port=port)
