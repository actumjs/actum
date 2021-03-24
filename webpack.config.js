const path = require('path');
module.exports = {
  entry: './src/index.js',
  mode:'production',
  output: {
    filename: 'main.js',
    library:'actum',
    libraryTarget:'umd',
    globalObject: "this",
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          // eslint options (if necessary)
        },
      },
    ],
  },
};