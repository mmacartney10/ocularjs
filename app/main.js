module.exports = function (currentDirectory) {
  const cli = require('./cli')(currentDirectory);
  const process = require('./process')(currentDirectory);
  const compareScreenshots = require('./compare-screenshots')(currentDirectory);
}
