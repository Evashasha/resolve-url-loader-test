const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        "test": "./index.scss",
    },

    optimization: {
        minimize: true,
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'tea',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
                }

            }
        }
    },
    stats: {
        children: false,
        entrypoints: false,
        warnings: false,
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 20000,
                            outputPath: 'images',
                            name: '[name].[ext]'
                        },
                    },
                ],
            }, {
                test: /\.svg(\?.*)?$/,  // match img.svg and img.svg?param=value
                use: [
                    {
                        loader: 'svg-url-loader',
                        options: {
                            limit: 20000,
                            outputPath: 'images',
                            name: '[name].[ext]'
                        },
                    },
                    {
                        loader: 'svgo-loader',
                        options: {
                            plugins: [
                                {
                                    name: "preset-default",
                                    params: {
                                        overrides: {
                                            removeTitle: false,
                                            convertPathData: false,
                                            convertColors: {
                                                shorthex: false,
                                            },
                                        },
                                    },
                                },
                                "prefixIds",
                            ],
                        }
                    },
                    {
                        loader: 'svg-fill-loader',
                    }
                ]
            }, {
                test: /\.css$/,
                use: [
                    'css-loader',
                ],
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    // postcss 配置在 postcss.config.js 内，包含 autoprefixer
                    'postcss-loader',
                    'svg-transform-loader/encode-query',
                    {
                        loader: 'resolve-url-loader',
                        options: { query: true }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                ]
            }
        ]
    },
    plugins: [
         // 清理dist目录
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['*.js'],
    
        }),
        // 单独分离css
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),

    ],

    devServer: {
        contentBase: './',
        host: '0.0.0.0',
        compress: true,
        port: 9000,
        open: false,
        writeToDisk: true,
        stats: 'errors-only',
    },
}