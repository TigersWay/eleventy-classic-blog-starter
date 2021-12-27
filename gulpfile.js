// Gulp & Options

const
  {src, dest, watch, series, parallel} = require('gulp'),
  $ = require('gulp-load-plugins')({maintainScope: false});


// Variables & parameters

const
  destPath = 'public',

  site = require('./site/_data/site.js'),
  theme = '_themes/' + (process.env.THEME || site.theme);


// Tasks

const clean = async () => await require('del')([`${destPath}/**`, `!${destPath}`]);


const buildHTML = () => {
  return require('child_process').spawn('npx',
    ['@11ty/eleventy', '--quiet'], {
      shell: true,
      stdio: 'inherit'
    });
};
// const watchHTML = () => watch(['site/**/*.{md,njk,11tydata.js}', '_11ty/**/*.js', '.eleventy.js'], buildHTML);


const buildCSS = () => {
  return src(`site/${theme}/css/styles.css`, {base: `site/${theme}`})
    .pipe($.postcss())
    .pipe($.cleanCss({
      level: {
        2: {restructureRules: true}
      }
    }))
    .pipe(dest(`site/${theme}/layouts`));
};
const watchCSS = () => watch(`site/${theme}/css/styles.css`, { ignoreInitial: false }, buildCSS);


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
const watchImages = () => watch('site/{posts,pages}/**/*.jpg', { ignoreInitial: false }, buildImages);


const serve = () => {
  // return require('browser-sync')
  //   .init({
  //     server: destPath,
  //     files: [
  //       `${destPath}/**/*.html`,
  //       `${destPath}/css/*.css`,
  //       `${destPath}/images/*`
  //     ],
  //     browser: (process.env.BROWSER) ? process.env.BROWSER : 'default'
  //   });
  return require('child_process').spawn('npx',
    ['@11ty/eleventy', '--serve'], {
      shell: true,
      stdio: 'inherit'
    });
};


module.exports = {
  // clean: clean,

  // buildHTML: buildHTML,
  // watchCSS,
  // buildCSS,
  // buildImages: buildImages,

  live: parallel(watchCSS, watchImages, serve),

  build: series(clean, buildCSS, buildHTML, buildImages)

};
