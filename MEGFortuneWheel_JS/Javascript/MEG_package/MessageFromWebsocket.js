// Code to replace HTML buttons by MEG button via websockets
EMITTER_ID = "emitter/";  // ID de l'émetteur uniquement
// RECEIVER_ID="receiver/"; // ID du recever
// ERROR_CODE = "404";
// RETRY_DELAY = 20;

JAVASCRIPT_ID = "receiver/";
ERROR_CODE = "404";
RETRY_DELAY = 20;

function waitForWebSocketMessage(){
  var socket = new WebSocket('ws://localhost:8000/');
  sendJsId(socket);
  console.log("waiting.....")
  listenToMessages(socket);
}

function sendJsId(socket){
  socket.addEventListener('open', function (event) {
    socket.send(JAVASCRIPT_ID);
  });
}

function listenToMessages(socket){
  socket.addEventListener('message', function (event) {
    answer = event.data
    if (answer == ERROR_CODE){
      retryListeningWithDelay()
    } else {
      console.log("message valid as " + answer )
      handleMessage(answer)
    }
  });
}

function retryListeningWithDelay() {
  setTimeout(function(){waitForWebSocketMessage();}, RETRY_DELAY);
}

function sendWebSocketMessage(message) {
  let socket = new WebSocket('ws://localhost:8000/');
  socket.addEventListener('open', function (event) {
    socket.send(EMITTER_ID + message);
  });
}

function handleMessage(message) {
  console.log(message)
  if (message == "redraw" && tSet.availSearches !== 0) {
    redrawSample()
  } else if (message == "next_trial") {
    runForagingTask()
  } else if (message == "accept") {
    acceptOffer()
  } else if (message == "next") {
    next()
  }
}

// decisionID = 1 / // "1" for initial decisions, "> 1" for later decisions
// trialID = tSet.trialcounter 
// triggerID = 1 // the number of the trigger
// triggerCode = 1 // triggers sent to MEG can only be comprised between 1 and 252, therefore they will be different from triggerID
// triggerType = String // Can be "showWheel", "accept", "redraw" or "outcome"

// message = [triggerID, triggerCode, triggerType, trialID, decisionID]