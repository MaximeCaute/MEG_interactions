import asyncio
import websockets

PYTHON_SOURCE_ID = "python"

# create handler for each connection?

message_buffer = [None]

async def handler(websocket, path):
    entry = await websocket.recv()

    (source_ID, data) = entry.split("/")

    if (source_ID == PYTHON_SOURCE_ID):
        message_buffer[0] = data
        print(f"Data received from {source_ID} as:  {data}! Saved to buffer...")

        await websocket.send("200")
    elif source_ID == "js":
        if(message_buffer[0] == None):
            print("send")
            await websocket.send("404")
        else:
            await websocket.send(message_buffer[0])
            print(f"Sent data from buffer: {message_buffer[0]}")
            message_buffer[0] = None
    else:
        raise Exception(f"Wrong source ID: {source_ID}")

    return data

# async def js_handler(websocket, path):
#     entry = await websocket.recv()
#     # TODO waiter
#     while message_buffer[0] == None:
#         pass
#     await websocket.send(message_buffer[0])
#     message_buffer[0] = None


start_server = websockets.serve(handler, "localhost", 8000)
# start_server_js = websockets.serve(js_handler, "localhost", 8080)



asyncio.get_event_loop().run_until_complete(start_server)
# asyncio.get_event_loop().run_until_complete(start_server_js)

asyncio.get_event_loop().run_forever()
