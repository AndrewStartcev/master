const { src, dest, watch, parallel, series } = require("gulp");
const scss = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const uglify = require("gulp-uglify-es").default;
const imagemin = require("gulp-imagemin");
const fileinclude = require("gulp-file-include");
const htmlhint = require("gulp-htmlhint");
const htmlbeautify = require("gulp-html-beautify");
const plumber = require('gulp-plumber')
const pug = require('gulp-pug')
const pugLinter = require('gulp-pug-linter')

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "../dist/",
        },
    });
}
function pug2html() {
    return src('../app/pages/*.pug')
        .pipe(plumber())
        .pipe(pugLinter({ reporter: 'default' }))
        .pipe(pug({ pretty: { beautifyHtml: true } }))
        .pipe(dest('../dist'))
}
function styles() {
    return src("../app/scss/style.scss")
        .pipe(scss({ outputStyle: "compressed" }))
        .pipe(concat("style.min.css"))
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 10 version"],
                grid: true,
            })
        )
        .pipe(dest("../dist/assets/css"))
        .pipe(browserSync.stream());
}
function stylesVendor() {
    return src("../app/assets/library/**/*.css")
        .pipe(scss({ outputStyle: "compressed" }))
        .pipe(concat("vendor.min.css"))
        .pipe(dest("../dist/assets/library"))
        .pipe(browserSync.stream());
}
function htmlRun() {
    const options = {
        indent_size: 2,
        inline: "body",
    };
    return src("../app/*.html")
        .pipe(
            fileinclude({
                prefix: "@@",
                basepath: "@file",
            })
        )
        .pipe(htmlhint())
        .pipe(htmlbeautify(options))
        .pipe(dest("../dist"));
}
function scripts() {
    return src(["../app/assets/js/main.js"]).pipe(concat("main.min.js")).pipe(uglify()).pipe(dest("../dist/assets/js")).pipe(browserSync.stream());
}
function scriptsVendor() {
    return src(["../app/assets/library/**/*"]).pipe(concat("vendor.min.js")).pipe(uglify()).pipe(dest("../dist/assets/library")).pipe(browserSync.stream());
}
function images() {
    return src("../app/assets/img/**/*.{gif,png,jpg,svg,webp}")
        .pipe(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.mozjpeg({ quality: 75, progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
                }),
            ])
        )
        .pipe(dest("../dist/assets/img/"));
}
function cleanDist() {
    return del("../dist");
}
function watchingFonts() {
    return src(["../app/assets/fonts/**/*"]).pipe(dest("../dist/assets/fonts"));
}
function watchingPhp() {
    return src(["../app/assets/php/**/*"]).pipe(dest("../dist/assets/php"));
}
function watching() {
    watch(["../app/assets/fonts/**/*"], watchingFonts);
    watch([".../app/assets/php/**/*"], watchingPhp);
    watch(["../app/scss/**/*.scss"], styles);
    watch(["../app/assets/library/**/*.css"], stylesVendor);
    watch(["../app/assets/img/**/*"], images);
    watch(["../app/**/*.html"], htmlRun);
    watch(["../app/**/*.pug"], pug2html);
    watch(["../app/assets/js/*.js"], scripts);
    watch(["../app/assets/library/**/*.js"], scriptsVendor);
    watch(["../app/assets/img/**/*"]).on("change", browserSync.reload);
    watch(["../dist/**/*.html"]).on("change", browserSync.reload);
}

exports.browsersync = browsersync;
exports.styles = styles;
exports.stylesVendor = stylesVendor;
exports.htmlRun = htmlRun;
exports.scripts = scripts;
exports.scriptsVendor = scriptsVendor;
exports.images = images;
exports.watching = watching;
exports.cleanDist = cleanDist;
exports.pug2html = pug2html

exports.default = parallel(
    styles,
    stylesVendor,
    scripts, scriptsVendor,
    images, watchingPhp,
    watchingFonts,
    htmlRun,
    watching,
    pug2html,
    browsersync
);
exports.css = parallel(
    styles,
);
