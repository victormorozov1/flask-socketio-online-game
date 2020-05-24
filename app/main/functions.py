from random import choice, randrange as rd


def get_id(len=3):
    return str(rd(10 ** (len - 1), 10 ** len - 1))
