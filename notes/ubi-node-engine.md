## ubi-node-engine
This document contains note about a task to investigate using Red Hat supported
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

Just a note about the syntax here which is not obvious to me, these
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
`run-image` for the produced image. In our case we would use a `build-image` and
a `run-image` based on `UBI` instead of `ubuntu bionic`. Paketo have 
[plans](https://blog.paketo.io/posts/2022-roadmap/) for creating UBI images.


The `full-builder` shown above includes a buildpack named `nodejs` which in
turn includes a number of buildpacks, and one of these is named
[node-engine](https://github.com/paketo-buildpacks/nodejs/blob/main/buildpack.toml#L27-L29)
which is the buildpack responsible for installing the Node.js executable
(including npm):
```
 [[order.group]]
    id = "paketo-buildpacks/node-engine"
    version = "0.17.0"
```

Now, we could provider our own builder which is similar to the above
`full-builder` but replaces that `stack` with `UBI` images, and replaces
`node.js` with our own buildpack for Node.js which uses `rhel-node-engine`
instead of `node-engine`.


The `node-engine` will detect if `node` is required by the application by
using a few different methods like the environment variable BP_NODE_VERSION,
a '.nvmrc` file,  a `.node-version` file, or a `version` field in `package.json.
`node-engine` is a Cloud Native Buildpack (CNB) provides a Node.js distribution
built using the sources from [nodejs.org](https://nodejs.org/dist) and
made available at [https://deps.paketo.io/node](https://deps.paketo.io/node).

The suggestion is that our `rhel-node-engine` be configured with RHEL Node.js
versions, and that it uses `rpm/dnf` to install node in the correct
layer/places just like `node-engine`.

If we do the above I think that the stack and the node-engine would be the only
buildpacks that require modification and we would be able to get the other
buildpack usages for free, like `yarn`, `yarn-install`, `npm-install`, etc.

### dnf (Dandified YUM) or rpm (Red Hat Package Manager)
DNF stands for Dandified YUM is the successor to YUM,  and RPM is Red Hat
Package Manager. Now, both dnf and rpm are used to install rpm packages. The
difference is that dnf can automatically identify and install dependencies which
rpm does not automatically do.

The idea for the ubi-node-engine is to use dnf or rpm to install a Red Hat
supported version of Node.js. The current Paketo node-engine downloads a Node.js
distribution and untars into a layer in the resulting images. This does not
require any special privileges But dnf/rpm do require superuser previledges.
So how do we install a package into the layer? 

The rpms available can be found [here](https://cdn-ubi.redhat.com/content/public/ubi/dist/ubi8/8/x86_64/appstream/os/Packages/n/)
, for example:
```
https://cdn-ubi.redhat.com/content/public/ubi/dist/ubi8/8/x86_64/appstream/os/Packages/n/nodejs-10.24.0-1.module+el8.3.0+10166+b07ac28e.x86_64.rpm
https://cdn-ubi.redhat.com/content/public/ubi/dist/ubi8/8/x86_64/appstream/os/Packages/n/nodejs-12.22.12-1.module+el8.6.0+15324+1f2c5d8d.x86_64.rpm
https://cdn-ubi.redhat.com/content/public/ubi/dist/ubi8/8/x86_64/appstream/os/Packages/n/nodejs-14.20.0-2.module+el8.6.0+16231+7c1b33d9.x86_64.rpm
```
One idea was that perhaps we could install this to a new location but these
packages are not relocatable:
```console
[root@cf951d2ec253 cnb]# rpm -i --prefix=/home/cnb/node/ https://cdn-ubi.redhat.com/content/public/ubi/dist/ubi8/8/x86_64/appstream/os/Packages/n/nodejs-14.20.0-2.module+el8.6.0+16231+7c1b33d9.x86_64.rpm
error: package nodejs is not relocatable
```
```console
[root@cf951d2ec253 cnb]# rpm -q https://cdn-ubi.redhat.com/content/public/ubi/dist/ubi8/8/x86_64/appstream/os/Packages/n/nodejs-14.20.0-2.module+el8.6.0+16231+7c1b33d9.x86_64.rpm
nodejs-14.20.0-2.module+el8.6.0+16231+7c1b33d9.x86_64
```

Perhaps we could install node using something like this:
```console
[cnb@4e1a25289f5f ~]$ sudo dnf install --installroot=/layer/ubi-node-engine -y https://cdn-ubi.redhat.com/content/public/ubi/dist/ubi8/8/x86_64/appstream/os/Packages/n/nodejs-12.22.12-1.module+el8.6.0+15324+1f2c5d8d.x86_64.rpm
[cnb@84e06d908032 /]$ /layer/ubi-node-engine/bin/node --version
v12.22.12
```

### Questions
* Can we add our changes to node-engine instead of forking?
  * How do we choose which installation method should be used, can we we inspect
    the stack that is in use? Can there be configuration options specified where
    the buildpack is include, in the builder for example. This might be possible
    to use an build environment variable on the command line using pack (--env)
    for example.

    
See [node-engine buildpack](./paketo.md#buildpack-for-node-engine) for more
details about how the node-engine works.
