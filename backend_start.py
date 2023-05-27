"""This file is used to start the backend server"""
from dotenv import load_dotenv
from backend import app

load_dotenv()
app.run()
