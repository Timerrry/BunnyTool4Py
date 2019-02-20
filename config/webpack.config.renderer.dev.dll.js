import webpack from 'webpack';
import path from 'path';
import merge from 'webpack-merge';
import baseConfig from './webpack.config.base';
import { dependencies } from '../package.json';
import CheckNodeEnv from '../scripts/CheckNodeEnv';

CheckNodeEnv('development');

const dist = path.resolve(__dirname, '../dll');

export default merge.smart(baseConfig, {
  context: path.resolve(__dirname, '..'),
  devtool: 'eval',
  mode: 'development',
  target: 'electron-renderer',
  externals: ['fsevents', 'crypto-browserify'],
  module: require('./webpack.config.renderer.dev').module,
  entry: {
    renderer: (Object.keys(dependencies || {}))
  },
  output: {
    library: 'renderer',
    path: dist,
    publicPath: '../../dll/',
    filename: '[name].dev.dll.js',
    libraryTarget: 'var'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(dist, '[name].json'),
      name: '[name]'
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development'
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        context: path.resolve(__dirname, '../app'),
        output: {
          path: path.resolve(__dirname, '../dll')
        }
      }
    })
  ]
});
