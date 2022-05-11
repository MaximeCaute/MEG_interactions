import asyncio
import websockets

python_to_js_socket = "ws://localhost:8000"

async def hello():
    async with websockets.connect(python_to_js_socket) as websocket:
        print("Sending a message to server...")
        await websocket.send("python/Hello world!")

        # This returns the answer further actions
        return await websocket.recv()

x = asyncio.run(hello())
print(x)
