import asyncio
import websockets

SEND_ID = "python"
RECEIVE_ID = "js"
SERVER_ADRESS = "localhost"
SERVER_PORT = 8000
ID_MESSAGE_DELIMITER = "/"

ERROR_CODE = "404"
OK_CODE = "200"

# Simple server that can receives and store messages to send them

message_buffer = [None]

async def handler(websocket, path):
    entry = await websocket.recv()
    (source_ID, data) = entry.split(ID_MESSAGE_DELIMITER)

    if (source_ID == SEND_ID):
        message_buffer[0] = data
        print(f"Data received from {source_ID} as:  {data}! Saved to buffer...")

        await websocket.send(OK_CODE)
    elif source_ID == RECEIVE_ID:
        if(message_buffer[0] == None):
            await websocket.send(ERROR_CODE)
        else:
            await websocket.send(message_buffer[0])
            print(f"Sent data from buffer: {message_buffer[0]}")
            message_buffer[0] = None
    else:
        raise Exception(f"Wrong source ID: {source_ID}")

    return data

start_server = websockets.serve(handler, SERVER_ADRESS, SERVER_PORT)
print(f"Starting server at address {SERVER_ADRESS}:{SERVER_PORT}")

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
