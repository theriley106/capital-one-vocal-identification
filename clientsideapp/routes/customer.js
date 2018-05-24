var express = require('express');
var router = express.Router();
const request = require('request');
var https = require("https");
var url = require('url');
var io = require('socket.io')(https);

//const record = require('node-record-lpcm16');

// Imports the Google Cloud client library
//const speech = require('@google-cloud/speech');

io.on('connection', function(socket){
  console.log('a user connected');
});

/**
 * Renders a GET request to the main page.
 */
router.get('/', function(req, resp, next) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  // Imports the Google Cloud client library
  /*const speech = require('@google-cloud/speech');
  const fs = require('fs');

  // Creates a client
  const client = new speech.SpeechClient();

  // The name of the audio file to transcribe
  const fileName = './resources/audio.raw';

  // Reads a local audio file and converts it to base64
  const file = fs.readFileSync(fileName);
  const audioBytes = file.toString('base64');

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: audioBytes,
  };
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file
  client
    .recognize(request)
    .then(data => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log(`Transcription: ${transcription}`);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });

  // Creates a client
  const client = new speech.SpeechClient();

  const encoding = 'LINEAR16';
  const sampleRateHertz = 16000;
  const languageCode = 'en-US';

  const request = {
    config: {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode,
    },
    interimResults: false, // If you want interim results, set this to true
  };

  // Create a recognize stream
  const recognizeStream = client
    .streamingRecognize(request)
    .on('error', console.error)
    .on('data', data =>
      process.stdout.write(
        data.results[0] && data.results[0].alternatives[0]
          ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
          : `\n\nReached transcription time limit, press Ctrl+C\n`
      )
    );

  // Start recording and send the microphone input to the Speech API
  record
    .start({
      sampleRateHertz: sampleRateHertz,
      threshold: 0,
      // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
      verbose: true,
      recordProgram: 'rec', // Try also "arecord" or "sox"
      silence: '10.0',
    })
    .on('error', console.error)
    .pipe(recognizeStream);

  console.log('Listening, press Ctrl+C to stop.');*/

  resp.render(
    'customer',
    {
      title: 'C1 Customer',
      //data: results
    }
  );
});

module.exports = router;