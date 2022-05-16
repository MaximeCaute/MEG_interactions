// Code to replace HTML buttons by MEG button via websockets
JAVASCRIPT_ID = "js/";
ERROR_CODE = "404";
RETRY_DELAY = 20;

function waitForWebSocketMessage(){
  var socket = new WebSocket('ws://localhost:8000/');
  sendJsId(socket);
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
      handleMessage(answer)
    }
  });
}

function retryListeningWithDelay() {
  setTimeout(function(){waitForWebSocketMessage();}, RETRY_DELAY);
}

function handleMessage(message){
  console.log(message)
  if(message == "redraw" && tSet.availSearches!==0){
      redrawSample()
  } else if(message == "next_trial"){
      runForagingTask()
  } else if(message == "accept"){
      acceptOffer()
  } else if(message == "hide"){
      console.log("Roger")
      $('#cercle').hide()
      waitForWebSocketMessage()
  } else if(message == "show"){
      $('#cercle').show()
      waitForWebSocketMessage()
  }
}

console.log("Asking for next message... will be printed upon arrival")


// function clearServerBuffer(){
//   var socket = new WebSocket('ws://localhost:8000/');
//   socket.addEventListener('open', function (event) {
//     socket.send(JAVASCRIPT_ID);
//   });
// }

// JAVASCRIPT_ID = "js/";
// ERROR_CODE = "404";
// RETRY_DELAY = 20;

// function waitForWebSocketMessage(){
//   clearServerBuffer();

//   var socket = new WebSocket('ws://localhost:8000/');
//   socket.addEventListener('open', function (event) {
//     socket.send(JAVASCRIPT_ID);
//   });
//   socket.addEventListener('message', function (event) {
//     answer = event.data
//     if (answer == ERROR_CODE){
//       retryListeningWithDelay()
//     } else {
//       handleMessage(answer)
//     }
//   });
// }

// function retryListeningWithDelay() {
//   setTimeout(function(){waitForWebSocketMessage();}, RETRY_DELAY)
// }

// function handleMessage(message){
//   console.log(message)
//   if(message == "redraw"){
//       redrawSample()
//   } else if(message == "next_trial"){
//       runForagingTask()
//   } else if(message == "accept"){
//       acceptOffer()
//   }
// }

// console.log("Asking for next message... will be printed upon arrival")

// Here we ask to print (**after**) answer, but could be about anything.
//tryGetMessage(console.log)
//tryGetMessage(alert)

//tryGetMessage(console.log)

//tryGetMessage(function(message){
//    console.log(message)
//    if(message == "redraw"){
//        redrawSample()
//    } else if(message == "next_trial"){
//        runForagingTask()
//    } else if(message == "accept"){
//        acceptOffer()
//    }
////}

//Function to be sure the previous response doesn't remain in the buffer
