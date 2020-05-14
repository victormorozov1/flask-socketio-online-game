from random import choice, randrange as rd


def get_id(len=3):
    arr = [chr(i) for i in range(ord('a'), ord('z') + 1)]
    id = ''
    for i in range(len):
        if rd(2):
            id += choice(arr)
        else:
            id += choice(arr).upper()
    return id
