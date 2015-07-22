var gulp = require('gulp'),
 shell = require('gulp-shell')

gulp.task('code', shell.task([
  'node crawler.js example.com'
]))

gulp.task('watch', function() {
  // Watch .js files
  gulp.watch('*.js', ['code']);

});
