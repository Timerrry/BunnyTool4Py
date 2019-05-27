import path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import merge from 'webpack-merge';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import baseConfig from './webpack.config.base';
import CheckNodeEnv from '../scripts/CheckNodeEnv';

CheckNodeEnv('production');

const DEBUG = process.env.DEBUG_PROD === "true";

let guiConfig = merge.smart(baseConfig, {
    devtool: DEBUG ? 'source-map' : undefined,
    mode: 'production',
    target: 'web',
    entry: {
        index: path.resolve(__dirname, '../src/renderer/index.js'),
    },
    output: {
        libraryTarget: 'umd',
        path: path.resolve(__dirname, '../app/renderer'),
        publicPath: './',
        filename: '[name].js'
    },
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin({})
        ]
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
                        ]
                    }
                }
            },
            // Extract all .global.css to style.css as is
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true,
                            camelCase: true,
                        }
                    }
                ],
            },
            // Add SASS support  - compile all .global.scss files and pipe it to style.css
            {
                test: /\.global\.(scss|sass)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true,
                            camelCase: true,
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ],
            },
            // Add SASS support  - compile all other .scss files and pipe it to style.css
            {
                test: /^((?!\.global).)*\.(scss|sass)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            minimize: true,
                            camelCase: true,
                            importLoaders: 1,
                            localIdentName: '[name]__[local]__[hash:base64:5]'
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ],
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
        // new BundleAnalyzerPlugin({
        //   analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
        //   openAnalyzer: process.env.OPEN_ANALYZER === 'true'
        // }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            ignoreOrder: true,
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../src/renderer/index.prod.html'),
                to: 'index.html'
            },
            {
                from: path.resolve(__dirname, '../src/renderer/vendor/ardublockly/blockly/media'),
                to: 'vendor/ardublockly/blockly/media'
            },
        ]),
        new MonacoWebpackPlugin(),
        new webpack.IgnorePlugin(/^((fs)|(path)|(os)|(crypto)|(source-map-support))$/, /vs(\/|\\)language(\/|\\)typescript(\/|\\)lib/),
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'production',
            DEBUG_PROD: JSON.stringify(DEBUG)
        }),
    ].concat(DEBUG ? [] : [
        new UglifyJSPlugin({
            parallel: true,
        }),
    ]),
    performance: {
        hints: false,
    },
});

let bridgeConfig = merge.smart(baseConfig, {
    devtool: DEBUG ? 'source-map' : undefined,
    mode: 'production',
    target: 'electron-renderer',
    entry: {
        bridge: path.resolve(__dirname, '../src/renderer/bridge.js'),
    },
    output: {
        libraryTarget: 'umd',
        path: path.resolve(__dirname, '../app/renderer'),
        filename: '[name].js'
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'production',
            DEBUG_PROD: JSON.stringify(DEBUG)
        }),
    ].concat(DEBUG ? [] : [
        new UglifyJSPlugin({
            parallel: true,
        }),
    ]),
});

let blocklyConfig = {
    devtool: DEBUG ? 'source-map' : undefined,
    mode: 'production',
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
    plugins: [].concat(DEBUG ? [] : [
        new UglifyJSPlugin({
            parallel: true,
        }),
    ]),
};

let arduinoConfig = {
    devtool: DEBUG ? 'source-map' : undefined,
    mode: 'production',
    target: 'web',
    entry: {
        arduino: path.resolve(__dirname, '../src/renderer/vendor/ardublockly/shim/arduino.js'),
    },
    output: {
        libraryTarget: 'window',
        path: path.resolve(__dirname, '../src/renderer/vendor/ardublockly/dist'),
        filename: '[name].js'
    },
    plugins: [].concat(DEBUG ? [] : [
        new UglifyJSPlugin({
            parallel: true,
        }),
    ]),
};

module.exports = [bridgeConfig, blocklyConfig, arduinoConfig, guiConfig];
