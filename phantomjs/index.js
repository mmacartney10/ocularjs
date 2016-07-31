#!/usr/bin/env node

var userArguments = process.argv.slice(2);

if (userArguments.length > 1) {
  throw new Error('Only one argument may be specified');
}

var path = require('path');
var phantomjs = require('phantomjs');
var spawn = require('child_process').spawn;

var watch = require('node-watch');

var data = require('../data.json');
var dataAsString = JSON.stringify(data);

var fileName = 'screenShot.js';
var filePath = path.join(__dirname, fileName);

var summary = {
  passed: 0,
  failed: 0
};

var viewportLength = Object.keys(data.viewports).length;
var currentViewportIndex = 0;

function generate (userArguments) {
  userArguments = userArguments;
  checkIfViewportsAreDefined();
  loopThroughEachViewport();
}

function checkIfViewportsAreDefined () {
  if (viewportLength === 0) {
    throw new Error('Viewport not specified');
  }
}

function loopThroughEachViewport () {
  for (var viewport in data.viewports) {
    callScreenShot(viewport, data.viewports[viewport]);
  }
}

function callScreenShot (viewportName, viewports) {

  var childArgs = [
    filePath,
    userArguments,
    dataAsString,
    viewportName,
    viewports
  ];

  var child = spawn(phantomjs.path, childArgs);

  child.stdout.on('data', function (data) {
    var output = data.toString('utf8');

    console.log(output);
    checkIfTestPassesOrFails(output);
  });

  child.on('close', function (code) {
    logSummaryOnLastInstance();
  });
}

function checkIfTestPassesOrFails (output) {
  if (output.indexOf('Passed') > 0) {
    summary.passed += 1;
  }

  if (output.indexOf('Failed') > 0) {
    summary.failed += 1;
  }
}

function logSummaryOnLastInstance () {
  currentViewportIndex += 1;

  if (currentViewportIndex === viewportLength) {
    console.log('Passed: ', summary.passed);
    console.log('Failed: ', summary.failed);
  }
}

generate();
