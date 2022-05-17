


// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Functions to read a random schedule
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Using the JATOS 'batch' feature, we can ensure even number of schedules
// This means that to run this in the settings of the properties in JATOS I should write:
/*
{
"conditionCounts": {
  "A": 3,
  "B": 3,
  "C": 3,
  "D": 3,
  "E": 3,
  "F": 3
}
}
*/

// Function for initial settings (no longer loads schedules as this depends on input from experimenter in the local study version)
function loadFiles() {
  // select the right css sheet
  selectStylesheet(['styleSheetOdometer', 'styleSheetGame'])
  // Hide all divs apart from the very first screen
  // later maybe make the screen maybe not consent, but study info? but might make most sense to have everything together anyway
  $('div').hide();
  // Show first Div
  $('#landingPageDiv').show()
  if (settings.datatype == "Internet") {
    $('#landingPage_Internet').show()
  } else {
    $('#landingPage_Local').show()
  }
  $(document).ready(function () {
    $('#startExperimentButton').prop('disabled', false);// make the 'fullscreen' button only available when we have finished loading
  });

  // Canvas settings
  settings.forageWheelCnvs = document.getElementById('forageWheelCanvas');
  settings.forageWheelCtx = settings.forageWheelCnvs.getContext("2d");
  var cs = getComputedStyle(settings.forageWheelCnvs);
  var width = parseInt(cs.getPropertyValue('width'), 10);
  var height = parseInt(cs.getPropertyValue('height'), 10);
  settings.forageWheelCnvs.height = height;
  settings.forageWheelCnvs.width = width;

  // Set the button labels
  $("#redrawButton").html(stimuliLabels.redraw);
  $("#acceptButton").html(stimuliLabels.accept);
  $("#nextTrialButton").html(stimuliLabels.nextTrial);

  // Set the odometer
  // once we have loaded the odometer script, we can also initialize the odometer (adding the 'odometer' class with jQuery is not enough):
  //    var t=document.getElementById("currentPoints"); //get the element we want to make into an odometer
  //    settings.myPoints = new Odometer({
  //      el:t, //tell the odometer what element it belongs to
  //      value:0 // set initial value
  //    });
}

// Load schedules
function loadSchedules() {
  console.log('in load schedule')
  // Schedule for training
  LoadSchedule(0, 0);

  // Load schedule
  if (settings.datatype == "Internet") {
    // Internet: use JATOS to make sure we get enough participants for each schedule

    data.schedID = tSet.nextCondition
    data.participantID = jatos.urlQueryParameters.PROLIFIC_PID

  } else {
    // Local: schedule ID has been read in from experimenter data entry
    //debugger
  }
  LoadSchedule(1, data.schedID);

  // http magic that i don't understand for loading (it works!)
  function LoadSchedule(istorage, ischedID) {

    //data.schedID=ischedID;// let's store this
    var xhttp;
    if (window.XMLHttpRequest) {
      // code for modern browsers
      xhttp = new XMLHttpRequest();
    } else {
      // code for IE6, IE5
      xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        data.sched[istorage] = JSON.parse(this.responseText);
      }
    };
    // load the specified schedule
    xhttp.open("GET", "schedules/Sched" + ischedID + ".json", true);
    xhttp.send();
  }
  proceedInExpt()
}




// Function to generate the 'batch' in JATOS if it doesn't exist yet
function initBatchConditions() {
  // Check if 'conditions' are not already in the batch session
  if (!jatos.batchSession.defined("/conditions")) {
    // Get the count of each condition
    var conditionCounts = jatos.componentJsonInput.conditionCounts;
    var conditions = [];
    // Fill the array with conditions according to the counters
    fillArrayWithValues(conditions, "1", conditionCounts.A);
    fillArrayWithValues(conditions, "2", conditionCounts.B);
    fillArrayWithValues(conditions, "3", conditionCounts.C);
    fillArrayWithValues(conditions, "4", conditionCounts.D);
    fillArrayWithValues(conditions, "5", conditionCounts.E);
    // Put the conditions in the batch session
    var promise = jatos.batchSession.set("conditions", conditions)
    promise.done(function () {
      getNextCondition()
    })
    promise.fail(initBatchConditions); // If it fails: try again
  } else {
    getNextCondition()
  }
}

// Draw a random condition from the availble list
function getNextCondition() {

  // Get the still available conditions from the Batch Session
  var conditions
  loadConditionFromJATOS()
  function loadConditionFromJATOS() {
    var temp = jatos.batchSession.get("conditions");
    if ((typeof temp == 'undefined')) {
      console.log('failed to load conditions from JATOS')
      loadConditionFromJATOS()
    } else {
      conditions = temp
      console.log('managed to load conditions from JATOS')
    }
  }

  // If no more conditions throw an error
  if (conditions.length == 0) {
    console.log('max num workers reached')
    //$('p').text("Error: max number of workers reached.");
    //throw "Max number of workers reached.";
    tSet.nextCondition = Math.ceil(Math.random() * settings.maxSchedulesIfOverLimit)

  } else {
    console.log('in else loop')
    // Get a random condition from list
    var randomIndex = Math.floor(Math.random() * conditions.length);
    var randomCondition = conditions[randomIndex];
    // Delete the choosen condition from the array
    conditions.splice(randomIndex, 1);
    // Set the changed conditions array in the Batch Session.
    var promise = jatos.batchSession.set("conditions", conditions)
    promise.done(function () {
      tSet.nextCondition = randomCondition;
    })
    promise.fail(function () {
      getNextCondition();
      //randomCondition = getNextCondition();
    })
  }
  // check if it has worked (rare case where two people try to access this in parallel might mess it up)
  if (tSet.nextCondition.length == 0) {
    tSet.nextCondition = Math.ceil(Math.random() * settings.maxSchedulesIfOverLimit)
  }
}


// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// General functions
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

function countNonNan(inp) {
  var count = 0;
  while (!isNaN(inp[count])) {
    count++;
  }
  return numelNonNan = count;
}

$(window).on('beforeunload', function () {
  // note that most browsers block the custom message and only show a generic message instead
  return "Your progress will be lost if you leave the page, are you sure? To quite the study early, please use the 'leave the study early' button, so that we can record your ProlificID and time in the study";
});


