"""This file is used to start the backend server"""
# pylint: disable=wrong-import-position

from dotenv import load_dotenv

load_dotenv()  # Move load_dotenv() here

from backend import app

app.run()
