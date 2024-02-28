const gulp = require("gulp") // gulp 기본 모듈
const concat = require("gulp-concat") // 여러 파일을 하나로 합쳐주는 플러그인
const uglify = require("gulp-uglify") // 최적화를 위한 플러그인
const sourcemaps = require("gulp-sourcemaps") // 코드상의 위치를 알려주는 플러그인
const scss = require("gulp-sass")(require("sass")) // scss & sass 플러그인
const browserSync = require("browser-sync").create() // 브라우저 자동 새로고침 플러그인
const fileInclude = require("gulp-file-include") // html 템플릿 플러그인

const scssOption = {
  outputStyle: "expanded",
  indentType: "tab",
  indentWidth: 1,
  precision: 6,
  sourceComments: true,
}

/**
 * @task : javascript 관련 task
 */
gulp.task("js-compile", () => {
  return gulp
    .src(["src/js/*.js"])
    .pipe(concat("test.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist/js"))
    .pipe(browserSync.reload({ stream: true }))
})
/**
 * @task : scss 관련 task
 */
gulp.task("scss-compile", () => {
  return gulp
    .src("src/scss/*.scss")
    .pipe(sourcemaps.init())
    .pipe(scss(scssOption).on("error", scss.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.reload({ stream: true }))
})
/**
 * @task : html 관련 task
 */
gulp.task("html-compile", () => {
  return gulp
    .src("src/html/*.html")
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(gulp.dest("dist/html"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    )
})
/**
 * @task : watch 파일 변경 감지
 */
gulp.task("watch", () => {
  gulp.watch(
    ["src/html/*.html", "src/html/**/*.html"],
    gulp.series(["html-compile"])
  )
  gulp.watch("src/js/*.js", gulp.series(["js-compile"]))
  gulp.watch("src/scss/*.scss", gulp.series(["scss-compile"]))
})

/**
 * @task : browserSync 실행
 */
gulp.task(
  "browserSync",
  gulp.series(["html-compile", "js-compile", "scss-compile"]),
  () => {
    return browserSync.init({
      port: 3333,
      server: {
        baseDir: "./dist",
      },
    })
  }
)
/**
 * @task : default task
 */
gulp.task("default", gulp.parallel(["browserSync", "watch"]))