// helper function for JATOS batch condition
function fillArrayWithValues(array, value, count) {
  for (var i = 0; i < count; i++) {
    array.push(value);
  }
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Set up experimental time line
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function TimeLine(toShow, toHide, toRun, varName) {
  this.toShow = toShow;
  this.toHide = toHide;
  this.toRun = toRun;
  this.name = varName;
  this.toStart = [];
  this.toEnd = [];
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//  OUTLINE EXPERIMENT
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

function startExperiment() {
  // First: check that participants are not using iPad etc.
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
    // Remove the being study button
    $("#startExperimentButton").remove();
    // Change the intro text to tell them that they need to abort the study
    $("#introText").text("Error. We are detecting that you are not using a computer and have to end the study now. Please return your submissions via Prolific.");
  } else {
    // Let's do the experiment
    // Make sure the screen looks good (not too much space between the wheel and the buttons)
    $("#forageDiv").width($("#forageDiv").height() + 0.2 * $("#forageDiv").width());

    proceedInExpt();
  }
}

function launch_fullscreen() {
  if (settings.fullscreen) {
    var element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }
}

//On some screens it is necessary to check boxes before proceeding. This function checks whether the boxes are checked
function checkBoxes() {
  if (exptTimeLine[runThrough].name === "infoSheet") {                        //for PIS, don't proceed without checking the box
    var checkBox = document.getElementById("infoSheetCheckbox");
    var nextButton = document.getElementById("next-button");
    nextButton.style.display = (checkBox.checked) ? "block" : "none";
  } else if (exptTimeLine[runThrough].name === "consent") {                //for consent screen, don't proceed without checking every box
    if ($('.consentBoxes:checked').length === $('.consentBoxes').length) { data.consent = 1; } else { data.consent = 0; } //if all boxes are checked, log consent as "true" and if not set to "false"
    document.getElementById("next-button").style.display = (data.consent === 1) ? "block" : "none";   //if consent is set to "true", show the "next"button so participant can proceed
  }
}

function proceedInExpt() {
  //runThrough is the trial counter. record time each section started and finished
  if (runThrough !== -1) {
    //add a time stamp to end the previous section
    exptTimeLine[runThrough].toEnd = new Date(); //.getTime();

    //add completed section into data structure in a way that doesn't overwrite previous sections (e.g. if participant has completed a section twice)
    data.exptTimeLine.push(JSON.parse(JSON.stringify(exptTimeLine[runThrough])));
  }
  //move onto next item in timeline and create start time stamp
  runThrough++;
  exptTimeLine[runThrough].toStart = new Date(); // .getTime();


  // Switch all the screen items that we need on
  for (var c = 0; c < exptTimeLine[runThrough].toShow.length; c++) {
    $("#" + exptTimeLine[runThrough].toShow[c]).show().children().show().children().show().children().show();
  }
  // Switch all the items we don't need off
  for (var c = 0; c < exptTimeLine[runThrough].toHide.length; c++) {
    $("#" + exptTimeLine[runThrough].toHide[c]).hide();
  }
  // Run the different parts of the experiment
  for (var c = 0; c < exptTimeLine[runThrough].toRun.length; c++) {
    exptTimeLine[runThrough].toRun[c]();
  }
}

//if participant is in consent section, this allows them to return to the info page
function returnToInfoPage() {
  runThrough--;
  i = -1;
  exptTimeLine[runThrough].toStart = new Date();//.getTime();

  // Switch all the screen items that we need on
  for (var c = 0; c < exptTimeLine[runThrough].toShow.length; c++) {
    $("#" + exptTimeLine[runThrough].toShow[c]).show().children().show().children().show().children().show();
  }
  // Switch all the items we don't need off
  for (var c = 0; c < exptTimeLine[runThrough].toHide.length; c++) {
    $("#" + exptTimeLine[runThrough].toHide[c]).hide();
  }
  // Run the different parts of the experiment
  for (var c = 0; c < exptTimeLine[runThrough].toRun.length; c++) {
    exptTimeLine[runThrough].toRun[c]();
  }
}

// Different functions to finish the study:
// These can be triggered by either having finished the task/questionnaires, or by participants wanting to leave the study early [in this study people can't fail the MCQ test]
// First the data will be saved, with different 'triggerFlags' (from where the function has been called). Then participants will be shown a page where they can click again to return to prolific/ close the browser
// Option to quit the study early
function exitStudyNow() {
  saveData("quittingEarly") // This function will then redirect to 'showQuitEarlyScreen'
}
//If participant clicks button to leave the study early, this button can take them back to the section they were just in
function returnToStudy() {
  for (var c = 0; c < exptTimeLine[runThrough].toShow.length; c++) {  //re-show all items from the experiment section we're still in (the "leaving the study early" page does not move to a different timeline section)
    $("#" + exptTimeLine[runThrough].toShow[c]).show().children().show().children().show().children().show();
  }
  for (var c = 0; c < exptTimeLine[runThrough].toRun.length; c++) {   //re-run all functions that need to be run
    exptTimeLine[runThrough].toRun[c]();
  }

  $('#endExperiment').hide();
  $("#submitOrQuit").hide();
  $("#psychiatricHelpPage").hide();
  $("#commentBox").hide();
  $("#thanksComment").hide();
}

function saveData(triggerFlag) { //triggerFlag = whether this function was called from trying to quit study early or from actually finishing study

  window.scrollTo(0, 0);
  data.exptDate.endExpt = new Date();
  data.exptDate.experimentDuration = data.exptDate.endExpt.getTime() - data.exptDate.startExpt.getTime();
  //data.exptDate.trainingDuration   = data.exptDate
  data.exptDate.numberMcqAttempts = tSet.mcq.attemptCounter;
  data.behaviorLongFormat = tSet.behaviorLongFormat;
  var resultJson = JSON.stringify(data);
  if (triggerFlag == "quittingEarly") {
    jatos.submitResultData(resultJson).then(() => showQuitEarlyScreen(), () => saveData("quittingEarly")) //{data:"resultJson"}
  } else if (triggerFlag == 'failedDisplayCheck') {
    data.errorCode = 'Failed display check';
    jatos.submitResultData(resultJson).then(() => showFailedDisplayCheckScreen(), () => saveData("failedDisplayCheck"))
  } else {
    jatos.submitResultData(resultJson).then(() => showFinishingScreen(), () => saveData()) //jatos.submitResultData(resultJson,showFinishingScreen());
  }
}

// Different final screens
function showFinishingScreen() { // Proper finish screen (different depending on whether it's on prolific or local)
  // Show DIVs
  if (settings.datatype == "Internet") {
    $('#FinalScreenDiv_Internet').show().children().show()
    $("#psychiatricHelpPage").show();
  } else {
    $('#FinalScreenDiv_Local').show().children().show()
  }
}


function showQuitEarlyScreen() {
  window.scrollTo(0, 0);
  // Hide all screens

  for (var c = 0; c < exptTimeLine[runThrough].toShow.length; c++) {
    $("#" + exptTimeLine[runThrough].toShow[c]).hide().children().hide().children().hide().children().hide();
  }

  $("#submitOrQuit").show().children().show();
  $("#submitOrQuitText2").hide(); // on the submitOrQuit Div there are two text fields
  if (settings.datatype == "Internet") {
    $("#commentBox").show();
    $("#thanksComment").hide();
    $("#psychiatricHelpPage").show();
  }
}

// Functions to quit study triggered by button presses
function quitStudy() {
  // jQuery version:
  $(window).unbind('beforeunload'); // this prevents a warning when participant click on 'submit and return to prolific'
  if (settings.datatype == "Internet") {
    jatos.endStudyAjax(true, [], window.location.replace("https://app.prolific.co/submissions/complete?cc=R5VOPY5Q"), window.location.replace("https://app.prolific.co/submissions/complete?cc=R5VOPY5Q"))
  } else {
    $("#finishExptButton").html("Vos donées ont été soumises. Veuillez informer l'expérimentateur que vous avez terminé.");
    $("#finishExptButton").css("background-color", "#4CAF50");
  }
}
// If participants quite without submitting their data
function quitStudyNoCode() {
  // jQuery version:
  $(window).unbind('beforeunload'); // this prevents a warning when participant click on 'submit and return to prolific'
  if (settings.datatype == "Internet") {
    jatos.endStudyAjax(true, [], window.location.replace("https://app.prolific.co/submissions/complete?cc=NOCODE"), window.location.replace("https://app.prolific.co/submissions/complete?cc=NOCODE"))//.then(window.location.replace("https://www.prolific.ac/submissions/complete?cc=R5VOPY5Q"));
  } else {
    $('#submitOrQuit').hide();
    $('#FinalScreenDiv_Local').show().children().show()
  }
}

function showFailedDisplayCheckScreen() {
  $('#checkDisplayDiv').hide()
  $('#forageWheelDiv').hide()
  $('#failedDisplayCheckDiv').show()
}

//if a participant enters a comment and presses submit, log it to the data structure
function submitComments() {
  if ($("#comments").val() !== "") {
    data.comments = $("#commentid")[0].value;
    document.getElementById("submitComments").style.background = "#c1c1c1";
    $("#commentid").hide();
    $("#thanksComment").show();
    $("#submitComments").hide();
  }
}


// Function to switch the style sheets (questionnaires need a separate style sheet)
function selectStylesheet(select_names) {
  // find out how many stylesheets we have
  var nStyles = settings.myStyleSheets.length;
  for (var i = 0; i < nStyles; i++) {
    // if the name is the selected name, don't disable it
    if (settings.myStyleSheets[i] == undefined) {
      settings.myStyleSheets[i].disabled = true;
    }
    else if (select_names.indexOf(settings.myStyleSheets[i].ownerNode.id) == -1) {
      settings.myStyleSheets[i].disabled = true;
    } else { // otherwise: disable it
      settings.myStyleSheets[i].disabled = false;
    }
  }
}


// Code to check wheel of fortune can display ok on screen
function createTestWheelOfFortune() {
  $('#displaytext2').hide()
  var ctx = document.getElementById('displayTestCanvas');
  var patchColors = [];

  // Make a list of the colours of the patches we want to draw now
  for (i = 0; i < 3; i++) {
    patchColors[i] = settings.colors[0];
  }
  tSet.displayTestChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ["17", "25", "58"], // some numbers
      datasets: [{
        backgroundColor: patchColors,
        borderColor: 'rgb(0,0,0)',
        data: [17, 25, 58],
      }]
    },
    options: {
      responisve: true,// in case people resize their windows
      maintainAspectRatio: false, // otherwise it does not fill the box
      events: [], // prevents action on hovering
      animation: {
        duration: 0
      },
      legend: {
        display: false
      },
      pieceLabel: {
        render: 'label',
        fontColor: '#000',
        fontSize: 16,
        fontStyle: 'bold',
        overlap: true,
        position: 'border'
      }
    }
  });
  //return chart;
}

