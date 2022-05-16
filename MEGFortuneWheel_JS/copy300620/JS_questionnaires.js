//JSON provided by SurveyJS online editor - www.surveyjs.io
var surveyJSON,
        surveyType = 1; //1 is the default surveyType - optionally surveys can be changed e.g. to type 2 to run additional checks


//INTRODUCTORY QUESTIONS - the answers to this questionnaire will be checked by the function "evalIntroQuestions" below - this means that if you want to
// add new qustions here, also go to this function and change the number of answers it expects
/*
function introQuestions_Local() {
    surveyType = 2;
    surveyJSON = {pages: [ { name: "page1", elements: [ { type: "text", name: "ProlificID", title: "Participant ID:" },{ type: "text", name: "SessionID", title: "Session number:" } ] } ]}; }
*/

function introQuestions_Internet() {
  surveyType = 2;
  surveyJSON = { pages: [ { name: "page1", elements: [ { type: "text", name: "ProlificID", title: "Enter your Prolific ID:" }, { type: "panel", name: "panel1", elements: [ { type: "dropdown", name: "Age", title: "Age", choices: [ "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40" ] }, { type: "dropdown", name: "Gender", title: "Gender", hasOther: true, choices: [ { value: "0", text: "Female" }, { value: "1", text: "Male" } ] }, { type: "dropdown", name: "EducationLevel", title: "Highest educational level attained?", choices: [ { value: "1", text: "GCSE or middle school graduation (education up to age 15/16)" }, { value: "2", text: "A-Levels or high school diploma" }, { value: "3", text: "Bachelor's degree" }, { value: "4", text: "Master's degree" }, { value: "5", text: "Doctorate or similarly advanced qualification" } ] }, { type: "dropdown", name: "EnglishFluency", title: "What is your level of English fluency?", choices: [ { value: "2", text: "Native speaker or otherwise fluent" }, { value: "1", text: "Moderate" }, { value: "0", text: "Basic" } ] }, { type: "dropdown", name: "VisualAcuity", title: "What is your visual acuity? If you are wearing corrective lenses, please select the response that best represents your visual acuity WITH the lenses on.", choices: [ { value: "2", text: "Excellent visual acuity (20/20)" }, { value: "1", text: "Moderate visual acuity" }, { value: "0", text: "Poor or impaired vision" } ] }, { type: "dropdown", name: "Handedness", title: "Are you left- or right-handed?", choices: [ { value: "2", text: "Left-handed" }, { value: "1", text: "Right-handed" }, { value: "0", text: "Ambidextrous" } ] }, { type: "dropdown", name: "Browser", title: "Which browser are you using?", hasOther: true, choices: [ { value: "0", text: "Chrome" }, { value: "1", text: "Firefox" }, { value: "2", text: "Internet Explorer" }, { value: "3", text: "Safari" }, { value: "4", text: "Opera" } ] },  ], title: "Please answer the following questions about yourself:" } ] } ] };
}


function apathyMotivationIndex() {
    surveyJSON = {pages:[{name:"page1",elements:[{type:"matrix",name:"ApathyMotivationIndex",title:"Below are a number of statements. Each statement asks you to think about your life over the last 2 weeks. For each statement, select how appropriately it describes your life right now. Select “Completely true” if the statement describes you perfectly, “Completely untrue” if the statement does not describe you at all over the last 2 weeks, and use the answers in between accordingly. ",columns:[{value:"4",text:"Completely UNTRUE"},{value:"3",text:"Mostly untrue"},{value:"2",text:"Neither true nor untrue"},{value:"1",text:"Quite true"},{value:"0",text:"Completely TRUE"}],rows:[{value:"Q1",text:"1. I feel sad or upset when I hear bad news."},{value:"Q2",text:"2. I start conversations with random people."},{value:"Q3",text:"3. I enjoy doing things with people I have just met."},{value:"Q4",text:"4. I suggest activities for me and my friends to do."},{value:"Q5",text:"5. I make decisions firmly and without hesitation."},{value:"Q6",text:"6. After making a decision, I will wonder if I have made the wrong choice."},{value:"Q7",text:"7. Based on the last two weeks, I will say I care deeply about how my loved ones think of me."},{value:"Q8",text:"8. I go out with friends on a weekly basis."},{value:"Q9",text:"9. When I decide to do something, I am able to make an effort easily."},{value:"Q10",text:"10. I don't like to laze around."},{value:"Q11",text:"11. I get things done when they need to be done, without requiring reminders from others."},{value:"Q12",text:"12. When I decide to do something, I am motivated to see it through to the end."},{value:"Q13",text:"13. I feel awful if I say something insensitive."},{value:"Q14",text:"14. I start conversations without being prompted."},{value:"Q15",text:"15. When I have something I need to do, I do it straightaway so it is out of the way."},{value:"Q16",text:"16. I feel bad when I hear an acquaintance has an accident or illness."},{value:"Q17",text:"17. I enjoy choosing what to do from a range of activities."},{value:"Q18",text:"18. If I realise I have been unpleasant to someone, I will feel terribly guilty afterwards."}]}]}]};
    tSet.questionnaire.minTime=30000;
}

