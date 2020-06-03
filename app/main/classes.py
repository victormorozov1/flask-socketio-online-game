from . import guests, rooms
from .functions import get_id
import json
from datetime import datetime
from .constants import COLORS


class Message:
    def __init__(self, message, author=None, time=None):
        if time:
            self.time = time
        else:
            self.time = f'{str(datetime.now().hour).rjust(2, "0")}:{str(datetime.now().minute).rjust(2, "0")}'
        self.message = message
        self.author = author


class Guest:
    def __init__(self, id, name='Guest'):
        self.id = id
        self.name = name
        guests[self.id] = self
        self.room = None

    def leave_room(self):
        if self.room:
            self.room.players.remove(self)
            self.room = None
            return True

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
        self.creator.room = self
        self.messages = []
        self.current_player = 0
        self.field = None

    def start(self):
        self.field = Field(self.n, self.m)

    def add_player(self, player):
        if len(self.players) < self.need_players:
            self.players.append(player)

    def ready(self):
        return self.need_players == len(self.players)

    def add_player(self, player):
        if not player.room and len(self.players) < self.need_players:
            self.players.append(player)
            player.room = self

            if len(self.players) == self.need_players:
                self.start()

            return True
        return False

    def room_num_players_str(self):
        return f'{len(self.players)}/{self.need_players}'

    def data(self):
        return {'name': self.name,
                'need_players': self.need_players,
                'current_players': 1,
                'id': str(self.id),
                'room_num_players_str': self.room_num_players_str(),
                'players': [player.id for player in self.players],
                'ready': len(self.players) == self.need_players}

    def click(self, x, y, player_id):
        if player_id != self.players[self.current_player].id:
            return False, "it is not your step yet"
        return self.field.click(x, y, player_id)

    def __str__(self):
        return f'Class Room. name={self.name}, players: {len(self.players)}/{self.need_players}, size: {self.n}*{self.m}'


class Cell:
    def __init__(self):
        self.val = 0  # 0 - empty cell, 1 - x, 2 - wall
        self.color_id = None

    def __bool__(self):
        return self.val < 2

    def click(self, player_id):
        if self.val == 0:
            self.val = 1
            self.color_id = player_id
            return True, 'ok'
        elif self.val == 1 and player_id != self.color_id:
            self.val = 2
            self.color_id = player_id
            return True, 'ok'
        return False, "you can't click on the wall"


class Field:
    def __init__(self, n, m):
        self.n, self.m = n, m
        self.players = []
        self.arr = []
        for i in range(n):
            self.arr.append([])
            for j in range(m):
                self.arr[-1].append(Cell())

    def neighboring_cells(self, x, y):
        ret = []
        if x > 0:
            ret.append(self.arr[x - 1][y])
        if x < self.n - 1:
            ret.append(self.arr[x + 1][y])
        if y > 0:
            ret.append(self.arr[x][y - 1])
        if y < self.m - 1:
            ret.append(self.arr[x][y - 1])
        return ret

    def click(self, x, y, player_id):
        #if player_id in [cell.color_id for cell in self.neighboring_cells(x, y)]:
        return self.arr[x][y].click(player_id)
        #return False








