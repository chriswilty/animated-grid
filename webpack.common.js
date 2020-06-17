const Dotenv = require('dotenv-webpack');
const PnpWebpackPlugin = require('pnp-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new Dotenv()
  ],
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
