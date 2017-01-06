const gulp = require('gulp');
const mocha = require('gulp-mocha');
const exec = require('child_process').exec;
const runSequence = require('run-sequence');

gulp.task('create-data-directory', function() {
  exec('mkdir -p data', function(err, stdout, stderr) {
    console.log(stdout);
  });
});

gulp.task('start-mongo', function() {
  exec('mongod --fork --syslog --dbpath=data --smallfiles', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
});

gulp.task('stop-mongo', function() {
  exec('killall mongod', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
});
//gulp.task('start-app', runCommand('node app.js'));

gulp.task('start-tests', () =>
  gulp.src('./test/*', {
    read: false
  })
  // gulp-mocha needs filepaths so you can't have any plugins before it
  .pipe(mocha())
  .once('error', () => {
    runSequence('stop-mongo', 'quit');
  })
  .once('end', () => {
    runSequence('stop-mongo', 'quit');
  })
);

gulp.task('quit', function() {
  process.exit();
});

gulp.task('default', function() {
  runSequence('create-data-directory', 'start-mongo', 'start-tests', 'stop-mongo', 'quit');
});