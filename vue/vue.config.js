/* eslint-disable */

const env = process.env.NODE_ENV

/** @type {import('@vue/cli-service').ProjectOptions */
module.exports = {
    publicPath: env === 'production' ? '././' : '/',
    outputDir: './lib/view',
    pages: {
        key: {
            entry: './vue/key/key.ts'
        }
    },
    chainWebpack: config => {
        config.resolve.alias.clear();

        config.module
            .rule('images')
            .use('url-loader')
            .loader('url-loader')
            .tap(options => Object.assign(options, { limit: 2000000 }))
            .end();
    }
};