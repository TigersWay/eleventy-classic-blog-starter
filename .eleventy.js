require('dotenv').config();

const
  glob = require('fast-glob'),
  hljs = require('highlight.js'),
  sizeOf = require('image-size'),

  projectName = process.env.npm_package_name,
  theme = process.env.npm_package_config_theme;
// site = require('./site/_data/site.js'),
// theme = '_themes/' + (process.env.THEME || site.theme);


module.exports = (eleventyConfig) => {

  // Engine: Markdown & plugins
  const Markdown = require('markdown-it')({
    html: true,         // Enable HTML tags in source
    breaks: true,       // Convert '\n' in paragraphs into <br>
    linkify: true,      // Autoconvert URL-like text to links
    typographer: true,  // Enable some language-neutral replacement + quotes beautification
    // quotes: ['«\xA0', '\xA0»', '‹\xA0', '\xA0›']
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return '<pre class="hljs"><code>' +
            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
            '</code></pre>';
        } catch (e) { }
      }

      return '';
    }
  })
    .use(require('markdown-it-emoji/light'))
    .use(require('markdown-it-link-attributes'), {
      pattern: /^(https?:)?\/\//,
      attrs: {
        target: '_blank',
        rel: 'noopener'
      }
    })
    .use(require('markdown-it-attrs'), {
      allowedAttributes: ['id', 'class']
    })
    // .use(require('markdown-it-eleventy-img'), {
    //   imgOptions: {
    //     widths: [720, 1440],
    //     urlPath: '/images/',
    //     outputDir: (process.env.NODE_ENV === 'production') ? './build/images' : './public/images'
    //   },
    //   // globalAttributes: { sizes: '(min-width:768px) calc(min(calc(100vw - 22rem), 38rem) - 2rem), calc(min(100vw, 38rem) - 2rem)' },
    //   globalAttributes: { sizes: '(min-width:768px) 720px, 100vw' },
    //   // globalAttributes: { sizes: '100vw' },
    //   // renderImage(image, attributes) {
    //   //   const [Image, options] = image;
    //   //   const [src, attrs] = attributes;
    //   //   console.log(src, attrs);
    //   // },
    //   resolvePath(src, env) {
    //     // console.log('Path', src, env.page, env.page.inputPath.split('/').slice(0, -1).concat(src).join('/'));
    //     return env.page.inputPath.split('/').slice(0, -1).concat(src).join('/');
    //   }
    // })
    ;
  eleventyConfig.setLibrary('md', Markdown);

  // Engine: Nunjucks
  eleventyConfig.setNunjucksEnvironmentOptions({ trimBlocks: true, lstripBlocks: true });


  // Filters
  glob.sync('./site/_filters/*.js').forEach(file => {
    let filters = require('./' + file);
    Object.keys(filters).forEach(name => eleventyConfig.addFilter(name, filters[name]));
  });

  // Shortcodes
  glob.sync('./site/_shortcodes/*.js').forEach(file => {
    let shortcodes = require('./' + file);
    Object.keys(shortcodes).forEach(name => eleventyConfig.addShortcode(name, shortcodes[name]));
  });

  // PairedShortcodes
  glob.sync('./site/_pairedShortcodes/*.js').forEach(file => {
    let pairedShortcodes = require('./' + file);
    Object.keys(pairedShortcodes).forEach(name => eleventyConfig.addPairedShortcode(name, pairedShortcodes[name]));
  });


  // Collections
  eleventyConfig.addCollection('pages', (collectionApi) => collectionApi.getFilteredByGlob('./site/pages/**/*.md'));
  eleventyConfig.addCollection('posts', (collectionApi) => collectionApi.getFilteredByGlob('./site/posts/**/*.md'));


  // Transforms
  // const {suffix} = require('./_11ty/filters/rename.js');
  // eleventyConfig.addTransform('async-transform-images', async (content, outputPath) => {
  //   if (outputPath && outputPath.endsWith(".html")) {
  //     let lazy = 0;
  //     return content.replaceAll(/(<article .*?data-input-path="(.*?)".*?>)([\s\S]*?)(<\/article>)/gim, (match, openingtag, inputPath, content, closingtag) => {
  //       // console.log(outputPath, openingtag, inputPath);
  //       inputPath = inputPath.split('/').slice(2, -1).join('/');
  //       content = content.replaceAll(/<img src="((?!https?:\/\/).*?.jpg)" alt="(.*?)">/g, (match, src, alt) => {
  //         const { width, height } = sizeOf(`site/posts/${inputPath}/${src}`);

  //         //         const size = sizeOf(`site/posts/${imagePath}${src}.jpg`)
  //         //         // return `<picture>
  //         //         // <source type="image/webp" srcset="${suffix(`/images${imagePath}${src}.webp`, '-330x')} 330w, ${suffix(`/images${imagePath}${src}.webp`, '-720x')} 720w, ${suffix(`/images${imagePath}${src}.webp`, '-330x@2x')} 2x, ${suffix(`/images${imagePath}${src}.webp`, '-330x@3x')} 3x">
  //         //         // <img src="${suffix(`/images${imagePath}${src}.jpg`, '-720x')}" alt="${alt}"${lazy++ ? ' loading="lazy"' : ''} width="1920" height="1080">
  //         //         // </picture>`
  //         //         return `<img src="${suffix(`/images${imagePath}${src}.jpg`, '-720x')}" `
  //         //           +`srcset="${suffix(`/images${imagePath}${src}.jpg`, '-360x')} 360w, ${suffix(`/images${imagePath}${src}.jpg`, '-720x')} 720w, ${suffix(`/images${imagePath}${src}.jpg`, '-1080x')} 1080w, ${suffix(`/images${imagePath}${src}.jpg`, '-1440x')} 1440w"
  //         //           sizes="(min-width:768px) calc(min(calc(100vw - 22rem), 38rem) - 2rem), calc(min(100vw, 38rem) - 2rem)"
  //         //           alt="${alt}"${lazy++ ? ' loading="lazy"' : ''} width="${size.width}" height="${size.height}">`;
  //         return `<img src="${process.env.CLOUDINARY_CDN_URL}/f_auto,q_40,w_720/${projectName}/${inputPath}/${src}" alt="${alt}" width="${width}" height="${height}">`;
  //       });
  //       return `${openingtag}${content}${closingtag}`;
  //     });
  //   }
  //   return content;
  // });

  eleventyConfig.addPassthroughCopy({ 'site/static': '.' });
  eleventyConfig.addPassthroughCopy({ [`site/_themes/${theme}/static`]: '.' });
  eleventyConfig.addPassthroughCopy({ 'node_modules/@fontsource/{abril-fatface,pt-sans}/files/{abril-fatface,pt-sans}-latin-{400,700}*.woff2': 'css/files' });
  eleventyConfig.setServerPassthroughCopyBehavior("copy");

  if (process.env.NODE_ENV === 'production') {


  }

  // eleventyConfig.addWatchTarget(`site/${theme}/css`);
  // eleventyConfig.setWatchThrottleWaitTime(300);


  return {
    templateFormats: ['md', 'njk'],
    markdownTemplateEngine: 'njk',

    dir: {
      input: './site',
      includes: `_themes/${theme}/layouts`,
      output: './public'
    }
  };
};
