import gulp from 'gulp';
import rename from 'gulp-rename';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import postcssVars from 'postcss-simple-vars';
import postcssNested from 'postcss-nested';
import postcssMixin from 'postcss-mixins';
import postcssImport from 'postcss-import';
import postcssNestedProps from 'postcss-nested-props';
import cssnano from 'cssnano';
import imageWebp from 'gulp-webp';
import del from 'del';
import path from 'path';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const postcssPlugins = [
    postcssImport(),
    postcssVars(),
    postcssNested(),
    postcssNestedProps(),
    postcssMixin(),
    autoprefixer(),
    cssnano()
];

const PATHS = {
    styles: path.resolve(dirname, 'src/assets/styles/main.css'),
    image: path.resolve(dirname, './src/assets/image/**/*'),
    fonts: path.resolve(dirname, 'src/assets/fonts/**/*'),
    templates: path.resolve(dirname, 'src/templates/**/*')
};

function cssTask() {
    return gulp
        .src(PATHS.styles)
        .pipe(postcss(postcssPlugins))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest(path.resolve(dirname, 'dist/assets/styles')));
}

function htmlTask() {
    return gulp
        .src(PATHS.templates)
        .pipe(gulp.dest(path.resolve(dirname, 'dist/templates')));
}

function imageTask() {
    return gulp
        .src(PATHS.image)
        .pipe(
            imageWebp({
                quality: 40
            })
        )
        .pipe(gulp.dest(path.resolve(dirname, 'dist/assets/image')));
}

function fontsTask() {
    return gulp
        .src(PATHS.fonts)
        .pipe(gulp.dest(path.resolve(dirname, 'dist/assets/fonts')));
}

function watch() {
    gulp.watch(['src/assets/styles/**/*'], gulp.parallel(cssTask));
    gulp.watch(['src/assets/fonts/**/*'], gulp.parallel(fontsTask));
    gulp.watch(['src/assets/image/**/*'], gulp.parallel(imageTask));
    gulp.watch(['src/templates/**/*'], gulp.parallel(htmlTask));
}

async function cleanBuild() {
    let delPaths = await del(['./dist/**', '!./dist/js']);

    return delPaths;
}

async function cleanCssFonts() {
    let delPaths = await del(['./dist/assets/fonts/**/*.css']);

    return delPaths;
}

async function gulpWatch() {
    await gulp
        .series(
            cleanBuild,
            imageTask,
            gulp.parallel(cssTask, htmlTask, fontsTask, imageTask),
            watch
        )
        .call(this);

    return true;
}

async function gulpBuild() {
    await gulp
        .series(
            cleanBuild,
            gulp.parallel(cssTask, htmlTask, fontsTask, imageTask),
            cleanCssFonts
        )
        .call(this);

    return true;
}

export { gulpWatch, gulpBuild };
