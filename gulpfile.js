const gulp = require("gulp"),
	browserSync = require("browser-sync").create(),
	watch = require("gulp-watch"),
	sass = require("gulp-sass"),
	autoprefixer = require("gulp-autoprefixer"),
	sourcemaps = require("gulp-sourcemaps"),
	notify = require("gulp-notify"),
	plumber = require("gulp-plumber"),
	pug = require("gulp-pug"),
	del = require("del");

gulp.task("pug", function(callback) {
	return gulp
		.src("./src/pug/pages/**/*.pug")
		.pipe(
			plumber({
				errorHandler: notify.onError(function(err) {
					return {
						title: "Pug",
						sound: false,
						message: err.message
					};
				})
			})
		)
		.pipe(
			pug({
				pretty: true
			})
		)
		.pipe(gulp.dest("./docs/"))
		.pipe(browserSync.stream());
	callback();
});

gulp.task("sass", function(callback) {
	return gulp
		.src("./src/sass/main.sass")
		.pipe(
			plumber({
				errorHandler: notify.onError(function(err) {
					return {
						title: "Styles",
						sound: false,
						message: err.message
					};
				})
			})
		)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(
			autoprefixer({
				overrideBrowserslist: ["last 4 versions"]
			})
		)
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("./docs/css/"))
		.pipe(browserSync.stream());
	callback();
});

gulp.task("copy:img", function(callback) {
	return gulp.src("./src/img/**/*.*").pipe(gulp.dest("./docs/img/"));
	callback();
});

gulp.task("copy:js", function(callback) {
	return gulp.src("./src/js/**/*.*").pipe(gulp.dest("./docs/js/"));
	callback();
});

gulp.task("copy:libs", function(callback) {
	return gulp.src("./src/libs/**/*.*").pipe(gulp.dest("./docs/libs/"));
	callback();
});

gulp.task("watch", function() {
	watch(["./docs/js/**/*.*", "./docs/img/**/*.*"], gulp.parallel(browserSync.reload));

	watch("./src/sass/**/*.sass", function() {
		setTimeout(gulp.parallel("sass"), 500);
	});

	watch("./src/pug/**/*.pug", gulp.parallel("pug"));

	watch("./src/img/**/*.*", gulp.parallel("copy:img"));
	watch("./src/js/**/*.*", gulp.parallel("copy:js"));
	watch("./src/libs/**/*.*", gulp.parallel("copy:libs"));
});

gulp.task("server", function() {
	browserSync.init({
		server: {
			baseDir: "./docs/"
		}
	});
});

gulp.task("clean:docs", function() {
	return del("./docs/");
});

gulp.task("default", gulp.series(gulp.parallel("clean:docs"), gulp.parallel("sass", "pug", "copy:img", "copy:js", "copy:libs"), gulp.parallel("server", "watch")));
