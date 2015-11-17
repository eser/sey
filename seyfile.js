var sey = require('sey');

var config = {
    global: {
        babelConfig: {

        },

        eslintConfig: {
            useEslintrc: false,
            configFile: './etc/tasks/config/eslint.json'
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

                tasks: ['eolfix', 'preprocess', 'lint', 'transpile', 'addheader'],
                eolfix: true,
                preprocess: true,
                lint: true,
                transpile: true,
                addheader: true
            },
            {
                src: ['./etc/config/**/*.js'],
                dest: './dist/config.js',

                tasks: ['eolfix', 'preprocess', 'lint', 'transpile', 'concat', 'addheader'],
                eolfix: true,
                preprocess: true,
                lint: true,
                transpile: true
                concat: true,
                addheaader: true
            },
            {
                src: './test/**/*.js',

                tasks: ['test'],
                test: true
            }
        ]
    }
};

var instance = new sey(config);
instance.doTasks();
// instance.bundle('main').src('./test/**/*.js').test(); // returns Promise

module.exports = instance;
