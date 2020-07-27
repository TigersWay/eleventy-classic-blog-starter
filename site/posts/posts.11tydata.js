module.exports = {
  layout: 'post.njk',

  eleventyComputed: {
    // permalink: data => (data.permalink) ? data.permalink : permalink(data.page),
    permalink: data => data.page.filePathStem.match(/.*\/(?:\d{1,}-){0,3}(.*)/)[1] + '/'
  }
};
