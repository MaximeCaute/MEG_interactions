import asyncio
import websockets

SERVER_ADRESS = "localhost"
SERVER_PORT = 8000
RECEIVER_ID = "js"
EMITTER_ID = "python"
ID_MESSAGE_DELIMITER = "/"
ERROR_CODE = "404"

def toWebSocketURI(address, port, secure = False):
    websocket_protocol = "wss" if secure else "ws"
    return f"{websocket_protocol}://{address}:{port}"

class WebSocketAgent():
    def __init__(self, socketURI, id):
        self.socketURI = socketURI
        self.id = id

    async def send_formatted_message(self, websocket, message):
        await websocket.send(self.id + ID_MESSAGE_DELIMITER + message)

class WebSocketReceiver(WebSocketAgent):
    async def wait_for_trigger(self):
        print("Receiver listening for answer...")
        answer = ERROR_CODE
        while answer == ERROR_CODE:
            async with websockets.connect(self.socketURI) as websocket:
                await self.send_formatted_message(websocket, "")
                answer = await websocket.recv()
        return answer

class WebSocketEmitter(WebSocketAgent):
    async def send_message(self, message):
        async with websockets.connect(self.socketURI) as websocket:
            print(f"Sending a message to server at {self.socketURI}")
            await self.send_formatted_message(websocket, message)

            # This returns the answer for further actions
            return await websocket.recv()

if __name__ == "__main__":
    RECEIVER_TYPE_ID = "receiver"
    EMITTER_TYPE_ID = "emitter"
    AGENT_TYPE_ARGNAME = 'agent_type'

    import argparse
    parser = argparse.ArgumentParser(description='TODO.')
    parser.add_argument(AGENT_TYPE_ARGNAME, metavar='agenttype',
                        choices = [RECEIVER_TYPE_ID, EMITTER_TYPE_ID],
                        help='Whether to emit or send')
    args = vars(parser.parse_args())


    socketURI = toWebSocketURI(SERVER_ADRESS, SERVER_PORT)

    if args[AGENT_TYPE_ARGNAME] == RECEIVER_TYPE_ID:
        print(f"Setting up *receiver* type websocket agent...")

        websocket_receiver = WebSocketReceiver(socketURI, RECEIVER_ID)
        server_answer = asyncio.run(websocket_receiver.wait_for_trigger())

        print(f"Received answer from server: {server_answer}!")

    elif args[AGENT_TYPE_ARGNAME] == EMITTER_TYPE_ID:
        print(f"Setting up *emitter* type websocket agent...")

        websocket_emitter = WebSocketEmitter(socketURI, EMITTER_ID)
        server_answer = asyncio.run(websocket_emitter.send_message("Hello world!"))

        print(f"Received answer from server: {server_answer}!")