function confirmDisplay() {
  var x = document.getElementById("checkDisplayNumber").value;
  if (x == 17) {
    proceedInExpt()
  }
  if (tSet.displayCheckCount < 3) {
    tSet.displayCheckCount++
    $('#displaytext2').show()
  } else {
    saveData('failedDisplayCheck')
  }
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Get participant information (local)
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function askSubjectInfo() {
  $(document.body).css("background", $('#GetParticipantInfo_Local').css('background-color'))
  $('#GetParticipantInfo_Local').show()
  $('#GetParticipantID_Schedule_FORM').show()
  //$('#GetParticipant_ID_Session_Instructions').show()
  //$('#GetParticipantID_Session_FORM').show()
}

/*
function submitParticipantID_Session(){
  // check whether it is session 1 or 2
  // accordingly show instructions to enter participant ID to excel sheet or just look up
  t=$('#sessionID').serializeArray()
  data.sessionID = t[0].value
  $('#GetParticipantInfo_Local').show().children().hide()
  //$('#GetParticipant_ID_Session_Instructions').hide()
  //$('#GetParticipantID_Session_FORM').hide()
  if(data.sessionID == "Pre"){
    $('#SessionPre_getSchedID_Instructions').show()
  } else{
    $('#SessionPost_getSchedID_Instructions').show()
  }
  $('#GetSchedule_FORM').show();
}
*/

function submitParticipantID_Schedule() {
  $('#GetParticipantInfo_Local').show().children().hide()
  // get ID
  var t = $('#participantID_V1').serializeArray()
  var participaticpantID_V1 = t[0].value
  // get schedule and store
  data.participantID = participaticpantID_V1
  t = $('#scheduleID').serializeArray()
  data.schedID = t[0].value
  proceedInExpt()
  /*
  // submit the schedule ID to JATOS
  var schedule_ID_matchList = {"schedule" : data.schedID,'ID':data.participantID}
  // not ideal to store like this, but for some reason only way to do it:
 var promise=jatos.batchSession.add("/subjects_" + data.participantID, schedule_ID_matchList);
  promise.done(function(){
    $(document.body).css( "background",'white')
    console.log('Participant info stored')
    proceedInExpt()
  })
  promise.fail(function(){
    console.log('Failed storing oarticipant info.')
    validateParticipantInfo_pre()
  })
  */
}
/*
function submitScheduleID(){
  // Hide previous pages,
  // Ask to re-enter participant ID and if session 1 confirm that participant ID was entered in form
  $('#GetParticipantInfo_Local').show().children().hide()
  //$('#SessionPre_getSchedID_Instructions').hide()
  //$('#SessionPost_getSchedID_Instructions').hide()
  //$('#GetSchedule_FORM').hide()
  if(data.sessionID == "Pre"){
    $('#SessionPre_reEnterParticipantID_Instructions').show()
    $('#ReEnterParticipantID_ConfirmExcel_SessionPre_FORM').show()
  } else{
    $('#SessionPost_reEnterParticipantID_Instructions').show()
    $('#ReEnterParticipantID_SessionPost_FORM').show()
  }
}
*/
/*
function validateParticipantInfo_pre(){
  // double check participant ID
  var t=$('#participantID_V1').serializeArray()
  var participaticpantID_V1 = t[0].value
  t=$('#participantID_V2_pre').serializeArray()
  var participaticpantID_V2 = t[0].value
  t =$('#validate_ExcelEntry').serializeArray()
  var excelCheck=t[0].value
  if (participaticpantID_V1==participaticpantID_V2  && excelCheck == "Yes"){ // check is fine
    data.participantID=participaticpantID_V1
    t=$('#scheduleID').serializeArray()
    data.schedID = t[0].value
    // submit the schedule ID to JATOS
    var schedule_ID_matchList = {"schedule" : data.schedID,'ID':data.participantID}
    // not ideal to store like this, but for some reason only way to do it:
   var promise=jatos.batchSession.add("/subjects_" + data.participantID, schedule_ID_matchList);
    promise.done(function(){
      $(document.body).css( "background",'white')
      console.log('Participant info stored')
      proceedInExpt()
    })
    promise.fail(function(){
      console.log('Failed storing oarticipant info.')
      validateParticipantInfo_pre()
    })

  } else{
    $('#GetParticipantInfo_Local').show().children().hide()
    //$('#SessionPre_reEnterParticipantID_Instructions').hide()
    //$('#ReEnterParticipantID_ConfirmExcel_SessionPre_FORM').hide()
    $('#Error_ParticipantID_Instructions').show()
    $('#GetParticipantID_Session_FORM').show()
  }}

function validateParticipantInfo_post(){
  // double check participant ID
  var t=$('#participantID_V1').serializeArray()
  var participaticpantID_V1 = t[0].value
  t=$('#participantID_V2_post').serializeArray()
  var participaticpantID_V2 = t[0].value
  if (participaticpantID_V1!=participaticpantID_V2){
    $('#GetParticipantInfo_Local').show().children().hide()
  //  $('#SessionPost_reEnterParticipantID_Instructions').hide()
  //  $('#ReEnterParticipantID_SessionPost_FORM').hide()
    $('#Error_ParticipantID_Instructions').show()
    $('#GetParticipantID_Session_FORM').show()
  } else{
    data.ParticipantID=participaticpantID_V1
    // Double check that the schedule ID matches what JATOS has previously stored
    // Extract previous schedule
    var t = jatos.batchSession.getAll()['subjects_'+data.ParticipantID]
    var previousSchedule=t.schedule
    t=$('#scheduleID').serializeArray()
    var curSched = t[0].value
    if (previousSchedule == curSched){
      data.schedID = curSched
      $(document.body).css( "background",'white')
      proceedInExpt()
    } else{ // ask them again to look up the schedule ID - then use that number
      $('#GetParticipantInfo_Local').show().children().hide()
      $('#Error_Post_Schedule_Instructions').show()
      $('#ReEnterSchedule_SessionPost_FORM').show()
    }

  }
}

function resubmitScheduleID(){
  t=$('#scheduleID_v2').serializeArray()
  var curSched = t[0].value
  data.schedID = curSched
  $(document.body).css( "background",'white')
  proceedInExpt()
}
*/
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// INSTRUCTIONS
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// store all the different texts and pictures in arrays
function setupInstructions() {
  // change style sheets
  selectStylesheet(['styleSheetOdometer', 'styleSheetGame']);
  // Get a list of the instructions
  tSet.instr.pics = document.querySelectorAll(".instrPicsClass");
  tSet.instr.texts = document.querySelectorAll(".instrTextsClass");
}

// refresh the instruction texts and pictures when buttons are clicked
function showInstructions() {
  // update the picture and the text
  $('.instrTextsClass').hide();
  $('.instrPicsClass').hide();
  $('#' + tSet.instr.texts[tSet.instr.counter].id).show();
  $('#' + tSet.instr.pics[tSet.instr.counter].id).show();

  // update the buttons
  if (tSet.instr.counter === 0) {
    $('#backwInstrButton').prop('disabled', true);
    $('#forwInstrButton').prop('disabled', false);
    $('#startTrainingButton').hide();
  } else if (tSet.instr.counter === settings.instr.maxCounter) {
    $('#backwInstrButton').prop('disabled', false);
    $('#forwInstrButton').hide();
    $('#startTrainingButton').show();
  } else {
    $('#backwInstrButton').prop('disabled', false);
    $('#forwInstrButton').prop('disabled', false);
    $('#startTrainingButton').hide();
  }
}

// what to do when buttons are clicked
function forwardInstr() {
  tSet.instr.counter++;
  showInstructions();
}

function backwardInstr() {
  tSet.instr.counter--;
  showInstructions();
  $('#forwInstrButton').show();
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Multiple choice questions
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function setupMCQ() {
  // Get a list of the pictures
  tSet.mcq.pics = document.querySelectorAll(".mcqPicsClass");
  // in case we're doing the quiz for the second time, empty all previous responses
  tSet.mcq.finishEnabled = 0;
  tSet.mcq.curQ = 0;
  tSet.mcq.answers = [];
  $('#startTaskButton').hide();
  $('#repeatTrainingButton').hide();
  $('#quizTextDiv').css({ top: '70%' });
}

function runMCQ() {
  var curQ = tSet.mcq.curQ;
  // update the picture
  $('.mcqPicsClass').hide();
  $('#' + tSet.mcq.pics[curQ].id).show();

  // update the question and the multiple choice answers (including adding the 'radio buttons')
  var fullQText = [];
  var answers = [];
  for (iAns in MCQs[curQ].answers) {
    // make 'radio' buttons
    answers.push(
      '<label>'
      + '<input type="radio" name="question' + curQ + '" value="' + iAns + '">'
      + iAns + ': '
      + MCQs[curQ].answers[iAns]
      + '<br/> </label>'
    );
  };
  fullQText.push(
    '<div class="questions">' + MCQs[curQ].question + '<br/><br/> </div>'
    + '<div class="answers">' + answers.join('') + '</div>'
  );
  $('#quizTextDiv').html(fullQText.join(''));

  // update the backward/forward/submit button
  if (curQ === 0) {
    $('#lastMCQButton').prop('disabled', true);
  } else {
    $('#lastMCQButton').prop('disabled', false);
  }
  $('#nextMCQButton').prop('disabled', true);
  $('#finishMCQButton').prop('disabled', true);
  // check if that question has already been answered previously, if so, show the previous answer
  if (jQuery.type(tSet.mcq.answers[curQ]) !== undefined) {
    if (($.inArray(tSet.mcq.answers[curQ], ["a", "b", "c", "d", "e"])) !== -1) {
      $(":radio[value=" + tSet.mcq.answers[curQ] + "]").prop("checked", true);
      $('#nextMCQButton').prop('disabled', false);
    }
  }
  // if participants have previously completed all questions
  if (tSet.mcq.finishEnabled === 1) {
    $('#finishMCQButton').prop('disabled', false);
  }

  // only enable the buttons when a check box is clicked
  $(':radio').click(function () {
    // record what was clicked
    var answers = $(':checked');
    tSet.mcq.answers[curQ] = answers[0].value;

    // enable 'next question'
    $('#nextMCQButton').prop('disabled', false);
    // enable the 'submit answers' button
    if (curQ === (settings.mcq.maxQ - 1)) { //-1 because curQ starts counting at 0
      $('#finishMCQButton').prop('disabled', false);
      $('#nextMCQButton').prop('disabled', true);
      tSet.mcq.finishEnabled = 1;
    }
  });
}

function forwardMCQ() {
  // move on to the next question
  var tt = $(':checked');
  if (tt[0] !== undefined) {
    tSet.mcq.answers[tSet.mcq.curtQ] = tt[0].value;
    tSet.mcq.curQ++;
  }
  runMCQ();
}

function backwardMCQ() {
  // go back to the last question
  var tt = $(':checked');
  if (tt[0] !== undefined) {
    tSet.mcq.answers[tSet.mcq.curQ] = tt[0].value;
  }
  tSet.mcq.curQ--;
  runMCQ();
}


function finishMCQ() {
  // find out how many answers are correct
  var allAnswers = tSet.mcq.answers;
  var corAns = [];
  for (var ians = 0; ians < allAnswers.length; ians++) {
    if (allAnswers[ians] === MCQs[ians].correctAnswer) {
      corAns.push(1);
    } else {
      corAns.push(0);
    }
  }
  var corAnsSum = corAns.reduce(getSum);
  // Store the MCQ answers
  // check how many answers are correct
  data.mcq[tSet.mcq.attemptCounter] = {}
  data.mcq[tSet.mcq.attemptCounter] = allAnswers;
  //data.storeBehav[tSet.taskCounter].multipleChoiceCheck=allAnswers;
  if (corAnsSum === settings.mcq.maxQ) { // if all correct, say thank you and, move on to task
    //$('#quizPicDiv').html("You have completed the training successfully.");
    $('#quizTextDiv').html('');
    $('#startTaskButton').show();
    $('#nextMCQButton').prop('disabled', true);
    $('#finishMCQButton').prop('disabled', true);
    $('#lastMCQButton').prop('disabled', true);

    $('#quizTextDiv').css({ top: '0%' });
    $('#quizPicDiv').hide();
    // Show participants again the answers they have given
    $('#quizTextDiv').html(["<br><br>Vous avez completé l'entrainement <br><br>",
      MCQs[0].question, "<span style='color: #029F73'> Votre réponse: ", tSet.mcq.answers[0], " - ", MCQs[0].answers[tSet.mcq.answers[0]].slice(0, -4), " (CORRECT)</span><br>",
      MCQs[1].question, "<span style='color: #029F73'> Votre réponse: ", tSet.mcq.answers[1], " - ", MCQs[1].answers[tSet.mcq.answers[1]].slice(0, -4), " (CORRECT)</span><br>", //D36027 for red
      MCQs[2].question, "<span style='color: #029F73'> Votre réponse: ", tSet.mcq.answers[2], " - ", MCQs[2].answers[tSet.mcq.answers[2]], " (CORRECT)</span><br>",
      MCQs[3].question, "<span style='color: #029F73'> Votre réponse: ", tSet.mcq.answers[3], " - ", MCQs[3].answers[tSet.mcq.answers[3]], " (CORRECT)</span><br>",
      MCQs[4].question, "<span style='color: #029F73'> Votre réponse: ", tSet.mcq.answers[4], " - ", MCQs[4].answers[tSet.mcq.answers[4]], " (CORRECT)</span><br>",
      MCQs[5].question, "<span style='color: #029F73'> Votre réponse: ", tSet.mcq.answers[5], " - ", MCQs[5].answers[tSet.mcq.answers[5]], " (CORRECT)</span><br>",
    ].join(''));  //$('#quizPicDiv'

  } else {
    tSet.mcq.attemptCounter++
    // go back to instructions (not training) and then MCQ
    exptTimeLine.splice(runThrough + 1, 0, forageInstructions); //from the next item in the experiment, remove 0 items and insert forageInstructions
    exptTimeLine.splice(runThrough + 2, 0, testUnderstanding);
    $('.mcqPicsClass').hide();
    $('#quizPicDiv').hide(); // hide the picture
    $('#repeatTrainingButton').show();
    $('#nextMCQButton').prop('disabled', true);
    $('#finishMCQButton').prop('disabled', true);
    $('#lastMCQButton').prop('disabled', true);
    $('#startTrainingButton').html('Réessayer le questionnaire');
    $('#quizTextDiv').css({ top: '0%' });
    tSet.instr.counter = 0;

    // Tell participants which questions they got wrong (using the 'quizTextDiv' so that we don't over-write the pictures which we need for the next MCQ round)
    $('#quizTextDiv').html(["<br><br>Malheureusement vous n’avez pas répondu correctement à toutes les questions. Veuillez lire les instructions et réessayer.<br><br>",
      MCQs[0].question, "<br><span style='color: #", (tSet.mcq.answers[0] === MCQs[0].correctAnswer) ? "029F73" : "D36027", "'> Votre réponse ",
      tSet.mcq.answers[0], " - ", MCQs[1].answers[tSet.mcq.answers[0]].includes("<br>") ? MCQs[0].answers[tSet.mcq.answers[0]].slice(0, -4) : MCQs[0].answers[tSet.mcq.answers[0]], " (", (tSet.mcq.answers[0] === MCQs[0].correctAnswer) ? "CORRECT" : "INCORRECT", ")</span><br><br>",

      MCQs[1].question, "<br><span style='color: #", (tSet.mcq.answers[1] === MCQs[1].correctAnswer) ? "029F73" : "D36027", "'> Votre réponse: ",
      tSet.mcq.answers[1], " - ", MCQs[1].answers[tSet.mcq.answers[1]].includes("<br>") ? MCQs[1].answers[tSet.mcq.answers[1]].slice(0, -4) : MCQs[1].answers[tSet.mcq.answers[1]], " (", (tSet.mcq.answers[1] === MCQs[1].correctAnswer) ? "CORRECT" : "INCORRECT", ")</span><br><br>",

      MCQs[2].question, "<br><span style='color: #", (tSet.mcq.answers[2] === MCQs[2].correctAnswer) ? "029F73" : "D36027", "'> Votre réponse: ",
      tSet.mcq.answers[2], " - ", MCQs[2].answers[tSet.mcq.answers[2]].includes("<br>") ? MCQs[2].answers[tSet.mcq.answers[2]].slice(0, -4) : MCQs[2].answers[tSet.mcq.answers[2]], " (", (tSet.mcq.answers[2] === MCQs[2].correctAnswer) ? "CORRECT" : "INCORRECT", ")</span><br><br>",

      MCQs[3].question, "<br><span style='color: #", (tSet.mcq.answers[3] === MCQs[3].correctAnswer) ? "029F73" : "D36027", "'> Votre réponse: ",
      tSet.mcq.answers[3], " - ", MCQs[3].answers[tSet.mcq.answers[3]].includes("<br>") ? MCQs[3].answers[tSet.mcq.answers[3]].slice(0, -4) : MCQs[3].answers[tSet.mcq.answers[3]], " (", (tSet.mcq.answers[3] === MCQs[3].correctAnswer) ? "CORRECT" : "INCORRECT", ")</span><br><br>",

      MCQs[4].question, "<br><span style='color: #", (tSet.mcq.answers[4] === MCQs[4].correctAnswer) ? "029F73" : "D36027", "'> Votre réponse: ",
      tSet.mcq.answers[4], " - ", MCQs[4].answers[tSet.mcq.answers[4]].includes("<br>") ? MCQs[4].answers[tSet.mcq.answers[4]].slice(0, -4) : MCQs[4].answers[tSet.mcq.answers[4]], " (", (tSet.mcq.answers[4] === MCQs[4].correctAnswer) ? "CORRECT" : "INCORRECT", ")</span><br><br>",

      MCQs[5].question, "<br><span style='color: #", (tSet.mcq.answers[5] === MCQs[5].correctAnswer) ? "029F73" : "D36027", "'> Votre réponse: ",
      tSet.mcq.answers[5], " - ", MCQs[5].answers[tSet.mcq.answers[5]].includes("<br>") ? MCQs[5].answers[tSet.mcq.answers[5]].slice(0, -4) : MCQs[5].answers[tSet.mcq.answers[5]], " (", (tSet.mcq.answers[5] === MCQs[5].correctAnswer) ? "CORRECT" : "INCORRECT", ")</span><br><br>",


    ].join(''));
  }

  // functions to compute a sum of an array in javascript
  function getSum(total, num) {
    return total + num;
  }
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// FORAGING TASK
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Function that runs through all of the elements of the foraging task
function runForagingTask() {
  var ctr = tSet.trialcounter; // current trial
  var cta = tSet.task; // current task
  var firstRespDelay = Math.random() * (settings.allowFirstRespDelay[1] - settings.allowFirstRespDelay[0]) + settings.allowFirstRespDelay[0]; // delay before the first response can be made
  tSet.behavior.firstRespDelay[ctr] = firstRespDelay;

  // Update trial counter shown to participants
  $('#ShowTrialCount').html(ctr);
  $('#ShowMaxTrialCount').html(data.sched[cta].MaxSearches.length);
  //console.log(ctr)
  // Check whether to do the trial - either have already done all in schedule or have reached maximum set in ExpSettings.js
  if (ctr != settings.maxTrials && ctr != data.sched[cta].MaxSearches.length) {  // in Presentation we would normally do a for-loop, but javascript executes everything at the same time, so we need to use an if-loop
    // Start full screen in case it's no longer full screen
    launch_fullscreen()
    // 1) Set up the screen
    // 1.A)
    if (ctr === data.sched[cta].MaxSearches.length) {
      console.log("problem");
    }
    tSet.currentChart = createEnvironment(ctr, settings.forageWheelCnvs);
    // 1.B) Show the cost of foraging and the number of spins still available and the status bar
    tSet.currentOffer = data.sched[cta].OfferMag[ctr][0];
    $('#forageOfferDiv').html(stimuliLabels.offer + " <br> " + tSet.currentOffer + " points ");
    $('#forageCostDiv').html(stimuliLabels.cost + " <br> " + data.sched[cta].Costs[ctr][0] + " points");
    tSet.availSearches = data.sched[cta].MaxSearches[ctr][0];
    $('#forageDrawDiv').html(stimuliLabels.remaining + " <br> " + tSet.availSearches);

    // 2) Make the button responsive and set the speed for selecting
    $('#redrawButton').show();
    $('#acceptButton').show();
    $('#nextTrialButton').hide();
    $('#redrawButton').prop('disabled', true);
    $('#acceptButton').prop('disabled', true);
    setTimeout(function () {
      $('#redrawButton').prop('disabled', false);
      $('#acceptButton').prop('disabled', false);
      // 3) Record the time when the button becomes enabled
      tSet.startTimer = new Date().getTime();
    }, firstRespDelay);

    // 4) initialize the number of searches for this trial
    tSet.behavior.nSearches[ctr] = 0;
    tSet.behavior.offers[ctr][0] = data.sched[cta].OfferMag[ctr][0];

  }
  else {
    // Store the data
    data.storeBehav[tSet.taskCounter] = {};
    data.storeBehav[tSet.taskCounter].type = JSON.parse(JSON.stringify(tSet.taskType)); // we need to use this syntax because objects don't store variables, but references to variables, and so we have to make a copy of the variable to actually have it stored here
    data.storeBehav[tSet.taskCounter].behavior = JSON.parse(JSON.stringify(tSet.behavior));
    // then proceed to next object in experiment
    proceedInExpt();
  }
  waitForWebSocketMessage()
}

// Sub-functions of the foraging task (we've kept them as separate functions, rather than within 'runForagingTask' so that we can also use them during e.g. training)

// Set up the alternative patches, i.e. the environment
function createEnvironment(ctr, cnvs) {

  var cta = tSet.task;
  // Draw the wheel with all the environment patches
  var patchColors = [];
  this.ctx = cnvs.getContext("2d");
  // Make a list of the colours of the patches we want to draw now
  for (i = 0; i < data.sched[cta].nPatches[ctr]; i++) {
    patchColors[i] = settings.colors[0];
  }
  var chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: data.sched[cta].PatchMags[ctr].toString().split(","), // make the number array into a string array because the 'piece label' function cannot cope with numbers
      datasets: [{
        backgroundColor: patchColors,
        borderColor: 'rgb(0,0,0)',
        data: data.sched[cta].PatchProbs[ctr],
      }]
    },
    options: {
      responisve: true,// in case people resize their windows
      maintainAspectRatio: false, // otherwise it does not fill the box
      events: [], // prevents action on hovering
      animation: {
        duration: 0
      },
      legend: {
        display: false
      },
      pieceLabel: {
        render: 'label',
        fontColor: '#000',
        fontSize: 30,
        fontStyle: 'bold',
        overlap: true,
        position: 'center'
      }
    }
  });
  return chart;
}

