var config = {
    global: {
        babelConfig: {

        },

        eslintConfig: {
//            useEslintrc: false,
//            configFile: './etc/tasks/config/eslint.json'
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
                src: ['./etc/config/**/*.js'],
                dest: './dist/config.js',

                eolfix: true,
                preprocess: true,
                lint: true,
                transpile: true,
                concat: true,
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
instance.start();
// instance.bundle('main').src('./test/**/*.js').test().exec();

module.exports = instance;