function SHAPS() {
    surveyJSON = { pages: [ { name: "page1", elements: [ { type: "matrix", name: "SHAPSV2", title: "This questionnaire is designed to measure your ability to experience pleasure IN THE LAST FEW DAYS. It is important to read each statement very carefully. Please indicate how much you agree or disagree with each statement.", columns: [ { value: "-2", text: "Strongly disagree" }, { value: "-1", text: "Disagree" }, { value: "1", text: "Agree" }, { value: "2", text: "Strongly agree" } ], rows: [ { value: "Q1", text: "Q1. I would enjoy my favourite television or radio programme:" }, { value: "Q2", text: "Q2. I would enjoy being with my family or close friends:" }, { value: "Q3", text: "Q3. I would find pleasure in my hobbies and pastimes:" }, { value: "Q4", text: "Q4. I would be able to enjoy my favourite meal:" }, { value: "Q5", text: "Q5. I would enjoy a warm bath or refreshing shower:" }, { value: "Q6", text: "Q6. I would find pleasure in the scent of flowers or the smell of a fresh sea breeze or freshly baked bread:" }, { value: "Q7", text: "Q7. I would enjoy seeing other people’s smiling faces:" }, { value: "Q8", text: "Q8. I would enjoy looking smart when I have made an effort with my appearance:" }, { value: "Q9", text: "Q9. I would enjoy reading a book, magazine or newspaper:" }, { value: "Q10", text: "Q10. I would enjoy a cup of tea or coffee or my favourite drink:" }, { value: "Q11", text: "Q11. I would find pleasure in small things, e.g. bright sunny day, a telephone call from a friend:" }, { value: "Q12", text: "Q12. I would be able to enjoy a beautiful landscape or view:" }, { value: "Q13", text: "Q13. I would get pleasure from helping others:" }, { value: "Q14", text: "Q14. I would feel pleasure when I receive praise from other people:" } ] } ] } ] }
    tSet.questionnaire.minTime=20000;
}

function STICSA() { //STICSA COMBINED question about right now and 'in general' into one question
  surveyJSON = {pages:[{name:"page1",elements:[{type:"matrixdropdown",name:"STICSA",title:"Below is a list of statements which can be used to describe how people feel. Beside each statement are four statements which indicate the degree with which each statement is true of you. Please read each statement carefully and indicate the statement which best indicates how often, right now and in general, the statement is true of you.",columns:[{name:"Column 1",title:"Right now"},{name:"Column 2",title:"In general"}],choices:[{value:1,text:"Not at all"},{value:2,text:"A little"},{value:3,text:"Moderately"},{value:4,text:"Very much so"}],rows:[{value:"Q1",text:"Q1. My heart beats fast."},{value:"Q2",text:"Q2. My muscles are tense."},{value:"Q3",text:"Q3. I feel agonised over my problems."},{value:"Q4",text:"Q4. I think that others won't approve of me."},{value:"Q5",text:"Q5. I feel like I'm missing out on things because I can't make up my mind soon enough."},{value:"Q6",text:"Q6. I feel dizzy."},{value:"Q7",text:"Q7. My muscles feel weak."},{value:"Q8",text:"Q8. I feel trembly and shaky."},{value:"Q9",text:"Q9. I picture some future misfortune"},{value:"Q10",text:"Q10. I can't get some thought out of my mind."},{value:"Q11",text:"Q11. I have trouble remembering things."},{value:"Q12",text:"Q12. My face feels hot."},{value:"Q13",text:"Q13. I think that the worst will happen."},{value:"Q14",text:"Q14. My arms and legs feel stiff."},{value:"Q15",text:"Q15. My throat feels dry."},{value:"Q16",text:"Q16. I keep busy to avoid uncomfortable thoughts."},{value:"Q17",text:"Q17. I cannot concentrate without irrelevant thoughts intruding."},{value:"Q18",text:"Q18. My breathing is fast and shallow."},{value:"Q19",text:"Q19. I worry that I cannot control my thoughts as well as I would like to."},{value:"Q20",text:"Q20. I have butterflies in the stomach."},{value:"Q21",text:"Q21. My palms feel clammy."}]},{type:"comment",name:"Q22",title:"Do you feel like you put very different scores for the \"now\" versus \"in general\" columns? If so, please also explain why (if you feel comfortable doing so)."}]}]};
  tSet.questionnaire.minTime=45000;
}

