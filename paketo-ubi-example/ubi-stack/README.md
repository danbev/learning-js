## Sample Stack for UBI build and run images
This is just an example to be able to try out a build/run image that uses
UBI. The intention is to try using rpm/dnf to install Node.js.

### Building
To build the `run` image:
```console
$ make build-run
```
To build the `build` image:
```console
$ make build-build
```

List images:
```console
$ podman images
REPOSITORY                                  TAG         IMAGE ID      CREATED         SIZE
localhost/cnbs/run-image                    ubi         4aff18191f70  13 minutes ago  227 MB
localhost/cnbs/build-image                  ubi         4aff18191f70  13 minutes ago  227 MB
```
