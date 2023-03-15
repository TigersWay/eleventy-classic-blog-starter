require('dotenv').config();

const
  glob = require('fast-glob'),
  hljs = require('highlight.js'),

  projectName = process.env.npm_package_name,
  theme = process.env.npm_package_config_theme;


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
    .use(require('markdown-it-eleventy-img'), {
      imgOptions: {
        widths: [720, 1080, 1440, 1800],
        urlPath: '/images/',
        outputDir: (process.env.NODE_ENV === 'production') ? './build/images' : './public/images'
      },
      globalAttributes: {
        loading: 'lazy',
        sizes: '(min-width: 1340px) 720px, (min-width: 1040px) calc(85.71vw - 411px), (min-width: 940px) calc(100vw - 480px), (min-width: 780px) calc(100vw - 384px), calc(98.26vw - 27px)'
      },
      resolvePath(src, env) {
        return env.page.inputPath.split('/').slice(0, -1).concat(src).join('/');
      }
    });
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


  if (process.env.NODE_ENV === 'production') {

    // Transform : html-minifier
    eleventyConfig.addTransform('html-minify', async (content, outputPath) => {
      if (outputPath && /(\.html|\.xml)$/.test(outputPath)) {
        return require('html-minifier').minify(content, {
          useShortDoctype: true,
          minifyJS: true,
          collapseWhitespace: true,
          keepClosingSlash: true
        });
      }
      return content;
    });

  }


  // Passthrough
  if (process.env.NODE_ENV === 'production') eleventyConfig.addPassthroughCopy({ 'site/static': '.' }); // Only one per destination folder, next is better for dev
  eleventyConfig.addPassthroughCopy({ [`site/_themes/${theme}/static`]: '.' });
  eleventyConfig.addPassthroughCopy({ 'node_modules/@fontsource/{abril-fatface,pt-sans}/files/{abril-fatface,pt-sans}-latin-{400,700}*.woff2': 'css/files' });
  eleventyConfig.setServerPassthroughCopyBehavior('passthrough');

  // Globals
  eleventyConfig.addGlobalData('isProduction', process.env.NODE_ENV === 'production');


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
