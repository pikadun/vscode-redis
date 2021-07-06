/* eslint-disable */
const preprocess = require('svelte-preprocess');
/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    exclude: ['**/*/tsconfig.json'],
    root: '../src/client',
    mount: {
        '../src/client': { url: '/' }
    },
    plugins: [
        ['@snowpack/plugin-svelte',
            {
                preprocess: preprocess({
                    defaults: {
                        script: 'typescript',
                    },
                })
            }
        ],
        [
            '@snowpack/plugin-typescript'
        ]
    ],
    routes: [{
        match: 'routes',
        src: '.*',
        dest: 'index.html'
    }],
    optimize: {
        entrypoints: ['./src/client/index.html'],
        sourcemap: false,
        bundle: true,
        minify: true,
        target: 'es2020'
    },
    packageOptions: {
        /* ... */
    },
    devOptions: {
        /* ... */
    },
    buildOptions: {
        out: '../lib/client',
        baseUrl: './'
    }
};