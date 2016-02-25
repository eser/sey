# sey

Simple javascript build tool with declarative configuration.


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
- specialized for create bundles and building projects,
- supports both configuration and api at the same time,
- as fast as it can be.

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
        eslint: {
            useEslintrc: true
        }

        ops: [
            {
                src: ['./src/**/*.js'],
                dest: './dist/js/',

                eolfix: true,
                lint: true,
                babel: true
            },
            {
                src: './test/**/*.less',
                dest: './dist/css/',
                less: true
            }
        ]
    }
};

sey.run(config);
```

API Based:

```js
let config = new sey.config();

config.bundle('scripts')
    .src('./src/**/*.js')
    .eolfix()
    .lint()
    .babel()
    .dest('./dist/js/')
    .exec();

config.bundle('styles')
    .src('./test/**/*.css')
    .less()
    .dest('./dist/css/')
    .exec();

sey.run(config);
```


### Todo List

- Deploy Task
- Watch Task (Refresh Friendliness)
- JSX, Browserify, TypeScript, CSSMin, JSMin, Closure, PostCSS Tasks
- Fancy output including line counts, lint and test results
- Code optimizations

See [GitHub Issues](https://github.com/eserozvataf/sey/issues).


### Requirements

* node.js (https://nodejs.org/)


## License

See [LICENSE](LICENSE)


## Contributing

See [contributors.md](contributors.md)

It is publicly open for any contribution. Bugfixes and suggestions are welcome.

* Fork the repo, push your changes to your fork, and submit a pull request.
* If something does not work, please report it using GitHub issues.
