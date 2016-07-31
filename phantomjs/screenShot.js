var page = require('webpage').create();
var fs = require('fs');
var colors = require('colors');

var currentViewport;
var currentSelector;

var path = '';
var referenceFolder = 'reference/';
var testFolder = 'test/';

var args = require('system').args;
var isReference = args[1] === 'test' ? false : true;
var data = JSON.parse(args[2]);

var viewportName = args[3];
var viewports = args[4];

function openPage () {
  page.open(data.pageUrl, function (status) {
    if(status !== 'success') return;

    checkIfIsReference();
    loopThroughEachBreakpoint();

    phantom.exit();
  });
}

function loopThroughEachBreakpoint () {

  currentViewport = viewportName;
  var viewportsArray = viewports.split(',');

  setViewPortSize(viewportsArray);
  loopThroughEachComponent();
}

function checkIfIsReference () {
  path = data.screenShotsPath + testFolder;

  if (isReference) {
    path = data.screenShotsPath + referenceFolder;
  }
}

function setViewPortSize (viewportDimensions) {
  page.viewportSize = {
    width: viewportDimensions[0],
    height: viewportDimensions[1]
  };
}

function loopThroughEachComponent () {
  for (var selector in data.selectorList) {
    currentSelector = selector;
    handleEachComponent();
  }
}

function handleEachComponent () {
  var base64Path = getBase64Path();

  // if (fs.exists(base64Path)) {
  //   if (compareBase64(base64Path)) {
  //     logImageComparisonMessage(true);
  //     return;
  //   }
  // }

  if (checkIfComponentExists(data.selectorList[currentSelector]) === false) {
    console.log(screenShotName().red + ' does not exist'.red);
    return;
  }

  clipPageToComponent(data.selectorList[currentSelector]);
  screenshotElement();
  handleBase64();
}

function checkIfComponentExists (selector) {
  return page.evaluate (function (selector) {
    if (document.querySelectorAll(selector)[0] === undefined) return false;
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

  var referenceMessage = 'screenshot - ' + screenShotName();
  console.log(referenceMessage.yellow);
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
  if (base64ReferencePath === false) return;

  var base64Reference = fs.read(base64ReferencePath);

  if (base64Reference === getBase64Image()) return true;
  return false;
}

function screenShotName () {
  return currentViewport + '--component-' + currentSelector;
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
    console.log('There is no reference image for '.red + currentSelector.red);
    return false;
  }

  return base64ReferencePath;
}

function logImageComparisonMessage (imagesAreTheSame) {
  var passedMessage = 'Passed - ' + screenShotName();
  var failedMessage = 'Failed - ' + screenShotName();

  if (imagesAreTheSame) {
    console.log(passedMessage.green);
    return;
  }

  console.log(passedMessage.red);
}

openPage();
