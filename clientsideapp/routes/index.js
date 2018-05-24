var express = require('express');
var router = express.Router();
const request = require('request');
var https = require("https");
var url = require('url');

/**
 * Renders a GET request to the main page.
 */
router.get('/', function(req, resp, next) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  resp.render(
    'index',
    {
      title: 'C1 Translate App',
      //data: results
    }
  );
});

// router.get('/login', function(req, resp, next) {
//   var url_parts = url.parse(req.url, true);
//   var query = url_parts.query;

//   resp.render(
//     'login',
//     {
//       title: 'C1 Translate App',
//       //data: results
//     }
//   );
// });

module.exports = router;
