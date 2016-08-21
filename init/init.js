var fs = require('fs');
var dirName = './ocular';
var json = require('./baseData.json');
var data = JSON.stringify(json, null, 2);

function init () {
  createOcularDirectory();
  createBaseDataFile();
}

function createOcularDirectory () {
  if (fs.existsSync(dirName)) return;
  fs.mkdirSync(dirName);
  console.log('Ocular directory was created');
}

function createBaseDataFile () {
  fs.writeFile(dirName + '/data.json', data, function(err) {
    if (err) throw err;
    console.log('Ocular base data file was created');
  });
}

init();
