const path = require('path')

const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  target: 'web',
  mode: 'development',
  devtool: 'inline-source-map',
  entry: "./src/index.js",
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:8765"
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: './main.js'
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
    extensions: [".vue", ".json", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },{
        test: /\.js$/,
        loader: 'babel-loader'
      },{
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          { loader: 'css-loader', options: { esModule: false }},
          { loader: 'sass-loader', options: {}}
        ]
      },{
        test: /\.(png|jpg)$/,
        loader: 'url-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
  ],
}