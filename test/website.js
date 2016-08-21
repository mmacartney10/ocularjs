var express = require('express');
var website = express();
var http = require('http').Server(website);
var path = require('path');

website.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

website.use(express.static('test/_client'));

http.listen(7000, function () {
  console.log('Listening on port 7000');
});

module.exports = website;
