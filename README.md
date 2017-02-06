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


### Update npm packaged
See which packages are outdated:

    npm outdated

Update a specific dev dependency:

    npm install grunt-contrib-concat@1.0.0 --save-dev


## NPM
Just a few npm commands that might be useful

### list/ls
Find the dependencies of a package:

    npm ls --depth=0

Without depth you can also see all the transient dependencies.

### docs
Open the docs for a module:

    npm docs module-name

### edit
If you need to debug a module you can run edit to open the module in your editor and
updated it.

    npm edit module-name


### Node Inspector

    $ npm install node-inspector -g


    $ node-debug program.js


If you want to debug a test then you'll have to debug grunt:

    $ node-inspector


Then start grunt like this:


    $ node --debug-brk $(which grunt) test

Or you can use the `--debug-brk` flag with mocha:

    $ mocha --debug-brk test


Running tape test using inspetor:

    $ node --inspect --debug-brk ./node_modules/babel-tape-runner/bin/babel-tape-runner tests/iterators/iterator-test.js

#### Vagrant
If you want to remote debug a virtual VM provisioned by Vagrant.

Find the VM that you want to use:

    $ VBoxManage list vms

Depending on your setup you might need to configure port forwarding:


    $ VBoxManage modifyvm "fhcap_single_1461911505182_31134" --natpf1 "guestnginx,tcp,,5858,,5858"
    $ VBoxManage modifyvm "fhcap_single_1461911505182_31134" --natpf1 "guestnginx,tcp,,8888,,8888"


Now, when you start node-debug use the ```--web-port``` and ```--web-host```  when starting:


    $ node-debug --web-host=192.168.33.10 --web-port=8888 program.js

I've noticed that there it can be slow sometimes when debugging but adding the `--hidden node_modules` option seems to improve performance.

If you find yourself debugging often you can create an ~/.node-inspectorrc file with your node-inspector configuration:

{
  "web-port": 8888,
  "web-host": "192.168.33.10",
  "debug-port": 5858,
  "hidden": ["./node_modules"]
}


### Proxyquire
Just a note about the @global property available in proxyquire which can be useful to allow for transitive requirements. Also note that this is not a
good approach to testing. A better approach would be to test the submodules in isolation and then stub the that module instead.

### Ru

