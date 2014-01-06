### Learning JavaScript
The sole purpose of this project is to aid me in leaning JavaScript. Apart from the language itself, things like build system, dependency management, 
and testing are setup.

## Prerequisites
[Grunt](http://gruntjs.com/) is used to build this project. It is similar to Ant, Maven, Gradle if you have a Java background.   
Grunt depends on the [Node Package Manager](https://npmjs.org/) (npn) to install itself and it's plugins. Please follow the instructions
for installing npn and Grunt.

## Building
Install the required plugins before running the build the first time, or after adding dependencies to project.json:

    npm install


To build this project simple execute:

    grunt

This will execute the default Grunt task which currently just produces a minified javascript file in the build directory. The default task
also includes the ```qunit``` task which executes the tests in this project.

## Testing
This project uses [qunit](http://qunitjs.com/) for unit tests. The tests are located in the ```tests``` directory.
All tests can be run from the command line by executing the following command:

    grunt qunit

During development simple opening the tests html file. For example, while adding tests to the equals module you'd then open
```tests/equals/equals.html``` in a browser. This will automatically run the tests that currently exist and they may be rerun
by using the link next to each test. When you add new tests you can simple refresh the page. 


## Development environment
Any text editor or IDE will do. I've been using VIM with the following plugins which has worked well:
* [vim-javascript](https://github.com/pangloss/vim-javascript)

