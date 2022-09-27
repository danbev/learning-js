## rhel-node-engine
This document contains note about a task to investigate using RHEL supported
version of Node.js in combination with Paketo.

Paketo currently allows for packaging Node.js application using it's
[paketobuildpacks/builder:full](https://github.com/paketo-buildpacks/full-builder).

This builder specifies a number of buildpacks:
```console
description = "Ubuntu bionic base image with buildpacks for Java, .NET Core, NodeJS, Go, Python, PHP, Ruby, Apache HTTPD, NGINX and Procfile"

[[buildpacks]]
  uri = "docker://gcr.io/paketo-buildpacks/dotnet-core:0.23.2"
  version = "0.23.2"

  ...

[[buildpacks]]
  uri = "docker://gcr.io/paketo-buildpacks/nodejs:0.24.0"
  version = "0.24.0"

[lifecycle]
  version = "0.14.2"

[[order]]

  [[order.group]]
    id = "paketo-buildpacks/ruby"
    version = "0.16.0"
  
   ...

[stack]
  build-image = "docker.io/paketobuildpacks/build:1.3.90-full-cnb"
  id = "io.buildpacks.stacks.bionic"
  run-image = "index.docker.io/paketobuildpacks/run:full-cnb"
  run-image-mirrors = ["gcr.io/paketo-buildpacks/run:full-cnb"]

```

Just a note about the syntax here which is not obvious to me, thesei
`[[buildpack]]`'s produce an array of tables. Each `[[buildpack]]` will be a
separate item in this array. For example:
```javascript
"buildpack": [
  {
    uri: "docker://gcr.io/paketo-buildpacks/dotnet-core:0.23.2",
    version: "0.23.2"
  },
  {
    uri: "docker://gcr.io/paketo-buildpacks/nodejs:0.24.0"
    version: "0.24.0"
  }
]
```

Notice that the above `[stack]` section specifed the `build-image` and the
`run-image` for the produces image. In our case we would use a `build-image` and
a `run-image` based on `ubi` instead of `ubuntu bionic`.

If the only way of specifying a different stack to be used then we might need to
fork of [paketo-buildpacks](https://github.com/paketo-buildpacks/full-builder)
which uses our ubi images. This might also make sense to do if we indend to
provide other buildpacks for other languages.

The `full-builder` shown above includes a buildpack named `nodejs` which in
turn includes a number of buildpacks, and on of these is named
[node-engine](https://github.com/paketo-buildpacks/nodejs/blob/main/buildpack.toml#L27-L29)
which is the buildpack responsible for installing the Node.js executable
(including npm).

We could replace
[packeto-buildpacks/nodejs](https://github.com/paketo-buildpacks/nodejs) with
a RHEL specific one which would use our own `rhel-node-engine` instead of
`paketo-buildpacks/node-engine`. It is the `rhel-node-engine` that is what might
be the outcome of this investigation. 

The `node-engine` will detect if `node` is required by the application by
using a few different methods like the environment variable BP_NODE_VERSION,
a '.nvmrc` file,  a `.node-version` file, or a `version` field in `package.json.

This is a Cloud Native Buildpack (CNB) provides a Node.js distribution
built using the sources from [nodejs.org](https://nodejs.org/dist) and
made available at [https://deps.paketo.io/node](https://deps.paketo.io/node).

The suggestion is that our `rhel-node-engine` be configured with versions and
to RHEL Node.js versions, and that it uses rpm/dnf to install not in the correct
layer/places just like `node-engine`. The current `node-engine` is written in
go and I'm not sure if that is requirement but worth mentioning.

If we do the above I think that the stack and the node-engine would be the only
buildpacks that require modification.

See [node-engine buildpack](./paketo.md#buildpack-for-node-engine) for more
details.

### Questions
* Can we add our changes to node-engine instead of forking?
  * How do we choose which installation method should be used, can we we inspect
    the stack that is in use? Can there be configuration options specified where
    the buildpack is include, in the builder for example.

