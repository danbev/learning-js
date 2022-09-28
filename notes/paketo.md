## Paketo

### Packit


### Software Bill of Materials (SBOM)
https://paketo.io/docs/concepts/sbom/

### Buildpack for Node Engine
[github repo](https://github.com/paketo-buildpacks/node-engine)

This is a Cloud Native Buildpack (CNB) which provides a Node.js distribution
from build using the sources from [nodejs.org](https://nodejs.org/dist) and
made available at [https://deps.paketo.io/node](https://deps.paketo.io/node).

```console
$ wget https://deps.paketo.io/node/node_v18.9.0_linux_x64_bionic_5d7d85f9.tgz
$ ls -lh node_v18.9.0_linux_x64_bionic_5d7d85f9.tgz 
-rw-rw-r--. 1 danielbevenius danielbevenius 44M Sep  8 18:34 node_v18.9.0_linux_x64_bionic_5d7d85f9.tgz
$ ls
bin  include  lib  LICENSE  share
$ ls bin/
corepack  node	npm  npx
```

The Node binary that will be downloaded from
[https://deps.paketo.io/node](https://deps.paketo.io/node) unpacked when this
buildpack is built/installed. 

`buildpack.toml` has a metadata section, and there is an entry for each version
of Node.js supported. The `uri` element is what specifies the binary
distribution to be used for each version:
```toml
[metadata]
  include-files = ["bin/build", "bin/detect", "bin/run", "bin/optimize-memory", "buildpack.toml"]
  pre-package = "./scripts/build.sh"
  [metadata.default-versions]
    node = "16.*.*"

  [[metadata.dependencies]]
    cpe = "cpe:2.3:a:nodejs:node.js:12.22.11:*:*:*:*:*:*:*"
    deprecation_date = "2022-04-30T00:00:00Z"
    id = "node"
    licenses = ["0BSD", "Apache-2.0", "Artistic-2.0", "BSD-2-Clause", "BSD-3-Clause", "BSD-3-Clause-Clear", "CC0-1.0", "MIT", "MIT-0", "Unicode-TOU"]
    name = "Node Engine"
    purl = "pkg:generic/node@v12.22.11?checksum=784785071df0c2f756a5dc5206a37f585ee1017898131a707183b8764269fefa&download_url=https://nodejs.org/dist/v12.22.11/node-v12.22.11.tar.gz"
    sha256 = "d7d7ee01d6e77fbba4dea79af30b85817ae6909eb1f02002a8bcffaa04979bb8"
    source = "https://nodejs.org/dist/v12.22.11/node-v12.22.11.tar.gz"         
    source_sha256 = "784785071df0c2f756a5dc5206a37f585ee1017898131a707183b8764269fefa"
    stacks = ["io.buildpacks.stacks.bionic", "io.buildpacks.stacks.jammy"]
    uri = "https://deps.paketo.io/node/node_v12.22.11_linux_x64_bionic_d7d7ee01.tgz"
    version = "12.22.11"
```

#### Building
```console
$ ./scripts/package.sh --version 18.9.0

Preparing repo...

Packaging buildpack into /home/danielbevenius/work/javascript/node-engine/build/buildpack.tgz...
Using jam 1.4.5
Packing Paketo Buildpack for Node Engine 18.9.0...
  Executing pre-packaging script: ./scripts/build.sh
    Building run... go: github.com/paketo-buildpacks/packit/v2@v2.4.2 requires
    	github.com/anchore/syft@v0.53.4 requires
    	github.com/letsencrypt/boulder@v0.0.0-20220331220046-b23ab962616e requires
    	github.com/honeycombio/beeline-go@v1.1.1 requires
    	github.com/gobuffalo/pop/v5@v5.3.1 requires
    	github.com/mattn/go-sqlite3@v2.0.3+incompatible: reading github.com/mattn/go-sqlite3/go.mod at revision v2.0.3: unknown revision v2.0.3
Error: failed to execute pre-packaging script "./scripts/build.sh": exit status 1
Usage:
  jam pack [flags]

Flags:
      --buildpack string   path to buildpack.toml
  -h, --help               help for pack
      --offline            enable offline caching of dependencies
      --output string      path to location of output tarball
      --stack string       restricts dependencies to given stack
      --version string     version of the buildpack

failed to execute: failed to execute pre-packaging script "./scripts/build.sh": exit status 1$
```
I was able to work around this issue by upgrading `go` from `go1.16.15` to
`go1.19.1`. After upgrading I was able to build using `./scripts/package.sh`:
```console
$ ./scripts/package.sh --version 18.9.0

Preparing repo...

Packaging buildpack into /home/danielbevenius/work/javascript/node-engine/build/buildpack.tgz...
Using jam 1.4.5
Packing Paketo Buildpack for Node Engine 18.9.0...
  Executing pre-packaging script: ./scripts/build.sh
    Building run... go: downloading github.com/paketo-buildpacks/packit/v2 v2.4.2
    go: downloading github.com/Masterminds/semver/v3 v3.1.1
    go: downloading github.com/Masterminds/semver v1.5.0
    go: downloading gopkg.in/yaml.v2 v2.4.0
    ...
    Success!
    Linking detect... Success!
    Linking build... Success!
    Building optimize-memory... Success!

  Building tarball: /home/danielbevenius/work/javascript/node-engine/build/buildpack.tgz
    bin
    bin/build
    bin/detect
    bin/optimize-memory
    bin/run
    buildpack.toml

Packaging buildpack...

Installing pack v0.27.0
Successfully created package /home/danielbevenius/work/javascript/node-engine/build/buildpackage.cnb
```
So we can see that this built `./build/buildpackage.cnb`. We can use this
to build an application using `pack`:
```console
$ pack config default-builder paketobuildpacks/builder:base

$ .bin/pack -v build paketo-example --path ../learning-js/paketo -b build/buildpackage.cnb 
Builder paketobuildpacks/builder:base is trusted
Pulling image index.docker.io/paketobuildpacks/builder:base
5a758b0d9e24: Already exists 
...
eeac5ef924c7: Download complete 
Selected run image index.docker.io/paketobuildpacks/run:base-cnb
Pulling image index.docker.io/paketobuildpacks/run:base-cnb
f2de9738df2c: Download complete 
Downloading buildpack from URI: file:///home/danielbevenius/work/javascript/node-engine/build/buildpackage.cnb
Adding buildpack paketo-buildpacks/node-engine version 18.0.0 to builder
Setting custom order
Creating builder with the following buildpacks:
-> paketo-buildpacks/dotnet-core@0.23.2
-> paketo-buildpacks/ca-certificates@3.4.0
-> paketo-buildpacks/environment-variables@4.3.0
-> paketo-buildpacks/vsdbg@0.0.2
-> paketo-buildpacks/dotnet-core-sdk@0.9.4
-> paketo-buildpacks/dotnet-execute@0.11.2
-> paketo-buildpacks/icu@0.4.1
-> paketo-buildpacks/watchexec@2.6.0
-> paketo-buildpacks/dotnet-core-aspnet@0.9.5
-> paketo-buildpacks/dotnet-core-runtime@0.10.4
-> paketo-buildpacks/dotnet-publish@0.9.2
-> paketo-buildpacks/image-labels@4.3.0
-> paketo-buildpacks/node-engine@0.16.0
-> paketo-buildpacks/procfile@5.4.0
-> paketo-buildpacks/go@3.0.0
-> paketo-buildpacks/git@1.0.0
-> paketo-buildpacks/go-build@2.0.2
-> paketo-buildpacks/procfile@5.4.0
-> paketo-buildpacks/watchexec@2.6.0
-> paketo-buildpacks/ca-certificates@3.4.0
-> paketo-buildpacks/environment-variables@4.3.0
-> paketo-buildpacks/go-dist@2.1.1
-> paketo-buildpacks/go-mod-vendor@1.0.2
-> paketo-buildpacks/image-labels@4.3.0
-> paketo-buildpacks/java-native-image@7.31.0
-> paketo-buildpacks/gradle@6.8.0
-> paketo-buildpacks/upx@3.2.0
-> paketo-buildpacks/procfile@5.4.0
-> paketo-buildpacks/sbt@6.8.0
-> paketo-buildpacks/ca-certificates@3.4.0
-> paketo-buildpacks/executable-jar@6.4.0
-> paketo-buildpacks/leiningen@4.4.0
-> paketo-buildpacks/native-image@5.4.0
-> paketo-buildpacks/image-labels@4.3.0
-> paketo-buildpacks/spring-boot@5.18.0
-> paketo-buildpacks/syft@1.19.0
-> paketo-buildpacks/bellsoft-liberica@9.7.0
-> paketo-buildpacks/environment-variables@4.3.0
-> paketo-buildpacks/maven@6.8.0
-> paketo-buildpacks/java@7.3.0
-> paketo-buildpacks/bellsoft-liberica@9.7.0
-> paketo-buildpacks/clojure-tools@2.5.0
-> paketo-buildpacks/dist-zip@5.3.0
-> paketo-buildpacks/leiningen@4.4.0
-> paketo-buildpacks/sbt@6.8.0
-> paketo-buildpacks/datadog@2.2.0
-> paketo-buildpacks/encrypt-at-rest@4.2.1
-> paketo-buildpacks/environment-variables@4.3.0
-> paketo-buildpacks/gradle@6.8.0
-> paketo-buildpacks/java-memory-assistant@1.1.0
-> paketo-buildpacks/liberty@2.2.0
-> paketo-buildpacks/syft@1.19.0
-> paketo-buildpacks/watchexec@2.6.0
-> paketo-buildpacks/ca-certificates@3.4.0
-> paketo-buildpacks/executable-jar@6.4.0
-> paketo-buildpacks/google-stackdriver@6.6.0
-> paketo-buildpacks/image-labels@4.3.0
-> paketo-buildpacks/jattach@1.1.0
-> paketo-buildpacks/maven@6.8.0
-> paketo-buildpacks/apache-tomcat@7.5.0
-> paketo-buildpacks/apache-tomee@1.2.0
-> paketo-buildpacks/azure-application-insights@5.7.0
-> paketo-buildpacks/procfile@5.4.0
-> paketo-buildpacks/spring-boot@5.18.0
-> paketo-buildpacks/nodejs@0.24.0
-> paketo-buildpacks/datadog@2.1.0
-> paketo-buildpacks/environment-variables@4.3.0
-> paketo-buildpacks/procfile@5.4.0
-> paketo-buildpacks/node-engine@0.16.0
-> paketo-buildpacks/node-module-bom@0.4.2
-> paketo-buildpacks/node-run-script@0.4.3
-> paketo-buildpacks/npm-start@0.10.1
-> paketo-buildpacks/watchexec@2.6.0
-> paketo-buildpacks/yarn@0.8.2
-> paketo-buildpacks/yarn-start@0.8.4
-> paketo-buildpacks/ca-certificates@3.4.0
-> paketo-buildpacks/image-labels@4.3.0
-> paketo-buildpacks/node-start@0.8.4
-> paketo-buildpacks/npm-install@0.10.5
-> paketo-buildpacks/yarn-install@0.10.4
-> paketo-buildpacks/procfile@5.4.0
-> paketo-buildpacks/python@2.2.0
-> paketo-buildpacks/poetry@0.4.0
-> paketo-buildpacks/pipenv@1.6.0
-> paketo-buildpacks/pipenv-install@0.6.2
-> paketo-buildpacks/watchexec@2.6.0
-> paketo-buildpacks/pip@0.15.0
-> paketo-buildpacks/image-labels@4.3.0
-> paketo-buildpacks/miniconda@0.7.0
-> paketo-buildpacks/poetry-run@0.4.2
-> paketo-buildpacks/procfile@5.4.0
-> paketo-buildpacks/cpython@1.4.0
-> paketo-buildpacks/environment-variables@4.3.0
-> paketo-buildpacks/pip-install@0.5.2
-> paketo-buildpacks/poetry-install@0.3.2
-> paketo-buildpacks/python-start@0.12.2
-> paketo-buildpacks/ca-certificates@3.4.0
-> paketo-buildpacks/conda-env-update@0.6.0
-> paketo-buildpacks/ruby@0.16.0
-> paketo-buildpacks/rackup@0.4.2
-> paketo-buildpacks/yarn-install@0.10.4
-> paketo-buildpacks/bundle-install@0.5.4
-> paketo-buildpacks/bundler@0.5.5
-> paketo-buildpacks/ca-certificates@3.4.0
-> paketo-buildpacks/puma@0.4.2
-> paketo-buildpacks/environment-variables@4.3.0
-> paketo-buildpacks/procfile@5.4.0
-> paketo-buildpacks/unicorn@0.4.2
-> paketo-buildpacks/rails-assets@0.7.2
-> paketo-buildpacks/rake@0.4.2
-> paketo-buildpacks/thin@0.5.2
-> paketo-buildpacks/yarn@0.8.2
-> paketo-buildpacks/image-labels@4.3.0
-> paketo-buildpacks/mri@0.8.5
-> paketo-buildpacks/node-engine@0.16.0
-> paketo-buildpacks/passenger@0.6.4
-> paketo-buildpacks/watchexec@2.6.0
-> paketo-buildpacks/web-servers@0.2.0
-> paketo-buildpacks/ca-certificates@3.4.0
-> paketo-buildpacks/npm-install@0.10.5
-> paketo-buildpacks/watchexec@2.6.0
-> paketo-buildpacks/yarn-install@0.10.4
-> paketo-buildpacks/procfile@5.4.0
-> paketo-buildpacks/environment-variables@4.3.0
-> paketo-buildpacks/httpd@0.5.1
-> paketo-buildpacks/image-labels@4.3.0
-> paketo-buildpacks/nginx@0.10.0
-> paketo-buildpacks/node-engine@0.16.0
-> paketo-buildpacks/node-run-script@0.4.3
-> paketo-buildpacks/yarn@0.8.2
-> paketo-buildpacks/node-engine@18.0.0
Adding buildpack paketo-buildpacks/node-engine@18.0.0 (diffID=sha256:625db7c2a1607b675a9e1162b54a54e0ea38347a7e2818c9bef59b64c69e75e5)
Using build cache volume pack-cache-library_paketo-example_latest-14322b19e9fc.build
Running the creator on OS linux with:
Container Settings:
  Args: /cnb/lifecycle/creator -daemon -launch-cache /launch-cache -log-level debug -app /workspace -cache-dir /cache -run-image index.docker.io/paketobuildpacks/run:base-cnb paketo-example
  System Envs: CNB_PLATFORM_API=0.9
  Image: pack.local/builder/617a6c63736e69626b6d:latest
  User: root
  Labels: map[author:pack]
Host Settings:
  Binds: pack-cache-library_paketo-example_latest-14322b19e9fc.build:/cache /var/run/docker.sock:/var/run/docker.sock pack-cache-library_paketo-example_latest-14322b19e9fc.launch:/launch-cache pack-layers-yophbkqlqc:/layers pack-app-watjybxrek:/workspace
  Network Mode: 
Previous image with name "paketo-example" not found
Analyzing image "55a9aa7ff79787b2bcc82b13012a786714fec80f1b9a413171b2a4f6d2cfe6da"
===> DETECTING
======== Results ========
pass: paketo-buildpacks/node-engine@18.0.0
Resolving plan... (try #1)
fail: paketo-buildpacks/node-engine@18.0.0 provides unused node
Resolving plan... (try #2)
fail: paketo-buildpacks/node-engine@18.0.0 provides unused node
ERROR: No buildpack groups passed detection.
ERROR: Please check that you are running against the correct path.
ERROR: failed to detect: no buildpacks participating
ERROR: failed to build: executing lifecycle: failed with status code: 20
```
So detection failed for this builder. What does the builder expect the apps
to have?  
So one things that can be specified is the Node.js version in a `.nvmrc` file:
```console
v18.9.0
```
The above example I used does not have such file so lets just create a directory
with only `.nvmrc` in it and see what happens:
```console
$ mkdir danbev-example
$ echo 'v18.9.0' > danbev-example/.nvmrc
```

And then re-run the `pack` command:
```console
$ .bin/pack -v build paketo-example --path danbev-example -b ./build/buildpackage.cnb --docker-host=inherit
Builder paketobuildpacks/builder:base is trusted
Pulling image index.docker.io/paketobuildpacks/builder:base
5a758b0d9e24: Already exists 
eeac5ef924c7: Download complete 
Selected run image index.docker.io/paketobuildpacks/run:base-cnb
Pulling image index.docker.io/paketobuildpacks/run:base-cnb
f2de9738df2c: Download complete 
Downloading buildpack from URI: file:///home/danielbevenius/work/javascript/node-engine/build/buildpackage.cnb
Adding buildpack paketo-buildpacks/node-engine version 18.9.0 to builder
Setting custom order
Creating builder with the following buildpacks:
-> paketo-buildpacks/dotnet-core@0.23.2
...
-> paketo-buildpacks/node-engine@18.9.0
Adding buildpack paketo-buildpacks/node-engine@18.9.0 (diffID=sha256:7e7b4fd27ca5d661fec8cc0619d353f9aa9d62e74504a23ce4c7ebc837136ee8)
Using build cache volume pack-cache-library_paketo-example_latest-14322b19e9fc.build
Running the creator on OS linux with:
Container Settings:
  Args: /cnb/lifecycle/creator -daemon -launch-cache /launch-cache -log-level debug -app /workspace -cache-dir /cache -run-image index.docker.io/paketobuildpacks/run:base-cnb paketo-example
  System Envs: CNB_PLATFORM_API=0.9
  Image: pack.local/builder/667061786f77676b7a7a:latest
  User: root
  Labels: map[author:pack]
Host Settings:
  Binds: pack-cache-library_paketo-example_latest-14322b19e9fc.build:/cache /run/user/1000/podman/podman.sock:/var/run/docker.sock pack-cache-library_paketo-example_latest-14322b19e9fc.launch:/launch-cache pack-layers-rzbhquekig:/layers pack-app-ztzxbbywwd:/workspace
  Network Mode: 
Previous image with name "paketo-example" not found
Analyzing image "f2de9738df2ca06d46c111b2a958271c962ffd3f9fc7864314082c4daa8d9fba"
===> DETECTING
======== Results ========
pass: paketo-buildpacks/node-engine@18.9.0
Resolving plan... (try #1)
paketo-buildpacks/node-engine 18.9.0
===> RESTORING
Reading buildpack directory: /layers/paketo-buildpacks_node-engine
Reading buildpack directory: /layers/paketo-buildpacks_node-engine
===> BUILDING
Starting build
Running build for buildpack paketo-buildpacks/node-engine@18.9.0
Looking up buildpack
Finding plan
Running build for buildpack Paketo Buildpack for Node Engine 18.9.0
Creating plan directory
Preparing paths
Running build command
Paketo Buildpack for Node Engine 18.9.0
  Resolving Node Engine version
    Candidate version sources (in priority order):
      .nvmrc -> "18.9.0"

    Selected Node Engine version (using .nvmrc): 18.9.0

  Executing build process
    Installing Node Engine 18.9.0
      Completed in 2.885s

  Generating SBOM for /layers/paketo-buildpacks_node-engine/node
      Completed in 0s

  Configuring build environment
    NODE_ENV     -> "production"
    NODE_HOME    -> "/layers/paketo-buildpacks_node-engine/node"
    NODE_VERBOSE -> "false"
    SSL_CERT_DIR -> "$SSL_CERT_DIR:/etc/ssl/certs"

  Configuring launch environment
    NODE_ENV     -> "production"
    NODE_HOME    -> "/layers/paketo-buildpacks_node-engine/node"
    NODE_VERBOSE -> "false"
    SSL_CERT_DIR -> "$SSL_CERT_DIR:/etc/ssl/certs"

    Writing exec.d/0-optimize-memory
      Calculates available memory based on container limits at launch time.
      Made available in the MEMORY_AVAILABLE environment variable.

Processing layers
Updating environment
Reading output files
Updating buildpack processes
Updating process list
Finished running build for buildpack paketo-buildpacks/node-engine@18.9.0
Copying SBOM files
Creating SBOM files for legacy BOM
Listing processes
Finished build
===> EXPORTING
Reading buildpack directory: /layers/paketo-buildpacks_node-engine
Reading buildpack directory item: node.ignore
Reading buildpack directory item: node.sbom.cdx.json
Reading buildpack directory item: node.sbom.spdx.json
Reading buildpack directory item: node.sbom.syft.json
Reading buildpack directory item: node.toml
Processing buildpack directory: /layers/paketo-buildpacks_node-engine
Found SBOM of type launch for at /layers/sbom/launch
Reusing tarball for layer "launch.sbom" with SHA: sha256:36f9de0748c420980a265697f38f76b0f9ae9b7862d3467b76b638706e637425
Adding layer 'launch.sbom'
Layer 'launch.sbom' SHA: sha256:36f9de0748c420980a265697f38f76b0f9ae9b7862d3467b76b638706e637425
Layer 'slice-1' SHA: sha256:6c608dde37a0cf23f987b2bfd8a6afda136ea3f9c962baf372468b56ece2f8da
Adding 1/1 app layer(s)
Reusing tarball for layer "launcher" with SHA: sha256:f6b3eafdc09a5ef55b177f186a53471b6280c69796b8b834de684389ea44ac35
Adding layer 'launcher'
Layer 'launcher' SHA: sha256:f6b3eafdc09a5ef55b177f186a53471b6280c69796b8b834de684389ea44ac35
Reusing tarball for layer "config" with SHA: sha256:8d9966ce9e3bac6d5669efd8f1835ef4bed2abddd0f3edc9fbadba6fd33e3a8a
Adding layer 'config'
Layer 'config' SHA: sha256:8d9966ce9e3bac6d5669efd8f1835ef4bed2abddd0f3edc9fbadba6fd33e3a8a
Adding label 'io.buildpacks.lifecycle.metadata'
Adding label 'io.buildpacks.build.metadata'
Adding label 'io.buildpacks.project.metadata'
Setting CNB_LAYERS_DIR=/layers
Setting CNB_APP_DIR=/workspace
Setting CNB_PLATFORM_API=0.9
Setting CNB_DEPRECATION_MODE=quiet
Prepending /cnb/process and /cnb/lifecycle to PATH
Setting WORKDIR: '/workspace'
no default process type
Setting ENTRYPOINT: '/cnb/lifecycle/launcher'
Saving paketo-example...
*** Images (0cdd52cf8c01):
      paketo-example

*** Image ID: 0cdd52cf8c0100b2998d81d6951b3d116752de3d094bc252fd188b519eb901bb
Reading buildpack directory: /layers/paketo-buildpacks_node-engine
Reading buildpack directory item: node.ignore
Reading buildpack directory item: node.sbom.cdx.json
Reading buildpack directory item: node.sbom.spdx.json
Reading buildpack directory item: node.sbom.syft.json
Reading buildpack directory item: node.toml
Successfully built image paketo-example
```
The entry point for this image is `/cnb/lifecycle/launcher`. This program is
responsible for launching the buildpack.

I'm a little confused at this point. I was expecting image created above to
have node installed somewhere after looking at the output.
```console
$ podman run -ti docker.io/library/paketo-example2 /bin/bash
cnb@d25fdf412483:/workspace$ ls /layers/paketo-buildpacks_node-engine
ls: cannot access '/layers/paketo-buildpacks_node-engine': No such file or directory
```
I've not been able to find any trace of node or the environment variables
that were in output above. I'm sure I'm missing something here...
This was because there is no `launch` variable set for this layer which means
that it will not be available when running. If the launch variable is set
the the layer will be available.

So I was able to get this to work by specifying additional buildpacks, namely
`paketo-buildpacks/npm-install` and  `paketo-buildpacks/node-start`:
```console
$ .bin/pack -v --pull-policy=never build paketo-example2 -p ../learning-js/paketo -b ./build/buildpackage.cnb -b paketo-buildpacks/npm-install -b paketo-buildpacks/node-start --docker-host=inherit
```
And one of those buildpacks probable set it.

```console
cnb@98190a7360a2:/workspace$ /layers/paketo-buildpacks_node-engine/node/bin/node --version
v18.9.0
```

There is an example in [paketo-ubi-example/ubi-node-engine](../paketo-ubi-example/ubi-node-engine)
which does set the `launch` variable and can be run using the following command:
```console
$ cd paketo-ubi-example
$ make pack
...
Saving paketo-buildpack-example...
*** Images (67e2ab8f8c76):
      paketo-buildpack-example

*** Image ID: 67e2ab8f8c7685f48a8397f6d4616ac27b52a188df2ac56ec3bed7d9439a4ef9
Reading buildpack directory: /layers/paketo-buildpack-example
Reading buildpack directory item: node
Reading buildpack directory item: node.toml
Reusing tarball for layer "paketo-buildpack-example:node" with SHA: sha256:4570cde298fa0e452c553e80aa73177395ab1864aa89face1a84af44e94f1d5a
Adding cache layer 'paketo-buildpack-example:node'
Layer 'paketo-buildpack-example:node' SHA: sha256:4570cde298fa0e452c553e80aa73177395ab1864aa89face1a84af44e94f1d5a
Successfully built image paketo-buildpack-example
```
```console
$ podman run -ti docker.io/library/paketo-buildpack-example node --version
node: /lib/x86_64-linux-gnu/libc.so.6: version `GLIBC_2.28' not found (required by node
```
Node 18 uses a newer version of libc which is not provided by Ubuntu 18. For
now I'll lower the node version to 17. With that change and re-building using
`make pack` we can now run the image:
```console
$ podman run -ti docker.io/library/paketo-buildpack-example node --version
v17.9.1
```

Another way to get detection to work is setting an environment variable
named `BP_NODE_VERSION`, or a buildpack.yml, or a package.json (with a version
in it), or an .node-version file.

Example of using `BP_NODE_VERSION`:
```console
.bin/pack -v build paketo-example -p integration/testdata/needs_node_and_npm_app/ -b ./build/buildpackage.cnb --env BP_NODE_VERSION=18.9.0 --docker-host=inherit
```

### node-engine internals
So lets take a closer look at where the installing/building of Node.js is
being done. We know we are calling a script named `scripts/package.sh` so lets
start there.
The first things that happens, after the command line options have been parsed
and checked, is that the shell script function `repo::prepare()` is called. It
will log to stdout:
```console
Preparing repo...
```
It will also remove any existing `build` dir and then create a bin directory
and the build directory. The environment variables PATH will be updated to
include this `bin` directory.

Next, `buildpack::archive` will be invoked.
```bash
function buildpack::archive() {
  ...
  jam pack \                                                                  
      --buildpack "${ROOT_DIR}/buildpack.toml" \                                
      --version "${version}" \                                                  
      --output "${BUILD_DIR}/buildpack.tgz"
}
```
`ROOT_DIR` is the root of the `node-engine` local repository. What is `jam`?  
I don't have this installed but it is installed in `.bin/jam`:
```console
$ .bin/jam --help
Usage:
  jam [command]

Available Commands:
  completion          Generate the autocompletion script for the specified shell
  create-stack        create-stack
  help                Help about any command
  pack                package buildpack
  summarize           summarize buildpackage
  update-builder      update builder
  update-buildpack    update buildpack
  update-dependencies updates all depdendencies in a buildpack.toml either with metadata from a file or from an API.
  version             version of jam

Flags:
  -h, --help   help for jam

Use "jam [command] --help" for more information about a command
```
The [github](https://github.com/paketo-buildpacks/jam) repo contains more
information about this tool. This is what creates buildpacks.
So `buildpack::archive` is calling this tool with the following options:
```console
  jam pack \
      --buildpack "./buildpack.toml" \
      --version "18.9.0" \
      --output "./build/buildpack.tgz"
```
That is "all" that achive does. If we look at the produces `buildpack.tgz` file
we find:
```console
$ ls
bin  buildpack.toml
```
The only difference between this buildpack.toml and the version in the root
directory is that a version has been added to the buildpack
```toml
[buildpack]
  homepage = "https://github.com/paketo-buildpacks/node-engine"
  id = "paketo-buildpacks/node-engine"
  name = "Paketo Buildpack for Node Engine"
  sbom-formats = ["application/vnd.cyclonedx+json", "application/spdx+json", "application/vnd.syft+json"]
  version = "18.9.0"

  ...
```
The files in the bin directory or executables:
```console
$ ls -lh
total 23M
lrwxrwxrwx. 1 danielbevenius danielbevenius    3 Sep 19 08:01 build -> run
lrwxrwxrwx. 1 danielbevenius danielbevenius    3 Sep 19 08:01 detect -> run
-rwxrwxr-x. 1 danielbevenius danielbevenius 1.5M Sep 19 08:01 optimize-memory
-rwxrwxr-x. 1 danielbevenius danielbevenius  21M Sep 19 08:01 run
```
After `buildpack::archive`, `buildpack::create` will be called.

```console
$ env BP_LOG_LEVEL=debug ./scripts/package.sh --version 18.9.0
```

### Build images
There is a `build-image` that is used while building the application, for example
this would be used for `npm install` for a Node.js application.
There is also a `run-image` which is the image used for running the application.
This combo of `build-image/run-image` is called a stack.

### Stack
A stack is the image used for building/running which can be different. For
Node.js and UBI where would be a `run-image` which uses UBI for example.

### Builders
A builder contains a set of buildpacks, a stack, and a cloud native buildpack
lifecycle that glues these components together.

Paketo provides a number of builders, for example 
[paketobuildpacks/builder:full](https://github.com/paketo-buildpacks/full-builder).

This builder specifies a number of buildpacks:
```toml
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

[[order]]

  [[order.group]]
    id = "paketo-buildpacks/dotnet-core"
    version = "0.23.2"

[[order]]

  [[order.group]]
    id = "paketo-buildpacks/go"
    version = "3.0.0"

[[order]]

  [[order.group]]
    id = "paketo-buildpacks/python"
    version = "2.2.0"

[[order]]

  [[order.group]]
    id = "paketo-buildpacks/php"
    version = "1.3.0"

[[order]]

  [[order.group]]
    id = "paketo-buildpacks/web-servers"
    version = "0.2.0"

[[order]]

  [[order.group]]
    id = "paketo-buildpacks/java-native-image"
    version = "7.31.0"

[[order]]

  [[order.group]]
    id = "paketo-buildpacks/java"
    version = "7.3.0"

[[order]]

  [[order.group]]
    id = "paketo-buildpacks/nodejs"
    version = "0.24.0"

[[order]]

  [[order.group]]
    id = "paketo-buildpacks/procfile"
    version = "5.4.0"

[stack]
  build-image = "docker.io/paketobuildpacks/build:1.3.90-full-cnb"
  id = "io.buildpacks.stacks.bionic"
  run-image = "index.docker.io/paketobuildpacks/run:full-cnb"
  run-image-mirrors = ["gcr.io/paketo-buildpacks/run:full-cnb"]

```
Note that these `[[buildpack]]`'s produce an array of tables. Each
`[[buildpack]]` will be a separate item in this array.
```json
"buildpack": [
  {
    uri = "docker://gcr.io/paketo-buildpacks/dotnet-core:0.23.2",
    version = "0.23.2"
  },
  {
    uri = "docker://gcr.io/paketo-buildpacks/nodejs:0.24.0"
    version = "0.24.0"
  }
]
```
So when a user uses `pack` with this builder it will run through the buildpacks
in the order specified by the order array I think. And depending on that the
`detect` phase detects the specific buildpack is the one that will build
the application.

When we use the pack command it will run though a number of lifecycle stages.
One of these stages is the `detect` stage which will try to identify the type
of source code application it is dealing with.1
If we take [paketo-buildpacks/nodejs](https://github.com/paketo-buildpacks/nodejs)
it in turn contains a number of buildpacks. For example it contains
paketo-buildpacks/node-engine, paketo-buildpacks/npm-install, etc.

So if we wanted to provide an alternative to `paketo-buildpacks/nodejs-engine`
how would we do that? 
We saw previously that the engine is identifies using a few different methods
like the BP_NODE_VERSION, '.nvmrc`, `.node-version`, version in `package.json`.
We could use a specific version scheme and prefix the version with `rhel/ubi`
and then have a ubi-node-engine only detect that version. This would require
the ubi-node-engine to come before the node-engine.


