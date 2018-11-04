// Load up plugins used by gulp watch
var gulp = require('gulp'),
  watch = require('gulp-watch'),
  browserSync = require('browser-sync').create();

//Gulp watch is a built in gulp action that will run continuously until stopped
gulp.task('watch', function(){

  //Browser sync options
  browserSync.init({
    notify: false,
    open: false,
    server:{
      baseDir: "app"
    }
  });

  //To trigger a task within gulp watch we use the watch() and then pass in
  //the file to watch to be saved and then use an anonymous function to tell
  //gulp what to do when that file is saved
  watch('./app/index.html', function(){
    //Reload the page whenever the index.html file is saved
    browserSync.reload();
  });

  //When specifing file paths for gulp watch we can use wild-card characters
  //to have the watch task look at multiple files
  watch('./app/assets/styles/**/*.css', function(){
    //Comile postcss and inject into the webpage without reloading the page
    gulp.start('cssInject');
  });
});

//Compile the postcss with our gulp action 'style' by adding a 3rd (2nd)
//argument to our gulp task which contains a list of all the actions that
//should run before executing the current task's function
gulp.task('cssInject', ['styles'], function(){
  return gulp.src('./app/temp/styles/styles.css')
    .pipe(browserSync.stream());
});
