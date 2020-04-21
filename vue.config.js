module.exports = {
  pwa: {
    iconPaths: {
      favicon32: 'img/icons/icon-72x72.png',
      favicon16: 'img/icons/icon-72x72.png',
      appleTouchIcon: 'img/icons/icon-152x152.png',
      msTileImage: 'img/icons/icon-144x144.png',
    },
  },
  css: {
    sourceMap: true,
  },
  chainWebpack: config => {
    config.module.rules.delete('svg');
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.svg$/,
          loader: 'vue-svg-loader',
        },
      ],
    },
  },
};
