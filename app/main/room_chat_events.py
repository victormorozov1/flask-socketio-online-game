from flask_socketio import emit, join_room, leave_room
from .. import socketio
from . import rooms
from .classes import Message


@socketio.on('join', namespace='/room')
def join(message):
    print("room id =", message["room_id"])
    join_room(int(message["room_id"]))


@socketio.on('chat_message', namespace='/room')
def chat_message(message):
    room_id = int(message["room_id"])
    chat_message = message["chat_message"]
    author = message["author"]

    rooms[room_id].messages.append(Message(chat_message, author=author))
    emit("chat_message", {"chat_message": chat_message, "author": author, "time": rooms[room_id].messages[-1].time},
         room=room_id)
