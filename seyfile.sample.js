'use strict';

let config = new sey.config({
    global: {
        babel: {

        },

        eslint: {
            useEslintrc: false,
            configFile: './etc/tasks/config/eslint.json'
        },

        less: {
            strictMath: true,
            compress: false,
            yuicompress: false,
            optimization: 0
        }
    },

    main: {
        banner: [
            '/**',
            ' * laroux.js',
            ' *',
            ' * @version v1.5.0',
            ' * @link https://eserozvataf.github.io/laroux.js',
            ' * @license Apache-2.0',
            ' */',
            ''
        ].join('\n'),

        preprocessVars: {
            BUNDLE: 'main'
        },

        ops: [
            {
                src: ['./src/**/*.js'],
                dest: './dist/',

                eolfix: true,
                preprocess: true,
                lint: true,
                babel: true,
                addheader: true
            },
            {
                src: ['./etc/config/**/*.js'],
                dest: './dist/config.js',

                eolfix: true,
                preprocess: true,
                lint: true,
                babel: true,
                concat: true,
                addheader: true
            },
            {
                src: './test/**/*.js',

                test: true
            }
        ]
    }
});

sey.run(config);
