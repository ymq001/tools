'use strict';

const path = require('path');
const glob = require('glob'); //自动查找固定目录的js文件
const CleanWebpackPlugin = require('clean-webpack-plugin'); //清理文件夹
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const webpack = require("webpack");
const WebpackDevServerOutput = require("webpack-dev-server-output");

const node_lib = true;
const outputPath = 'dist';
const entryPath = 'src';
const clearPaths = [];//['dist/lib/**.js', 'dist/lib/**.js.map'];
const pathMatch = node_lib ? '**/index.js' : '**/**.js';

let webpackConfig = {
  entry: {
    vendor: 'babel-polyfill'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, outputPath),
    //library: 'qview',
    libraryTarget: 'umd'
  },
  context: path.resolve(__dirname),
  resolve: {
  },
  devtool: 'source-map',
  mode: 'development',
  devServer: {
    // 发布服务的文件夹
    contentBase: "./docs",
    host: "127.0.0.1",
    port: 8066,
    // 声明为热替换
    //hot: true,
    historyApiFallback: true,
    // 第一次打包时打开浏览器
    open: true,
    inline: true, //注意：不写hot: true，否则浏览器无法自动更新；也不要写colors:true，progress:true等，webpack2.x已不支持这些
    overlay: true
  },
  plugins: [
    new UglifyJsPlugin({
      sourceMap: true
    }),
    new webpack.NamedModulesPlugin(),
    // 热替换插件
    new webpack.HotModuleReplacementPlugin(),
    // 将webpack-dev-server在内存中打包的文件输出为本地文件
    // new WebpackDevServerOutput({
    //   path: "./dist",
    //   isDel: true
    // })
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        include: path.join(__dirname, entryPath),
        exclude: /(node_modules|dist|docs|examples|tutorials)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
}

let pathRoot = path.resolve(__dirname, './')
let paths = path.resolve(pathRoot, entryPath);
let options = {
  cwd: paths, // 在src目录里找
  sync: true, // 这里不能异步，只能同步
};

let entries = new glob.Glob(pathMatch, options).found;

entries.forEach((page) => {
  let filename = page.substring(0, page.lastIndexOf('.'));
  if (filename.indexOf('index') > -1) {
    filename = filename.substring(0, filename.lastIndexOf('/'));
    filename = node_lib ? `lib/${filename}` : `${filename}/${filename}`;
  }
  webpackConfig.entry[filename] = path.resolve(paths, page);
  webpackConfig.plugins.push(new CleanWebpackPlugin(
    clearPaths,
    {
      root: __dirname,    //根目录
      exclude: ['dist/vendor.js', 'dist/vendor.js.map'],  //排除
      verbose: true,      //开启在控制台输出信息
      dry: false        　//启用删除文件
    }
  ));
});

module.exports = webpackConfig;