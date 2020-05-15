from flask import session
from flask_socketio import emit, join_room, leave_room
from .. import socketio
from app.main.functions import get_id
from . import guests
from .classes import Room, Guest

clicked = 0


@socketio.on('joined', namespace='/')
def joined(message):
    print(f'{message["name"]} is joined!!!')
    guest = Guest(get_id(), name=message['name'])
    emit('id', {'id': guest.id})


@socketio.on('add_room', namespace='/')
def add_room(message):
    print('in add room')
    print('id', message['id'])
    room = Room(message['name'], message['need_players'], guests[message['id']],
                message['n'] if 'n' in message.keys() else 20, message['m'] if 'm' in message.keys() else 30)
    print('created new room:\n', room)
    emit('new_room', {'name': room.name, 'need_players': room.need_players, 'current_players': 1, 'id': room.id})
