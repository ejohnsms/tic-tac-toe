const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    app: './src/app.js',
    test: './test/app.Spec.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /.jsx?$/,
        include: [
          path.resolve(__dirname, 'app'),
          path.resolve(__dirname, 'test')
        ],
        exclude: /(node_modules | bower_components)/,
        use: {
          loader: 'eslint-loader'
        }
      },
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        exclude: /(node_modules | bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, 'test')
        ],
        exclude: /(node_modules | bower_components)/,
        use: {
          loader: 'mocha-loader'
        }
      }
    ]
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve(__dirname, './'),
    compress: true,
    port: 9000,
    open: true
  },
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    })
  ]
}
