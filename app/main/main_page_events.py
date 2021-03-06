from flask import session
from flask_socketio import emit, join_room, leave_room
from .. import socketio
from app.main.functions import get_id
from . import guests, rooms
from .classes import Room, Guest, Message


@socketio.on('joined', namespace='/')
def joined(message):
    id = int(message['id']) if 'id' in message else get_id()
    global guest
    if id in guests:
        guest = guests[id]
    else:
        guest = Guest(id, name=message['name'])
    print(f'{message["name"]} is joined!!!  id={guest.id}')
    join_room(0)
    emit('id', {'id': guest.id})
    emit('all_rooms', {'rooms': [room.data() for room in rooms.values()]})


@socketio.on('add_room', namespace='/')
def add_room(message):
    print('in add room')
    print('id', message['id'])
    creator = guests[message['id']]

    if not creator.room:
        room = Room(message['name'], int(message['need_players']), creator,
                    int(message['n']) if 'n' in message.keys() else 20,
                    int(message['m']) if 'm' in message.keys() else 30,
                    int(message['actions_per_turn'] if 'actions_per_turn' in message.keys() else 3))
        print('created new room:\n', room)
        emit('new_room', room.data(), room=0)


@socketio.on('join_room', namespace='/')
def add_room(message):
    print('in join room')
    print('room-id', message['room_id'])
    room = rooms[int(message['room_id'])]
    player = guests[message['id']]

    if room.add_player(player):
        emit('new_room_player', {'id': message['id'], 'room': room.data()}, room=0)


@socketio.on('leave_room', namespace='/')
def add_room(message):
    id = message['id']
    global room_id
    if guests[id].room:
        room_id = guests[id].room.id
    if guests[id].leave_room():
        emit('player_leave_room', {'id': id, 'room': rooms[room_id].data()}, room=0)


@socketio.on('delete_room', namespace='/')
def joined(message):
    id = int(message['id'])
    print("deleting room", id)
    del rooms[id]
