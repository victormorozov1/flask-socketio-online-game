from flask import session, redirect, url_for, render_template, request
from . import main, rooms, guests
from .classes import Room


@main.route('/', methods=['GET', 'POST'])
def index():
    return render_template('main.html', forms=filter(lambda room: not room.ready(), rooms.values()))


@main.route('/room/<room_id>/<player_id>', methods=['GET', 'POST'])
def room(room_id, player_id):
    room = rooms[room_id]
    return render_template('room.html', n=room.n, m=room.m)
