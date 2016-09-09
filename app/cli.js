module.exports = function (currentDirectory) {

  const store = require('./store');
  const inquirer = require('inquirer');

  var questions = [{
    type: 'list',
    name: 'screenShotType',
    message: 'Would you like to run Reference or Test screenshots?',
    choices: [ 'Reference', 'Test', 'Exit' ],
    default: 'Reference'
  }];

  function init () {
    askQuestion();
  }

  function handleChange() {
    var completed = store.getState()[0].completed;
    if (completed === false || completed === undefined) return;
    askQuestion();
  }

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

  init();

  store.subscribe(handleChange);
};
