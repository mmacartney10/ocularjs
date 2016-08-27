module.exports = function (currentDirectory) {

  const store = require('./store');
  const process = require('./process')(currentDirectory);
  const inquirer = require('inquirer');
  const fs = require('fs');

  var questions = [{
    type: 'list',
    name: 'screenShotType',
    message: 'Would you like to run Reference or Test screenshots?',
    choices: [ 'Reference', 'Test', 'Exit' ],
    default: 'Reference'
  }];

  function askQuestion () {
    inquirer.prompt(questions).then(function (answers) {
      if (answers.screenShotType === 'Exit') return;
      sendQuestionResultToStore(answers.screenShotType);
    });
  }

  function sendQuestionResultToStore (answer) {
    store.dispatch({
      type: 'APP',
      answer: answer,
      completed: false
    });
  }

  function handleChange() {
    var completed = store.getState()[0].completed;
    if (completed === false) return;
    askQuestion();
  }

  askQuestion();

  store.subscribe(handleChange);
}
