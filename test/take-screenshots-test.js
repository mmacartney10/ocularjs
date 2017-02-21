var expect = require('chai').expect;

var phantomjs = require('phantomjs');
var spawn = require('child_process').spawn

function runChildProcess(childArguments) {
  return new Promise(function(resolve, reject) {

    var child = spawn(phantomjs.path, childArguments);

    child.stdout.on('data', (data) => {
      console.log('stdout', `${data}`);
      resolve(`${data}`);
    });

    child.stderr.on('data', (error) => {
      console.log('stderr', `${error}`);
      reject(`${error}`);
    });

    child.on('exit', (code) => {
      console.log('exit', `${code}`);
      resolve(`${code}`);
    });
  });
}

var testData = require('./test-site/test-data.json');



var filePath = __dirname + '/../app-new/take-screenshots.js';
var cliAnswer = 'reference';

var pageUrl = testData.pageUrl;
var selectorList = '{"containerOne":"[data-container-one]"}';

var viewportName = 'smallScreen';
var viewportDimensions = [320, 480];
var currentDirectory = '../' + __dirname;

var childArgs = [
  filePath,
  cliAnswer,
  pageUrl,
  selectorList,
  viewportName,
  viewportDimensions,
  currentDirectory
];





describe('when the take screenshot process is ran', function() {

  describe('And there is one component on one breakpoint', function() {
    it('Should return a screenshot name with the breakpoint name and the component name', function() {
      return runChildProcess(childArgs).then(function(data) {
        expect(data).to.equal('smallScreen--containerOne\n');
      });
    });
  });
});
