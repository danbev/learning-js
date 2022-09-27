## UBI Full Builder example
This is just an example used for exploration of buildpack builders.

The main goal of this builder is to use it with an
[ubi-node-engine](../ubi-node-engine) what we are looking into building.

### Building
Building this builder can be done with the following target:
```console
$ make build
```

Since the main purpose of this example is to develop/explore the
[ubi-node-engine](../ubi-node-engine) it can be built using the following
target:
```console
$ make pack
```
This target will first build `ubi-node-engine`, then build this `builder`, and
then use the `pack` command to build the [paketo](../../paketo). So the idea
is that changes can be made to the sources in `ubi-node-engine` and then run
`make pack` in this directory to get a fast turnaround.

