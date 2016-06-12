'use strict';

let config = new sey.config();

config.set('global', {
        destination: './build/',
        clean: {
            before: [ './dist/*' ],
            after: []
        }
    });

config.set('common', {
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
    });

config.bundle('polyfills')
    .setTarget('node')
    .setStandard(2016)
    .set({
        preprocessVars: {
            BUNDLE: 'polyfills'
        }
    });

config.bundle('polyfills')
    .src([ './src/polyfills/**/*.js' ])
    .addheader()
    .compile()
    .eolfix()
    .optimize()
    .preprocess()
    .transpile()
    .dest('./dist/scripts/')
    .exec();

config.bundle('main')
    .setTarget('node')
    .setStandard(2016)
    .depends('polyfills')
    .set({
        preprocessVars: {
            BUNDLE: 'main'
        }
    });

config.bundle('main')
    .src([ './src/**/*.js', './src/**/*.ts', './src/**/*.jsx', '!./src/polyfills/**/*.js' ])
    .addheader()
    .compile()
    .commonjs({ name: 'browserified.js', entry: './index.js' })
    .eolfix()
    .lint()
    .optimize()
    .preprocess()
    .transpile()
    .dest('./dist/scripts/')
    .exec();

config.bundle('main')
    .src([ './src/**/*.css', './src/**/*.less', './src/**/*.scss' ])
    .addheader()
    .compile()
    .concat('style.css')
    .eolfix()
    .lint()
    .minify()
    .optimize()
    .preprocess()
    .dest('./dist/styles/')
    .exec();

config.bundle('main')
    .src('./test/*.js')
    .test()
    .exec();

sey.run(config);
