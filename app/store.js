var createStore = require('redux').createStore;

function Reducer() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case 'APP':
      return [{
        answer: action.answer,
        completed: action.completed
      }]
      case 'SCREENSHOT':
        return [{
          name: action.name,
        }]
    default:
      return state;
  }
};

var store = createStore(Reducer);

module.exports = store;
