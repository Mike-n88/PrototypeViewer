var gulp = require('gulp');
    connect = require('gulp-connect');
var browserify = require('browserify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var exposeConfig = {expose: {openlayers: 'ol'}};

gulp.task('default',  ['connect', 'watch'], function() {
  // place code for your default task here
});

gulp.task('connect', function() {
  connect.server({
    root: '.',
    livereload: true,
    start: true
  });
});

gulp.task('openlayers', function() {
  gulp.src('node_modules/openlayers/dist/*')
  .pipe(gulp.dest('dist/dist/'));
});

gulp.task('es2015', function() {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './assets/javascript/entry.js',
    debug: true
  });

  return b.transform('babelify', {presets: ['es2015']})
    .transform('exposify', exposeConfig)
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        //.pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'))
    .pipe(connect.reload());
});


gulp.task('watch',['connect'], function() {
  //livereload.listen();
  gulp.watch('./assets/javascript/*.js', ['es2015']);
});
