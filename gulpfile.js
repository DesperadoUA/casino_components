'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require("browser-sync");
const cache = require('gulp-cached');
const cleanCSS = require('gulp-clean-css');
const cheerio = require('gulp-cheerio');
const del = require('del');
const imagemin = require('gulp-imagemin');
const path = require('path');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const posthtmlAttrsSorter = require('posthtml-attrs-sorter');
const rigger = require('gulp-rigger');
const replace = require('gulp-replace');
const runSequence = require('gulp4-run-sequence');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const svgmin = require('gulp-svgmin');
const reload = browserSync.reload;
const webp = require('gulp-webp');
const surge = require('gulp-surge');
const tinypng = require('gulp-tinypng-compress');
const zip = require('gulp-zip');

// Plugins options
// fetch command line arguments
const arg = (argList => {
    let arg = {}, a, opt, thisOpt, curOpt;
    for (a = 0; a < argList.length; a++) {
        thisOpt = argList[a].trim();
        opt = thisOpt.replace(/^\-+/, '');

        if (opt === thisOpt) {
            // argument value
            if (curOpt) arg[curOpt] = opt;
            curOpt = null;
        } else {
            // argument name
            curOpt = opt;
            arg[curOpt] = true;
        }
    }
    return arg;

})(process.argv);

if (typeof arg.p === "boolean" || typeof arg.p === 'undefined') {
    arg.p = '';
} else {
    arg.p = arg.p + '/';
}

const options = {
    src: { // Source paths
        html: arg.p + 'src/*.html',
        js: arg.p + 'src/js/**/*.js',
        style: arg.p + 'src/components/**/*.scss',
        img: arg.p + 'src/img/**/*.{svg,png,jpg}',
        favicon: arg.p + 'src/favicon/*.*',
        icons: arg.p + 'src/components/svg-icons/*.svg',
        fonts: arg.p + 'src/fonts/**/*',
        uploads: arg.p + 'src/uploads/**/*.*',
        static: arg.p + 'src/media/**/*'
    },
    watch: { // Watch files
        html: arg.p + 'src/**/*.html',
        js: arg.p + 'src/js/**/*.js',
        style: arg.p + 'src/components/**/*.scss',
        img: arg.p + 'src/img/**/*.*',
        icons: arg.p + 'src/components/svg-icons/*.svg',
        fonts: arg.p + 'src/fonts/**/*',
        uploads: arg.p + 'src/uploads/**/*.*',
        static: arg.p + 'src/media/**/*'
    },
    dist: { // Dist paths
        html: arg.p + 'dist/',
        js: arg.p + 'dist/js/',
        css: arg.p + 'dist/components/',
        img: arg.p + 'dist/img/',
        favicon: arg.p + 'dist/favicon/',
        uploads: arg.p + 'dist/uploads/',
        icons: arg.p + 'src/components/svg-icons/'
    },

    svgSprite: {
        title: 'Icon %f',
        id: 'icon-%f',
        className: 'icon-%f',
        svgClassname: 'icons-sprite',
        templates: [
            //path.join(__dirname, arg.p + 'src/components/svg-icons/icons-template.scss'),
            path.join(__dirname, arg.p + 'src/components/svg-icons/icons-template.html')
        ]
    },

    imagemin: {
        images: [
            $.imagemin.gifsicle({
                interlaced: true,
                optimizationLevel: 3
            }),
            $.imagemin.mozjpeg({
                quality: 91,
                progressive: true
            }),
            $.imagemin.optipng({
                optimizationLevel: 5
            }),
            $.imagemin.svgo({
                plugins: [
                    {removeViewBox: false},
                    {removeDimensions: true},
                    {cleanupIDs: false}
                ]
            })
        ],

        icons: [
            $.imagemin.svgo({
                plugins: [
                    {removeTitle: false},
                    {removeStyleElement: false},
                    {removeAttrs: {attrs: ['id', 'class', 'data-name', 'fill', 'fill-rule']}},
                    {removeEmptyContainers: true},
                    {sortAttrs: true},
                    {removeUselessDefs: true},
                    {removeEmptyText: true},
                    {removeEditorsNSData: true},
                    {removeEmptyAttrs: true},
                    {removeHiddenElems: true},
                    {transformsWithOnePath: true}
                ]
            })
        ],

        plumber: {
            errorHandler: errorHandler
        }
    },

    posthtml: {
        plugins: [
            posthtmlAttrsSorter({
                order: [
                    'class',
                    'id',
                    'name',
                    'data',
                    'ng',
                    'src',
                    'for',
                    'type',
                    'href',
                    'values',
                    'title',
                    'alt',
                    'role',
                    'aria'
                ]
            })
        ],
        options: {}
    },

    htmlPrettify: {
        indent_char: ' ',
        indent_size: 4
    },

    del: [
        arg.p + 'dist/**',
        '!' + arg.p + 'dist/robots.txt'
    ]
};

