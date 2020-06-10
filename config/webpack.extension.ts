import { Configuration } from 'webpack';
import baseConfig from './webpack.base';
import merge from 'webpack-merge';
import path from 'path';

const config: Configuration = {
    name: 'extension',
    target: 'node',
    node: false,
    entry: './index.ts',
    externals: {
        'vscode': 'commonjs vscode',
        'redis-parser': 'commonjs redis-parser'
    },
    output: {
        path: path.resolve(__dirname, '..', 'lib'),
        filename: 'index.js',
        libraryTarget: 'commonjs2',
        devtoolModuleFilenameTemplate: '../src/[resource-path]'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            }
        ]
    }
};

export default merge(baseConfig, config);