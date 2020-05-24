from flask import Blueprint

main = Blueprint('main', __name__)
rooms = {}
guests = {}

from . import routes, main_page_events, room_chat_events, game_events

