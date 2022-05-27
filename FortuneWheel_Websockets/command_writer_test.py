import asyncio
import websockets
import argparse
import json

WS_URL = "ws://localhost:8000"

def create_event(message):
    event = {"type": "w_command", "payload": message}
    return json.dumps(event)

async def send_message(message):
    json_event = create_event(message)

    async with websockets.connect(WS_URL) as websocket:
        print(f"Sending '{json_event}' to server...")
        await websocket.send(json_event)

        return await websocket.recv()

parser = argparse.ArgumentParser()
parser.add_argument('message', default='Hello world!')
args = vars(parser.parse_args())

x = asyncio.run(send_message(args['message']))
print(x)