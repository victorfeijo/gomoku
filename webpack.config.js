module.exports = {
  entry: './app/main.js',
  output: {
      filename: './public/bundle.js'
    },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['babel-preset-es2015', 'babel-preset-stage-0']
        }
      }
    ]
  }
};
