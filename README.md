# eleventy-classic-blog-starter
A starter repository for a classic blog website using the Eleventy SSG.

Of course, a very opiniated one, and a work in progress!

[![Netlify Status](https://api.netlify.com/api/v1/badges/0079108a-1e50-4c91-a5b7-d849710e0f0e/deploy-status)](https://eleventy-classic-blog-starter.netlify.app/)

## Tools

- [Eleventy](https://www.11ty.dev/)
- [Gulp](https://gulpjs.com/)
- [highlight.js](https://highlightjs.org/)
- [@tigersway/gulp-responsive](https://github.com/TigersWay/gulp-responsive) & [gulp-vinyl-flow](https://github.com/TigersWay/gulp-vinyl-flow)

## Themes

- Nunjucks port - but same CSS - based on liquid layouts from [Hyde](https://hyde.getpoole.com/) by [@mdo](https://twitter.com/mdo)

## Problems, notes and sometimes solutions

### Dates!

#### Creation (or Updated) dates

Posts default dates (file creation) are only reliable in local, for you. Depending where you are, they may change during transfer, upload, etc.
Differently but not really better, dates embedded inside the post filename (YYYY-MM-DD) only works in UTC, and will never - if needed - include a time of day.

=> Conclusion: The only valid dates are coming from the "data cascade", from Frontmatter to computed data and work best in their complete form like this: "2020-07-20T13:00:00.000Z" or simplified like this: "2020-07-20 20:00:00 +7".

#### SEO & Automatic link(s) to image(s)

SEO experts are saying you should avoid to set year, month and day in your URL, which means you may have trouble keeping your images with their related post, and in the same time not keeping that "dated" structure for these same markdown document.

=> Conclusion: As you build permalinks, you have to build links to images.

### Responsive

With a little help from [@tigersway/gulp-responsive](https://github.com/TigersWay/gulp-responsive) and [gulp-vinyl-flow](https://github.com/TigersWay/gulp-vinyl-flow), Eleventy can [transform](.eleventy.js#L76-L88) every `img` tag.

### Nunjucks & Fragments

[source](.eleventy.js#L42-L49)

