from flask import session, redirect, url_for, render_template, request
from . import main


@main.route('/', methods=['GET', 'POST'])
def index():
    return render_template('main.html')

