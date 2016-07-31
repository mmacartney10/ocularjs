var page = require('webpage').create();
var fs = require('fs');
var colors = require('colors');
var currentSelector;

var path = '';
var referenceFolder = 'reference/';
var testFolder = 'test/';

var messages = {
  doesNotExist: ' does not exist',
  passed: 'Passed - ',
  failed: 'Failed - ',
  noReference: 'There is no reference image for '
};

var args = require('system').args;
var isReference = args[1] === 'test' ? false : true;
var data = JSON.parse(args[2]);
var viewportName = args[3];
var viewports = args[4];

function openPage () {
  page.open(data.pageUrl, function (status) {
    if(status !== 'success') return;

    checkIfIsReference();
    setViewPortSize();
    loopThroughEachComponent();
    
    phantom.exit();
  });
}

function checkIfIsReference () {
  path = data.screenShotsPath;
  path += isReference ? referenceFolder : testFolder;
}

function setViewPortSize () {
  var viewportsArray = viewports.split(',');

  page.viewportSize = {
    width: viewportsArray[0],
    height: viewportsArray[1]
  };
}

function loopThroughEachComponent () {
  for (var selector in data.selectorList) {

    // checkIfComponentExists(data.selectorList[currentSelector]);

    currentSelector = selector;
    handleEachComponent();
  }
}

function handleEachComponent () {
  var base64Path = getBase64Path();

  clipPageToComponent(data.selectorList[currentSelector]);
  screenshotElement();
  handleBase64();
}


// TODO: Check if component is on page
function checkIfComponentExists (selector) {
  return page.evaluate (function (selector) {
    if (document.querySelectorAll(selector)[0] === undefined) {
      // throw new Error(screenShotName().red + messages.doesNotExist.red);
      return false;
    }
    return true;
  }, selector);
}

function clipPageToComponent (selector) {
  page.clipRect = page.evaluate (function (selector) {
    return document.querySelectorAll(selector)[0].getBoundingClientRect();
  }, selector);
}

function screenshotElement () {
  var imageScreenShotPath = path + screenShotName() + '.png';
  page.render(imageScreenShotPath);
  logReferenceMessage();
}

function logReferenceMessage () {
  if (isReference === false) return;
  console.log(screenShotName().yellow);
}

function handleBase64 () {
  var base64Path = getBase64Path();
  writeBase64(base64Path);

  if (isReference) return;

  var isTheSame = compareBase64(base64Path);
  logImageComparisonMessage(isTheSame);
}

function writeBase64 (base64Path) {
  fs.write(base64Path, getBase64Image(), 'w');
}

function compareBase64(base64Path) {
  if (isReference) return;

  var base64ReferencePath = getBase64ReferencePath(base64Path);
  var base64Reference = fs.read(base64ReferencePath);

  if (base64Reference === getBase64Image()) return true;
  return false;
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

function getBase64ReferencePath (base64Path) {
  var base64ReferencePath = base64Path.replace(testFolder, referenceFolder);
  if (!fs.exists(base64ReferencePath)) {
    throw new Error(messages.noReference.red + currentSelector.red);
  }

  return base64ReferencePath;
}

function logImageComparisonMessage (imagesAreTheSame) {
  var passedMessage = messages.passed + screenShotName();
  var failedMessage = messages.failed + screenShotName();

  if (imagesAreTheSame) {
    console.log(passedMessage.green);
    return;
  }

  console.log(passedMessage.red);
}

openPage();
