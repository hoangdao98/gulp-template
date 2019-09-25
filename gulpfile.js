const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const del = require('del');

const paths = {
    scss: 'app/scss/**/*.scss',
    html: 'app/*.html',
    js: 'app/js/**/*.js',
    images: 'app/images/**/*.+(png|jpg|gif|svg)',
    fonts: 'app/fonts/**/*'
}

/**
 * Compile sass to css
 */
function style() {
    return gulp.src(paths.scss)
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream());
}

function browserSyncF() {
    browserSync.init({
        server: "app"
    });
}

function browserReload() {
    return browserSync.reload;
}

function wathFiles() {
    gulp.watch(paths.scss, style);
    gulp.watch(paths.html).on('change', browserReload());
    gulp.watch(paths.js).on('change', browserReload());
}

function minifySoucre() {
    return gulp.src(paths.html)
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
}

function minifyImage() {
    return gulp.src(paths.images)
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('dist/images'));
}

function moveFonts() {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest('dist/fonts'));
}

function cleanBuild(done) {
    return del.sync('dist', done());
}

const watching = gulp.parallel(wathFiles, browserSyncF);
const build = gulp.parallel(cleanBuild, style, minifySoucre, minifyImage, moveFonts)

exports.default = watching;
exports.build = build;