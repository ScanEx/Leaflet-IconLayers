var gulp = require('gulp');
var eslint = require('gulp-eslint');

gulp.task('lint', function() {
    return gulp.src(['src/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('copy', ['lint'], function() {
    return gulp.src([
        'src/check.png',
        'src/iconLayers.js',
        'src/iconLayers.css',
        'src/transparent-pixel.png'
    ]).pipe(gulp.dest('dist'));
});

gulp.task('default', ['lint', 'copy']);
