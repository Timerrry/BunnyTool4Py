import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import chalk from 'chalk';
import merge from 'webpack-merge';
import { spawn, execSync } from 'child_process';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import baseConfig from './webpack.config.base';
import CheckNodeEnv from '../scripts/CheckNodeEnv';

CheckNodeEnv('development');

const port = process.env.PORT || 1212;
const publicPath = `http://localhost:${port}/`;
const dll = path.resolve(__dirname, '../dll');
const manifest = path.resolve(dll, 'renderer.json');

const requiredByDLLConfig = module.parent.filename.includes('webpack.config.renderer.dev.dll');

/**
 * Warn if the DLL is not built
 */
if (!requiredByDLLConfig && !(fs.existsSync(dll) && fs.existsSync(manifest))) {
  console.log(chalk.black.bgYellow.bold('The DLL files are missing. Sit back while we build them for you with "npm run build-dll"'));
  execSync('npm run build-dll');
}

let guiConfig = merge.smart(baseConfig, {
  devtool: 'inline-source-map',
  mode: 'development',
  target: 'web',
  entry: {
    index: [
      'react-hot-loader/patch',
      `webpack-dev-server/client?http://localhost:${port}`,
      'webpack/hot/only-dev-server',
      path.resolve(__dirname, '../src/renderer/index.js'),
    ],
  },
  output: {
    libraryTarget: 'umd',
    path: path.resolve(__dirname, '../app/renderer'),
    publicPath: publicPath,
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ["react", "env"],
            plugins: [
              // Here, we include babel plugins that are only required for the
              // renderer process. The 'transform-*' plugins must be included
              // before react-hot-loader/babel
              "babel-plugin-transform-es2015-arrow-functions",
              "babel-plugin-add-module-exports",
              "babel-plugin-dev-expression",
              // "babel-plugin-import",
              "babel-plugin-transform-class-properties",
              "babel-plugin-transform-es2015-classes",
              "babel-plugin-transform-function-bind",
              "babel-plugin-transform-object-rest-spread",
              "babel-plugin-transform-react-remove-prop-types",
              'react-hot-loader/babel'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              camelCase: true,
            }
          }
        ]
      },
      // SASS support - compile all .global.scss files and pipe it to style.css
      {
        test: /\.global\.(scss|sass)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              camelCase: true,
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      // SASS support - compile all other .scss files and pipe it to style.css
      {
        test: /^((?!\.global).)*\.(scss|sass)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              camelCase: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]__[hash:base64:5]'
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      // WOFF Font
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff'
          }
        }
      },
      // WOFF2 Font
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff'
          }
        }
      },
      // TTF Font
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream'
          }
        }
      },
      // EOT Font
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader'
      },
      // SVG Font
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml'
          }
        }
      },
      // Common Image Formats
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        use: 'url-loader'
      }
    ]
  },
  plugins: [
    requiredByDLLConfig ? null : new webpack.DllReferencePlugin({
      context: process.cwd(),
      manifest: require(manifest),
      sourceType: 'var'
    }),
    new webpack.HotModuleReplacementPlugin({
      multiStep: true
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development'
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    new MonacoWebpackPlugin(),
    new webpack.IgnorePlugin(/^((fs)|(path)|(os)|(crypto)|(source-map-support))$/, /vs(\/|\\)language(\/|\\)typescript(\/|\\)lib/),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src/renderer/index.dev.html'),
        to: 'index.html'
      },
      {
        from: path.resolve(__dirname, '../src/renderer/bridge.js'),
        to: 'bridge.js'
      },
      {
        from: path.resolve(__dirname, '../src/renderer/vendor/ardublockly/blockly/media'),
        to: 'vendor/ardublockly/blockly/media'
      },
    ]),
  ],
  node: {
    __dirname: false,
    __filename: false,
    path: true
  },
  devServer: {
    port,
    publicPath,
    compress: true,
    // noInfo: true,
    stats: 'errors-only',
    inline: true,
    lazy: false,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentBase: path.resolve(__dirname, '../app/renderer'),
    watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules/,
      poll: 100
    },
    historyApiFallback: {
      verbose: true,
      disableDotRule: false
    },
  }
});

let blocklyConfig = {
  devtool: 'inline-source-map',
  mode: 'development',
  target: 'web',
  entry: {
    blockly: path.resolve(__dirname, '../src/renderer/vendor/ardublockly/shim/blockly.js'),
  },
  output: {
    library: "Blockly",
    libraryTarget: 'window',
    path: path.resolve(__dirname, '../src/renderer/vendor/ardublockly/dist'),
    filename: '[name].js'
  },
};

let arduinoConfig = {
  devtool: 'inline-source-map',
  mode: 'development',
  target: 'web',
  entry: {
    arduino: path.resolve(__dirname, '../src/renderer/vendor/ardublockly/shim/arduino.js'),
  },
  output: {
    libraryTarget: 'window',
    path: path.resolve(__dirname, '../src/renderer/vendor/ardublockly/dist'),
    filename: '[name].js'
  },
};

export default [guiConfig, blocklyConfig, arduinoConfig];
