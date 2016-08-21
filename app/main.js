const store = require('./store')
const process = require('./process')
const inquirer = require('inquirer')
const fs = require('fs');

var questions = [
  {
    type: 'list',
    name: 'openingQuestion',
    message: 'Would you like to run reference or test screenshots?:',
    choices: [ 'Reference', 'Test' ],
    default: 'Reference'
  }
]

function askQuestion () {
  inquirer.prompt(questions).then(function (answers) {
    store.dispatch({
      type: 'TEST',
      answer: answers.openingQuestion,
      completed: false
    });
  });
}

function watchDirectory () {
  fs.watch('./_client', function (event, filename) {
      console.log('event is: ' + event);
  });
}

function handleChange() {
  var completed = store.getState()[0].completed;
  if (completed === false) return;
  askQuestion();
}

askQuestion();

store.subscribe(handleChange)
