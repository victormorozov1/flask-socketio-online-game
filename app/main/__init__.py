from flask import Blueprint

main = Blueprint('main', __name__)
rooms = {}
guests = {}
messages = {}

from . import routes, events

