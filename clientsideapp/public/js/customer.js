var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var outputPara = document.querySelector('#output');

var startBtn = document.querySelector('#start-button');

var recurse = true;

var transcript = '';

function updateText(text) {
  document.getElementsByClassName("phrase")[0].innerHTML = text;
}

function testSpeech() {
  startBtn.disabled = true;
  startBtn.textContent = 'Test in progress';
  var language = document.getElementById("langSelect").value;
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();

  recognition.grammars = speechRecognitionList;
  recognition.lang = language;
  console.log(language);
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

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
    outputPara.textContent = transcript + ' ' + speechResult[increment] + ' ';
    console.log(speechResult);
  }
  recognition.onspeechend = function() {
    outputPara.textContent = speechResult + ' ' + outputPara.textContent + ' ';
    recognition.stop();
    startBtn.disabled = false;
    startBtn.textContent = 'Start new test';
    startBtn.onclick = function(){
        recurse = false;
        console.log("Finally it stopped!");
        startBtn.disabled = true;
    }
    if(recurse){
        testSpeech();
    }

}

  recognition.onerror = function(event) {
    startBtn.disabled = false;
    startBtn.textContent = 'Start new test';
    outputPara.textContent = 'Call Timed Out:' + event.error;
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
      //Fired when the speech recognition service has disconnected.
      transcript = outputPara.textContent + '. ';
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

startBtn.addEventListener('click', testSpeech);
