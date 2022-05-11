import asyncio
import websockets

python_to_js_socket = "ws://localhost:8000"

async def wait_for_trigger():
    print("Receiver listening for answer...")
    answer = "404"
    while answer == "404":
        async with websockets.connect(python_to_js_socket) as websocket:
            await websocket.send("js/")
            answer = await websocket.recv()
    return answer

server_answer = asyncio.run(wait_for_trigger())
print(f"Received answer from server: {server_answer}!")
