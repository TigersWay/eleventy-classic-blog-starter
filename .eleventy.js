const
  glob = require('fast-glob')
  hljs = require('highlight.js');

const
  site = require('./site/_data/site.js'),
  theme = '_themes/' + (process.env.THEME || site.theme);


module.exports = (eleventyConfig) => {

  // Markdown engine &  plugins
  eleventyConfig.setLibrary(
    'md',
    require('markdown-it')({
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
    })
  );

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
      return fileContent.replace(/(<article .*?data-input-path="(.*?)".*?>)([\s\S]*?)(<\/article>)/gim, (match, openingtag, inputPath, content, closingtag) => {
        let imagePath = inputPath.match(/(?:\/posts(\/\d{4}\/\d{2}\/)|\/pages\/)[^\/]*/);
        imagePath = (imagePath) ? (imagePath[1] ? imagePath[1] : '/') : '';
        content = content.replace(/<img src="(?!https?:\/\/)(.*?)" alt="(.*?)">/g, (match, src, alt) => {
          return `<img src="${suffix(`/images${imagePath}${src}`, '-720x')}" alt="${alt}" srcset="${suffix(`/images${imagePath}${src}`, '-420x')} 420w, ${suffix(`/images${imagePath}${src}`, '-720x')} 720w">`;
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
      layouts: `${theme}`,
      includes: `${theme}/includes`,
      data: '_data',
      output: './public'
    }
  }
};