function redrawSample() {
  if (!canRespond) return
  
  triggerLuminousFlash()
  var ctr = tSet.trialcounter;
  var cta = tSet.task;
  // disable the buttons
  disableButtons()
  // record RT and count number of searches
  tSet.endTimer = new Date().getTime();

  //  subtract the costs and show participants and animation
  // data.pointCounter = data.pointCounter - data.sched[cta].Costs[ctr][0];
  // setTimeout(function(){
  //     //currentPoints.innerHTML =data.pointCounter;
  //     settings.myPoints.update(data.pointCounter);
  // },settings.counterDelay);
  substractFromSearches();

  // Spin the pointer
  // pick a random angle to start with
  tSet.pointerPosition = Math.random() * Math.PI * 2;
  var randSpinDur = Math.random() * (settings.pointer.spinDuration[1] - settings.pointer.spinDuration[0]) + settings.pointer.spinDuration[0];
  var delta = 0; // time that has passed between rendering frames
  var lastFrameTimeMs = 0; // last time the loop was run
  var maxFPS = 60;
  var timestep = 1000 / 60; // to make sure the animation is smooth
  var running = true;
  frameID = requestAnimationFrame(mainPointerLoop); // start the pointer
  tSet.spinStart = new Date().getTime();
  // update the pointer position smoothly
  function mainPointerLoop(timestamp) {
    // Throttle the frame rate.
    if (timestamp < lastFrameTimeMs + (1000 / maxFPS) && running === true) {
      requestAnimationFrame(mainPointerLoop);
      return;
    }
    delta += timestamp - lastFrameTimeMs;
    lastFrameTimeMs = timestamp;

    // stop animation if time is up and if we are at least a few degrees away from any borders
    if ((Date.now() - tSet.spinStart) >= randSpinDur) {
      cancelAnimationFrame(frameID);
      running = false;
      // update the offer
      updateOffer();
    }
    else {
      // Simulate the total elapsed time in fixed-size chunks
      while (delta >= timestep && running === true) {
        updateAngle(timestep);
        delta -= timestep;
      }
      drawPointer();
    }
    if (running === true) {
      requestAnimationFrame(mainPointerLoop);
    }
  }
  // function that redraws the pointer
  function drawPointer() {
    tSet.currentChart.update();
    var angle = tSet.pointerPosition;
    var length = tSet.currentChart.radiusLength * settings.pointer.length;
    var width = settings.pointer.width;
    var ctx = settings.forageWheelCtx;
    ctx.translate(tSet.currentChart.width / 2, tSet.currentChart.height / 2);
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0, 0);
    ctx.rotate(angle);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-angle);
    ctx.translate(-tSet.currentChart.width / 2, -tSet.currentChart.height / 2);
  }

  function updateOffer() {
    // make a list of the angles on our pie chart
    var angles = [];
    var cta = tSet.task;
    var npatches = countNonNan(data.sched[cta].PatchMags[ctr]);
    for (i = 0; i < npatches; i++) {
      var curPatch = tSet.currentChart.data.datasets[0]._meta[Object.keys(tSet.currentChart.data.datasets[0]._meta)[0]].data[i]._view;
      var tangles = [100, 100, 100]; // temporary matrix to store the angles
      if (curPatch.startAngle < 2 * Math.PI) {//360){
        tangles[0] = curPatch.startAngle;
      } else {
        tangles[0] = curPatch.startAngle - 2 * Math.PI;//360;
      }
      if (curPatch.endAngle < 2 * Math.PI) {//360){
        tangles[1] = curPatch.endAngle;
      } else {
        tangles[1] = curPatch.endAngle - 2 * Math.PI;//360;
      }
      tangles[2] = i; // original location of the angle in our set
      angles.push(tangles);
    }
    // sort the angles so that to compare to the pointer position we can just go through it one by one
    angles.sort();

    // Check where the pointer is compared to the angles
    for (i = 0; i < npatches; i++) {
      // check whether the angle is in the segment
      tpointer = tSet.pointerPosition - 0.5 * Math.PI;//because framework of chart counts the angles differently than canvas itself
      if (tpointer > angles[i][0] && tpointer < angles[i][1]) {
        tSet.currentOffer = data.sched[cta].PatchMags[ctr][angles[i][2]];
        // store the data
        storeDataSpin();
        // update the offer screen and reset the buttons
        $('#forageOfferDiv').html(stimuliLabels.offer + "<br> " + tSet.currentOffer + " points");
        reenableSpinButtons();
        break;
      }
    }
  }

  function storeDataSpin() {
    // ******** STORE THE BEHAVIORAL DATA ********//
    // store the RT
    tSet.behavior.RTs[ctr][tSet.behavior.nSearches[ctr]] = tSet.endTimer - tSet.startTimer;

    // increase the number of searches done
    tSet.behavior.nSearches[ctr]++;
    // show the new offer and record it; reduce the available number of searches; reduce the  point counter
    tSet.behavior.offers[ctr][tSet.behavior.nSearches[ctr]] = tSet.currentOffer;


    // Also store data in long format
    store_data_long('spin')
  }

  function reenableSpinButtons() {
    // enable the buttons again if there are searches left
    if (tSet.behavior.nSearches[ctr] < data.sched[cta].MaxSearches[ctr]) {
      $('#redrawButton').prop('disabled', false);
      $('#acceptButton').prop('disabled', false);
      // get the time when the buttons are enabled again
      tSet.startTimer = new Date().getTime();
    } else { // only enable the 'accept offer button'
      $('#acceptButton').prop('disabled', false);
    }
  }
  canRespond = false
  currentStep=5
  waitForWebSocketMessage()
  setCircleToBlack()
}

