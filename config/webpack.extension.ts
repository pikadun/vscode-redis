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
        'vscode': 'commonjs vscode'
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

export default (_env: unknown, argv: Configuration): Configuration => {
    if (argv.mode !== 'production') {
        config.devtool = '#inline-source-map';
    }
    return merge(baseConfig, config);
};