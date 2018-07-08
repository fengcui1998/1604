var gulp = require('gulp');
var url = require('url');
var path = require('path');
var fs = require('fs');
var server = require('gulp-webserver');
var sass = require('gulp-sass');
var cssmin = require('gulp-clean-css');
var jsmin = require('gulp-uglify');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var sequence = require('gulp-sequence');
// 起服务 
gulp.task('server', function() {
    gulp.src('src')
        .pipe(server({
            port: 8888,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname === '/favicon.ico') {
                    return false;
                }
                pathname = pathname === '/' ? '/index.html' : pathname;
                res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))

            }
        }))
});
// scss
gulp.task('sass', function() {
    gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(concat('all.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('src/css'))
});
// 监听
gulp.task('watch', function() {
    gulp.watch('./src/scss/*.scss', ['scss'])
});
// 异步 开发阶段
gulp.task('dev', ['sass', 'server', 'watch']);

// 线上开发
gulp.task('bulitsass', function() {
    gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(concat('all.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0']
        }))
        .pipe(cssmin())
        .pipe(gulp.dest('bulit/css'))
});
gulp.task('bulitjs', function() {
    gulp.src('./src/js/*.js')
        .pipe(concat('all.js'))
        .pipe(jsmin())
        .pipe(gulp.dest('bulit/js'))
});
gulp.task('default', function(cd) {
    sequence('bulitsass', 'bulitjs', cd)
})