/*eslint-env node */

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var jasmine = require('gulp-jasmine-phantom');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');

gulp.task('copy-html', copyHTML);
gulp.task('copy-css', copyCSS);
gulp.task('copy-images', copyImages);
gulp.task('styles', buildSaas);
gulp.task('lint', lintJS);
gulp.task('scripts', buildJS);
gulp.task('test', unitTesting);
gulp.task('watch', watchFiles);
gulp.task('scripts-dist', scriptsDist);

gulp.task('default', gulp.series('copy-html', 'copy-css', 'copy-images', 'styles', 'scripts', 'watch')); //'lint', 
gulp.task('dist', gulp.series('copy-html', 'copy-css', 'copy-images','styles','lint','scripts-dist'));

function watchFiles() {
	gulp.watch('src/sass/**/*.scss', gulp.series('styles'));
	gulp.watch('src/js/**/*.js', gulp.series('lint'));
	gulp.watch('src/index.html', gulp.series('copy-html'));
	gulp.watch('./dist/index.html').on('change', browserSync.reload);
	browserSync.init({
		server: './dist'
	});
};

function buildJS(done) {
	gulp.src('src/js/vendor/*.js')
        .pipe(gulp.dest('dist/js'));
	gulp.src('src/js/**/dgj*.js')
        .pipe(babel())
		.pipe(concat('all.js'))
		.pipe(gulp.dest('dist/js'));
    done();
};

function scriptsDist(done) {
	gulp.src('src/js/vendor/*.js')
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'));
	gulp.src('src/js/**/dgj*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
		.pipe(concat('all.js'))
		.pipe(uglify())
        .pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/js'));
    done();
};

function copyHTML(done) {
	gulp.src('./src/*.html')
		.pipe(gulp.dest('./dist'));
    done();
};

function copyCSS(done) {
	gulp.src('./src/css/**/*.css')
		.pipe(gulp.dest('./dist/css'));
    done();
};

function copyImages(done) {
	gulp.src('src/img/*')
		.pipe(gulp.dest('dist/img'));
    done();
};

function buildSaas(done) {
	gulp.src('src/sass/**/*.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
    done();
};

function lintJS(done) {
	return gulp.src(['src/js/**/*.js'])
		// eslint() attaches the lint output to the eslint property
		// of the file object so it can be used by other modules.
		.pipe(eslint())
		// eslint.format() outputs the lint results to the console.
		// Alternatively use eslint.formatEach() (see Docs).
		.pipe(eslint.format())
		// To have the process exit with an error code (1) on
		// lint error, return the stream and pipe to failOnError last.
		.pipe(eslint.failOnError());
    done();
};

function unitTesting(done) {
	gulp.src('src/tests/spec/extraSpec.js')
		.pipe(jasmine({
			integration: true,
			vendor: 'src/js/**/*.js'
		}));
    done();
};