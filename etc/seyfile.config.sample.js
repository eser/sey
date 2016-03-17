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

        ops: [
            {
                src: ['./src/**/*.js', './src/**/*.ts', './src/**/*.jsx'],
                dest: './dist/scripts/',

                addheader: true,
                commonjs: { name: 'browserified.js', entry: './index.js' },
                eolfix: true,
                jsx: true,
                lint: true,
                optimize: true,
                preprocess: true,
                transpile: true,
                typescript: true
            },
            {
                src: ['./src/**/*.css', './src/**/*.less', './src/**/*.scss'],
                dest: './dist/styles/',

                addheader: true,
                concat: 'style.css',
                eolfix: true,
                lint: true,
                minify: true,
                optimize: true,
                preprocess: true,
                transpile: true
            },
            {
                src: './test/*.js',
                test: true
            }
        ]
    }
});

sey.run(config);
