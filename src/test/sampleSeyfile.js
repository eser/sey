sey.tasks.add('do', function (resolve, reject) {
    resolve('helo');
});
sey.tasks.do.exec().then(x => { console.log(x); });
console.log('tasks', sey.tasks.keys);

sey.config.merge({
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
    }
});

sey.config.set('polyfills', {
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
});

sey.bundles.readFromConfig();

sey.bundles.add('main', { target: 'node', standard: 2015, dest: 'build/' });
sey.bundles.main.standard = 2016;
sey.bundles.main.ops.add({ src: [], dest: 'extra/', addheader: { enabled: true, banner: 'x' }, eolfix: true });
// sey.bundles.main.exec();
console.log('bundles', sey.bundles.keys);
