var gulp = require('gulp');

gulp.task('default', [], function () {
    return gulp.src([
        'src/check.png',
        'src/iconLayers.js',
        'src/iconLayers.css',
        'src/transparent-pixel.png'
    ]).pipe(gulp.dest('dist'));
});
