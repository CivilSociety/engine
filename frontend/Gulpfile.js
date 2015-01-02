var gulp = require('gulp'),
	concat = require('gulp-concat'),
	stylus = require('gulp-stylus'),
	changed = require('gulp-changed'),
	browserify = require('browserify'),
	watchify = require('watchify'),
	source = require('vinyl-source-stream'),
	env = process.env.ENV || 'dev';

var JS_DEST = '../public/js/',
	CSS_DEST = '../public/css/',
	PUBLIC_DEST = '../public/',
	FONTS_DEST = '../public/fonts/';

gulp.task('scripts.vendor', function () {
	var source = [
		'vendor/jquery/dist/jquery.min.js',
		'vendor/lodash/dist/lodash.js',
		'vendor/backbone/backbone.js',
		'vendor/backbone.babysitter/lib/backbone.babysitter.min.js',
		'vendor/backbone.wreqr/lib/backbone.wreqr.min.js',
		'vendor/marionette/lib/backbone.marionette.min.js',
		'vendor/moment/min/moment.min.js'
	];
//script(src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAUXIcXT_AhcCZ8BXAcyn0OUfXN1LnRkgw")
	return gulp.src(source).pipe(concat('vendor.js')).pipe(gulp.dest(JS_DEST));
});

gulp.task('scripts.maps', function () {
	var source = [
		'vendor/marionette/lib/backbone.marionette.map'
	];

	return gulp.src(source).pipe(gulp.dest(JS_DEST));
});

gulp.task('browserify', function() {
	return browserify('./app/app.js')
	.bundle()
	.pipe(source('app.js'))
	.pipe(gulp.dest(JS_DEST));
});

gulp.task('styles', function () {
	var source = [
		'vendor/bootstrap/dist/css/bootstrap.min.css',
		'styles/*.styl'
	];
	return gulp.src(source)
		.pipe(stylus())
		.pipe(concat('styles.css'))
		.pipe(gulp.dest(CSS_DEST));
});

gulp.task('templates', function () {
	var source = [
		'app/**/*.html'
	];
	return gulp.src(source)
		.pipe(concat('templates.html'))
		.pipe(gulp.dest(PUBLIC_DEST));

});

gulp.task('copypublic', function () {
	return gulp.src('app/public/**/*').pipe(gulp.dest(PUBLIC_DEST));
});

gulp.task('fonts', function() {
	return gulp.src('vendor/bootstrap/dist/fonts/*').pipe(gulp.dest(FONTS_DEST));
});

gulp.task('watch', function () {
	gulp.watch('app/**/*.js', ['browserify']);
	gulp.watch('styles/**/*.styl', ['styles']);
	gulp.watch('app/**/*.html', ['templates']);
});

gulp.task('default', function () {
	gulp.start('browserify', 'copypublic', 'scripts.vendor', 'scripts.maps', 'styles', 'templates', 'fonts', 'watch');
});

gulp.task('build', function () {
	gulp.start('browserify', 'scripts.vendor', 'scripts.maps', 'styles', 'templates', 'fonts');
});