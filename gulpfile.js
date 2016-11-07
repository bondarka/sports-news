var gulp = require("gulp");
var clean = require("gulp-clean");
var htmlmin = require("gulp-htmlmin");
var less = require("gulp-less");
var concat = require("gulp-concat")
var autoprefixer = require("gulp-autoprefixer")
var notify = require("gulp-notify");
var plumber = require("gulp-plumber");
var sourcemaps = require("gulp-sourcemaps");
var browserSync = require('browser-sync').create();

gulp.task("clean", [], function() {
    return gulp.src("dist")
        .pipe(clean());
})

gulp.task("html", [], function() {
    return gulp.src("index.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("dist"))
        .pipe(notify("HTML changed"));
})

gulp.task("img", [], function() {
    return gulp.src(["img/*.png","img/*.jpg", "img/*.ico"])
        .pipe(gulp.dest("dist/img"))
        .pipe(browserSync.stream());
})
gulp.task("styles", [], function() {
    return gulp.src("css/style.less")
        .pipe(plumber({
            "errorHandler": function(err) {
                // console.log(err["message"]);
                var args = Array.prototype.slice.call(arguments);
                notify.onError({ "title": "Error", "message": err["message"] }).apply(this, args);
                this.emit("end");
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream())
        .pipe(notify("Styles rebilde"));
})


gulp.task("js", [], function() {
    return gulp.src("js/*.js")
        .pipe(gulp.dest("dist/js"))
})

gulp.task("vendor", [], function() {
    return gulp.src(["vendor/jquery-1.12.1.min.js"])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest("dist/js"))
})

gulp.task("serve", [], function() {

    browserSync.init({
        server: {
            baseDir: './dist'
        },
        browser: "chrome",
        notify: false
    });
     gulp.watch("*.html").on("change", browserSync.reload);

})

// gulp.task("open", [], function() {
//     var options = {
//         uri: "http://localhost:5000",
//         app: "chrome"
//     };
//     gulp.src('.')
//         .pipe(open(options))
// })


gulp.task("default", ["clean"], function() {
    gulp.run("html");
    gulp.run("img");
    gulp.run("styles");
    gulp.run("js");
    gulp.run("vendor");
    gulp.run("serve");

    gulp.watch("./index.html", ['html']);
    gulp.watch("css/*.less", ['styles']);



});
