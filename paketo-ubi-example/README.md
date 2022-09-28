### Paketo UBI Node.js example
This directory contains an example of a Node.js buildpack which uses a Red Hat
supported Node.js version. This is only exploration code to help us figure out
what would be done and possible how.

The example contains 4 components:
* [ubi-stack](./ubi-stack) The stack (build-image and run-image) which uses UBI.
* [ubi-nodejs](./ubi-nodejs) The buildpack which include the ubi-node-engine below.
* [ubi-node-engine](./ubi-node-engine) The buildpack for the Node.js runtime.
* [ubi-full-builder](./ubi-full-builder) A Paketo builder that can be used with the `pack` command.

### Building
First we need to build the build-image and the run-image:
```console
$ cd ubi-stack
$ make build-run build-build
```
Next we can build the builder:
```console
$ cd ubi-full-builder
$ make pack
...
Successfully built image paketo-ubi-example
```
The `pack` target will build `ubi-node-engine`, and the `ubi-full-builder` and
then run the `pack` command.

### Running
```console
$ podman run -ti docker.io/library/paketo-ubi-example node --version
v12.22.12
```
