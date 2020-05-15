from flask import Blueprint

main = Blueprint('main', __name__)
rooms = []
guests = {}

from . import routes, events

