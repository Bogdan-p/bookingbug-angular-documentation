var gulp = require('gulp');
var connect = require('connect');
var serveStatic = require('serve-static');

gulp.task('ngdocs', [], function () {
  var options = {
    scripts: ['jquery-2.1.4.min.js', 'customScript.js'],
    styles: ['customStyle.css'],
    html5Mode: false,
    title: "BookingBug API Docs"
  }

  var gulpDocs = require('gulp-ngdocs');
  return gulp.src('src/**/*.js')
    .pipe(gulpDocs.process(options))
    .pipe(gulp.dest('./docs'));
});

// watch for ngdocs generator
gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['ngdocs']);
});


gulp.task('default', ['ngdocs', 'watch'], function (cb) {
  var app = connect().use(serveStatic('./docs'));
  app.listen(8000);
  //cb();
  console.log('Server started on http://localhost:8000');
});



