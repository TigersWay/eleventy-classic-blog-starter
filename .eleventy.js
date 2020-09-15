const
  glob = require('fast-glob')
  hljs = require('highlight.js');

const
  site = require('./site/_data/site.js'),
  theme = '_themes/' + (process.env.THEME || site.theme);


module.exports = (eleventyConfig) => {

  // Markdown engine with its plugins
  const Markdown = require('markdown-it')({
    html: true,         // Enable HTML tags in source
    breaks: true,       // Convert '\n' in paragraphs into <br>
    linkify: true,      // Autoconvert URL-like text to links
    typographer: true,  // Enable some language-neutral replacement + quotes beautification
    // quotes: ['«\xA0', '\xA0»', '‹\xA0', '\xA0›']
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (__) {}
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
    });
  eleventyConfig.setLibrary('md', Markdown);

  // Nunjucks engine with its fragments
  const nunjucks = require("nunjucks");
  let nunjucksEnvironment = new nunjucks.Environment(
    new nunjucks.FileSystemLoader([`site/${theme}/layouts`, `site/${theme}/fragments`]),
    {trimBlocks: true, lstripBlocks: true}  // Nunjucks are so much easier to read now!
  );
  eleventyConfig.setLibrary("njk", nunjucksEnvironment);
  eleventyConfig.addNunjucksShortcode('inline', (name, args) => nunjucksEnvironment.render(`${name}.njk`, args));


  // Filters
  glob.sync(['_11ty/filters/*.js', `site/${theme}\filters.js`]).forEach(file => {
    let filters = require('./' + file);
    Object.keys(filters).forEach(name => eleventyConfig.addFilter(name, filters[name]));
  });

  // Shortcodes
  glob.sync(['_11ty/shortcodes/*.js', `site/${theme}\shortcodes.js`]).forEach(file => {
    let shortcodes = require('./' + file);
    Object.keys(shortcodes).forEach(name => eleventyConfig.addShortcode(name, shortcodes[name]));
  });

  // PairedShortcodes
  glob.sync(['_11ty/pairedShortcodes/*.js', `site/${theme}\pairedShortcodes.js`]).forEach(file => {
    let pairedShortcodes = require('./' + file);
    Object.keys(pairedShortcodes).forEach(name => eleventyConfig.addPairedShortcode(name, pairedShortcodes[name]));
  });

  // Collections
  eleventyConfig.addCollection('pages', (collectionApi) => collectionApi.getFilteredByGlob('site/pages/**/*.md'));
  eleventyConfig.addCollection('posts', (collectionApi) => collectionApi.getFilteredByGlob('site/posts/**/*.md'));

  // Transforms
  const {suffix} = require('./_11ty/filters/rename.js');
  eleventyConfig.addTransform('async-transform-images', async (fileContent, outputPath, inputPath) => {
    if (outputPath.endsWith('.html')) {
      let lazy = 0;
      return fileContent.replace(/(<article .*?data-input-path="(.*?)".*?>)([\s\S]*?)(<\/article>)/gim, (match, openingtag, inputPath, content, closingtag) => {
        let imagePath = inputPath.match(/(?:\/posts(\/\d{4}\/\d{2}\/)|\/pages\/)[^\/]*/);
        imagePath = (imagePath) ? (imagePath[1] ? imagePath[1] : '/') : '';
        content = content.replace(/<img src="(?!https?:\/\/)(.*?).jpg" alt="(.*?)">/g, (match, src, alt) => {
          return `<picture><source type="image/webp" srcset="${suffix(`/images${imagePath}${src}.webp`, '-330x')} 330w, ${suffix(`/images${imagePath}${src}.webp`, '-720x')} 720w, ${suffix(`/images${imagePath}${src}.webp`, '-330x@2x')} 2x, ${suffix(`/images${imagePath}${src}.webp`, '-330x@3x')} 3x"><img src="${suffix(`/images${imagePath}${src}.jpg`, '-720x')}" alt="${alt}"${lazy++ ? ' loading="lazy"' : ''}></picture>`
        })
        return `${openingtag}${content}${closingtag}`;
      });
    }
    return fileContent;
  });

  eleventyConfig.setDataDeepMerge(true);

  return {
    templateFormats: ['html', 'md', 'njk', '11ty.js'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',

    dir: {
      input: './site',
      includes: `${theme}/layouts`,
      data: '_data',
      output: './public'
    }
  }
};
