const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: `${__dirname}/src/index.html`,
  filename: 'index.html',
  inject: 'body',
});

module.exports = {
  context: `${__dirname}/src`,

  entry: {
    javascript: './index.js',
  },

  output: {
    filename: 'index.js',
    path: `${__dirname}/dist`,
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          { loader: 'react-hot-loader' },
          { loader: 'babel-loader' },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: "style-loader" }, // creates style nodes from JS strings
          { loader: "css-loader", options: { // translates CSS into CommonJS
              sourceMap: true
            }
          },
          { loader: "postcss-loader", options: { // handles prefixing of CSS
              plugins: function () {
                return [
                  require('precss'),
                  require('autoprefixer')
                ];
              }
            },
          },
          { loader: "sass-loader", options: { // compiles Sass to CSS
            sourceMap: true }
          },
        ],
      },
    ],
  },

  plugins: [
    HtmlWebpackPluginConfig,
  ],
};
