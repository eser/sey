// var rogue = require('rogue');
var rogue = require('./src/main.js');

var config = {
    global: {
        banner: [
            '/**',
            ' * <%= pkg.name %> - <%= pkg.description %>',
            ' *',
            ' * @version v<%= pkg.version %>',
            ' * @link <%= pkg.link %>',
            ' * @license <%= pkg.license %>',
            ' */',
            ''
        ].join('\n'),

        babelConfig: {

        },

        eslintConfig: {
            useEslintrc: false,
            configFile: './etc/tasks/config/eslint.json'
        },

        cleanFiles: [
            '~/**/*',
            '!~/.gitkeep'
        ]
    },

    main: {
        preprocessVars: {
            BUNDLE: 'base',
            ENV: 'base',
            COMPAT: false
        },

        ops: [
            {
                from: ['./src/**/*.js'],
                // tasks: ['eolfix', 'preprocess', 'lint', 'transpile', 'addheader'],
                to: './dist/'
            },
            {
                from: ['./etc/config/**/*.js'],
                // tasks: ['eolfix', 'preprocess', 'lint', 'transpile', 'concat', 'addheader'],
                to: './dist/config.js'
            },
            {
                from: './test/**/*.js',
                tasks: ['test']
            }
        ]
    }
};

var instance = new rogue(config);
instance.doTasks();

module.exports = instance;
