'use strict';

const path = require("path");
const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');

module.exports = {
  entry: './src/javascripts/app',
  output: {
    path: './public/javascripts',
    filename: 'build.js'
  },
  watch: true,
  watchOptions: {
    aggregateTimeOut: 100
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
        //plugins: ["transform-class-properties"]
      }
    ]
  },
  externals: {
      //don't bundle the 'react' npm package with our bundle.js
      //but get it from a global 'React' variable
      //'react': 'React',
      //"react-dom": "ReactDOM"
  },
  resolve: {
    // you can now require('file') instead of require('file.jsx')
    extensions: ["", ".js", ".jsx"],
    root: [path.join(__dirname, "src", "javascripts")],
    modulesDirectories: ["node_modules"]
  },
  resolveLoader: {
    modulesDirectories: ['node_modules'],
    moduleTemplates: ['*-loader', '*'],
    extensions: ['', '.js']
  },
  devtool: NODE_ENV == 'development' ? 'cheap-inline-module-source-map' : null,
  plugins: [
    // new DefinePlugin({ "process.env": { NODE_ENV: JSON.stringify("production") } }))
    // myConfig.resolve.alias.react = "nodeModules/react/dist/react-with-addons";
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV)
    })
  ]
}

if(NODE_ENV == 'production') {

  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        unsafe: true
      }
    })
  )

}