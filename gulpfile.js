var gulp = require('gulp'),
  watch = require('gulp-watch');

gulp.task('default', function(){
  console.log("Dope...");
});

gulp.task('html', function(){
  console.log("When HTML gets fancy we break that biz down - or do something useful to it");
});

gulp.task('styles', function(){
  console.log("Dope AF Sass and PostCSS running here");
});

gulp.task('watch', function(){
  watch('./app/index.html', function(){
    gulp.start('html');
  });

  watch('./app/assets/styles/**/*.css', function(){
    gulp.start('styles');
  })
});
