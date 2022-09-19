## Paketo

### Buildpack for Node Engine
[github repo](git@github.com:paketo-buildpacks/node-engine.git)

This is a Cloud Native Buildpack (CNB) which provides a Node.js distribution
from [nodejs.org](https://nodejs.org/dist):
```console
$ wget https://nodejs.org/dist/v18.9.0/node-v18.9.0.tar.gz
$ ls -lh node-v18.9.0.tar.gz 
-rw-rw-r--. 1 danielbevenius danielbevenius 79M Sep  8 02:01 node-v18.9.0.tar.gz
```
Notice that this a source distrtibution so it will have to build node which
takes a while. TODO: when does that happen?

The Node binary will be downloaded from [nodejs.org](https://nodejs.org/dist)
and the urls are specified in `buildpack.toml` in the metadata section:
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
$ .bin/pack -v build paketo-example --path ../learning-js/paketo -b build/buildpackage.cnb 
```


So lets take a closer look at where the installing/building of Node.js is
being done. We know we are calling a script named `scripts/package.sh` so lets
start there.
The first things that happens, after the command line options have been parsed
and checked, is that the shell script function `repo::prepare()` is called. It
will log to stdout:
```console
reparing repo...
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
The only differenct between this buildpack.toml and the version in the root
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
When we use the pack command it will run though a number of lifecycle stages.
One of these stages is the `detect` stage which will try to identify the type
of source code application it is dealing with.1
