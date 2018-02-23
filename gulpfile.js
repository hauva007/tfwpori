var gulp = require('gulp');
var gutil = require('gulp-util');
var browserSync = require('browser-sync');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer-core');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

// gulp build --production
var production = !!argv.production;
// determine if we're doing a build
// and if so, bypass the livereload
var build = argv._.length ? argv._[0] === 'build' : false;
var watch = argv._.length ? argv._[0] === 'watch' : true;

var tasks = {
    // --------------------------
    // Delete build folder
    // --------------------------
    clean: function(cb) {
        del(['build/'], cb);
    },
    // --------------------------
    // Copy static assets
    // --------------------------
    assets: function() {
        return gulp.src([
            './app/assets/**/*',
            './app/favicon.png'])
          .pipe(gulp.dest('./.tmp'));
    },
    // --------------------------
    // SASS (libsass)
    // --------------------------
    sass: function() {
        return gulp.src('./app/scss/*.scss')
        // sourcemaps + sass + error handling
        .pipe(gulpif(!production, sourcemaps.init()))
        .pipe(sass({
            sourceComments: !production,
            outputStyle: production ? 'compressed' : 'nested'
        }))
        .on('error', handleError('SASS'))
        // generate .maps
        .pipe(gulpif(!production, sourcemaps.write({
            'includeContent': false,
            'sourceRoot': '.'
        })))
        // autoprefixer
        .pipe(gulpif(!production, sourcemaps.init({
            'loadMaps': true
        })))
        .pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
        // we don't serve the source files
        // so include scss content inside the sourcemaps
        .pipe(sourcemaps.write({
            'includeContent': true
        }))
        // write sourcemaps to a specific directory
        // give it a file and save
        .pipe(gulp.dest('./.tmp/css'));
    },
    // --------------------------
    // Browserify (bundle)
    // --------------------------
    browserify: function() {
        var bundler = browserify('app/js/app.main.js', {
            debug: !production,
            cache: {}
        });
        var rebundle = function() {
            return bundler.bundle()
            .on('error', handleError('Browserify'))
            .pipe(source('app.bundle.js'))
            .pipe(gulp.dest('./.tmp'));
        };
        return rebundle();
    },
    // --------------------------
    // linting
    // --------------------------
    lintjs: function() {
        return gulp.src([
            'gulpfile.js',
            './app/js/main.js',
            './app/js/**/*.js'
        ]).pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .on('error', function() {
            beep();
        });
    }
};

// --------------------------
// CUSTOM TASK METHODS
// --------------------------
gulp.task('clean', tasks.clean);
// for production we require the clean method on every individual task
var req = build ? ['clean'] : [];
// individual tasks
gulp.task('assets', req, tasks.assets);
gulp.task('sass', req, tasks.sass);
gulp.task('browserify', tasks.browserify);
gulp.task('lint:js', tasks.lintjs);

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        proxy: "http://localhost:7777",
        port: process.env.PORT || 9000
    });
});

gulp.task('reload-sass', ['sass'], function(){
    browserSync.reload();
});

gulp.task('reload-js', ['browserify'], function(){
    browserSync.reload();
});

// --------------------------
// DEV/WATCH TASK
// --------------------------
gulp.task('watch', ['assets', 'sass', 'browserify', 'browser-sync'], function() {
    
    // --------------------------
    // watch:sass
    // --------------------------
    gulp.watch('./app/scss/**/*.scss', ['reload-sass']);

    // --------------------------
    // watch:js
    // --------------------------
    gulp.watch('./app/js/**/*.js', ['lint:js', 'reload-js']);

    gutil.log(gutil.colors.bgGreen('Watching for changes...'));
});

// ----------------------------
// Error notification methods
// ----------------------------
var beep = function() {
    var os = require('os');
    var file = 'gulp/error.wav';
    if (os.platform() === 'linux') {
      // linux
      exec("aplay " + file);
    } else {
      // mac
      console.log("afplay " + file);
      exec("afplay " + file);
    }
  };
  var handleError = function(task) {
    return function(err) {
      beep();
      
        notify.onError({
          message: task + ' failed, check the logs..',
          sound: false
        })(err);
      
      gutil.log(gutil.colors.bgRed(task + ' error:'), gutil.colors.red(err));
    };
  };