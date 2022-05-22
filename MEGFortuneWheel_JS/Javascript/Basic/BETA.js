
var exptTimeLine = [], runThrough = -1;

var forageTraining= new TimeLine([(["exitNow", "forageDiv", "square"],["consentDiv","instructionsDiv"],[setupTraining,runForagingTask, resetUi, hideFlash],"Training")]
var forageGame = new TimeLine(["exitNow", "forageDiv","square"], ["consentDiv","instructionsDiv","quizDiv","landingPageDiv"], [setupForagingTask, runForagingTask, resetUi, hideFlash],"Task"])
var WOFdebrief = new TimeLine(["surveyContainer", "exitNow"], ["forageDiv","questionnaireInfoDiv_Internet","questionnaireInfoDiv_Local"], [WOFdebriefQuestionnaire, runQuestionnaires],"debriefQ")
var finishExperiment= new TimeLine([],["forageDiv","questionnaireInfoDiv", "surveyContainer", "exitNow","thanksComment","startExperiment","introText"],[saveData], "finishExpt");

// Timeline of the experiment

exptTimeLine.push(forageInstructions);
exptTimeLine.push(forageTraining);
exptTimeLine.push(WOFdebrief);
exptTimeLine.push(finishExperiment);

// Trials 

class Trials {
  constructor(number, trainingOrTask, offerMag, cost, maxSearches, patchMags, patchProbs, trialNumber)
this.trainingOrTask= trainingOrTask)
.....
}

//
class outputData {
  constructor(trainingOrTask, currentOffer, cost, remainingSpins, patchMags, patchProbs, trialNumber, responseDelay, triggerTimingType, triggerTiming)
}

class Steps {
  constructor(name, divToShow, divToHide, toRun)
this.name= stepName
this.divToShow= divToShow
this.divToHide = divToHide
this.toRun = toRun
this.tamère=tamère
this.tonpère=darkVador
}
// var checkDisplay= new TimeLine(["checkDisplayDiv"],["landingPageDiv"],[createTestWheelOfFortune],'checkDisplayDiv')
// var infoSheet = new TimeLine(["participantInfoSheet", "exitNow"], ['checkDisplayDiv',"landingPageDiv","goBackButton", "consentForm", "returnToInfoPage", "TaskInstrReminder"], [checkBoxes], "infoSheet");
// var consent = new TimeLine(["returnToInfoPage", "consentForm", "exitNow"],["participantInfoSheet"], [checkBoxes], "consent");
// var   subjectInfo_Local = new TimeLine(["GetParticipantInfo_Local", "exitNow"], ["landingPageDiv","startExperiment", "next-button"], [askSubjectInfo], "subjectInfo");

// var pickSchedules = new TimeLine([],["GetParticipantInfo_Local"],[launch_fullscreen,loadSchedules],"loadingSchedules")


// // Experimental task
// var forageInstructions = new TimeLine(["exitNow", "instructionsDiv"],["consentDiv","quizDiv", "surveyContainer"],[setupInstructions,showInstructions],"Instr"),
//     forageTraining= new TimeLine(["exitNow", "forageDiv", "square"],["consentDiv","instructionsDiv"],[setupTraining,runForagingTask, resetUi, hideFlash],"Training"),
//     testUnderstanding= new TimeLine(["exitNow", "quizDiv"],["forageDiv","consentDiv","instructionsDiv","landingPageDiv"],[setupMCQ,runMCQ],"MCQ"),
//     forageGame = new TimeLine(["exitNow", "forageDiv","square"], ["consentDiv","instructionsDiv","quizDiv","landingPageDiv"], [setupForagingTask, runForagingTask, resetUi, hideFlash],"Task");

// // add post-task questionnaires
// var qInfo_Internet = new TimeLine(["exitNow","questionnaireInfoDiv_Internet"],["forageDiv","landingPageDiv"],[],"questionnaireReminder")
// var qInfo_Local = new TimeLine(["exitNow","questionnaireInfoDiv_Local"],["forageDiv","landingPageDiv"],[],"questionnaireReminder")
// var apathyQ = new TimeLine(["surveyContainer", "exitNow"], ["forageDiv","questionnaireInfoDiv_Internet","questionnaireInfoDiv_Local"], [apathyMotivationIndex, runQuestionnaires], "apathyMotivationIndex")
// var STICSAQ = new TimeLine(["surveyContainer", "exitNow"], [], [STICSA, runQuestionnaires], "STICSA")
// var SHAPSQ = new TimeLine(["surveyContainer", "exitNow"], [], [SHAPS, runQuestionnaires], "SHAPS")
// var OCDQ= new TimeLine(["surveyContainer", "exitNow"], [], [obsessiveCompulsiveInventory, runQuestionnaires], "OCD")
// var checkQs= new TimeLine(["surveyContainer", "exitNow"], [], [checkQuestions, runQuestionnaires], "checkQuestions")

// var WOFdebrief = new TimeLine(["surveyContainer", "exitNow"], ["forageDiv","questionnaireInfoDiv_Internet","questionnaireInfoDiv_Local"], [WOFdebriefQuestionnaire, runQuestionnaires],"debriefQ")
// var finishExperiment= new TimeLine([],["forageDiv","questionnaireInfoDiv", "surveyContainer", "exitNow","thanksComment","startExperiment","introText"],[saveData], "finishExpt");


// // adding the timeline elements to the exptTimeLine, depending on whether it's over the internet or local/in the lab


// } else{
//   exptTimeLine.push(subjectInfo_Local);
//   exptTimeLine.push(pickSchedules);
  
//   exptTimeLine.push(forageInstructions);
//   exptTimeLine.push(forageTraining);
//   exptTimeLine.push(testUnderstanding);

//   exptTimeLine.push(forageGame);

//   exptTimeLine.push(qInfo_Local);
//   exptTimeLine.push(WOFdebrief);

//   exptTimeLine.push(finishExperiment);


//   //exptTimeLine.push(apathyQ);
// //  exptTimeLine.push(STICSAQ);
// //  exptTimeLine.push(SHAPSQ);
// //  exptTimeLine.push(OCDQ);
//   //exptTimeLine.push(checkQs);

// }