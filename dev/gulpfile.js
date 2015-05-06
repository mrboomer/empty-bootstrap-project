/*global require, console*/

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minify = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    bower = require('gulp-bower'),
    plumber = require('gulp-plumber');

var basePaths = {
  src: 'assets/',
  dest: './../assets/',
  bower: 'bower_components/'
};

var paths = {
  styles: {
    src: basePaths.src + 'scss/',
    unminified: basePaths.src + 'css/',
    dest: basePaths.dest + 'css/'
  },
  scripts: {
    src: basePaths.src + 'js/',
    dest: basePaths.dest + 'js/'
  },
  images: {
    src: basePaths.src + 'img/',
    dest: basePaths.dest + 'img/'
  }
};

var devAssets = {
  styles: paths.styles.src + 'main.scss',
  scripts: paths.scripts.src + '**/*.js',
  images: paths.images.src + '**/*.{png,jpg,jpeg,gif,svg}'
};

function onError(err) {
  'use strict';
  console.error('Error!', err.message);
}

gulp.task('bower', function() {
  'use strict';
  return bower()
    .pipe( gulp.dest(basePaths.bower) )
    .pipe( plumber({ errorHandler: onError }) );
});

gulp.task('jquery', function() {
  'use strict';
  return gulp.src( basePaths.bower + 'jquery/dist/jquery.js' )
    .pipe( plumber({ errorHandler: onError }) )
    .pipe( uglify() )
    .pipe( rename({ suffix: '.min' }) )
    .pipe( gulp.dest(paths.scripts.dest + 'vendor/') );
});

gulp.task('bootstrapStyle', function() {
  'use strict';
  return gulp.src( basePaths.bower + 'bootstrap/dist/css/bootstrap.css' )
    .pipe( plumber({ errorHandler: onError }) )
    .pipe( autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4') )
    .pipe( minify({ keepSpecialComments: 0 }) )
    .pipe( rename({ suffix: '.min'	}) )
    .pipe( gulp.dest(paths.styles.dest + 'vendor/') );
});

gulp.task('bootstrapScript', function() {
  'use strict';
  return gulp.src( basePaths.bower + 'bootstrap/dist/js/bootstrap.js' )
    .pipe( plumber({ errorHandler: onError }) )
    .pipe( uglify() )
    .pipe( rename({ suffix: '.min'	}) )
    .pipe( gulp.dest(paths.scripts.dest + 'vendor/') );
});

gulp.task('styles', function() {
  'use strict';
  return sass( devAssets.styles, { style: 'expanded' } )
    .on( 'error', onError )
    .pipe( autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4') )
    .pipe( gulp.dest(paths.styles.unminified) )
    .pipe( rename({suffix: '.min'}) )
    .pipe( minify({ keepSpecialComments: 0 }) )
    .pipe( gulp.dest(paths.styles.dest) )
    .pipe( notify({
      title: 'Gulp',
      message: 'Styles Task Successful'
    }) );
});

gulp.task('scripts', function() {
  'use strict';
  return gulp.src( devAssets.scripts )
    .pipe( plumber({ errorHandler: onError }) )
    .pipe( jshint('.jshintrc') )
    .pipe( jshint.reporter('default') )
    .pipe( concat('main.min.js') )
    .pipe( uglify() )
    .pipe( gulp.dest(paths.scripts.dest) )
    .pipe( notify({
      title: 'Gulp',
      message: 'Scripts Task Successful'
    }) );
});

gulp.task('images', function() {
  'use strict';
  return gulp.src( devAssets.images )
    .pipe( plumber({ errorHandler: onError }) )
    .pipe( cache(imagemin({
      optimizationLevel: 5,
      progessive: true,
      interlaced: true
    })) )
    .pipe( gulp.dest(paths.images.dest) )
    .pipe( notify({
      title: 'Gulp',
      message: 'Images Task Successful'
    }) );
});

gulp.task('watch', function() {
  'use strict';
  gulp.watch(paths.styles.src + '**/*.scss', ['styles']);
  gulp.watch(devAssets.scripts, ['scripts']);
  gulp.watch(devAssets.images, ['images']);
});

gulp.task('reload', function() {
  'use strict';
  livereload.listen();
  gulp.watch(paths.styles.dest + '**/*.*').on('change', livereload.changed);
  gulp.watch(paths.scripts.dest + '**/*.*').on('change', livereload.changed);
  gulp.watch(paths.images.dest + '**/*.*').on('change', livereload.changed);
});

gulp.task('setDependencies', ['jquery', 'bootstrapStyle', 'bootstrapScript']);

gulp.task('default', ['styles', 'scripts', 'images', 'watch', 'reload']);
