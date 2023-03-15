# eleventy-classic-blog-starter  ![GitHub last commit](https://img.shields.io/github/last-commit/tigersway/eleventy-classic-blog-starter?style=flat-square) ![GitHub issues](https://img.shields.io/github/issues/tigersway/eleventy-classic-blog-starter?style=flat-square)

A starter repository for a "classic-themed" blog website using Eleventy.

Of course, a very opinionated one, and probably forever, a work in progress!

Dependencies:

- ![@11ty/eleventy](https://img.shields.io/github/package-json/dependency-version/tigersway/eleventy-classic-blog-starter/dev/@11ty/eleventy)
- ![markdown-it-eleventy-img](https://img.shields.io/github/package-json/dependency-version/tigersway/eleventy-classic-blog-starter/dev/markdown-it-eleventy-img)

Demo: [![Cloudflare](https://img.shields.io/badge/Cloudflare_Pages--none?style=social&logo=cloudflare)](https://eleventy-classic-blog-starter.pages.dev/)
[![Netlify](https://img.shields.io/badge/Netlify--none?style=social&logo=netlify)](https://eleventy-classic-blog-starter.netlify.app/)
[![Render](https://img.shields.io/badge/Render--none?style=social&logo=eleventy&logoColor=46e3b7)](https://eleventy-classic-blog-starter.onrender.com/)
[![Vercel](https://img.shields.io/badge/Vercel--none?style=social&logo=vercel)](https://eleventy-classic-blog-starter.vercel.app/)

## Completely re-written v2

At the end of 2022, Gulp and its plugins seem to be gone, and Eleventy has been updated quite a lot.
It was time to clean-up this template/starter!

## Tools

- [Eleventy](https://www.11ty.dev/)
- [highlight.js](https://highlightjs.org/)
- [markdown-it-eleventy-img](https://github.com/solution-loisir/markdown-it-eleventy-img)
- [Fontsource](https://fontsource.org/)

## Theme

- Nunjucks port - with (nearly) same CSS - based on liquid layouts from [Hyde](https://hyde.getpoole.com/) by [@mdo](https://twitter.com/mdo)
- Some WCAG contrast corrections

## Bug reports, feature requests... or even stars

This is an ongoing project - even if I don't modify it everyday - and every suggestions, contributions or even stars are most welcome!

## CHANGELOG

- **v2.0.0**
  - Update all dependencies
  - eleventy-img plugin through markdown-it-eleventy-img
  - Layout corrections
  - css: postcss & fontsource
  - spell-checker

- **v1.0.0**
  - Lighthouse 4 x 100%
  - Color corrections (WCAG2AA)
  - RSS
  - Filter `excerpt` without cheerio
  - moment -> dayjs
  - Re-visit Gulp/eleventy organization
    - Static folders
    - Fonts
    - PostCSS
  - Delete FrontAid CMS files - CMS tests will be done later

- **v0.6.1**
  - First try on "Cloudflare Pages"
  - Added robots.txt
