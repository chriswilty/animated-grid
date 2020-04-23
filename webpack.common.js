const PnpWebpackPlugin = require('pnp-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  resolve: {
    plugins: [
      PnpWebpackPlugin,
    ],
    alias: {
      'src': __dirname + '/src',
    }
  },
  resolveLoader: {
    plugins: [
      PnpWebpackPlugin.moduleLoader(module),
    ],
  },
};
