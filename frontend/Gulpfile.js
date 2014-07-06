var gulp = require('gulp'),
	concat = require('gulp-concat'),
	stylus = require('gulp-stylus'),
	changed = require('gulp-changed'),
	env = process.env.ENV || 'dev';

var JS_DEST = '../public/js/',
	CSS_DEST = '../public/css/',
	PUBLIC_DEST = '../public/';

gulp.task('scripts.app', function () {
	return gulp.src('app/**/*.js')
		.pipe(concat('app.js'))
		.pipe(gulp.dest(JS_DEST));
});

gulp.task('scripts.vendor', function () {
	var source = [
		'vendor/bootstrap/dist/js/bootstrap.js.min',
		'vendor/angular/angular.js',
		'vendor/lodash/dist/lodash.js',
		'vendor/angular-ui-router/release/angular-ui-router.js',
		'vendor/restangular/dist/restangular.min.js',
		'vendor/ngstorage/ngStorage.js',
		'vendor/moment/min/moment.min.js'
	];

	return gulp.src(source).pipe(concat('vendor.js')).pipe(gulp.dest(JS_DEST));
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

gulp.task('templates.direct', function () {
	return gulp.src('app/**/*.html').pipe(gulp.dest(PUBLIC_DEST));
});

gulp.task('copypublic', function () {
	return gulp.src('app/public/**/*').pipe(gulp.dest(PUBLIC_DEST));
});

gulp.task('fonts', function() {
	return gulp.src('vendor/bootstrap/dist/fonts/*').pipe(gulp.dest(PUBLIC_DEST));
});

gulp.task('watch', function () {
	gulp.watch('app/**/*.js', ['scripts.app']);
	gulp.watch('styles/**/*.styl', ['styles']);
	gulp.watch('app/**/*.html', ['templates.direct']);
});

gulp.task('default', function () {
	gulp.start('scripts.app', 'copypublic', 'scripts.vendor', 'styles', 'templates.direct', 'fonts', 'watch');
});

gulp.task('build', function () {
	gulp.start('scripts.app', 'scripts.vendor', 'styles', 'templates.direct', 'fonts');
});