#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from expyriment import io
import mywebsockets as websockets

import asyncio
import json

WS_URL = "ws://localhost:8000"

STATE_NONE = 0
STATE_ACCEPT = 16
STATE_REDRAW = 32
STATE_NEXT = 64

MESSAGE_NONE = ""
MESSAGE_ACCEPT = "accept"
MESSAGE_REDRAW = "redraw"
MESSAGE_NEXT = "next"

port2 = io.ParallelPort(address=0x0379, reverse = True)
port1 = io.ParallelPort(address=0x0BCC9, reverse = True)

last_state = STATE_NONE

def create_event(message):
    event = {"type": "w_command", "payload": message}
    return json.dumps(event)

async def send_message(message):
    json_event = create_event(message)

    async with websockets.connect(WS_URL) as websocket:
        print(f"Sending '{json_event}' to server...")
        await websocket.send(json_event)

        # This returns the answer further actions
        return await websocket.recv()

def state_to_message(state):
    if (state == STATE_ACCEPT):
        return MESSAGE_ACCEPT
    elif (state == STATE_REDRAW):
        return MESSAGE_REDRAW
    elif (state == STATE_NEXT):
        return MESSAGE_NEXT
    else :
        return MESSAGE_NONE

def onstate_changed(new_state):
    message = state_to_message(new_state)
    if message != MESSAGE_NONE:
        return asyncio.run(send_message(message))

def handle_port_state(current_state):
    global last_state
    if (current_state != last_state):
        onstate_changed(current_state)
        last_state = current_state

while True:
    state_port2 = port2.read_data()
    handle_port_state(state_port2)