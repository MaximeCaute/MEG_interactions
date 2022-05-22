// Code to replace HTML buttons by MEG button via websockets
JAVASCRIPT_ID = "js/";
ERROR_CODE = "404";
RETRY_DELAY = 20;

function waitForWebSocketMessage() {
  sendWebSocketMessage("");
  listenToMessages();
}

function createWebSocket() {
  return new WebSocket('ws://localhost:8000/');
}

function sendWebSocketMessage(message) {
  let socket = createWebSocket();
  socket.addEventListener('open', function (event) {
    socket.send(JAVASCRIPT_ID + message);
  });
}

function listenToMessages() {
  let socket = createWebSocket();
  console.log("Asking for next message... will be printed upon arrival")
  socket.addEventListener('message', function (event) {
    answer = event.data
    if (answer == ERROR_CODE) {
      retryListeningWithDelay()
    } else {
      handleMessage(answer)
    }
  });
}

function retryListeningWithDelay() {
  setTimeout(function () { waitForWebSocketMessage(); }, RETRY_DELAY);
}

function handleMessage(message) {
  console.log(message)
  if (message == "redraw" && tSet.availSearches !== 0) {
    redrawSample()
  } else if (message == "next_trial") {
    runForagingTask()
  } else if (message == "accept") {
    acceptOffer()
  } else if (message == "hide") {
    console.log("Roger")
    $('#fixationPoint').hide()
    waitForWebSocketMessage()
  } else if (message == "show") {
    $('#fixationPoint').show()
    waitForWebSocketMessage()
  } else if (message == "next") {
    next()
  }

}