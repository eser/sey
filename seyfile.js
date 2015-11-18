var config = {
    global: {
        babelConfig: {

        },

        eslintConfig: {
            useEslintrc: false
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
                transpile: true,
                addheader: true
            },
            {
                src: './test/**/*.js',

                test: true
            }
        ]
    }
};

var instance = new global.sey(config);
instance.doTasks();
// instance.bundle('main').src('./test/**/*.js').test(); // returns Promise

module.exports = instance;
