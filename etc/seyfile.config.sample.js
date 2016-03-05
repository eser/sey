'use strict';

let config = new sey.config({
    global: {
        babel: {
        },

        eslint: {
        },

        less: {
        }
    },

    main: {
        target: 'node',
        standard: 2016,

        banner: [
            '/**',
            ' * my package',
            ' *',
            ' * @version v1.0.0',
            ' * @link https://...',
            ' * @license Apache-2.0',
            ' */',
            ''
        ].join('\n'),

        preprocessVars: {
            BUNDLE: 'main'
        },

        clean: {
            beforeBuild: './dist'
        },

        ops: [
            {
                src: ['./src/**/*.js', './src/**/*.ts'],
                dest: './dist/scripts/',

                eolfix: true,
                preprocess: true,
                // jsx: true,
                // typescript: true,
                jslint: true,
                transpile: true,
                // jsoptimize: true,
                // browserify: { name: 'browserified.js', entry: './index.js' },
                addheader: true
            },
            {
                src: ['./src/**/*.css', './src/**/*.less'],
                dest: './dist/styles/',

                eolfix: true,
                preprocess: true,
                less: true,
                // sass: true,
                concat: 'style.css',
                comb: true,
                cssminify: true,
                addheader: true
            },
            {
                src: './test/*.js',
                test: true
            }
        ]
    }
});

sey.run(config);
