'use strict';

module.exports = {
    global: {
        destination: './build/',
        clean: {
            before: [ './dist/*' ],
            after: []
        }
    },

    common: {
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

        babel: {
        },

        eslint: {
        },

        less: {
        },

        eser: true
    },

    polyfills: {
        target: 'node',
        standard: 2016,

        preprocessVars: {
            BUNDLE: 'polyfills'
        },

        ops: [
            {
                src: [ './src/polyfills/**/*.js' ],
                dest: './dist/scripts/',

                addheader: true,
                compile: true,
                eolfix: true,
                optimize: true,
                preprocess: true,
                transpile: true
            }
        ]
    },

    main: {
        target: 'node',
        standard: 2016,

        depends: [ 'polyfills' ],

        preprocessVars: {
            BUNDLE: 'main'
        },

        ops: [
            {
                src: [ './src/**/*.js', './src/**/*.ts', './src/**/*.jsx' ],
                dest: './dist/scripts/',

                addheader: true,
                compile: true,
                commonjs: { name: 'browserified.js', entry: './index.js' },
                eolfix: true,
                lint: true,
                optimize: true,
                preprocess: true,
                transpile: true
            },
            {
                src: [ './src/**/*.css', './src/**/*.less', './src/**/*.scss' ],
                dest: './dist/styles/',

                addheader: true,
                compile: true,
                concat: 'style.css',
                eolfix: true,
                lint: true,
                minify: true,
                optimize: true,
                preprocess: true
            },
            {
                src: './test/*.js',
                test: true
            }
        ]
    }
};
