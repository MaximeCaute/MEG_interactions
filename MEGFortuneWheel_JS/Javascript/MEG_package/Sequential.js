var currentStep = 0
var canRespond = false
var canRunForagingTask = false
resetUi()

function next() {
  if (currentStep == 4){
    return
  } else if (currentStep < 4){
    currentStep++
  } else if (currentStep == 5){
    currentStep = 1
  }
    updateUi()
}

function previous() {
  currentStep--
  sanatizeCurrentStep()
  updateUi()
}

function sanatizeCurrentStep() {
 if (currentStep < 1) currentStep = 4
}

function updateUi() {
  console.log("updateUi")

  resetUi()

  if (currentStep == 1) {
    $('#forageOfferDiv').show()
    triggerLuminousFlash()
  } else if (currentStep == 2) {
    $('#forageCostDiv').show()
  } else if (currentStep == 3) {
    $('#forageDrawDiv').show()
  } else if (currentStep == 4) {
    $('#forageWheelCanvas').show()
    triggerLuminousFlash()
    setTimeout(allowReaction, 3000)
  } else if (currentStep==6) {
    runForagingTask()
    currentStep=1
    resetUi()
    updateUi()
  }
}

function resetUi() {
  canRespond = false
  $("#cercle").css("background", "black")
  $('#forageWheelCanvas').hide()
  $('#forageCostDiv').hide()
  $('#forageDrawDiv').hide()
  $('#forageOfferDiv').hide()
}

//to indicate that participant can respond
function setCircleToGreen() {
  $("#cercle").css("background", "green")
}

function setCircleToBlack() {
    $("#cercle").css("background", "black")
  }

//to avoid impulsive response
function allowReaction() {
  setCircleToGreen()
  canRespond = true
}

// function to trigger luminous flash (to optimize timming record)
function triggerLuminousFlash(){
    $("#square").show()
    setTimeout(hideFlash, 100)
}

function hideFlash(){
    $("#square").hide()
}