var page = require('webpage').create();
var pageUrl = 'http://localhost:7000/';

var system = require('system');
var args = system.args;

var isReference = args[1];
var viewports = args[2];
var data = args[3];

var dataAsObj = JSON.parse(data);

function openPage () {
  page.open(pageUrl, function (status) {
    console.log('status:', status);
    if(status !== 'success') return;

    console.log(dataAsObj.pageUrl);

    setViewPortSize();
    console.log('width: ', page.viewportSize.width);
    console.log('height: ', page.viewportSize.height);
    phantom.exit();
  });
}

function setViewPortSize () {
  var viewportsArr = viewports.split(',');

  page.viewportSize = {
    width: viewportsArr[0],
    height: viewportsArr[1]
  };
}

openPage();
