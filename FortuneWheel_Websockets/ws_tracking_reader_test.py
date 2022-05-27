import asyncio
import json
import time
from sqlite3 import Time
import websockets

WS_URL = "ws://localhost:8000"
SERVER_ADRESS = "localhost"
SERVER_PORT = "8000"

def create_event():
    event = {"type": "r_tracking"}
    return json.dumps(event)

async def request_buffer_content():
    async with websockets.connect(WS_URL) as websocket:
        await websocket.send(create_event())

        return await websocket.recv()

while True:
    server_answer = asyncio.run(request_buffer_content())
    if (server_answer != "none"):
        print(f"Received answer from server: {server_answer}!")
    time.sleep(0.04)
