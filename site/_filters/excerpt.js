module.exports = {

  excerpt: (content, limit = 156) => {
    if (content) {
      let txt = content.slice(0, content.indexOf('<!--more-->'));
      txt = txt.replace(/<[^>]+>/g, '').replace(/\r\n|\n|\r|\t/g, ' ').trim().slice(0, limit);
      txt = txt.slice(0, txt.lastIndexOf(' '));
      return txt;
    }
  }

};
