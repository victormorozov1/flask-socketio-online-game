from flask import session
from flask_socketio import emit, join_room, leave_room
from .. import socketio
from app.main.functions import get_id


clicked = 0


@socketio.on('joined', namespace='/')
def joined(message):
    print(f'{message["name"]} is joined!!!')
    emit('id', {'id': get_id()})


@socketio.on('message', namespace='/')
def text(message):
    emit('message', {'msg': str(clicked)})


@socketio.on('click', namespace='/')
def text(message):
    global clicked
    print('click')
    clicked += 1
    emit('message', {'msg': str(clicked)})