// note: when copying text here from surveyJS, you need to manually change checkQs to all be 'checkQs' (rather than checkQs2 etc.) because surveyJS automatically prevents questions from having the same label
function checkQuestions() {
  surveyJSON={
 "pages": [ { "name": "page1", "elements": [ { "type": "html", "name": "Instructions", "html": "Almost done. <br>\n On this page, some of the earlier questions will be repeated; you don't need to remember exactly what you answered last time, but please be as consistent as possible. <br>\n<b> Note that the answer options for each question differ <b>" }, { "type": "matrix", "name": "CheckQs", "title": " In general, how often is this statement true:", "columns": [ { "value": "1", "text": "Not at all" }, { "value": "2", "text": "A little" }, { "value": "3", "text": "Moderately" }, { "value": "4", "text": "Very much so" } ], "rows": [ { "value": "STICSA_Q13", "text": "I think that the worst will happen" } ] }, { "type": "matrix", "name": "CheckQs", "title": "The statement below asks you to think about your life over the last 2 weeks. Select how appropriately it describes your life right now. ", "columns": [ { "value": "4", "text": "Completely UNTRUE" }, { "value": "3", "text": "Mostly untrue" }, { "value": "2", "text": "Neither true nor untrue" }, { "value": "1", "text": "Quite true" }, { "value": "0", "text": "Completely TRUE" } ], "rows": [ { "value": "apathyMotivationIndex_Q7", "text": "Based on the last two weeks, I will say I care deeply about how my loved ones think of me." } ] }, { "type": "matrix", "name": "CheckQs", "title": "This question asks about your ability to experience pleasure IN THE LAST FEW DAYS. ", "columns": [ { "value": "-2", "text": "Strongly disagree" }, { "value": "-1", "text": "Disagree" }, { "value": "1", "text": "Agree" }, { "value": "2", "text": "Strongly agree" } ], "rows": [ { "value": "SHAPS_Q5", "text": "I would enjoy a warm bath or refreshing shower:" } ] } ] } ] }
  tSet.questionnaire.minTime=15000;
}

//OBSESSIVE-COMPULSIVE INVENTORY (checked scoring)
function obsessiveCompulsiveInventory() {
    surveyJSON = {pages:[{name:"page1",elements:[{type:"matrix",name:"OCIRevised",title:"The following statements refer to experiences that many people have in their everyday lives. Select the number that best describes HOW MUCH that experience has DISTRESSED or BOTHERED you during the PAST MONTH. ",columns:[{value:"0",text:"Not at all"},{value:"1",text:"A little"},{value:"2",text:"Moderately"},{value:"3",text:"A lot"},{value:"4",text:"Extremely"}],rows:[{value:"Q1",text:"1. I have saved up so many things that they get in the way."},{value:"Q2",text:"2. I check things more often than necessary."},{value:"Q3",text:"3. I get upset if objects are not arranged properly."},{value:"Q4",text:"4. I feel compelled to count while I am doing things."},{value:"Q5",text:"5. I find it difficult to touch an object when I know it has been touched by strangers or certain people."},{value:"Q6",text:"6. I find it difficult to control my own thoughts."},{value:"Q7",text:"7. I collect things I don’t need."},{value:"Q8",text:"8. I repeatedly check doors, windows, drawers, etc."},{value:"Q9",text:"9. I get upset if others change the way I have arranged things."},{value:"Q10",text:"10. I feel I have to repeat certain numbers."},{value:"Q11",text:"11. I sometimes have to wash or clean myself simply because I feel contaminated."},{value:"Q12",text:"12. I am upset by unpleasant thoughts that come into my mind against my will."},{value:"Q13",text:"13. I avoid throwing things away because I am afraid I might need them later."},{value:"Q14",text:"14. I repeatedly check gas and water taps and light switches after turning them off."},{value:"Q15",text:"15. I need things to be arranged in a particular order."},{value:"Q16",text:"16. I feel that there are good and bad numbers."},{value:"Q17",text:"17. I wash my hands more often and longer than necessary."},{value:"Q18",text:"18. I frequently get nasty thoughts and have difficulty in getting rid of them."}]}]}]}
    tSet.questionnaire.minTime=55000;
}

