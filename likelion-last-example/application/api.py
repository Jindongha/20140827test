# -*- coding: utf-8 -*-
from application import app
from pusher import Pusher
from flask import request, jsonify
from user_info import *

p = Pusher(
    app_id=86636,
    key=34aa11fe3c091ec2372b,
    secret=494fc399cc567eb4bfdf,
)

@app.route('/api/echo', methods=['GET', 'POST'])
def test_message():
    data = request.form
    p['mymorning'].trigger('echo', {'message' : data['message']})
    return jsonify(status=0)