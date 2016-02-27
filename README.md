# sey

[![npm version][npm-image]][npm-url]
[![npm download][download-image]][npm-url]
[![dependencies][dep-image]][dep-url]
[![license][license-image]][license-url]

Simple JavaScript build tool with declarative and easy configuration. It also has incremental build support which only rebuilds changed files to pace up the build process.

![Sey](docs/sey-effect.png)

Built-in tasks empowers sey in order to achieve unique features like **dead code elimination** that no other build tool offered yet.


## Why sey

As we know, there is grunt and gulp for running some tasks to make your web project production-ready. 

They also brought extra learning curve and maintenance cost for learning own configuration and packages with them.

This is where sey comes into play and offers alternative build system:

| Feature                 | sey          | Grunt        | Gulp         |
| ----------------------- |:------------:|:------------:|:------------:|
| Configuration Approach  | Descriptive  | Imperative   | Imperative   |
| Configuration Type      | API and JSON | JSON         | API          |
| Platform targeting      | node and web | Agnostic     | Agnostic     |
| Incremental builds      | ✓            |              |              |
| Built-in tasks          | ✓            |              |              |
| No disk IO during tasks | ✓            |              |              |
| No maintainance cost    | ✓            |              |              |

in other words, sey...

- has ability to target node.js projects as well as web browser projects,
- has built-in tasks, which does not need extra maintenance cost due to expiration of concepts and methods. all you need is updating to keep up to date,
- has declarative configuration which only needs the input of what user expect. say goodbye to planning directives such as copy, concat, etc.
- supports partial building on changed files. it never starts over doing all tasks.
- supports both configuration and API at the same time,
- is specialized for create bundles and building projects,
- is as fast as it can be.


### Built-in Tasks

* addheader: adds file header to each file
* comb: css formatter
* cssminify: css minification
* eolfix: replaces various EOL types with unix standard
* jslint: ESLint JavaScript Linter
* jsoptimize: advanced code optimizations with Google Closure Compiler
* less: LESS compiler
* preprocess: Code Preprocessor for macro support
* transpile: Transpiles code to specified standard
* typescript: Validates code with Microsoft TypeScript Compiler


### Usage

To Install:   
`npm install -g sey`

To create the seyfile in current directory:   
`sey init`

To edit seyfile created:   
`vim seyfile.js` (or open **seyfile.js** with your favorite text editor)

To build:   
`sey build`

To clean working directory:   
`sey clean`


### Configuration (seyfile) Examples

Configuration Based:

```js
let config = {
    main: {
        target: 'node',
        standard: 2016,

        eslint: {
            quotes: [ 2, 'single' ]
        },

        banner: [
            '/**',
            ' * my package',
            ' */',
            ''
        ].join('\n'),

        ops: [
            {
                src: './src/**/*.js',
                dest: './dist/scripts/',

                eolfix: true,
                preprocess: true,
                jslint: true,
                transpile: true,
                jsoptimize: true,
                addheader: true
            },
            {
                src: ['./src/**/*.less', './src/**/*.lss'],
                dest: './dist/styles/',

                eolfix: true,
                preprocess: true,
                less: true,
                addheader: true
            },
            {
                src: './test/*.js',
                test: true
            }
        ]
    }
};

sey.run(config);
```

API Based:

```js
let config = new sey.config();

config.bundle('main')
    .src('./src/**/*.js')
    .eolfix()
    .preprocess()
    .jslint()
    .transpile()
    .jsoptimize()
    .addheader()
    .dest('./dist/scripts/')
    .exec();

config.bundle('main')
    .src(['./src/**/*.less', './src/**/*.lss'])
    .eolfix()
    .preprocess()
    .less()
    .addheader()
    .dest('./dist/styles/')
    .exec();

config.bundle('main')
    .src('./test/*.js')
    .test()
    .exec();

sey.run(config);
```


### Todo List

- Deploy Task
- Watch Task (Refresh Friendliness)
- JSX, Browserify, CSSMin, JSMin, PostCSS Tasks
- Sourcemaps
- Fancy output including line counts, lint and test results

See [GitHub Issues](https://github.com/eserozvataf/sey/issues).


### Requirements

* node.js (https://nodejs.org/)


## License

Apache 2.0, for further details, please see [LICENSE](LICENSE) file


## Contributing

See [contributors.md](contributors.md)

It is publicly open for any contribution. Bugfixes and suggestions are welcome.

* Fork the repo, push your changes to your fork, and submit a pull request.
* If something does not work, please report it using GitHub issues.

[npm-image]: https://img.shields.io/npm/v/sey.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/sey
[download-image]: https://img.shields.io/npm/dt/sey.svg?style=flat-square
[dep-image]: https://img.shields.io/david/eserozvataf/sey.svg?style=flat-square
[dep-url]: https://github.com/eserozvataf/sey
[license-image]: https://img.shields.io/npm/l/sey.svg?style=flat-square
[license-url]: https://github.com/eserozvataf/sey/blob/master/LICENSE
