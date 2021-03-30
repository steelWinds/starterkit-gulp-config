import gulp from 'gulp';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import postcssVars from 'postcss-simple-vars';
import postcssNested from 'postcss-nested';
import postcssMixin from 'postcss-mixins';
import postcssImport from 'postcss-import';
import postcssNestedProps from 'postcss-nested-props';
import cssnano from 'cssnano';
import imageMin from 'gulp-image';
import del from 'del';

const postcssPlugins = [
	postcssImport(),
	postcssVars(),
	postcssNested(),
	postcssNestedProps(),
	postcssMixin(),
	autoprefixer(),
	cssnano(),
];

const PATHS = {
	styles: './src/assets/styles/main.css',
	image: './src/assets/image/**/*',
	fonts: './src/assets/fonts/**/*',
	templates: './src/templates/**/*',
};

function cssTask() {
	return gulp
		.src(PATHS.styles)
		.pipe(postcss(postcssPlugins))
		.pipe(gulp.dest('./dist/styles'));
}

function htmlTask() {
	return gulp.src(PATHS.templates).pipe(gulp.dest('./dist/templates/'));
}

function imageTask() {
	return gulp
		.src(PATHS.image)
		.pipe(imageMin())
		.pipe(gulp.dest('./dist/image'));
}

function fontsTask() {
	return gulp.src(PATHS.fonts).pipe(gulp.dest('./dist/fonts'));
}

function watch() {
	gulp.watch(['./src/assets/styles/**/*'], gulp.parallel(cssTask));
	gulp.watch(['./src/assets/fonts/**/*'], gulp.parallel(fontsTask));
	gulp.watch(['./src/assets/image/**/*'], gulp.parallel(imageTask));
	gulp.watch(['./src/templates/**/*'], gulp.parallel(htmlTask));
}

async function cleanBuild() {
	let delPaths = await del(['./dist/**', '!./dist/js']);

	return delPaths;
}

async function gulpWatch() {
	await gulp
		.series(
			cleanBuild,
			gulp.parallel(cssTask, htmlTask, imageTask, fontsTask),
			watch
		)
		.call(this);

	return true;
}

async function gulpBuild() {
	await gulp
		.series(
			cleanBuild,
			gulp.parallel(cssTask, htmlTask, imageTask, fontsTask)
		)
		.call(this);

	return true;
}

export { gulpWatch, gulpBuild };
