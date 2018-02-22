let gulp = require('gulp');
let LiveServer = require('gulp-live-server');
let browserSync = require('browser-sync');
let browserify = require('browserify');
let source = require('vinyl-source-stream');

gulp.task('live-server', function() {
    var server = new LiveServer('server/main.js');
    server.start();
})

gulp.task('bundle', function() {
    return browserify()
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./.tmp'));
})

// gulp.task('copy', function() {
//     gulp.src(['./app/*.css', './bower_components/skeleton/css/*.css'])
//     .pipe(gulp.dest('./.tmp'))
// })

gulp.task('serve', ['bundle', 'live-server'], function() {
    browserSync.init(null, {
        proxy: "http://localhost:7777",
        port: 9000
    })    
})