function disableButtons() {
  $('#redrawButton').prop('disabled', true);
  $('#acceptButton').prop('disabled', true);
}

function substractFromSearches() {
  tSet.availSearches--;
  $('#forageDrawDiv').html(stimuliLabels.remaining + " <br> " + tSet.availSearches);
}

// function that updates the angle
function updateAngle(delta) {
  tSet.pointerPosition += settings.pointer.speed * delta;
  if (tSet.pointerPosition >= 2 * Math.PI) {
    tSet.pointerPosition -= 2 * Math.PI;
  }
}

function acceptOffer() {
  if (!canRespond) return

  triggerLuminousFlash()
  var ctr = tSet.trialcounter;
  var cta = tSet.task;
  // HERE BEFORE AND IT WORKED FINE: tSet.trialcounter++; // ready to go on to next trial
  tSet.endTimer = new Date().getTime(); // get time for RT computation
  // add the accepted offer to the point counter and redraw the point counter
  data.pointCounter = data.pointCounter + tSet.currentOffer;
  // ******** STORE THE BEHAVIORAL DATA ********//
  // (if the accept wasnt forced, i.e. if participants didnt run out of trials
  if (tSet.behavior.nSearches[ctr] !== data.sched[cta].MaxSearches[ctr][0]) {
    tSet.behavior.RTs[ctr][tSet.behavior.nSearches[ctr]] = tSet.endTimer - tSet.startTimer;
    store_data_long('accept')
    /*
    if (tSet.behavior.RTs[ctr][tSet.behavior.nSearches[ctr]] <0){
      debugger;
    }
    else{
      console.log(tSet.behavior.RTs[ctr][tSet.behavior.nSearches[ctr]])
    }
    */
  } else { // otherwise don't store the data, because it's not a decision RT
  }

  // moved here:
  tSet.trialcounter++; // ready to go on to next trial
  // ********************************************* //
  tSet.currentChart.destroy(); // remove the chart
  $('#redrawButton').prop('disabled', true);
  $('#acceptButton').prop('disabled', true);
  // update the counter and present the 'next trial' button
  setTimeout(function () {
    currentPoints.innerHTML = data.pointCounter;
    setTimeout(function () {
      $('#nextTrialButton').show();
      $('#redrawButton').hide();
      $('#acceptButton').hide();
      $('#nextTrialButton').prop('disabled', false);
    }, settings.nextButtonTrialDelay); // this delay is set to be the same as the hard-coded duration of the otometer so that it appears when the update is done
  }, settings.counterDelay);
  //    runForagingTask();
  currentStep=6
  canRespond = false
  setCircleToBlack()
  waitForWebSocketMessage()
}

