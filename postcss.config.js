module.exports = {
  plugins: [
    require('postcss-import'),
    (process.env.NODE_ENV === 'production') ? require('postcss-url')({
      url: ({ url }) => url.startsWith('./files/') ? '/css' + url.substring(1) : url,
    }) : false,
    (process.env.NODE_ENV === 'production') ? require('postcss-csso')({
      forceMediaMerge: true,
      comments: false
    }) : false,
  ],
};
