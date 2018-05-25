var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var outputPara = document.querySelector('#output');
var startBtn = $('#microphone');
var callStatus = document.querySelector('#call-status');
var recurse = true;
var isTranscribing = false;
var transcript = '';

var lang = document.getElementById("langSelect");

function updateText(text) {
  document.getElementsByClassName("phrase")[0].innerHTML = text;
}

function updateLang(){
  document.getElementById("customer-language").innerHTML = ' - ' + lang.options[lang.selectedIndex].text;
}

function testSpeech() {
  startBtn.prop('disabled', true);
  callStatus.innerHTML = "End Call";
  startBtn.css("background-color", "red");
  $('#microphone').find('i').addClass('fa-phone-slash');
  $('#microphone').find('i').removeClass('fa-phone');
//   startBtn.textContent = 'Test in progress';
  var language = document.getElementById("langSelect").value;
  var recognition = new SpeechRecognition();
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
    startBtn.disabled = false;
    // startBtn.textContent = 'Start new test';
    startBtn.onclick = function(){
        $('#microphone').find('i').addClass('fa-phone');
        $('#microphone').find('i').removeClass('fa-phone-slash');
        recurse = false;
        callStatus.innerHTML = "Start Call";
        startBtn.style.backgroundColor = "green";
        console.log("Finally it stopped!");
        startBtn.disabled = true;
    }

    if (recurse) {
        testSpeech();
    }
}

  recognition.onerror = function(event) {
    startBtn.disabled = false;
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
        //alert(this.response);
      });
      //Fired when the speech recognition service has disconnected.
      /*transcript = outputPara.textContent + '. ';
      var xhr=new XMLHttpRequest();
      xhr.open('post',"http://http://104.236.71.248:8000/startSpeech",true);
      //xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");<--don't do this
      var formData=new FormData();
      formData.append('info',transcript);    // makes no difference
      xhr.send(formData);
      xhr.onload=function() {
          alert(this.response);
      };*/

      
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

$(startBtn).click(function() {
    console.log('clicked');
    if (isTranscribing) {
        isTranscribing = false;
        recognition.stop();
    } else {
        isTranscribing = true;
        testSpeech();
    }
});