'use strict';

let config = new sey.config();

config.bundle('global')
    .set({
        babel: {
        },

        eslint: {
        },

        less: {
        }
    });

config.bundle('main')
    .setTarget('node')
    .setStandard(2016)
    .set({
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
        }
    });

config.bundle('main')
    .src('./src/**/*.js')
    .eolfix()
    .preprocess()
    // .jsx()
    // .typescript()
    .jslint()
    .transpile()
    .jsoptimize()
    .addheader()
    .dest('./dist/scripts/')
    .exec();

config.bundle('main')
    .src('./src/**/*.less')
    .eolfix()
    .preprocess()
    .less()
    // .sass()
    .concat('style.css')
    .comb()
    .cssminify()
    .addheader()
    .dest('./dist/styles/')
    .exec();

config.bundle('main')
    .src('./test/*.js')
    .test()
    .exec();

sey.run(config);
