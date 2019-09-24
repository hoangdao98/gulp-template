const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const runSequence = require('run-sequence');
const del = require('del');

const prefixScssPath = 'app/scss/**/*.scss';
const prefixHtmlPath =  'app/*.html';
const prefixJsPath = 'app/js/**/*.js';
const prefixImagePath = 'app/images/**/*.+(png|jpg|gif|svg)';
const prefixFontsPath = 'app/fonts/**/*';

/**
 * Compile sass to css
 */
gulp.task('sass', function() {
    return gulp.src(prefixScssPath)
            .pipe(sass())
            .pipe(gulp.dest('app/css'))
            .pipe(browserSync.reload({
                stream: true
            }));
});

/**
 * Reload page when change data.
 */
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    })
});

/**
 * Watch
 */
gulp.task('watch', gulp.series('browserSync', 'sass'), function() {
    gulp.watch(prefixScssPath, gulp.series('sass'));
    gulp.watch(prefixHtmlPath, browserSync.reload);
    gulp.watch(prefixJsPath, browserSync.reload)
});

/**
 * Minify
 */
gulp.task('useref', function() {
    return gulp.src(prefixHtmlPath)
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
});

/**
 * Minify images
 */
gulp.task('images', function() {
    return gulp.src(prefixImagePath)
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('dist/images'));
});

/**
 * Move fonts to dist/fonts
 */
gulp.task('fonts', function() {
    return gulp.src(prefixFontsPath)
        .pipe(gulp.dest('dist/fonts'));
});

/**
 * Delete file dist before build project.
 */
gulp.task('clean', function(done) {
    return del.sync('dist', done());
});

/**
 * Build project.
 */
gulp.task('build', gulp.series(`clean`, `sass`, `useref`, `images`, `fonts`), function (done) {
    runSequence('clean',
        gulp.series('sass', 'useref', 'images', 'fonts'),
        done()
    )
});

/**
 * Run task defaut
 */
gulp.task('default', gulp.series(`sass`, `browserSync`, `watch`), function (done) {
    runSequence(gulp.series('sass', 'browserSync', 'watch'),
        done()
    );
})