import path from 'path';
import { Configuration } from 'webpack';

const env = process.env.NODE_ENV;

const config: Configuration = {
    mode: env === 'production' ? 'production' : 'development',
    context: path.resolve(__dirname, '..', 'src'),
    stats: 'minimal',
    resolve: {
        extensions: ['.ts', 'js']
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

export default config;