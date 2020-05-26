import path from 'path';
import { Configuration } from 'webpack';

const env = process.env.NODE_ENV;

const config: Configuration = {
    mode: env === 'production' ? 'production' : 'development',
    context: path.resolve(__dirname, '..', 'src'),
    stats: 'minimal',
    devtool: env === 'production' ? undefined : 'inline-source-map',
    resolve: {
        extensions: ['.ts', '.js']
    }
};

export default config;