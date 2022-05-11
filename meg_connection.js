// Code for no current answer.
var ERROR_CODE = "404"

// Some retry to avoid overcharging CPU
var RETRY_DELAY = 50

// ID for server to adapt behavior.
// Note that it could perhaps be replaced by using another port.
var RECEIVER_ID = "js"
var ID_MESSAGE_DELIMITER = "/"

var SERVER_ADRESS = "localhost"
var SERVER_PORT = 8000

function tryGetMessage(followUp){
  var socket = new WebSocket(`ws://${SERVER_ADRESS}:${SERVER_PORT}/`);
  socket.addEventListener('open', function (event) {
    socket.send(RECEIVER_ID + ID_MESSAGE_DELIMITER);
  });
  socket.addEventListener('message', function (event) {
    answer = event.data
    if (answer == ERROR_CODE){
      setTimeout(function(){tryGetMessage(followUp);}, RETRY_DELAY)
    } else {
      followUp(answer)
    }
  });
}

function clearServerBuffer(){
  var socket = new WebSocket(`ws://${SERVER_ADRESS}:${SERVER_PORT}/`);

  socket.addEventListener('open', function (event) {
    socket.send(RECEIVER_ID + ID_MESSAGE_DELIMITER);
  });
}

console.log("Asking for next message... will be printed upon arrival")

// Here we ask to print (**after**) answer, but could be about anything.
clearServerBuffer()
tryGetMessage(console.log)
