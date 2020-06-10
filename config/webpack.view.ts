import { Configuration as WebpackConfig, HotModuleReplacementPlugin } from 'webpack';
import baseConfig from './webpack.base';
import merge from 'webpack-merge';
import path from 'path';
import { VueLoaderPlugin } from 'vue-loader';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration as DevServerConfig } from 'webpack-dev-server';

const env = process.env.EXTENSION;
type Configuration = WebpackConfig & DevServerConfig;

const config: Configuration = {
    name: 'view',
    entry: './view/app.ts',
    output: {
        path: path.resolve(__dirname, '..', 'lib', 'view'),
        publicPath: env ? './' : '/',
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js'
    },
    resolve: {
        extensions: ['.vue']
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }, {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            }, {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        appendTsSuffixTo: [/\.vue$/]
                    }
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            inject: true,
            title: 'VSCode Redis',
            templateContent: '<html><head></head><body><div id="app"></div></body></html>',
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true,
            }
        }),
        new HotModuleReplacementPlugin()
    ],
    devServer: {
        inline: true,
        contentBase: path.resolve(__dirname, '..', 'lib', 'view'),
        port: 9000,
        hot: true
    }
};

export default merge(baseConfig, config);