function WOFdebriefQuestionnaire(){
  surveyType=1
  surveyJSON={pages: [ { name: "page1", elements: [ { type: "matrix", name: "DebriefQs", title: "Now just a few quick questions about how you found the game. How often did the following happen to you?", columns: [ { value: "0", text: "0 - Never" }, { value: "1", text: "1 " }, "2", { value: "3", text: "3 " }, "4", "5", { value: "6", text: "6 - Always" } ], rows: [ { value: "Q1", text: "Q1. Did you ever feel like you spun too many times in a round because there was an option on the wheel that you really wanted to get?" }, { value: "Q2", text: "Q2. Did you ever feel like you continued spinning the wheel just because you had spun the wheel already this round, rather than because you really thought this was the right thing to do?" }, { value: "Q3", text: "Q3. Did you ever feel like you spun too many times in a round because you did not take enough into account how expensive it was to spin?" }, { value: "Q4", text: "Q4. Did you ever avoid starting spinning the wheel in the first place in a round because you were  worried that you might end up spinning it too many times?" } ] } ] } ] }
  tSet.questionnaire.minTime=000; // in msec
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// CODE TO RUN SURVEYS
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//style the page, run the survey and wait for participant to press complete
function runQuestionnaires() {
  // start timer when questionnaire starts so we can check that they do them carefully enough
  tSet.questionnaire.startTime=new Date().getTime(); // record start time of questionnaire

  document.getElementById("exitNow").style.marginLeft = "30%";
  Survey.Survey.cssType = "bootstrap"; //installed bootstrap with node package manager
  var survey = new Survey.Model(surveyJSON); //converts JSON code above into survey format
  $("#surveyContainer").Survey({model: survey, onComplete:function(){
    if (surveyType===2){
      evalIntroQuestions(survey)
    }
    else{
      //if (settings.datatype=="Internet"){
        testForCompleteness(survey)
      //} else{
      //logSurveyData(survey)}
    }
  }})

  // switch to questionnaire style sheet
  selectStylesheet('styleSheetQuestionnaire');

  document.getElementById("surveyContainer").display = "block";
  for (var i = 0; i < document.getElementById("surveyContainer").getElementsByTagName("div").length; i++) {
    document.getElementById("surveyContainer").getElementsByTagName("div")[i].style.display = "block";
  }
}

//check whether all questions have been answered - if not, show page to ask them whether to continue - only need this for internet sample

function testForCompleteness(survey) {
  // Store the time it took to complete the survey
  var surveyName; // name of the survey
  var submitTime=(new Date().getTime() - tSet.questionnaire.startTime);
  surveyName= (exptTimeLine[runThrough].toRun[0].toString().match(/^function\s*([^\s(]+)/) || []) [1];
  if (data.questionnaireDurations.length==0){ // if this is the first questionnaire
    data.questionnaireDurations[0]={}
    data.questionnaireDurations[0][surveyName]=[submitTime]
  } else if (Object.keys(data.questionnaireDurations[data.questionnaireDurations.length-1])[0] == surveyName){ // if this is still the same questionnaire
    data.questionnaireDurations[data.questionnaireDurations.length-1][surveyName].push(submitTime)
  } else{ //if it's a new questionnaire
    data.questionnaireDurations[data.questionnaireDurations.length]={}
    data.questionnaireDurations[data.questionnaireDurations.length-1][surveyName]=[submitTime]// now again -1 as length has increased by 1
  }

    var submittedAnswers = (survey.data[surveyJSON.pages[0].elements[0].name] !== undefined) ? survey.data[surveyJSON.pages[0].elements[0].name] : survey.data;
    if (survey.data[surveyJSON.pages[0].elements[0].name] !== undefined && (Object.keys(survey.data).length !== 1)) {
        var answerKeys = Object.keys(survey.data);
        for (k = 1; k < answerKeys.length; k++)  {
            var currentAnswer = answerKeys[k];
            submittedAnswers[currentAnswer] = survey.data[currentAnswer];
        }
    } else if (surveyJSON.pages[0].elements[0].name=='Instructions'){
      submittedAnswers=[]
        var answerKeys = Object.keys(survey.data);
        for (k = 0; k < answerKeys.length; k++)  {
          var answerKeys2 = Object.keys( survey.data[answerKeys[k]])
          for (j=0;j <answerKeys2.length;j++){
            currentAnswer=survey.data[answerKeys[k]][answerKeys2[j]]
            submittedAnswers[answerKeys2[j]]= currentAnswer;
          }
        }
    }

    var columns = (surveyJSON.pages[0].elements[0].columns !== undefined) ? surveyJSON.pages[0].elements[0].columns : surveyJSON.pages[0].elements[1].choices,
        allSurveyQuestions = (surveyJSON.pages[0].elements[0].rows !== undefined) ? JSON.parse(JSON.stringify(surveyJSON.pages[0].elements[0].rows)) : JSON.parse(JSON.stringify(surveyJSON.pages[0].elements)), //JSON parsing saves the data instead of the reference, so the original array remains unchanged
        origNumberofElements = surveyJSON.pages[0].elements.length; //for the code below - we want to add questions but can't keep re-evaluating the length of the survey because it will lengthen

        //sometimes questionnaires are made up of multiple question matrices - see Liebowitz Social Anxiety Scale
        if (surveyJSON.pages[0].elements.length > 1 && (surveyJSON.pages[0].elements[0].rows !== undefined)) {
                for (fq = 1; fq < origNumberofElements; fq++) {    //for each additional matrix of questions
                    if (surveyJSON.pages[0].elements[fq].name[0] !== "Q") {  //if there are multiple questions in this element
                        for (mq = 0; mq < surveyJSON.pages[0].elements[fq].rows.length; mq++) {
                            allSurveyQuestions[allSurveyQuestions.length] = surveyJSON.pages[0].elements[fq].rows[mq];
                        }
                    } else {    //if there is only one question in this element, add its name
                        allSurveyQuestions[allSurveyQuestions.length] = {};
                        allSurveyQuestions[allSurveyQuestions.length-1].value = "Q" + (allSurveyQuestions.length).toString();
                    }
                }
        } else if (surveyJSON.pages[0].elements.length > 1){ // sometimes (e.g. for check question there are several questions per page, but no issue with rows)
          allSurveyQuestions=[]
          for (fq = 1; fq < origNumberofElements; fq++) {    //for each additional matrix of questions
            if (surveyJSON.pages[0].elements[fq].name[0] !== "Q") {  //if there are multiple questions in this element
                for (mq = 0; mq < surveyJSON.pages[0].elements[fq].rows.length; mq++) {
                    allSurveyQuestions[allSurveyQuestions.length] = surveyJSON.pages[0].elements[fq].rows[mq];
                }
            } else {    //if there is only one question in this element, add its name
                allSurveyQuestions[allSurveyQuestions.length] = {};
                allSurveyQuestions[allSurveyQuestions.length-1].value = "Q" + (allSurveyQuestions.length).toString();
            }
          }
        }

        // Special code for STICSA - both the survey template & the submitted answers need to be expanded
        if (surveyJSON.pages[0].elements[0].name=="STICSA") {
            //Reformat questions form
            for (sc=21; sc < 42; sc++) { // double the array for survey template
                allSurveyQuestions.splice(sc, 0, allSurveyQuestions[sc-21]);
            }
            allSurveyQuestions = JSON.parse(JSON.stringify(allSurveyQuestions)); //remove annoying javascript array referencing
            for (lb=0; lb < allSurveyQuestions.length-1; lb++) {
                allSurveyQuestions[lb].value = (lb < 21) ? allSurveyQuestions[lb].value+"a" : allSurveyQuestions[lb].value+"b";
            }

            //Reformat answers
            tempSTICSA = submittedAnswers;
            submittedAnswers = [];
            for (rq=1; rq <= Object.keys(tempSTICSA).length; rq++) { //separate submitted questions
                ind_key = Object.keys(tempSTICSA)[rq-1];
                if (ind_key!="Q22") {if (tempSTICSA[ind_key]["Column 1"] !== undefined) {submittedAnswers[ind_key+"a"] = tempSTICSA[ind_key]["Column 1"];}}
            }
            for (rq=1; rq <= Object.keys(tempSTICSA).length; rq++) { //separate submitted questions
                ind_key = Object.keys(tempSTICSA)[rq-1];
                if (ind_key!="Q22") {
                    if (tempSTICSA[ind_key]["Column 2"] !== undefined) {submittedAnswers[ind_key+"b"] = tempSTICSA[ind_key]["Column 2"];}
                } else {
                    submittedAnswers[ind_key] = tempSTICSA[ind_key];
                }
            }
        }


        // Order of checks: too quick > not all completed > completely empty

        //check if the participant has filled out at least one question
        //check if any responses are missing
        if (submitTime < tSet.questionnaire.minTime){
          confirmContinue(survey,0,false,true); //confirmContinue(survey, unansweredQs, isBlank,timeIssue)
        } else if (Object.keys(survey.data).length !== 0) {

          // For the new questionnaire format: need to not count the 'Instructions'
          //if (allSurveyQuestions[0].name=='Instructions'){
          //  numQuestions=allSurveyQuestions.length-1
          //} else{
          //  numQuestions=allSurveyQuestions.length
        //  }
          //console.log(numQuestions)

          //&& qLabel!=='Instructions'
          //if (allSurveyQuestions.length > Object.keys(submittedAnswers).length) { //numQsAnswered > Object.keys(submittedAnswers).length
          if (allSurveyQuestions.length > Object.keys(submittedAnswers).length) {
            //log which questions are missing answers
            var unansweredQs = "",
            qLabel = "",    //question label from questionnaire form
            rLabel = "";    //label from response submitted by participant
            for (aq = 0; aq<allSurveyQuestions.length; aq++) { //go through each question that's supposed to be in the questionnaire
              //first define which label we want to search for (different questionnaires keep them in different formats)
              if (allSurveyQuestions[aq].value !== undefined) {
                qLabel = allSurveyQuestions[aq].value;
              } else {
                if (allSurveyQuestions[aq].type === "panel") {
                  qLabel = allSurveyQuestions[aq].elements[0].name;    //go inside the panel and grab the label of the question within it
                } else {
                  qLabel = allSurveyQuestions[aq].name;
                }
              }

              //next check this label against all responses submitted by the participant
              for (sq = 0; sq < Object.keys(submittedAnswers).length+1; sq++) {
                rLabel = Object.keys(submittedAnswers)[sq];

                if (qLabel !== rLabel) {   //if question in survey form doesn't match label of submitted question. (sq = submitted questions, aq = all questions), added 'instructions' to take into account new questionnaire format
                  if (sq === Object.keys(submittedAnswers).length) {  //if we've run out of answers to check

                    //if label is not in the array of answers submitted by the participant, add it to the list of unanswered questions
                    if (unansweredQs.length === 0) {(unansweredQs += qLabel);} else {(unansweredQs += ", " + qLabel);} //add question label to unanswered questions array
                  }
                } else {    //if question in survey form matches label for submitted answer
                  break; //go on to next question
                }
              }
            }

            confirmContinue(survey, unansweredQs, false,false); //confirmContinue(survey, unansweredQs, isBlank,timeIssue)
          } else{logSurveyData(survey); }
        } else {
          //if survey is blank
          confirmContinue(survey, unansweredQs, true,false);
        }

}


function logSurveyData(survey) {
  var resultAsString = JSON.stringify(survey.data);
  // in all browsers other than internet explorer, we can store the survey using this code:
  // data.questions.push({[exptTimeLine[runThrough].toRun[0].name] : survey.data});  //log answers to all questions

  // however, for internet explorer (as it does not use the latest technology), we have to code (this also works in other browsers):
  var surveyName; // name of the survey
  surveyName= (exptTimeLine[runThrough].toRun[0].toString().match(/^function\s*([^\s(]+)/) || []) [1];
  data.questions[data.questions.length]={};
  data.questions[data.questions.length-1][surveyName]=survey.data;
        //document.getElementById("styleSheetInUse").href = "/study_assets/foraging/Foraging.css";    //change style sheet back to original
        //document.getElementById("styleSheet2").href = "/study_assets/foraging/odometer-theme-car.css";
        $("#styleSheetInUse").attr("href","Foraging.css"); //document.getElementById("styleSheetInUse").href = "/study_assets/foraging/Foraging.css";
        $("#styleSheet2").attr("href","odometer-theme-car.css"); //   document.getElementById("styleSheet2").href = "/study_assets/foraging/odometer-theme-car.css"; //restore original css
        document.getElementById("exitNow").style.marginLeft = "0%";
        proceedInExpt();
        }

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Alert screens (if participants haven't completed all questions on questionnaire)
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

function confirmContinue(survey, unansweredQs, isBlank,timeIssue) {
if (!isBlank & !timeIssue) { //Case 1: there's no time issue, they just forgot some questions
  document.getElementById("dialog-confirm").innerHTML = "<br><br><br>Answers are missing from the following questions:\n\n" + unansweredQs + "<br><br>"
  + "<button type=\"button\" id=\"confirmButton1\"  class=\"allButtons\" style=\"margin:auto;\" onclick=\"closeDialog_return();\">Return to questions</button><br><br>"
  + "<button type=\"button\" id=\"confirmButton2\"  class=\"allButtons\" style=\"margin:auto;\" onclick=\"closeDialog_continue();\">Continue without answering</button><br><br>";
} else if (isBlank) { //Case 2: Regardless of time, they submitted a blank questionnaire
  document.getElementById("dialog-confirm").innerHTML = "<br><br><br>You have left the questionnaire blank. Would you like to continue the experiment?<br><br>"
  + "<button type=\"button\" id=\"confirmButton1\"  class=\"allButtons\" style=\"margin:auto;\" onclick=\"closeDialog_return();\">Return to questions</button><br><br>"
  + "<button type=\"button\" id=\"confirmButton2\"  class=\"allButtons\" style=\"margin:auto;\" onclick=\"closeDialog_continue();\">Continue without answering</button><br><br>";
} else if (timeIssue & (!isBlank)) { //Case 3: Some questions submitted, but time was too short
  document.getElementById("dialog-confirm").innerHTML = "<br><br><br>You seem to have completed the questionnaire much faster than expected. Would you like to check your answers again?<br>"
  + "<button type=\"button\" id=\"confirmButton1\"  class=\"allButtons\" style=\"margin:auto;\" onclick=\"closeDialog_return();\">Return to questions</button><br><br>"
  + "<button type=\"button\" id=\"confirmButton2\"  class=\"allButtons\" style=\"margin:auto;\" onclick=\"closeDialog_continue();\">Continue anyway</button><br><br>";
}

// to run without popups (as this caused problems on some browsers):
tSet.survey = survey; //save survey data into temporary field so the html can access it
survey.isCompleted = false;
selectStylesheet(['styleSheetGame','styleSheetOdometer']);
$("#surveyContainer").hide();
$("#dialog-confirm").show();

}

//for the information questions at the beginning, don't allow participants to continue if they haven't completed all questions
function evalIntroQuestions(survey) {
  if (surveyType === 2) {
    if (settings.datatype=="Internet"){
      var qNIntro=8
    } else{
      var qNIntro=2
    }
    if (Object.keys(survey.data).length < qNIntro) { // as many questions as we have in the survey
      //if not all questions are completed
      survey.isCompleted = false;
      selectStylesheet(['styleSheetGame','styleSheetSlider']);
      $("#surveyContainer").hide();
      $("#dialog-confirm-intro").show();
} else {
  surveyType = 1;
  logSurveyData(survey);
}
}
}




// If we notify the participant e.g. they've missed questions on a questionnaire, this function closes that dialog div
function closeDialog_return() { //returns to the questionnaire to fill out more questions

    selectStylesheet('styleSheetQuestionnaire');
    $("#dialog-confirm").hide();
    $("#dialog-confirm-intro").hide();
    $("#surveyContainer").show();
}

function closeDialog_continue() {
    $("#dialog-confirm").hide();
    $("#dialog-confirm-intro").hide();
    logSurveyData(tSet.survey);
}
