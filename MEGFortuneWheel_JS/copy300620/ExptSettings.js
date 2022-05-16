// List of general experimental settings that we might want to change
var settings = {
    datatype:"Internet", // set to "Internet" or "Local" - it changes what questionnaires and demographic data is collected and what happens in the end of the experiment
    task: 0, //0 for training, 1 for real task, if 0, then we do training before then doing real task - always choose this!
    forageWheelCnvs:[], // for making the 'lucky wheel' - content defined in ForagingFunctions>preloadSchedule
    forageWheelCtx:[],
    fullscreen: true,
    wheelColor: ["#009999"],//, "#00CCCC", "#00FFFF"],
    maxTrials:100,// this is mainly for piloting, if we want to do fewer trials then there are in the schedule
    colors: ['rgb(255,99,132)','rgb(224,85,114)','rgb(168,65,87)'],
    counterDelay:0,
    nextButtonTrialDelay: 1500, // delay betwenn when one trial is finished and when participants can move on to the next trial
    allowFirstRespDelay: [3000, 6000], // range of delays until participants can make a response
    pointer:{ // the little pointer that spins and shows participants what their new alternative is
        length:0.3,// percentage
        width: 10, //pixels
        speed: 0.01, // in radians per msec
        spinDuration: [300, 2000] // min and max duration of pointer spinning
    },
    instr:{
        maxCounter: 8 //how many slides in the instructions
    },
    mcq:{
        maxQ: 6 // questions in multiple choice questionnaire to assess task understanding
    },
    myPoints: [], // store the odometer
    myStyleSheets:document.styleSheets
};

// All labels for buttons etc. in one place
var stimuliLabels = {
    offer: "Current win: ",
    redraw: "Spin again",
    accept: "Bank win",
    cost: "Cost to spin: ",
    remaining:"Remaining spins: ",
    title: "Lucky wheel",
    nextTrial: "Next round"
};

// List of pictures for instructions screen
// other temporary counters used during the experiment - this is to allow us to store all global variables to which we want to write in one place
var tSet = {
    //currentSelectionSpeed: settings.selectionSpeeds[0] // time after which 'selection segment' jumps
    instr:{
        pics:[],
        texts:[],
        counter:0
    },
    task: settings.task,
    taskType:[], // spell the task out in words for better data record
    taskCounter:-1, // starts at -1 for the first training, then increases by one for subsequent training or real experiment
    currentChart: [], // ID for pie chart
    trialcounter: 0,
    startTimer: [],  // we use the timers to record the reaction time
    endTimer: [],
    availSearches: [], // how many searches can still be done on the current trial
    currentOffer:[], // what participant's current offer is
    pointerPosition: [], // random angle for the pointer to start spinning
    spinStart: [], // to set the time for how long the pointer should spin
    mcq:{
        curQ: 0,
        answers: [],
        pics: [],
        finishEnabled: 0,
        attemptCounter:0,
    },
    behavior:{}, // will be stored here temporarily so that we can re-use the same code for training and the actual experiment. we later copy this to the data structure
    behaviorLongFormat:{
      trainingOrTask:[],
      trial:[],
      choice:[],
      availableSearches:[],
      nSearchesDone:[],
      offer:[],
      cost:[],
      RT:[],
      initialLaterSearch:[],
      firstRespDelay:[],
      totalPoints:[],
      mag1:[],
      mag2:[],
      mag3:[],
      mag4:[],
      mag5:[],
      mag6:[],
      prob1:[],
      prob2:[],
      prob3:[],
      prob4:[],
      prob5:[],
      prob6:[],
    },
    // Questionnaires
    questionnaire:{
      startTime:[],
      minTime:[]},
};

