// Default Gulp file that will run all of our gulp tasks for travel-site

// Load up plugins used be gulp
var gulp = require('gulp'),
  watch = require('gulp-watch'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  cssvars = require('postcss-simple-vars'),
  nested = require('postcss-nested'),
  cssImport = require('postcss-import'),
  browserSync = require('browser-sync').create();

//Tester task. To use type "gulp default" in terminal
gulp.task('default', function(){
  console.log("Dope...");
});

//Tester task.
gulp.task('html', function(){
  console.log("When HTML gets fancy we break that biz down - or do something useful to it");
});

//Task to convert all postcss to standard css.
//Postcss plugins are included in first pipe
//Last pipe gives the destination of where to output the css into one file
gulp.task('styles', function(){
  return gulp.src('./app/assets/styles/styles.css')
    .pipe(postcss([cssImport, cssvars, nested, autoprefixer]))
    .pipe(gulp.dest('./app/temp/styles'));
});

//Gulp watch is a built in gulp action that will run continuously until stopped
gulp.task('watch', function(){

  browserSync.init({
    notify: false,
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
