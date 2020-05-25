import { Configuration } from 'webpack';
import baseConfig from './webpack.base';
import merge from 'webpack-merge';
import path from 'path';

const env = process.env.NODE_ENV;

const config: Configuration = {
    name: 'extension',
    target: 'node',
    node: false,
    entry: './index.ts',
    devtool: env === 'production' ? undefined : 'inline-source-map',
    externals: {
        'vscode': 'commonjs vscode',
        'redis-parser': 'commonjs redis-parser'
    },
    output: {
        path: path.resolve(__dirname, '..', 'lib'),
        filename: 'index.js',
        libraryTarget: 'commonjs2',
        devtoolModuleFilenameTemplate: '../src/[resource-path]'
    }
};

export default merge(baseConfig, config);