module.exports = function (currentDirectory) {

  const store = require('./store')
  const process = require('./process')(currentDirectory);
  const inquirer = require('inquirer')
  const fs = require('fs')

  var questions = [
    {
      type: 'list',
      name: 'openingQuestion',
      message: 'Would you like to run reference or test screenshots?:',
      choices: [ 'Reference', 'Test', 'Exit' ],
      default: 'Reference'
    }
  ]

  function askQuestion () {
    inquirer.prompt(questions).then(function (answers) {
      if (answers.openingQuestion === 'Exit') return;



      store.dispatch({
        type: 'APP',
        answer: answers.openingQuestion,
        completed: false
      });
    });
  }

  function handleChange() {
    var completed = store.getState()[0].completed;
    if (completed === false) return;
    askQuestion();
  }

  askQuestion();

  store.subscribe(handleChange)
}
