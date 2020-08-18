module.exports = {
  layout: 'post.njk',

  eleventyComputed: {
    permalink: data => data.page.filePathStem.match(/.*\/(?:\d{1,}-){0,3}(.*)/)[1] + '/'
  }
};
