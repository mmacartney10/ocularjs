var obj = {
  pageUrl: 'http://localhost:7000/',
  screenShotsPath: './screenshots/',
  viewports: {
    smallScreen: [320, 480],
    mediumScreen_landscape: [768, 1024],
    mediumScreen_portrait: [1024, 768],
    largeScreen : [1920, 1080]
  },
  selectorList: {
    containerOne: '[data-container-one]',
		containerTwo: '[data-container-two]',
		containerThree: '[data-container-three]',
		containerFour: '[data-container-four]',
		containerFive: '[data-container-five]',
		containerSix: '[data-container-six]',
		containerSeven: '[data-container-seven]',
		containerEight: '[data-container-eight]',
		containerNine: '[data-container-nine]',
		containerTen: '[data-container-ten]',
		containerEleven: '[data-container-eleven]',
		containerTwelve: '[data-container-twelve]',
		containerThirteen: '[data-container-thirteen]',
		containerFourteen: '[data-container-fourteen]',
		containerFifteen: '[data-container-fifteen]',
		containerSixteen: '[data-container-sixteen]',
		containerSeventeen: '[data-container-seventeen]',
		containerEighteen: '[data-container-eighteen]',
		containerNineteen: '[data-container-nineteen]',
		containerTwenty: '[data-container-twenty]'
  }
};

var page = require('webpage').create();
var fs = require('fs');
var colors = require('colors');

var isReference = false;
var path = '';

var currentViewport;
var currentSelector;

var referenceFolder = 'reference/';
var testFolder = 'test/';

function openPage () {
  page.open(obj.pageUrl, function (status) {
    if(status !== 'success') return;

    checkIfIsReference();
    loopThroughEachBreakpoint();

    phantom.exit();
  });
}

function loopThroughEachBreakpoint () {
  for (var viewport in obj.viewports) {
    currentViewport = viewport;

    setViewPortSize(obj.viewports[viewport]);
    loopThroughEachComponent();
  }
}

function checkIfIsReference () {
  path = obj.screenShotsPath + testFolder;

  if (isReference) {
    path = obj.screenShotsPath + referenceFolder;
  }
}

function setViewPortSize (viewportDimensions) {
  page.viewportSize = {
    width: viewportDimensions[0],
    height: viewportDimensions[1]
  };
}

function loopThroughEachComponent () {
  for (var selector in obj.selectorList) {
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

  if (checkIfComponentExists(obj.selectorList[currentSelector]) === false) {
    console.log(screenShotName().red + ' does not exist'.red);
    return;
  }

  clipPageToComponent(obj.selectorList[currentSelector]);
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

  var passedMessage = 'Passed - ' + screenShotName();
  var failedMessage = 'Failed - ' + screenShotName();

  if (base64Reference === getBase64Image()) {
    return true;
  }

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
