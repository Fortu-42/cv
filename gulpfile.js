var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
var header = require("gulp-header");
var cleanCSS = require("gulp-clean-css");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var pkg = require("./package.json");

// Compiles SCSS files from /scss into /css
gulp.task("sass", function() {
  return gulp
    .src("scss/style.scss")
    .pipe(sass())
    .pipe(gulp.dest("css"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

// Minify compiled CSS
gulp.task("minify-css", function(done) {
  return gulp
    .src("css/style.css")
    .pipe(
      cleanCSS({
        compatibility: "ie8"
      })
    )
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest("css"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
  done();
});

// Minify custom JS
// gulp.task('minify-js', function() {
//   return gulp.src('js/resume.js')
//     .pipe(uglify())
//     .pipe(header(banner, {
//       pkg: pkg
//     }))
//     .pipe(rename({
//       suffix: '.min'
//     }))
//     .pipe(gulp.dest('js'))
//     .pipe(browserSync.reload({
//       stream: true
//     }))
// });

// Copy vendor files from /node_modules into /vendor
// NOTE: requires `npm install` before running!
gulp.task("copy", function(done) {
  gulp
    .src([
      "node_modules/bootstrap/dist/**/*",
      "!**/npm.js",
      "!**/bootstrap-theme.*",
      "!**/*.map"
    ])
    .pipe(gulp.dest("vendor/bootstrap"));

  gulp
    .src([
      "node_modules/jquery/dist/jquery.js",
      "node_modules/jquery/dist/jquery.min.js"
    ])
    .pipe(gulp.dest("vendor/jquery"));

  gulp
    .src(["node_modules/jquery.easing/*.js"])
    .pipe(gulp.dest("vendor/jquery-easing"));

  gulp
    .src([
      "node_modules/font-awesome/**",
      "!node_modules/font-awesome/**/*.map",
      "!node_modules/font-awesome/.npmignore",
      "!node_modules/font-awesome/*.txt",
      "!node_modules/font-awesome/*.md",
      "!node_modules/font-awesome/*.json"
    ])
    .pipe(gulp.dest("vendor/font-awesome"));

  gulp
    .src([
      "node_modules/devicons/**/*",
      "!node_modules/devicons/*.json",
      "!node_modules/devicons/*.md",
      "!node_modules/devicons/!PNG",
      "!node_modules/devicons/!PNG/**/*",
      "!node_modules/devicons/!SVG",
      "!node_modules/devicons/!SVG/**/*"
    ])
    .pipe(gulp.dest("vendor/devicons"));

  gulp
    .src([
      "node_modules/simple-line-icons/**/*",
      "!node_modules/simple-line-icons/*.json",
      "!node_modules/simple-line-icons/*.md"
    ])
    .pipe(gulp.dest("vendor/simple-line-icons"));
  done();
});

// Default task
gulp.task("default", gulp.series("sass", "minify-css", "copy"));

// Configure the browserSync task
gulp.task("browserSync", function(done) {
  browserSync.init({
    server: {
      baseDir: "./",
      index: "index.html"
    }
  });
  done();
});

// Dev task with browserSync
gulp.task(
  "dev",
  gulp.series("browserSync", "sass", "minify-css", function(done) {
    gulp.watch("scss/*.scss", gulp.parallel(["sass"]));
    gulp.watch("css/style.css", gulp.parallel(["minify-css"]));
    // Reloads the browser whenever HTML or JS files change
    gulp.watch("*.html", gulp.parallel(browserSync.reload));
    done();
  })
);
