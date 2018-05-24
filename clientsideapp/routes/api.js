var express = require('express');
var router = express.Router();
const request = require('request');
var https = require("https");
var url = require('url');

/**
 * Sends the audio data to the server.
 */
router.post('/send-data', function(req, resp, next) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  

  resp.send();
});

module.exports = router;
