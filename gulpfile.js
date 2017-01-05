const gulp = require('gulp');
const mocha = require('gulp-mocha');
const exec = require('child_process').exec;

function runCommand(command) {
  return function (cb) {
    exec(command, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  }
}

gulp.task('start-mongo', runCommand('mongod --dbpath=data --smallfiles'));
gulp.task('start-app', runCommand('node app.js'));
gulp.task('start-tests', runCommand('mocha ./test/*'));

gulp.task('start-server', ['start-mongo', 'start-app']);
gulp.task('default',['start-server', 'start-tests']);