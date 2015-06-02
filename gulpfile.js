'use strict';

var gulp     = require('gulp'),
	jshint   = require('gulp-jshint');

var files = {
	jsFiles: ['atrack/**/*.js', 'gosafe/**/*.js', 'meitrack/**/*.js', 'queclink/**/*.js']
};

gulp.task('jshint', function () {
	return gulp.src(files.jsFiles)
		.pipe(jshint())
		.pipe(jshint.reporter('default', {verbose: true}))
		.pipe(jshint.reporter('fail'));
});

gulp.task('lint', ['jshint']);