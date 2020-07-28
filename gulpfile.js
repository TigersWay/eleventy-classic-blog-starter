// Gulp & Options

const
  {src, dest, watch, series, parallel} = require('gulp'),
  $ = require('gulp-load-plugins')({maintainScope: false});


// Variables & parameters

const
  isProduction = (process.env.NODE_ENV === 'production'),
  pkg = require('./package.json'),
  site = require('./site/_data/site.js'),
  destPath = 'public',
  theme = '_themes/' + (process.env.THEME || site.theme);


// Tasks

const clean = async () => await require('del')([`${destPath}/**`, `!${destPath}`]);


const justCopy = () => src([
  'site/favicon.ico',
  // Any other file(s)
])
  // .pipe(src( And more if needed ))
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
    .pipe($.header('/*! ${pkg.name} v${pkg.version} | ${pkg.license} | ${ pkg.author} */', {pkg: pkg}))
    .pipe($.cleanCss({
      format: {
        breakWith: 'unix',
        breaks: {afterComment: true, afterRuleEnds: !isProduction}
      },
      level: {
        1: {specialComments: '1'},
        2: {restructureRules: true}
      }
    }))
    .pipe($.rename({suffix: '.min'}))
    .pipe(dest(destPath));
};
const watchCSS = () => watch(`site/${theme}/css/styles.css`, buildCSS);


const buildImages = () => {
  return src('site/posts/**/*.{jpg,png}', {})
    .pipe(dest(`${destPath}/images`));
};
const watchImages = () => watch('site/posts/**/*.{jpg,png}', buildImages);


const serve = () => {
  return require('browser-sync')
    .init({
      server: destPath,
      files: [
        `${destPath}/**/*.html`,
        `${destPath}/css/*.css`,
        `${destPath}/images/*`
      ],
      // browser: [...(process.env.BROWSER) ? [process.env.BROWSER] : []]
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
    parallel(justCopy, buildCSS, series(buildHTML, buildImages))
  ),

  live: parallel(watchHTML, watchCSS, watchImages, serve)
};