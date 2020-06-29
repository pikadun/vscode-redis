import path from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
    context: path.resolve(__dirname, '..', 'src'),
    stats: 'minimal',
    resolve: {
        extensions: ['.ts', '.js']
    }
};

export default config;