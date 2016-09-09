module.exports = function (currentDirectory) {

  const fs = require('fs');
  const store = require('./store');
  const colors = require('colors');

  const message = {
    passed: 'Passed - ',
    failed: 'Failed - ',
  };

  var obj = {
    test: {
      folder: currentDirectory + '/ocular/screenshots/reference/',
      base64: ''
    },
    reference: {
      folder: currentDirectory + '/ocular/screenshots/test/',
      base64: ''
    }
  }

  function init () {
    getBase64Data('test');
    getBase64Data('reference');
    compareReferenceAndTestBase64();
  }

  function getBase64Path (folder) {
    var str = screenshotName.replace(/\s+/g, '');
    return `${folder}${str}.txt`;
  }

  function getBase64Data (type) {
    var folderName = obj[type].folder;

    fs.readFile(getBase64Path(folderName), 'utf8', function (error, data) {
      if (error) return;
      obj[type].base64 = data;
    });
  }

  function compareReferenceAndTestBase64 () {
    var successMessage = message.passed + screenshotName;
    var failedMessage = message.failed + screenshotName;

    if (obj.test.base64 === obj.reference.base64) {
      console.log(successMessage.green);
      return;
    }

    console.log(failedMessage.red);
  }

  function handleChange () {
    screenshotName = store.getState()[0].name;
    if (screenshotName === undefined) return;
    init();
  }

  store.subscribe(handleChange);
};
