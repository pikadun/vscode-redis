import { Configuration } from 'webpack';
import baseConfig from './webpack.base';
import merge from 'webpack-merge';
import path from 'path';

const config: Configuration = {
    name: 'view',
    entry: './view/index.ts',
    output: {
        path: path.resolve(__dirname, '..', 'lib', 'view')
    }
};

export default merge(baseConfig, config);