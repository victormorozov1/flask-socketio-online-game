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
        self.started = False
        self.colors = ['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb(200, 100, 50)']

    def get_arr(self):
        arr = []
        for i in self.field.arr:
            arr.append([])
            for j in i:
                arr[-1].append([j.val, j.color])
        return arr

    def start(self):
        self.started = True
        self.field = Field(self.n, self.m)
        a = [(0, 0), (0, self.m - 1), (self.n - 1, 0), (self.m - 1, self.n - 1)]
        for i in range(self.need_players):
            self.field.arr[a[i][0]][a[i][1]].click(self.colors[i])

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
        if not self.started:
            return {'message': 'game is not started yet'}
        if player_id != self.players[self.current_player].id:
            return {'message': "it is not your step yet"}
        ret = self.field.click(x, y, self.colors[self.current_player])
        if ret['message'] == 'ok':
            self.current_player = (self.current_player + 1) % self.need_players
        return ret

    def __str__(self):
        return f'Class Room. name={self.name}, players: {len(self.players)}/{self.need_players}, size: {self.n}*{self.m}'


class Cell:
    def __init__(self):
        self.val = 0  # 0 - empty cell, 1 - x, 2 - wall
        self.color = None

    def __bool__(self):
        return self.val < 2

    def click(self, color):
        if self.color == color:
            return {'message': 'this is already your cell'}
        if self.val != 2:
            self.val += 1
            self.color = color
            return {'message': 'ok', 'color': color}
        return {'message': "you can't click on the wall"}


class Field:
    def __init__(self, n, m):
        self.n, self.m = n, m
        self.arr = []
        for i in range(n):
            self.arr.append([])
            for j in range(m):
                self.arr[-1].append(Cell())

    def cell_exist_near(self, x, y, color, start=True):
        if start:
            self.used = []
            for i in range(self.n):
                self.used.append([])
                for j in range(self.m):
                    self.used[-1].append(False)

        self.used[x][y] = True

        print("cell exist near", x, y, color)
        if self.arr[x][y].color != color and not start:
            print(f'    wrong color, {self.arr[x][y].color} != {color}')
            return False
        if self.arr[x][y].val == 1 and self.arr[x][y].color == color:
            return True
        for plus_x, plus_y in [(1, 0), (0, 1), (-1, 0), (0, -1)]:
            new_x, new_y = x + plus_x, y + plus_y
            print(f'newx = {new_x}, newy = {new_y}')
            if new_x in range(self.n) and new_y in range(self.m):
                if not self.used[new_x][new_y] and self.cell_exist_near(new_x, new_y, color, start=False):
                    return True
        return False

    def click(self, x, y, color):
        if self.cell_exist_near(x, y, color):
            return self.arr[x][y].click(color)
        return {'message': 'you can build cell here'}








