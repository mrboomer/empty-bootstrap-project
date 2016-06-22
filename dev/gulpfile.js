/* global require, console */

const gulp = require('gulp');
const sass = require('gulp-ruby-sass');
const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-minify-css');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const notify = require('gulp-notify');
const cache = require('gulp-cache');
const livereload = require('gulp-livereload');
const plumber = require('gulp-plumber');

const basePaths = {
  index: '../',
  src: 'assets/',
  dest: '../assets/',
};

const paths = {
  styles: {
    src: `${basePaths.src}scss/`,
    unminified: `${basePaths.src}css/`,
    dest: `${basePaths.dest}css/`,
  },
  scripts: {
    src: `${basePaths.src}js/`,
    dest: `${basePaths.dest}js/`,
  },
  images: {
    src: `${basePaths.src}img/`,
    dest: `${basePaths.dest}img/`,
  },
};

const devAssets = {
  styles: `${paths.styles.src}main.scss`,
  scripts: `${paths.scripts.src}**/*.js`,
  images: `${paths.images.src}**/*.{png,jpg,jpeg,gif,svg}`,
};

const onError = (err) => {
  console.error('Error!', err.message);
};

gulp.task('styles', () =>
  sass(devAssets.styles, { style: 'expanded' })
    .on('error', onError)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
    }))
    .pipe(gulp.dest(paths.styles.unminified))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minify({ keepSpecialComments: 0 }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(notify({
      title: 'Gulp',
      message: 'Styles Task Successful',
    }))
);

gulp.task('scripts', () =>
  gulp.src(devAssets.scripts)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(eslint('.eslintrc.js'))
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(notify({
      title: 'Gulp',
      message: 'Scripts Task Successful',
    }))
);

gulp.task('images', () =>
  gulp.src(devAssets.images)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(cache(imagemin({
      optimizationLevel: 5,
      progessive: true,
      interlaced: true,
    })))
    .pipe(gulp.dest(paths.images.dest))
    .pipe(notify({
      title: 'Gulp',
      message: 'Images Task Successful',
    }))
);

gulp.task('watch', () => {
  gulp.watch(`${paths.styles.src}**/*.scss`, ['styles']);
  gulp.watch(devAssets.scripts, ['scripts']);
  gulp.watch(devAssets.images, ['images']);
});

gulp.task('reload', () => {
  livereload.listen();
  gulp.watch(`${basePaths.index}*.{php,html}`).on('change', livereload.changed);
  gulp.watch(`${paths.styles.dest}**/*.*`).on('change', livereload.changed);
  gulp.watch(`${paths.scripts.dest}**/*.*`).on('change', livereload.changed);
  gulp.watch(`${paths.images.dest}**/*.*`).on('change', livereload.changed);
});

gulp.task('default', ['styles', 'scripts', 'images', 'watch', 'reload']);
