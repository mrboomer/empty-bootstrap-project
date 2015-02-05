/*global require */

var gulp = require('gulp');
var minify = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var notify = require('gulp-notify');
var bower = require('gulp-bower');

var basePaths = {
	src: 'app/',
	dest: './../assets/',
	bower: 'bower_components/'
};

var paths = {
	images: {
		src: basePaths.src + 'img/',
		dest: basePaths.dest + 'img/'
	},
	scripts: {
		src: basePaths.src + 'js/',
		dest: basePaths.dest + 'js/'
	},
	styles: {
		src: basePaths.src + 'css/',
		dest: basePaths.dest + 'css/'
	}
};

var appFiles = {
	scripts: paths.scripts.src + 'main.js',
	styles: paths.styles.src + '**/*.css',
	images: paths.images.src + '**/*.{png,jpg,jpeg,gif,svg}'
};

gulp.task('bower', function() {
	return bower()
		.pipe(gulp.dest(basePaths.bower));
});

gulp.task('jQuery', function() {
	return gulp.src(basePaths.bower + 'jquery/dist/jquery.js')
		.pipe(uglify())
		.pipe(rename({ suffix: '.min'	}))
		.pipe(gulp.dest(paths.scripts.dest + 'vendor/'));
});

gulp.task('bootstrapJS', function() {
	return gulp.src(basePaths.bower + 'bootstrap/dist/js/bootstrap.js')
		.pipe(uglify())
		.pipe(rename({ suffix: '.min'	}))
		.pipe(gulp.dest(paths.scripts.dest + 'vendor/'));
});

gulp.task('bootstrapCSS', function() {
	return gulp.src(basePaths.bower + 'bootstrap/dist/css/bootstrap.css')
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(minify({ keepSpecialComments: 0 }))
		.pipe(rename({ suffix: '.min'	}))
		.pipe(gulp.dest(paths.styles.dest));
});

gulp.task('pluginsJS', function() {
	return gulp.src([
			paths.scripts.src + 'plugins.js'
		])
		.pipe(concat('plugins.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(paths.scripts.dest));
});

gulp.task('css', function() {
	return gulp.src(appFiles.styles)
		.pipe(concat('styles.min.css'))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(minify({ keepSpecialComments: 0 }))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(notify({
			title: 'Gulp',
			message: 'CSS Task Successful',
		}));
});

gulp.task('scripts', function() {
	return gulp.src([
			appFiles.scripts
		])
		.pipe(concat('scripts.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(paths.scripts.dest))
		.pipe(notify({
			title: 'Gulp',
			message: 'JS Task Successful',
		}));
});

gulp.task('images', function() {
	return gulp.src(appFiles.images)
		.pipe(imagemin({
			optimizationLevel: 4,
			progessive: true,
			interlaced: true
		}))
		.pipe(gulp.dest(paths.images.dest));
});

gulp.task('watch', function() {
	gulp.watch(appFiles.styles, ['css']);
	gulp.watch(appFiles.scripts, ['scripts']);
	gulp.watch(appFiles.images, ['images']);
});

gulp.task('setDependencies', ['jQuery', 'bootstrapJS', 'bootstrapCSS', 'pluginsJS']);

gulp.task('default', ['css', 'scripts', 'images', 'watch']);
