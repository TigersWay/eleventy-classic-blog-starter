const {parse} = require('path');

const rename = (input, options = {}) => {
  let o = parse(String(input));

  return [
    o.dir.replace(/\\/g, '/'),
    [
      options.prefix || '',
      o.name,
      options.suffix || '',
      options.ext || o.ext
    ].join('')
  ].join('/');
};

module.exports = {

  rename: rename,

  suffix: (input, str) => rename(input, {'suffix':str})

};
