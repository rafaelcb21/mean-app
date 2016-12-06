var gulp = require('gulp');
var gulpTypescript = require('gulp-typescript');
var gulpSourcemaps = require('gulp-sourcemaps');

var del = require('del');

var appDev = 'app/';
var appProd = 'public/js/app/';
var vendor = 'public/js/vendor/';

var tsconfig = gulpTypescript.createProject('tsconfig.json');

gulp.task('build-ts', function () {
    var tsResult = tsconfig.src()
        .pipe(tsconfig());
    return tsResult.js.pipe(gulp.dest(appProd));
});

gulp.task('build-copy', function() {
   return gulp.src([appDev + '**/*.html', appDev + '**/*.css'])
       .pipe(gulp.dest(appProd));
});

gulp.task('clean', function() {
   del(appProd + '**/*');
});

gulp.task('vendor', function() {
    gulp.src('node_modules/@angular/**')
        .pipe(gulp.dest(vendor + '/@angular'));

    gulp.src('node_modules/es6-shim/**')
        .pipe(gulp.dest(vendor + '/es6-shim'));

    //reflect metadata
    gulp.src('node_modules/reflect-metadata/**')
        .pipe(gulp.dest(vendor + '/reflect-metadata/'));

    //rxjs
    gulp.src('node_modules/rxjs/**')
        .pipe(gulp.dest(vendor + '/rxjs/'));

    //systemjs
    gulp.src('node_modules/systemjs/**')
        .pipe(gulp.dest(vendor + '/systemjs/'));

    //zonejs
    return gulp.src('node_modules/zone.js/**')
        .pipe(gulp.dest(vendor + '/zone.js/'));
});

gulp.task('watch', function() {
   gulp.watch(appDev + '**/*.ts', ['build-ts']);
   gulp.watch(appDev + '**/*.{html,css}', ['build-copy']);
});

gulp.task('default', ['watch', 'build-ts', 'build-copy', 'vendor']);
gulp.task('build', ['build-ts', 'build-copy', 'vendor']);