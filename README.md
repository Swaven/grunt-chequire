# grunt-chequire

> Ensures require directives point to existing files (case-sensitively).

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-chequire --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-chequire');
```

## The "chequire" task

### Overview
In your project's Gruntfile, add a section named `chequire` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  chequire: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

**exclude**  
*Type: array of string. Default: []*  
Files and folders that will not be checked when found in a *require* statement.

### Usage Examples

```js
grunt.initConfig({
  chequire: {
    srv: ['app/**/*.js']
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

* 2016-07-19: [v0.1.3](https://github.com/Swaven/grunt-chequire/releases/tag/v0.1.3): add support for exclusion list
* 2016-02-23: [v0.1.2](https://github.com/Swaven/grunt-chequire/releases/tag/v0.1.2): update peer dependency to support grunt v1.0.0
* 2015-10-30: [v0.1.1](https://github.com/Swaven/grunt-chequire/releases/tag/v0.1.1): bugfix (reset to initial cwd)
* 2015-10-27: [v0.1.0](https://github.com/Swaven/grunt-chequire/releases/tag/v0.1.0): first release
