var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    minify = require('gulp-minify'),
    cleanCss = require('gulp-clean-css'),
    rev = require('gulp-rev'),
    del = require('del'),
    browserSync = require('browser-sync').create();
    

var sassInput = './src/cwg-scss/cwg-styles.scss';
var sassOutput = './src/cwg-scss/';

var distCssFolder = './dist/build/css';
var distCssFiles = './dist/build/css/*.css';

var sassWatchPath = './src/cwg-scss/**/*.scss';


gulp.task('clean-css', function () {
    return del([
        distCssFiles
    ]);
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './dist/'
    },
  })
})

gulp.task('sass', ['clean-css'], function() {
    return gulp
        // Find all `.scss` files from the `cwg-scss` folder
        .src(sassInput)
        // Adds a sourcemap to the actual .scss file, instead of the compiled .css file
        .pipe(sourcemaps.init())
        // Run Sass on those files
        .pipe(sass().on('error', sass.logError)) // Error log to keep session going when scss contains error)
        // Write those sourcemaps
        .pipe(sourcemaps.write())
        // Auto prefix the CSS, and here are the 8 options: https://github.com/postcss/autoprefixer#options
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        // Minifies css
        .pipe(cleanCss())  
        // CSS for distribution
        .pipe(gulp.dest(distCssFolder))
        .pipe(browserSync.reload({
          stream: true
        }));
});

gulp.task('watch', ['browserSync', 'sass'], function() {
    gulp.watch(sassWatchPath, ['sass']); // Watch and run sass on changes
    gulp.watch(sassWatchPath).on('change', browserSync.reload);
    gulp.watch("./dist/*.html").on('change', browserSync.reload);
    gulp.watch("assets/img/**", ['imagemin', 'svgmin']); // Watch and minify images on changes

});

gulp.task('default', ['watch']);
gulp.task('dist', ['watch', 'sass-dist']);

// Notes
// Used this guide to minimize css and js » https://www.toptal.com/javascript/optimize-js-and-css-with-gulp