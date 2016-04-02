var path = require('path')

var production = process.argv.indexOf("--production") > -1

//various loaders
var babelLoader = {
  test: /\.js?$/,
  exclude: /(node_modules)/,
  loader: 'babel', // 'babel-loader' is also a legal name to reference
  query: {
    presets: ['es2015']
  }
}
//var cssLoader = { test: /\.css$/, loader: "style-loader!css-loader" }
var postcssLoader = {
  test: /\.css$/,
  loader: "style-loader?singleton!css-loader?modules&importLoaders=1!postcss-loader"//!postcss-loader" 
}
var postcssSettings = {
  postcss: function (webpack) {
       return [
         require('postcss-import')({addDependencyTo: webpack})
         ,require('precss')
         ,require('autoprefixer')
         //,require('postcss-simple-vars')
       ]
   }
}

var config = {
  entry: [
    './src/client'
  ],

  output: {
    path: path.join(__dirname, 'dist','client'),
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      babelLoader,
      postcssLoader
    ]
  },

  resolve: {
    modulesDirectories: [path.join(__dirname, 'src'), 'node_modules']
  }

}

//generate final config file, injecting specific settings
config = Object.assign({}, config, postcssSettings)


module.exports = config
