const gulp = require('gulp');
const mocha = require('gulp-mocha');
const exec = require('child_process').exec;

function runCommand(command) {
  return function(cb) {
    exec(command, function(err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  }
}

gulp.task('create-data-directory', runCommand('mkdir -p data'));
gulp.task('start-mongo', runCommand('mongod --dbpath=data --smallfiles'));
gulp.task('start-app', runCommand('node app.js'));
gulp.task('start-tests', () =>
  gulp.src('./test/*', {
    read: false
  })
  // gulp-mocha needs filepaths so you can't have any plugins before it
  .pipe(mocha())
  .once('error', () => {
    process.exit(1);
  })
  .once('end', () => {
    process.exit();
  })
);
gulp.task('start-server', ['create-data-directory', 'start-mongo', 'start-app']);
gulp.task('default', ['start-server', 'start-tests']);