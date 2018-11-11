var gulp = require('gulp'),
  imagemin = require('gulp-imagemin'),
  del = require('del'),
  usemin = require('gulp-usemin'),
  rev = require('gulp-rev'),
  cssnano = require('gulp-cssnano'),
  uglify = require('gulp-uglify'),
  browserSync = require('browser-sync').create();

var projectDestination = "docs";

// Launch BrowserSync to show us our new builded site
gulp.task('previewLive', function() {
  //Browser sync options
  browserSync.init({
    notify: false,
    server:{
      baseDir: projectDestination
    }
  });

});

// Delete the project destionation folder in order to force its rebuild when
/// running gulp build
gulp.task('deleteLiveFolder', ['icons'], function(){
  return del('./' + projectDestination);
});

// Copy over any other files that we want
gulp.task('copyGeneralFiles', ['deleteLiveFolder'], function() {
  var pathsToCopy = [
    './app/**/*',
    '!./app/index.html',
    '!./app/assets/images/**',
    '!./app/assets/styles/**',
    '!./app/assets/scripts/**',
    '!./app/temp',
    '!./app/temp/**'
  ]
  return gulp.src(pathsToCopy)
    .pipe(gulp.dest('./' + projectDestination))
})

// Compress images using the npm package gulp-imagemin
// Passing the folder for all images and exluding the icons folder and anything
// nested within the icons folder since it isn't needed with our sprites
// Options used in imagemin include:
//    progressive: "support for jpeg compression"
//    interlace: "support for gif compression"
//    multipass: "support for svg compression"
gulp.task('optimizeImages', ['deleteLiveFolder'], function() {
  return gulp.src(['./app/assets/images/**/*', '!./app/assets/images/icons', '!./app/assets/images/icons/**/*'])
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      multipass: true
    }))
    .pipe(gulp.dest('./' + projectDestination + '/assets/images'));
});

gulp.task('useminTrigger', ['deleteLiveFolder'], function(){
  gulp.start('usemin');
})

// Compress and move over needed html,css, and js files with npm package usemin
// The package usemin uses comments in html to be able to tell which css and
// js files to move over. All usemin needs is the html file and then moves it
// over and looks for a comment containing:
//    <!-- build:{language} {folder-path} -->
//    {HTML import file code here. Either <link> or <script>}
//    <!-- endbuild -->
// usemin then takes the file and changes the path in the link/script tag to
// the file path provided in the comment and moves the file in the link/script
// tag to the file path provided.
// NOTE: uses the following packages for other useful tasks:
//       rev: adds numerical end to files that changes on each build to have
//            browsers redownload our css and js files if they change
//       cssnano: minifies (compresses) css files
//       uglify: minifies (compresses) js files
gulp.task('usemin', ['styles', 'scripts'], function() {
  return gulp.src('./app/index.html')
    .pipe(usemin({
      css: [function() {return rev()}, function() {return cssnano()}],
      js: [function() {return rev()}, function() {return uglify()}]
    }))
    .pipe(gulp.dest('./' + projectDestination));
})


// Run all build tasks
gulp.task('build', ['deleteLiveFolder', 'copyGeneralFiles', 'optimizeImages', 'useminTrigger']);