// Initialize the data matrix for each subject to fill
var data = {
    dataType:settings.dataType, // internet or local
    consent: 0, // we check whether people have checked all the consent boxes and only allow them to do the task if they have
    questions: [], // answers to all the questionnaires
    schedID: [], // random schedule assigned to the participant
    participantID:[], // prolific or manually entered (local) participant ID
    sessionID:[],
    sched: [],   // store the schedule participants do
    storeBehav: [], // behaviour from tSet.behavior for training(s) and task will be stored here
    behaviorLongFormat:[],// behaviour from tSet.behaviorLongFormat - each response is a row
    mcqAnswers:[],
    pointCounter:0,  // store how many points they have won overall
    exptTimeLine: [], // in the end of the experiment store what their timeline was (so we can later see e.g. how often they had to do the training)
    exptDate:{ // to allow us to compute in Matlab how long participants took to do the task
        startExpt: new Date,
        endExpt:[], //with date command, enter new date in here
        experimentDuration:[],
        trainingDuration:[],
        numberMcqAttempts:[]
    },
    mcq:[], // record the answers for each attempt
    questionnaireDurations:[], // record the duration for each questionnaire
    unfocused: [], //entries represent the total time in ms that participant spent away from the experiment screen at one time. (entries under 1s omitted because they're probably due to  javascript alerts in script)
    bonusPayment: 0, //add: calculation of bonus payment based on total points minus the mandatory £/hr payment. recalculate after every trial because we want to display it if the participant chooses to leave the experiment early
    comments: [] // we have a box for participants to leave comments about the task
};

// function to make empty 2D arrays
function Array2D(x, y)
{
    var array2D = new Array(x);
    for(var i = 0; i < array2D.length; i++)
    {
        array2D[i] = new Array(y);
    }
    return array2D;
};

// specify duration of odometer (i.e. the point counter) - note that if you want to change this you also need to update the css sheet
window.odometerOptions= {
    duration:1000
};

// questions and answers for the multiple choice test to check understanding of the task
var MCQs = [
    {
        // Q0
        question: "In the beginning of each round, why are the buttons 'Spin again' and 'Bank Win' greyed out for up to 5s?",
        answers:{
          a: "The task is frozen",
          b: "There is a delay in the beginning of each round to give me time to think about what I want to do. The buttons will automatically become active after the delay.",
          c: "The experiment is over",
          d: "I don't know"
        },
        correctAnswer: 'b',
      },
      {
        // Q1
        question: "Where is the arrow most likely to land after a spin?",
        answers:{
            a: "A",
            b: "B",
            c: "C",
            d: "D",
            e: "E"
        },
        correctAnswer: 'c',
        detailedAnswer: "C covers the largest area on the wheel, so the arrow is most likely to land there."
    },
    {
        //Q2
        question: "Which of the following does <b> not</b> happen if you click on 'Spin again'?",
        answers:{
            a: "The 'current win' will be added to your total.",
            b: "Your total wil be decreased by the points shown as 'cost to spin' (here: 15 points).",
            c: "You will get a new 'current win' depending on where the arrow lands after spinning.",
            d: "The amount of 'remaining spins' will decrease by one."
        },
        correctAnswer: 'a',
        detailedAnswer: "The 'cost to spin' will be reduced from your points and the number of 'remaining spins' will decrease by one .\n\
        The arrow will then spin to a random new position. Where it lands will determine the new 'current win'."
    },
    {
        //Q3
        question:"Which of the following happens if you click on 'bank win'?",
        answers:{
            a: "Your total will be decreased by the points shown as 'cost to spin' (here: 15 points).",
            b: "The arrow will spin and you will get a new 'current win'.",
            c: "The 'current win' will be added to your total and you can move on to the next round.",
            d: "The number of 'remaining spins' will decrease by one."
        },
        correctAnswer:'c'

    },
    {
        //Q4
        question: " Why is the button 'Spin again' disabled (i.e. greyed out) in this example?",
        answers:{
            a: "The task is broken.",
            b: "You have run out of 'remaining spins' and your only option now is to bank the 'current win'",
            c: "The experiment is finished.",
            d: "I have run out of credit to pay to spin."
        },
        correctAnswer:'b'
    },
    {
        // Q5
        question: "What does 'cost to spin' mean?",
        answers:{
            a: "The points you will earn every time you spin.",
            b: "The points you will lose <b>every</b> time you spin.",
            c: "The points you lose the <b>first</b> time you spin in each round.",
            d: "Nothing, you should ignore it."
        },
        correctAnswer:'b'
    },
    {
        // Q6
        question: "What does 'remaining spins' mean?",
        answers:{
            a: "The remaining number of spins that will not cost anything this round.",
            b: "The points you will lose <b>every</b> time you spin.",
            c: "The number of times you can still spin the arrow <b>this round</b>.",
            d: "The number of time you can still spin the arrow in the <b>whole experiment</b>."
        },
        correctAnswer: 'c'
    }
];
// give the script a name to find it for debugging:
//# sourceURL=ExptSettings.js
