module.exports = {
  plugins: [
    require('postcss-import'),
    (process.env.NODE_ENV === 'production') ? require('postcss-csso')({
      forceMediaMerge: true,
      comments: false
    }) : false,
  ],
};
