var path = require('path');

module.exports = {

  entry: [
    './src/client'
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },

  module: {
    loaders: [{
      test: function (filename) {
        if (filename.indexOf('node_modules') !== -1) {
          return false;
        } else {
          return /\.js$/.test(filename) !== -1;
        }
      },
      loaders: ['babel-loader']
    },
    { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  },

  resolve: {
    modulesDirectories: [path.join(__dirname, 'src'), 'node_modules']
  }

};