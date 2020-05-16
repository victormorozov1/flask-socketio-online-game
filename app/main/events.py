from flask import session
from flask_socketio import emit, join_room, leave_room
from .. import socketio
from app.main.functions import get_id
from . import guests, rooms
from .classes import Room, Guest

clicked = 0


@socketio.on('joined', namespace='/')
def joined(message):
    guest = Guest(message['id'] if 'id' in message else get_id(), name=message['name'])
    print(f'{message["name"]} is joined!!!  id={guest.id}')
    join_room(0)
    emit('id', {'id': guest.id})
    emit('all_rooms', {
        'rooms': [{'name': room.name, 'need_players': room.need_players, 'current_players': 1, 'id': room.id} for room
                  in rooms]})


@socketio.on('add_room', namespace='/')
def add_room(message):
    print('in add room')
    print('id', message['id'])
    room = Room(message['name'], message['need_players'], guests[message['id']],
                message['n'] if 'n' in message.keys() else 20, message['m'] if 'm' in message.keys() else 30)
    print('created new room:\n', room)
    emit('new_room', {'name': room.name, 'need_players': room.need_players, 'current_players': 1, 'id': room.id},
         room=0)
