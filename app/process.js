module.exports = function (currentDirectory) {

  const store = require('./store')

  var path = require('path');
  var phantomjs = require('phantomjs');
  var spawn = require('child_process').spawn;

  var colors = require('colors');

  const fileName = 'child-process.js';
  const filePath = path.join(__dirname, fileName);

  var data = require(currentDirectory + '/ocular/data.json');
  var dataAsString = JSON.stringify(data);

  var viewportLength = Object.keys(data.viewports).length;
  var currentViewportIndex = 0;

  function runChildProcess () {
    currentViewportIndex = 0;

    for (var viewport in data.viewports) {
      createScreenShots(viewport, data.viewports[viewport]);
    }
  }

  function createScreenShots (viewportName, viewportDimensions) {

    var childArgs = [
      filePath,
      store.getState()[0].answer,
      dataAsString,
      viewportName,
      viewportDimensions,
      currentDirectory
    ];

    var child = spawn(phantomjs.path, childArgs);

    child.stdout.on('data', (data) => {
      var output = `stdout: ${data}`;
      var answer = store.getState()[0].answer;

      if (answer === 'Reference') {
        console.log(output.yellow);
        return;
      }

      if (output.indexOf('Passed') > -1) {
        console.log(output.green);
        return;
      }

      console.log(output.red);

    });

    child.stderr.on('data', (data) => {
      var output = `stderr: ${data}`;
      console.log(output.red);
    });

    child.on('exit', (code) => {

      currentViewportIndex += 1;

      if (currentViewportIndex === viewportLength) {
        store.dispatch({
          type: 'APP',
          answer: store.getState()[0].answer,
          completed: true
        });
      }
    });
  }

  function handleChange () {
    var completed = store.getState()[0].completed;

    if (completed) return;

    runChildProcess();
  }

  store.subscribe(handleChange)
}
