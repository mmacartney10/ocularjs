#! /usr/bin/env node

var args = process.argv.slice(2);

var dataPath = __dirname + '/ocular/data.json';

if (args.length === 0) {
  require('./app/main.js')(dataPath);
}

if (args[0] === 'init') {
  require('./init/init.js');
}

// if (args[0] === 'watch') {
//   require('./app/main.js');
// }
//
// function watchDirectory () {
//   fs.watch('./_client', function (event, filename) {
//     console.log('event is: ' + event);
//   });
// }
