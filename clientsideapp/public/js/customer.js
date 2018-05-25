var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
var recognition = new SpeechRecognition();

var outputPara = document.querySelector('#output');
var startBtn = $('#microphone');
var callStatus = document.querySelector('#call-status');

var callTimer = document.querySelector('#callTimer');

var seconds = 0, minutes = 0, hours = 0, t;

var recurse = false;
var isTranscribing = false;
var transcript = '';
var sentimentCount = 0;
var sentimentVal = 0;
var avgSentiment = 0;

var lang = document.getElementById("langSelect");

function updateText(text) {
  document.getElementsByClassName("phrase")[0].innerHTML = text;
}

function updateLang() {
    document.getElementById("customer-language").innerHTML = ' - ' + lang.options[lang.selectedIndex].text;
}

function testSpeech() {
  $('#microphone').find('i').addClass('fa-phone-slash');
  $('#microphone').find('i').removeClass('fa-phone');
//   startBtn.textContent = 'Test in progress';
/* Start timer */
callTimer.textContent = "00:00:00";
seconds = 0; minutes = 0; hours = 0;

  var language = document.getElementById("langSelect").value;

  var speechRecognitionList = new SpeechGrammarList();



  recognition.grammars = speechRecognitionList;
  recognition.lang = language;
  recognition.interimResults = true;
  recognition.maxAlternatives = 0;

  recognition.start();
  var speechResult = [];
  var increment = -1;

  recognition.onresult = function() {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object
    speechResult.push(event.results[0][0].transcript);
    increment = increment + 1;
    outputPara.textContent = transcript + ' ' + speechResult[increment];

  }

  recognition.onspeechend = function() {

    recognition.stop();
    // startBtn.textContent = 'Start new test';


}

    recognition.onspeechend = function () {
        recognition.stop();
        // startBtn.textContent = 'Start new test';

    }

    recognition.onerror = function (event) {
        // startBtn.textContent = 'Start new test';
        // outputPara.textContent = 'Call Timed Out:' + event.error;
    }

  recognition.onaudiostart = function(event) {
      //Fired when the user agent has started to capture audio.
      console.log('SpeechRecognition.onaudiostart');
  }

  recognition.onaudioend = function(event) {
      //Fired when the user agent has finished capturing audio.
      console.log('SpeechRecognition.onaudioend');
  }

  recognition.onend = function(event) {
      var transcript = outputPara.textContent + '. ';
      $.ajax({
          url: 'http://104.236.71.248:8000/submitSpeech',
          type: 'POST',
          data: {
            text: transcript,
            to_language: language
          },
      }).done(function(resp) {
          console.log(resp);
          sentiment = resp.sentiment;
          sentimentVal = sentiment + sentimentVal;
          sentimentCount = sentimentCount + 1;
          console.log(sentimentVal);
          console.log(sentimentCount);
          avgSentiment = sentimentVal/sentimentCount;

      });
      if(recurse){
      testSpeech();
        }
      console.log('SpeechRecognition.onend');
  }

  recognition.onnomatch = function(event) {
      //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
      console.log('SpeechRecognition.onnomatch');
  }

  recognition.onsoundstart = function(event) {
      //Fired when any sound � recognisable speech or not � has been detected.
      console.log('SpeechRecognition.onsoundstart');
  }

  recognition.onsoundend = function(event) {
      //Fired when any sound � recognisable speech or not � has stopped being detected.
      console.log('SpeechRecognition.onsoundend');
  }

  recognition.onspeechstart = function (event) {
      //Fired when sound that is recognised by the speech recognition service as speech has been detected.
      console.log('SpeechRecognition.onspeechstart');
  }
  recognition.onstart = function(event) {
      //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
      console.log('SpeechRecognition.onstart');
  }
}

function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }

    callTimer.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    timer();
}

function timer() {
    t = setTimeout(add, 1000);
}

$(startBtn).click(function() {
    console.log('clicked');
    recurse = !recurse;
    console.log(recurse);
    if(!recurse){

        recognition.stop();


    }
    if(recurse){
        callStatus.innerHTML = "End Call";
        startBtn.css("background-color", "red");
    }

    else {
        $('#microphone').find('i').addClass('fa-phone');
        $('#microphone').find('i').removeClass('fa-phone-slash');
        callStatus.innerHTML = "Start Call";
        startBtn.css("background-color", "#1f9c25");


    }
    testSpeech();
    timer();




});
