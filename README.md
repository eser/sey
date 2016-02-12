# sey

Simple javascript build tool with declarative configuration


## Why sey

As we know, there is grunt and gulp for running some tasks to make your web project production-ready. But they weren't satify my needs in development since they:

- don't target node.js projects,
- work with external components which needs extra maintenance due to expiration of concepts and methods,
- have imperative configuration/api which needs detailed instruction input of what to do,
- do all tasks by starting over everytime,
- mostly need redudant disk i/o during tasks,
- have no specialisation for bundling and building,
- don't support mixing configuration file and api,
- are slow,

and sey,

- does target node.js projects as well as web browser projects,
- all tasks bundled internally. all you need is updating to keep up to date,
- has declarative configuration which only needs the input of what user expect,
- supports partial running of tasks on changed files,
- specialized for create bundles and building projects,
- supports both configuration and api at the same time.


### Examples

Configuration Based:

```js
var config = {
    main: {
        eslintConfig: {
            useEslintrc: false,
            configFile: './etc/tasks/config/eslint.json'
        }

        ops: [
            {
                src: ['./src/**/*.js'],
                dest: './dist/',

                eolfix: true,
                lint: true,
                transpile: true
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

module.exports = instance;

```

API Based:

```js
var instance = new global.sey();

instance.bundle('main')
    .src('./src/**/*.js')
    .eolfix()
    .lint()
    .transpile()
    .dest('./dist/')
    .exec();

instance.bundle('main')
    .src('./test/**/*.js')
    .test()
    .exec();

instance.start();

module.exports = instance;
```


### Todo List

- Deploy Task
- Browserify, CSSMin, JSMin Tasks
- Fancy output including line counts, lint and test results
- Code optimizations

See [GitHub Issues](https://github.com/eserozvataf/sey/issues).


### Requirements

* Node (https://nodejs.org/)
* NPM (https://npmjs.org)


## License

See [LICENSE](LICENSE)


## Contributing

See [contributors.md](contributors.md)

It is publicly open for any contribution. Bugfixes and suggestions are welcome.

* Fork the repo, push your changes to your fork, and submit a pull request.
* If something does not work, please report it using GitHub issues.
