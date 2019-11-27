const path = require('path');

module.exports = {
  devServer: {
    compress: true,
    public: 'transfr.test' 
  },
  chainWebpack: (config) => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach((type) => addStyleResource(config.module.rule('scss').oneOf(type)));
    devtool: 'source-map';
  },
};
/**
 * Function to automatically load in SCSS files
 * @param {*} rule rules for it to load
 */
function addStyleResource(rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/scss/variables.scss'),
        path.resolve(__dirname, './src/scss/global.scss'),
        path.resolve(__dirname, './src/css/normalize.css'),
      ],
    });
}
