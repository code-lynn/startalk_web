/*
 * @Description: In User Settings Edit
 * @Author: xi.guo
 * @Date: 2019-08-05 14:54:15
 * @LastEditTime: 2019-08-13 19:54:57
 * @LastEditors: Please set LastEditors
 */

const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const merge = require('webpack-merge')
const path = require('path')
const dotenv = require('dotenv')
dotenv.config()
process.env.NODE_ENV === 'production' && require('./dotenv')
const _mode = process.env.NODE_ENV || 'development'
const _mergeConfig = require(`./config/webpack.${_mode}.js`)
const HtmlWebpackPlugin = require('html-webpack-plugin')
const htmlAfterWebpackPlugin = require('./config/htmlAfterWebpackPlugin')
const ASSETS = path.join(__dirname, '/dist/assets/')

// 用户可配置 config 
const devPaths ={
  MODULES: path.join(__dirname , '/src/web/modules'),
  common: path.join(__dirname , '/src/web/scripts/page/common'),
  stylesCommon: path.join(__dirname , '/src/web/styles/common/'),
  emotions: path.join(__dirname , '/src/web/scripts/lib/emotions'),
  jp: path.join(__dirname , '/src/web/scripts/lib/jquery-plugins'),
  utils: path.join(__dirname , '/src/web/scripts/utils'),
  page: path.join(__dirname , '/src/web/scripts/page'),
  tmpl: path.join(__dirname , '/src/web/scripts/templates'),
  lib: path.join(__dirname , '/src/web/scripts/lib/'),
  qchat: path.join(__dirname , '/src/web/scripts/core/'),
  fonts: path.join(__dirname , '/src/assets/fonts'),
  png: path.join(__dirname , '/src/assets/png'),
  public: path.join(__dirname , '/src/assets/public'),
  touch: path.join(__dirname , '/src/assets/touch'),
  web: path.join(__dirname , '/src/assets/web'),
  voice: path.join(__dirname , '/src/assets/voice'),
}

// 用户可配置 config 
const entry = () => {
  return {
    // _startalk_sdk: './src/web/sdk/entry.js',
    // index: './src/web/app/pages/index/entry.js'
    qchat_web: './src/web/scripts/page/web/qchat.js',
    // qchat_touch: './src/web/scripts/page/touch/qchat.js'
  }
}

let webpackConfig = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: entry(),
  output: {
    filename: 'scripts/[name].js',
    // 静态资源输出路径
    path: ASSETS,
    // 所有资源的基础路径
    publicPath: process.env.PUBLICPATH
  },
  module: {
    rules: [
      {
        test: /\.js$/, 
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader?cacheDirectory',
          options: {
            'presets': [ '@babel/preset-env', '@babel/preset-react'],
            plugins: [
              ['@babel/plugin-proposal-decorators',{ 'legacy': true }],
              '@babel/plugin-proposal-class-properties',
              // 配合路由懒加载
              '@babel/plugin-syntax-dynamic-import',
              '@babel/plugin-transform-runtime'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, 
          'css-loader',
          { loader: 'postcss-loader', options: { plugins: [ require('autoprefixer') ]}}
        ]
      },
      {
        test:/\.less$/,
        use:[
          MiniCssExtractPlugin.loader,
          'css-loader',
          { loader: 'postcss-loader', options: { plugins: [ require('autoprefixer') ] }},
          'less-loader'
        ] 
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: "[name]-[hash:5].min.[ext]",
              limit: 1024, 
              publicPath: "../images/",
              outputPath: "images/"
            }
          }, 
          {
            loader: 'img-loader'
          }
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      }
    ]
  },
  resolve: {
    extensions: ["*",".jsx",".js"],
    alias: devPaths
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        common: {
          test: /[\\/]node_modules[\\/]/,
          name: 'common',
          chunks: 'all',
          priority: 2,
          minChunks: 2,
        },
      }
    }
  },
  plugins: [
    new OptimizeCssAssetsPlugin(),
    new CopyPlugin([{
      from: path.join(__dirname, './package.json'), 
      to: path.join(__dirname, '/dist/package.json') 
    },
    {
      from: path.join(__dirname, './jquery/jquery-1.11.1.js'), 
      to: path.join(__dirname, '/dist/jquery/jquery-1.11.1.js') 
    }]),
    new HtmlWebpackPlugin({
      template:  __dirname + '/src/web/html/index-web.html',
      //development 环境使用 webpack-dev-middleware 插件打包资源到内存
      //production 环境打包到 dist/view 作为 node 的 html 模板
      filename: _mode === 'production' ? '../views/index.html' : 'index.html',
      inject: false,
      minify: false
    }),
    new htmlAfterWebpackPlugin()
  ]
}

module.exports = merge(webpackConfig, _mergeConfig)