from flask import session, redirect, url_for, render_template, request
from . import main, rooms
from .classes import Room


@main.route('/', methods=['GET', 'POST'])
def index():
    return render_template('main.html', forms=filter(lambda room: not room.ready(), rooms))