function store_data_long(flag) {
  var ctr = tSet.trialcounter
  var cta = tSet.task;
  tSet.behaviorLongFormat.trainingOrTask.push(tSet.taskType)
  tSet.behaviorLongFormat.trial.push(ctr + 1) //as javascript counts from zero
  tSet.behaviorLongFormat.choice.push(flag);
  tSet.behaviorLongFormat.firstRespDelay.push(tSet.behavior.firstRespDelay[ctr]);

  //tSet.currentOffer);
  tSet.behaviorLongFormat.cost.push(data.sched[cta].Costs[ctr][0])
  if (flag == 'spin') {
    tSet.behaviorLongFormat.offer.push(tSet.behavior.offers[ctr][tSet.behavior.nSearches[ctr] - 1])
    tSet.behaviorLongFormat.availableSearches.push(tSet.availSearches + 1)
    tSet.behaviorLongFormat.RT.push(tSet.behavior.RTs[ctr][tSet.behavior.nSearches[ctr] - 1])
    tSet.behaviorLongFormat.nSearchesDone.push(tSet.behavior.nSearches[ctr] - 1); // we want to record how many searches were done before this one and it was increased by the function that called this
    tSet.behaviorLongFormat.totalPoints.push(data.pointCounter + data.sched[cta].Costs[ctr][0]);
  } else if (flag == 'accept') {
    tSet.behaviorLongFormat.offer.push(tSet.behavior.offers[ctr][tSet.behavior.nSearches[ctr]])
    tSet.behaviorLongFormat.availableSearches.push(tSet.availSearches)
    tSet.behaviorLongFormat.RT.push(tSet.behavior.RTs[ctr][tSet.behavior.nSearches[ctr]])
    tSet.behaviorLongFormat.nSearchesDone.push(tSet.behavior.nSearches[ctr])
    tSet.behaviorLongFormat.totalPoints.push(data.pointCounter - tSet.currentOffer); // because acceptOffer function has already updated this
  }

  //store whether it was an initial or later decision
  if (tSet.behaviorLongFormat.nSearchesDone[tSet.behaviorLongFormat.nSearchesDone.length - 1] == 0) {
    tSet.behaviorLongFormat.initialLaterSearch.push('initial')
  } else {
    tSet.behaviorLongFormat.initialLaterSearch.push('later')
  }

  // add offers and probabilities of the patches
  tSet.behaviorLongFormat.mag1.push(data.sched[cta].PatchMags[ctr][0]);
  tSet.behaviorLongFormat.mag2.push(data.sched[cta].PatchMags[ctr][1]);
  tSet.behaviorLongFormat.mag3.push(data.sched[cta].PatchMags[ctr][2]);
  tSet.behaviorLongFormat.mag4.push(data.sched[cta].PatchMags[ctr][3]);
  tSet.behaviorLongFormat.mag5.push(data.sched[cta].PatchMags[ctr][4]);
  tSet.behaviorLongFormat.mag6.push(data.sched[cta].PatchMags[ctr][5]);

  tSet.behaviorLongFormat.prob1.push(data.sched[cta].PatchProbs[ctr][0]);
  tSet.behaviorLongFormat.prob2.push(data.sched[cta].PatchProbs[ctr][1]);
  tSet.behaviorLongFormat.prob3.push(data.sched[cta].PatchProbs[ctr][2]);
  tSet.behaviorLongFormat.prob4.push(data.sched[cta].PatchProbs[ctr][3]);
  tSet.behaviorLongFormat.prob5.push(data.sched[cta].PatchProbs[ctr][4]);
  tSet.behaviorLongFormat.prob6.push(data.sched[cta].PatchProbs[ctr][5]);


}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Settings for training vs. foraging task
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function setupTraining() {
  tSet.task = settings.task;
  tSet.taskType = 'Training';
  tSet.trialcounter = 0;
  tSet.taskCounter = tSet.taskCounter + 1;
  // reset tSet.behavior to be empty
  tSet.behavior.nSearches = Array2D(data.sched[0].PatchMags.length, 1);
  tSet.behavior.offers = Array2D(data.sched[0].PatchMags.length, 11);
  tSet.behavior.RTs = Array2D(data.sched[0].PatchMags.length, 11);
  tSet.behavior.firstRespDelay = Array2D(data.sched[0].PatchMags.length, 1);
  data.pointCounter = 0;
}

