const webpack = require('webpack');
const path = require('path');

const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSAssets = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');

const PATHS = {
  src: path.join(__dirname, 'client/src'),
  build: path.join(__dirname, 'client/build')
};

const pathsToClean = [
  PATHS.build+'/css',
  PATHS.build+'/js',
  PATHS.build+'/img'
]

let config = { // config object
  node: {
    fs: 'empty'
  },
  entry: {
    //'index':     PATHS.src + '/pages/index.js',
    //'faq':       PATHS.src + '/pages/faq.js',
    'vpage':     PATHS.src + '/pages/valuation.js',
    'valuation': PATHS.src + '/valuation/valuation.module.js',
    "vendor":    ['bootstrap']
  },
  output: {
    path: PATHS.build,
    publicPath: '/',
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['ng-annotate-loader', {loader: 'babel-loader', options: {presets: ['env']} }]
      },
      {
        test: /\.scss$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader',{ loader:'postcss-loader', options: { plugins: [ require('precss'),require('autoprefixer') ] }},'sass-loader' ],
        }),
      },
      {
        test: /\.css$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
      { test: /\.html$/, loader: 'html-loader' }
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      "window.jQuery": "jquery",
      $: "jquery",
      jQuery: "jquery",
      Popper: ['popper.js', 'default'],
      Tether: 'tether'
    }),
    new ExtractTextWebpackPlugin('./css/[name].css'),
    new CleanWebpackPlugin(pathsToClean),
    new CopyWebpackPlugin([
        { from: PATHS.src +'/assets/img', to: "img" },
    ]),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [autoprefixer]
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      // The order of this array matters
      chunks: ["vpage", "valuation"],
      name: "common",
    })

    //new webpack.optimize.CommonsChunkPlugin({
    //  name: 'vpage_vendor',
    //  chunks: ['vpage'],
    //  minChunks: (module, count) => ( module.resource && module.resource.indexOf('node_modules') >= 0) 
    //}),
    //new webpack.optimize.CommonsChunkPlugin({
    //  name: 'common',
    //  chunks: [ 'vpage' ],
    //  minChunks: (module, count) => {
    //    console.log('count ', (module.resource && (module.resource.indexOf('node_modules') >= 0) && (count >= 2)))
    //    return module.resource && (module.resource.indexOf('node_modules') >= 0) && (count >= 2)
    //  }
    //})
    //new webpack.optimize.CommonsChunkPlugin({
    //  name: 'index_vendor',
    //  chunks: ['index'],
    //  minChunks: (module, count) => ( module.resource && module.resource.indexOf('node_modules') >= 0)
    //}),
    //new webpack.optimize.CommonsChunkPlugin({
    //  name: 'faq_vendor',
    //  chunks: ['faq'],
    //  minChunks: (module, count) => ( module.resource && module.resource.indexOf('node_modules') >= 0) 
    //}),
  ],
  devtool: 'source-map',
}

module.exports = config;

if (process.env.NODE_ENV === 'production') { // if we're in production mode, here's what happens next
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    }), // call the uglify plugin
    new OptimizeCSSAssets() // call the css optimizer (minfication)
  );
}

