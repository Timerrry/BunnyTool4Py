/**
 * Webpack config for production electron main process
 */

import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import baseConfig from './webpack.config.base';
import CheckNodeEnv from '../scripts/CheckNodeEnv';

CheckNodeEnv('production');

const DEBUG = process.env.DEBUG_PROD === "true";

export default merge.smart(baseConfig, {
    devtool: DEBUG ? 'source-map' : undefined,

    mode: 'production',

    target: 'electron-main',

    entry: path.resolve(__dirname, '../src/main/index'),

    // 'main.js' in root
    output: {
        path: path.resolve(__dirname, '../app/main'),
        filename: 'index.js'
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
                        presets: ["env"],
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
                        ]
                    }
                }
            }
        ]
    },

    plugins: [
        // new UglifyJSPlugin({
        //   parallel: true,
        //   sourceMap: true
        // }),

        // new BundleAnalyzerPlugin({
        //  analyzerMode:
        //    process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
        //   openAnalyzer: process.env.OPEN_ANALYZER === 'true'
        // }),

        /**
         * Create global constants which can be configured at compile time.
         *
         * Useful for allowing different behaviour between development builds and
         * release builds
         *
         * NODE_ENV should be production so that modules do not perform certain
         * development checks
         */
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'production',
            DEBUG_PROD: JSON.stringify(DEBUG),
        })
    ].concat(DEBUG ? [] : [
        new UglifyJSPlugin({
            parallel: true,
            // sourceMap: true
        }),
    ]),

    /**
     * Disables webpack processing of __dirname and __filename.
     * If you run the bundle in node.js it falls back to these values of node.js.
     * https://github.com/webpack/webpack/issues/2010
     */
    node: {
        __dirname: false,
        __filename: false
    }
});
