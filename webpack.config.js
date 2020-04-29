const path = require('path');

module.exports = {
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  },
  mode: "development",
  entry: :"./client/index.jsx",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: bundle.js,
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  }
};