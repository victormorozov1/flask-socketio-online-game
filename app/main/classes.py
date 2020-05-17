from . import guests, rooms
from .functions import get_id
import json


class Guest:
    def __init__(self, id, name='Guest'):
        self.id = id
        self.name = name
        guests[self.id] = self
        self.room = None

    def __str__(self):
        return f'Class Guest. id={self.id}, name={self.name}'


class Room:
    def __init__(self, name, need_players, creator, n=20, m=30):
        self.name = name
        self.need_players = need_players
        self.creator = creator
        self.n = n
        self.m = m
        self.players = [creator]
        self.id = get_id()
        rooms[self.id] = self

    def add_player(self, player):
        if len(self.players) < self.need_players:
            self.players.append(player)

    def ready(self):
        return self.need_players == len(self.players)

    def add_player(self, player):
        if not player.room and len(self.players) < self.need_players:
            self.players.append(player)
            player.room = self
            return True
        return False

    def room_num_participants_str(self):
        return f'{len(self.players)}/{self.need_players}'

    def data(self):
        return {'name': self.name, 'need_players': self.need_players, 'current_players': 1, 'id': self.id,
                'room_num_participants_str': self.room_num_participants_str()}

    def __str__(self):
        return f'Class Room. name={self.name}, players: {len(self.players)}/{self.need_players}, size: {self.n}*{self.m}'

