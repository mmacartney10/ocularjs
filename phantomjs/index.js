#!/usr/bin/env node

var userArguments = process.argv.slice(2);

if (userArguments.length > 1) {
  throw new Error('Only one argument may be specified');
}

var path = require('path');
var phantomjs = require('phantomjs');
var spawn = require('child_process').spawn;

var data = require('../data.json');
var dataAsString = JSON.stringify(data);

var file = 'screenShot.js';
// var file = 'test.js';

function generate () {

  for (var viewport in data.viewports) {
    callScreenShot('screenShot.js', viewport, data.viewports[viewport]);
  }

  // delete data.viewports;
  // console.log(data);

}

function callScreenShot (fileName, viewportName, viewports) {

  if (viewportName === undefined || viewports === undefined) {
    throw new Error('Viewport not specified');
  }

  var childArgs = [
    path.join(__dirname, fileName),
    userArguments,
    dataAsString,
    viewportName,
    viewports
  ];

  var child = spawn(phantomjs.path, childArgs);

  child.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  child.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  child.on('close', function (code) {
    console.log('child process exited with code ' + code);
  });
}

generate();
