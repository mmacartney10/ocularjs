#! /usr/bin/env node

var args = process.argv.slice(2);
var currentDirectory = process.cwd();

var isInit = false;
var isWatch = false;

if (args.length === 0) {
  require('./app/main.js')(currentDirectory);
  return;
}

for (var index = 0; index < args.length; index++) {
  if (args[index] === 'init') isInit = true;
}

if (isInit) {
  require('./init/init.js');
}