function setupForagingTask() {
  tSet.task = 1;
  tSet.taskType = 'Experiment';
  tSet.trialcounter = 0;
  tSet.taskCounter = tSet.taskCounter + 1;
  // reset tSet.behavior to be empty
  tSet.behavior.nSearches = Array2D(data.sched[1].PatchMags.length, 1);
  tSet.behavior.offers = Array2D(data.sched[1].PatchMags.length, 11);
  tSet.behavior.RTs = Array2D(data.sched[1].PatchMags.length, 11);
  tSet.behavior.firstRespDelay = Array2D(data.sched[0].PatchMags.length, 1);
  data.pointCounter = 0;
}

// Function to replace HTML buttons by MEG button via websockets

// JAVASCRIPT_ID = "js/";
// ERROR_CODE = "404";
// RETRY_DELAY = 20;

// function waitForWebSocketMessage(){
//   var socket = new WebSocket('ws://localhost:8000/');
//   sendJsId(socket);
//   listenToMessages(socket);
// }

// function sendJsId(socket){
//   socket.addEventListener('open', function (event) {
//     socket.send(JAVASCRIPT_ID);
//   });
// }

// function listenToMessages(socket){
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
//   setTimeout(function(){waitForWebSocketMessage();}, RETRY_DELAY);
// }

// function handleMessage(message){
//   console.log(message)
//   if(message == "redraw" && tSet.availSearches!==0){
//     redrawSample();
//   } else if(message == "next_trial"){
//     runForagingTask();
//   } else if(message == "accept"){
//     acceptOffer();
//   } else if(message == "hide"){
//     hideCircle();
//   }
// }

// function hideCircle(){
//   $('#test').hide();
//   console.log('element hidden');
// }

// if (tSet.behavior.nSearches[ctr]<data.sched[cta].MaxSearches[ctr]){
//   console.log("pizza peperoni")
// }

// console.log(tSet.availSearches)
// console.log("Asking for next message... will be printed upon arrival")

// && tSet.behavior.nSearches[ctr]<data.sched[cta].MaxSearches[ctr]

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
