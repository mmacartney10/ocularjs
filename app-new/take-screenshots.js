var page = require('webpage').create();
var fs = require('fs');
var currentSelector;

var path = '';
var referenceFolder = 'reference/';
var testFolder = 'test/';

var pngExtension = '.png';

var args = require('system').args;
var isReference = args[1] === 'Reference' ? true : false;
var pageUrl = args[2];
var selectorList = JSON.parse(args[3]);
var viewportName = args[4];
var viewports = args[5];
var currentDirectory = args[6] === '' ? false : args[6] + '/ocular/screenshots/';

var error = {
  'error': false,
  'message': ''
};

var errorMessages = {
  'pageCannotBeOpened': 'The url cannot be opened',
  'noScreenShotpath' : 'The screenshot path cannot be created',
  'viewportParametersIncorrect' : 'The viewport perameters are incorrect',
  'noSelectorsPassed': 'No selectors have been passed',
  'selectorDoesnotExist': 'The selector containerNone does not exist'
}

function logErrorMessage() {
  console.log(error.message);
  phantom.exit();
}

function openPage () {
  page.open(pageUrl, function (status) {
    if(status !== 'success') {
      error.error = true;
      error.message = errorMessages.pageCannotBeOpened;

      logErrorMessage();
      return;
    }

    setScreenShotPath();

    if (error.error) {
      return logErrorMessage();
    }

    setViewPortSize();

    if (error.error) {
      return logErrorMessage();
    }

    loopThroughEachComponent();

    if (error.error) {
      return logErrorMessage();
    }

    phantom.exit();
  });
}

function setScreenShotPath() {

  if (currentDirectory === false) {
    error.error = true;
    error.message = errorMessages.noScreenShotpath;
    return;
  };

  path = currentDirectory;
  path += isReference ? referenceFolder : testFolder;
}

function setViewPortSize () {
  var viewportsArray = viewports.split(',');

  if (viewportsArray.length < 2) {
    error.error = true;
    error.message = errorMessages.viewportParametersIncorrect;
    return;
  }

  page.viewportSize = {
    width: viewportsArray[0],
    height: viewportsArray[1]
  };
}

function loopThroughEachComponent () {
  if (Object.keys(selectorList).length === 0) {
    error.error = true;
    error.message = errorMessages.noSelectorsPassed;
    return;
  }

  for (var selector in selectorList) {
    currentSelector = selector;
    handleEachComponent();
  }
}

function handleEachComponent () {
  var selector = selectorList[currentSelector];

  var testest = doesSelectorExist(selector);

  // console.log('doesSelectorExist', testest);

  if (testest === false) {
    error.error = true;
    error.message = errorMessages.selectorDoesnotExist;
    logErrorMessage();
    return;
  }

  clipPageToComponent(selector);
  // screenshotElement();
  logReferenceMessage();
  // handleBase64();
}

function doesSelectorExist(selector) {
  var selectorLength = page.evaluate(function(selector) {
    return document.querySelectorAll(selector).length;
  }, selector);

  // console.log('selectorLength', selectorLength);

  if (selectorLength === 0) {
    return false;
  }

  return true;
}

function clipPageToComponent (selector) {
  page.clipRect = page.evaluate (function (selector) {
    return document.querySelectorAll(selector)[0].getBoundingClientRect();
  }, selector);
}

function screenshotElement () {
  var imageScreenShotPath = path + screenShotName() + pngExtensions;
  page.render(imageScreenShotPath);
}

function logReferenceMessage () {
  console.log(screenShotName());
}

function handleBase64 () {
  var base64Path = getBase64Path();
  writeBase64(base64Path);
}

function writeBase64 (base64Path) {
  fs.write(base64Path, getBase64Image(), 'w');
}

function screenShotName () {
  return viewportName + '--' + currentSelector;
}

function getBase64Image () {
  return page.renderBase64('PNG');
}

function getBase64Path () {
  return path + screenShotName() + '.txt';
}

openPage();
