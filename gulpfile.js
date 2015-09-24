var gulp         = require('gulp');
var watch        = require('gulp-watch');
var plumber      = require('gulp-plumber');
var jade         = require('gulp-jade');
var sass         = require('gulp-sass');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer-core');
var clearfix     = require('postcss-clearfix');
var assets       = require('postcss-assets');
var calc         = require("postcss-calc");
var spritesmith  = require('gulp.spritesmith');
var uglify       = require('gulp-uglify');
var concat       = require('gulp-concat');
var sourcemaps   = require('gulp-sourcemaps');
var cssGlobbing  = require('gulp-css-globbing');

var js_build = 'src/js/build.json';
var path = {
    jade        : ['src/*.jade', 'src/blocks/**/*.jade'],
    jade_layout : 'src/*.jade',
    script      : [],
    style       : ['src/scss/*.scss', 'src/blocks/**/*.scss'],
    images      : 'src/images/images/*',
    sprite      : 'src/images/sprites/*.png',
    fonts       : 'src/fonts/*'
};

gulp.task('default', ['fonts', 'jade', 'sprite', 'images', 'style', 'load_js', 'js']);

gulp.task('watch', ['default'], function() {
    watch(path.fonts, function() {
        gulp.run('fonts');
    });
    watch(path.jade, function() {
        gulp.run('jade');
    });
    watch(path.sprite, function() {
        gulp.run('sprite');
        gulp.run('style');
    });
    watch(path.style, function() {
        gulp.run('style');
    });
    watch(path.images, function() {
        gulp.run('images');
    });

    watch(js_build, function(){
        gulp.run('load_js')
    });

    watch([js_build, 'src/blocks/**/*.js', 'src/js/**/*.js'], function() {
        gulp.run('js');
    });
});

gulp.task('style', function(){
    return gulp.src(path.style)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(cssGlobbing({
            extensions: ['.scss', '.css']
        }))
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['src/blocks/']
        }))
        .pipe(postcss([
            clearfix,
            autoprefixer({browsers: ['> 2%', 'ie 8']}),
            assets({ loadPaths: ['src/images/images/'] }),
            calc
        ]))
        //.pipe(concat('style.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('sprite', function(){
    var spriteData = gulp.src(path.sprite)
        .pipe(plumber())
        .pipe(spritesmith({
            imgName: 'dist/images/sprite.png',
            imgPath: '../images/sprite.png',
            cssName: 'src/scss/_sprite.scss',
            cssFormat: "scss"
        }));
    return spriteData.pipe(gulp.dest('.'));
});

gulp.task('load_js', function(){
    delete( require.cache[ __dirname + '/' + js_build ] );
    var js = require('./' + js_build);
    js.push('src/blocks/**/*.js');
    return path.script = js;
});

gulp.task('js', function () {
    return gulp.src(path.script)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('build.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('fonts', function(){
    gulp.src(path.fonts)
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('jade', function() {
    return gulp.src(path.jade_layout)
        .pipe(plumber())
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('images', function () {
    return gulp.src(path.images)
        .pipe(plumber())
        .pipe(gulp.dest('dist/images'));
});