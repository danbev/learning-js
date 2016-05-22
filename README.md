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
```shell
$ npm install node-inspector -g
```

```shell
$ node-debug program.js
```

#### Vagrant
If you want to remote debug a virtual VM provisioned by Vagrant.

Find the VM that you want to use:

```shell
$ VBoxManage list vms
```
Depending on your setup you might need to configure port forwarding:

```shell
$ VBoxManage modifyvm "fhcap_single_1461911505182_31134" --natpf1 "guestnginx,tcp,,5858,,5858"
$ VBoxManage modifyvm "fhcap_single_1461911505182_31134" --natpf1 "guestnginx,tcp,,8888,,8888"
```

Now, when you start node-debug use the ```--web-port``` and ```--web-host```  when starting:

```shell
$ node-debug --web-host=192.168.33.10 --web-port=8888 program.js
```


