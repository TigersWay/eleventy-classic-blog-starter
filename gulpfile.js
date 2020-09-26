// Gulp & Options

const
  {src, dest, watch, series, parallel} = require('gulp'),
  $ = require('gulp-load-plugins')({maintainScope: false});


// Variables & parameters

const
  // isProduction = (process.env.NODE_ENV === 'production'),
  // pkg = require('./package.json'),
  site = require('./site/_data/site.js'),
  destPath = 'public',
  theme = '_themes/' + (process.env.THEME || site.theme);


// Tasks

const clean = async () => await require('del')([`${destPath}/**`, `!${destPath}`]);


const justCopy = () => src([
  `site/${theme}/favicon.ico`,
  `site/${theme}/favicon-32x32.png`,
  `site/${theme}/apple-touch-icon.png`,
  // Any other file(s)
])
  .pipe(src(`site/${theme}/fonts/*.woff*`, {base: `site/${theme}`}))
  .pipe(dest(destPath));


const buildHTML = () => {
  return require('child_process').spawn('npx',
    ['@11ty/eleventy', '--quiet'], {
      shell: true,
      stdio: 'inherit'
    });
};
const watchHTML = () => watch(['site/**/*.{md,njk,11tydata.js}', '_11ty/**/*.js', '.eleventy.js'], buildHTML);


const buildCSS = () => {
  return src(`site/${theme}/css/styles.css`, {base: `site/${theme}`})
    .pipe(src('./node_modules/highlight.js/styles/github.css'))
    .pipe($.concat('css/styles.css'))
    // .pipe($.header('/*! ${pkg.name} v${pkg.version} | ${pkg.license} | ${ pkg.author} */', {pkg: pkg}))
    .pipe($.cleanCss({
      // format: {
      //   breakWith: 'unix',
      //   breaks: {afterComment: true, afterRuleEnds: !isProduction}
      // },
      level: {
        // 1: {specialComments: '1'},
        2: {restructureRules: true}
      }
    }))
    // .pipe($.rename({suffix: '.min'}))
    // .pipe(dest(destPath));
    .pipe(dest(`site/${theme}/layouts`));
};
const watchCSS = () => watch(`site/${theme}/css/styles.css`, buildCSS);


const buildImages = () => {
  return src(['site/posts/**/*.jpg', 'site/pages/**/*.jpg'])
    .pipe($.responsive({
      '**/*': [{
        resize: {width: 720},
        rename: {suffix: '-720x'}
      },{
        resize: {width: 330},
        webp: {},
        rename: {suffix: '-330x', extname: '.webp'}
      },{
        resize: {width: 720},
        webp: {},
        rename: {suffix: '-720x', extname: '.webp'}
      },{
        resize: {width: 660},
        webp: {},
        rename: {suffix: '-330x@2x', extname: '.webp'}
      },{
        resize: {width: 990},
        webp: {},
        rename: {suffix: '-330x@3x', extname: '.webp'}
      }]
    }))
    .pipe($.newer(`${destPath}/images`))
    .pipe($.vinylFlow())
    .pipe(dest(`${destPath}/images`));
};
const watchImages = () => watch('site/{posts,pages}/**/*.jpg', buildImages);


const serve = () => {
  return require('browser-sync')
    .init({
      server: destPath,
      files: [
        `${destPath}/**/*.html`,
        `${destPath}/css/*.css`,
        `${destPath}/images/*`
      ],
      browser: (process.env.BROWSER) ? process.env.BROWSER : 'default'
    });
};


module.exports = {
  clean: clean,
  justCopy: justCopy,

  buildHTML: buildHTML,
  buildCSS: buildCSS,
  buildImages: buildImages,

  build: series(
    clean,
    parallel(justCopy, series(buildCSS, buildHTML, buildImages))
  ),

  live: parallel(watchHTML, watchCSS, watchImages, serve)
};
