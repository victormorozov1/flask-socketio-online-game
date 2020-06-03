from flask import session
from flask_socketio import emit, join_room, leave_room
from .. import socketio
from app.main.functions import get_id
from . import guests, rooms
from .classes import Room, Guest, Message


@socketio.on('field_click', namespace='/room')
def field_click(message):
    x, y, player_id, room_id = int(message['x']), int(message['y']), int(message['player_id']), int(message['room_id'])
    print(x, y)
    if rooms[room_id].click(x, y, player_id):
        print("true")
        emit('set_cell_value', {'x': x, 'y': y, 'value': str(rooms[room_id].field.arr[x][y].val)}, room=room_id)
