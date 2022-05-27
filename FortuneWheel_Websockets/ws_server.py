#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import asyncio
import json
import websockets

TYPE_PING = "ping"
TYPE_WRITE_COMMAND = "w_command"
TYPE_READ_COMMAND = "r_command"
TYPE_WRITE_TRACKING = "w_tracking"
TYPE_READ_TRACKING = "r_tracking"

RESPONSE_OK = "OK"
RESPONSE_KO = "KO"

SERVER_ADRESS = "localhost"
SERVER_PORT = 8000

EMPTY_PAYLOAD = "none"

command_buffer = EMPTY_PAYLOAD
tracking_buffer = EMPTY_PAYLOAD

async def handler(websocket, path):
    global command_buffer
    global tracking_buffer

    event_str = await websocket.recv()
    event = json.loads(event_str)

    type = event['type']

    if type == TYPE_PING:
        print(f"Ping received. Sending pong.")
        await websocket.send("pong")
        
    elif type == TYPE_WRITE_COMMAND:
        command_buffer = event['payload']
        print(f"Command received {command_buffer}! Saved to buffer...")
        await websocket.send(RESPONSE_OK)

    elif type == TYPE_WRITE_TRACKING:
        tracking_buffer = event['payload']
        print(f"Tracking received {tracking_buffer}! Saved to buffer...")
        await websocket.send(RESPONSE_OK)

    elif type == TYPE_READ_COMMAND:
        await websocket.send(command_buffer)
        if (command_buffer != EMPTY_PAYLOAD):
            print(f"Read command and clearing buffer")
            command_buffer = EMPTY_PAYLOAD

    elif type == TYPE_READ_TRACKING:
        await websocket.send(tracking_buffer)
        if (tracking_buffer != EMPTY_PAYLOAD):
            print(f"Read tracking and clearing buffer")
            tracking_buffer = "none"

    else:
        raise Exception(f"Count not read message: {event_str}")

start_server = websockets.serve(handler, SERVER_ADRESS, SERVER_PORT)
print(f"Starting server at address {SERVER_ADRESS}:{SERVER_PORT}")

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
