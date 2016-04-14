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

To run this project simple execute:

    npm start

## Testing

    npm test

### Running a single test:

    mocha tests/algorithms/algorithms_test.js

