/* global __dirname */

const path = require(`path`);
const HtmlWebpackPlugin = require(`html-webpack-plugin`);

module.exports = {
  mode: `development`,
  entry: `./src/js/main.js`,
  output: {
    filename: `bundle.js`,
    path: path.join(__dirname, `public/js`),
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: `babel-loader`
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: `../index.html`,
      template: `./src/index.html`,
    })],
  devtool: `source-map`,
  devServer: {
    contentBase: path.join(__dirname, `public`),
    publicPath: `http://localhost:8080/`,
    hot: true,
    compress: true,
  },
};
