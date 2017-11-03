const path = require('path')

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'awesome-typescript-loader',
        exclude: /node_modules/
      },
      {
        test: /fabric(\.min)?\.js$/,
        use: 'exports-loader?fabric',
      }
    ]
  },
  resolve: {
    extensions: [ ".ts", ".ts", ".js" ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public', 'javascripts')
  }
};
