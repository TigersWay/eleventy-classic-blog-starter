// const { parse } = require('node-html-parser');

module.exports = {

  excerpt: (content) => {
    // let html = parse(content.replace(/<!--more-->.*/, '').replace(/\r\n|\n|\r|\t/g, ' '));
    // return html.text.substr(0, 250).trim();
    return (content) ? content.substr(0, 250).trim() : '';
  }

};