// configuration for localhost
var configServer = {
    server: {
        baseDir: arg.p + 'dist/'
    },
    host: 'localhost',
    port: 8080,
    open: true,
    logPrefix: "Frontend",
    notify: false
};

/* All tasks */

// Error handler for gulp-plumber
function errorHandler(err) {
    $.util.log([(err.name + ' in ' + err.plugin).bold.red, '', err.message, ''].join('\n'));

    this.emit('end');
}

// livereload
gulp.task('webserver', function () {
    browserSync(configServer);
});

//task for js build
gulp.task('js:build', function () {
    return gulp.src(options.src.js)
    //.pipe(rigger())
    //.pipe($.sourcemaps.init())
    //.pipe($.uglify())
    //.pipe($.sourcemaps.write())
        .pipe(gulp.dest(options.dist.js))
        .pipe(reload({stream: true}));
});

//task for style build
gulp.task('style:build', function () {
    return gulp.src(options.src.style)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        //.pipe(sourcemaps.init())
        //.pipe(postcss(plugins))
        //.pipe(sourcemaps.write('.'))
        //.pipe($.cssmin())
        .pipe(plumber.stop())
        .pipe(gulp.dest(options.dist.css))
        .pipe(reload({stream: true}));
});

//task for style min
gulp.task('style:min', () =>
    gulp.src(options.src.style)
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({debug: true}, function (details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(gulp.dest(options.dist.css))
);

gulp.task('html:build', () =>
    gulp.src([options.src.html])
        .pipe($.plumber(options.plumber))
        .pipe(rigger())
        .pipe(gulp.dest(options.dist.html))
        .pipe(reload({stream: true}))
);

gulp.task('icons:build', () =>
    gulp.src([options.src.icons])
        .pipe($.plumber(options.plumber))
        .pipe(cheerio({
            /*run: function ($) {
              $('[fill]').removeAttr('fill');
              $('[style]').removeAttr('style');
            },*/
            parserOptions: {xmlMode: true}
        }))
        .pipe(replace('&gt;', '>'))
        .pipe(svgmin({
            plugins: [{
                removeDoctype: false
            }, {
                removeComments: true
            }, {
                cleanupNumericValues: {
                    floatPrecision: 2
                }
            }, {
                convertColors: {
                    names2hex: true,
                    rgb2hex: true
                }
            }]
        }))
        .pipe($.svgSymbols(options.svgSprite))
        .pipe($.if(/\.html$/, $.rename({
            basename: "icons"
        })))
        .pipe($.if(/\.html/, gulp.dest(options.dist.icons)))
);

gulp.task('image:webp', () =>
    gulp.src([options.src.img,
        '!**/*.svg',
        '!' + options.src.favicon],
        {base: arg.p + 'src'}
    )
        .pipe(cache())
        .pipe(webp({
            quality: 91,
            method: 4
        }))
        .pipe(gulp.dest(options.dist.html))
);

gulp.task('image:copy', gulp.series('image:webp', () =>
    gulp.src([
        options.src.img,
        options.src.favicon,
        '!' + options.src.icons],
        {base: arg.p + 'src'}
    )
        .pipe(gulp.dest(options.dist.html))
        .pipe(reload({stream: true}))
));

gulp.task('image:min', gulp.series('image:copy', () =>
    gulp.src([options.src.img,
            '!' + options.src.svg,
            '!**/*.svg',
            '!' + options.src.favicon,
            {base: arg.p + 'src'}
        ]
    )
        .pipe(imagemin(options.imagemin.images))
        .pipe(gulp.dest(options.dist.html))
));

gulp.task('tinypng', async function () {
    gulp.src([options.src.img,
            '!' + options.src.favicon
        ]
    )
        .pipe(tinypng({
            key: 'ccTD120tSFZHRwl6LhF7QS79rJFgrf4Z',
            sigFile: 'images/.tinypng-sigs',
            log: true,
            summarize: true
        }))
        .pipe(gulp.dest(options.dist.img))
});

//task for static copy
gulp.task('static:build', function () {
    return gulp.src([options.src.favicon, options.src.fonts, options.src.static], {base: arg.p + 'src'})
        .pipe(gulp.dest(options.dist.html))
});

gulp.task('cleanup', function (cb) {
    return del([options.del, {force: true}], cb());
});

gulp.task('robots', function(cb){
    fs.writeFile('robots.txt', 'contents', cb);
});

gulp.task('zip', async function () {
    gulp.src(options.dist.html)
        .pipe(zip(arg + '.zip'))
        .pipe(gulp.dest(options.dist.html))
});

/*
  Tasks:
  * build (gulp build) -- start building task
  * production (gulp prod) -- minification files (now - only CSS)
  * deploy (gulp deploy) -- deploying on configured server
  * watch (gulp watch)
*/

let surgeDomain = arg.p.replace('/', '') + '.surge.sh'

gulp.task('surge', function () {
    surgeDomain;
    return surge({
        project: arg.p + 'dist',
        domain: surgeDomain // Your domain or Surge subdomain
    })
})

// watch task
gulp.task('watch', function () {
    $.watch(options.watch.html, gulp.series('html:build'));
    $.watch(options.watch.fonts, gulp.series('static:build'));
    $.watch(options.watch.js, gulp.series('js:build'));
    $.watch(options.watch.img, gulp.series('image:copy'));
    $.watch(options.watch.static, gulp.series('static:build'));
    //$.watch(options.watch.icons, gulp.series('icons:build'));
    $.watch(options.watch.style, gulp.series('style:build'));
});

// watch task
gulp.task('front-watcher', function () {
    $.watch(options.watch.style, gulp.series('style:build'));
    $.watch(options.watch.html, gulp.series('html:build'));
    $.watch(options.watch.js, gulp.series('js:build'));
});

gulp.task('dev', function (cb) {
    return runSequence(
        [
            'webserver',
            'front-watcher'
        ],
        cb
    );
});

gulp.task('build', function (cb) {
    return runSequence(
        'cleanup',
        'html:build',
        'js:build',
        'style:build',
        'image:copy',
        //'icons:build',
        'static:build',
        cb
    );
});

gulp.task('prod', function (cb) {
    return runSequence(
        'cleanup',
        'html:build',
        'js:build',
        'static:build',
        'style:min',
        'image:webp',
        'tinypng',
        cb
    );
});

// main default task
gulp.task('deploy', function (cb) {
    return runSequence(
        'cleanup',
        'html:build',
        'js:build',
        'static:build',
        'style:min',
        'image:webp',
        'image:min',
        'surge',
        cb
    );
});

// main default task
gulp.task('default', function (cb) {
    return runSequence(
        'build',
        [
            'webserver',
            'watch'
        ],
        cb
    );
});
