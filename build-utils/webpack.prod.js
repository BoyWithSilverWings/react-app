const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const workboxPlugin = require("workbox-webpack-plugin");
const path = require("path");
const commonPaths = require("./common-paths");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  devtool: "source-map",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                importLoaders: 1
              }
            },
            {
              loader: "postcss-loader"
            }
          ]
        })
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader"
        },
        exclude: /(node_modules|dist|build-utils|webpack.config.js)/
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(["dist"], {
      root: commonPaths.root
    }),
    new ExtractTextPlugin("styles.css"),
    new webpack.EnvironmentPlugin({
      NODE_ENV: "production",
      DEBUG: false
    }),
    new UglifyJsPlugin({
      sourceMap: true,
      uglifyOptions: {
        compress: {
          inline: false
        }
      }
    }),
    new workboxPlugin({
      globDirectory: commonPaths.outputPath,
      globPatterns: ["**/*.{html,js,css}"],
      swDest: path.join(commonPaths.outputPath, "sw.js")
    }),
    new CopyWebpackPlugin([
      {
        from: commonPaths.public,
        to: commonPaths.outputPath,
        ignore: ["index.html"]
      }
    ])
  ]
};
