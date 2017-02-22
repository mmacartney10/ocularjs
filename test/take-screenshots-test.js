var expect = require('chai').expect;

var phantomjs = require('phantomjs');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

function runChildProcess(childArguments) {
  return new Promise(function(resolve, reject) {

    var child = spawn(phantomjs.path, childArguments);

    child.stdout.on('data', (data) => {
      // console.log('stdout', `${data}`);
      resolve(`${data}`);
    });

    child.stderr.on('data', (error) => {
      // console.log('stderr', `${error}`);
      reject(`${error}`);
    });

    child.on('exit', (code) => {
      // console.log('exit', `${code}`);
      resolve(`${code}`);
    });
  });
}



var testData = require('./ocular/test-data.json');
var filePath = __dirname + '/../app-new/take-screenshots.js';

var referenceCliAnswer = 'Reference';
var testCliAnswer = 'Test';

var cliAnswer = referenceCliAnswer;

var pageUrl = '';

var selectorList = '{"containerOne":"[data-container-one]"}';
var noSelectorList = '{"containerNone":"[data-container-none]"}';
var twoSelectorList = '{"containerOne":"[data-container-one]", "containerTwo":"[data-container-two]"}';
var viewportName = 'smallScreen';
var viewportDimensions = [320, 480];
var currentDirectory = '../' + __dirname;

function createChildArgs() {
  return [
    filePath,
    cliAnswer,
    pageUrl,
    selectorList,
    viewportName,
    viewportDimensions,
    currentDirectory
  ]
};






describe('when the take screenshot process is ran', function() {

  describe('And the url cannot be opened', function() {
    it('Should return an error saying the url cannot be opened', function() {
      var childArgs = createChildArgs();

      return runChildProcess(childArgs).then(function(data) {
        expect(data).to.equal('The url cannot be opened\n');
      });
    });
  });

  describe('And the test server has been started', function() {

    before(function() {
      pageUrl = `file://${__dirname}/test-site/index.html`;
    });

    beforeEach(function() {
      selectorList = '{"containerOne":"[data-container-one]"}';
      viewportName = 'smallScreen';
      viewportDimensions = [320, 480];
      currentDirectory = '../' + __dirname;
    });

    describe('And the current directory is empty', function() {

      beforeEach(function() {
        currentDirectory = '';
      });

      it('Should return an error saying the screenshot path cannot be created', function() {
        var childArgs = createChildArgs();

        return runChildProcess(childArgs).then(function(data) {
          expect(data).to.equal('The screenshot path cannot be created\n');
        });
      });
    });

    describe('And only one viewport perameter has been passed', function() {

      beforeEach(function() {
        viewportDimensions = [320];
      });

      it('Should return an error saying the viewport perameters are incorrect', function() {
        var childArgs = createChildArgs();

        return runChildProcess(childArgs).then(function(data) {
          expect(data).to.equal('The viewport perameters are incorrect\n');
        });
      });
    });

    describe('And no selectors have been passed', function() {

      beforeEach(function() {
        selectorList = '{}'
      });

      it('Should return an error saying no selectors have been passed', function() {
        var childArgs = createChildArgs();

        return runChildProcess(childArgs).then(function(data) {
          expect(data).to.equal('No selectors have been passed\n');
        });
      });
    });

    describe('And a selector is passed that does not exist', function() {

      beforeEach(function() {
        selectorList = '{"containerNone":"[data-container-none]"}';
      });

      it('Should return an error saying the selector does not exist', function() {
        var childArgs = createChildArgs();

        return runChildProcess(childArgs).then(function(data) {
          expect(data).to.equal('The selector containerNone does not exist\n');
        });
      });
    });

    describe('And a selector is passed that exists', function() {

      beforeEach(function() {
        selectorList = '{"containerOne":"[data-container-one]"}';
      });

      it('Should return a message with the breakpoint name and the selector name', function() {
        var childArgs = createChildArgs();

        return runChildProcess(childArgs).then(function(data) {
          expect(data).to.equal('smallScreen--containerOne\n');
        });
      });
    });
  });
});
