// Setting up the time line for the experiment
var exptTimeLine = [], runThrough = -1;

// Make a list of elements for the study time line, using the 'new TimeLine' command that we define in ForagingFunctions
// for each element, define 1) what DIVs to show, 2) what DIVs to hide, 3) what functions to run, 4) what the name of this timeline element is to store in the json output from the experiment
// task information, consent and subject basic info
var checkDisplay= new TimeLine(["checkDisplayDiv"],["landingPageDiv"],[createTestWheelOfFortune],'checkDisplayDiv')
var infoSheet = new TimeLine(["participantInfoSheet", "exitNow"], ['checkDisplayDiv',"landingPageDiv","goBackButton", "consentForm", "returnToInfoPage", "TaskInstrReminder"], [checkBoxes], "infoSheet");
var consent = new TimeLine(["returnToInfoPage", "consentForm", "exitNow"],["participantInfoSheet"], [checkBoxes], "consent");



var   subjectInfo_Internet = new TimeLine(["surveyContainer", "exitNow"], ["consentForm","startExperiment", "next-button"], [introQuestions_Internet, runQuestionnaires,initBatchConditions], "subjectInfo");
//var   subjectInfo_Local = new TimeLine(["surveyContainer", "exitNow"], ["landingPageDiv","startExperiment", "next-button"], [introQuestions_Local, runQuestionnaires], "subjectInfo");
var   subjectInfo_Local = new TimeLine(["GetParticipantInfo_Local", "exitNow"], ["landingPageDiv","startExperiment", "next-button"], [askSubjectInfo], "subjectInfo");

var pickSchedules = new TimeLine([],["GetParticipantInfo_Local"],[launch_fullscreen,loadSchedules],"loadingSchedules")


// Experimental task
var forageInstructions = new TimeLine(["exitNow", "instructionsDiv"],["consentDiv","quizDiv", "surveyContainer"],[setupInstructions,showInstructions],"Instr"),
    forageTraining= new TimeLine(["exitNow", "forageDiv", "square"],["consentDiv","instructionsDiv"],[setupTraining,runForagingTask, resetUi, hideFlash],"Training"),
    testUnderstanding= new TimeLine(["exitNow", "quizDiv"],["forageDiv","consentDiv","instructionsDiv","landingPageDiv"],[setupMCQ,runMCQ],"MCQ"),
    forageGame = new TimeLine(["exitNow", "forageDiv","square"], ["consentDiv","instructionsDiv","quizDiv","landingPageDiv"], [setupForagingTask, runForagingTask, resetUi, hideFlash],"Task");

// add post-task questionnaires
var qInfo_Internet = new TimeLine(["exitNow","questionnaireInfoDiv_Internet"],["forageDiv","landingPageDiv"],[],"questionnaireReminder")
var qInfo_Local = new TimeLine(["exitNow","questionnaireInfoDiv_Local"],["forageDiv","landingPageDiv"],[],"questionnaireReminder")
var apathyQ = new TimeLine(["surveyContainer", "exitNow"], ["forageDiv","questionnaireInfoDiv_Internet","questionnaireInfoDiv_Local"], [apathyMotivationIndex, runQuestionnaires], "apathyMotivationIndex")
var STICSAQ = new TimeLine(["surveyContainer", "exitNow"], [], [STICSA, runQuestionnaires], "STICSA")
var SHAPSQ = new TimeLine(["surveyContainer", "exitNow"], [], [SHAPS, runQuestionnaires], "SHAPS")
var OCDQ= new TimeLine(["surveyContainer", "exitNow"], [], [obsessiveCompulsiveInventory, runQuestionnaires], "OCD")
var checkQs= new TimeLine(["surveyContainer", "exitNow"], [], [checkQuestions, runQuestionnaires], "checkQuestions")

var WOFdebrief = new TimeLine(["surveyContainer", "exitNow"], ["forageDiv","questionnaireInfoDiv_Internet","questionnaireInfoDiv_Local"], [WOFdebriefQuestionnaire, runQuestionnaires],"debriefQ")
var finishExperiment= new TimeLine([],["forageDiv","questionnaireInfoDiv", "surveyContainer", "exitNow","thanksComment","startExperiment","introText"],[saveData], "finishExpt");


// adding the timeline elements to the exptTimeLine, depending on whether it's over the internet or local/in the lab

if (settings.datatype=="Internet"){
  exptTimeLine.push(checkDisplay);
  exptTimeLine.push(infoSheet);
  exptTimeLine.push(consent);

  exptTimeLine.push(subjectInfo_Internet);
  exptTimeLine.push(pickSchedules);
  exptTimeLine.push(forageInstructions);
  exptTimeLine.push(forageTraining);
  exptTimeLine.push(testUnderstanding);

  exptTimeLine.push(forageGame);

  exptTimeLine.push(qInfo_Internet);

  exptTimeLine.push(WOFdebrief);
  exptTimeLine.push(apathyQ);

  exptTimeLine.push(STICSAQ);
  exptTimeLine.push(SHAPSQ);
  exptTimeLine.push(OCDQ);

  exptTimeLine.push(checkQs);

  exptTimeLine.push(finishExperiment);


} else{
  exptTimeLine.push(subjectInfo_Local);
  exptTimeLine.push(pickSchedules);
  
  exptTimeLine.push(forageInstructions);
  exptTimeLine.push(forageTraining);
  exptTimeLine.push(testUnderstanding);

  exptTimeLine.push(forageGame);

  exptTimeLine.push(qInfo_Local);
  exptTimeLine.push(WOFdebrief);

  exptTimeLine.push(finishExperiment);


  //exptTimeLine.push(apathyQ);
//  exptTimeLine.push(STICSAQ);
//  exptTimeLine.push(SHAPSQ);
//  exptTimeLine.push(OCDQ);
  //exptTimeLine.push(checkQs);

}


//every second check whether focus is on the experiment screen. If not log the time stamp when another tab/window opens
var focused = true, unfocusedStart, unfocusedEnd;
setInterval(function () {
    if (!document.hasFocus() && (focused)) {
        focused = false;
        unfocusedStart = new Date().getTime();
    } else if (document.hasFocus() && (!focused)) {
        focused = true;
        unfocusedEnd = new Date().getTime();
        logTimeAway(unfocusedEnd, unfocusedStart);
    }
}, 500); //check every 500ms

function logTimeAway(unfocusedEnd, unfocusedStart) {
    if ((unfocusedEnd-unfocusedStart) > 1000) {data.unfocused.push(unfocusedEnd-unfocusedStart);}; //log total time spent away from screen (only log if more than 1s, since this is triggered by clicking on alert boxes that are part of the experiment)
}
//# sourceURL=ForagingRun.js
