## [Paketo](https://paketo.io/) Buildpacks
[buildpacks](https://buildpacks.io/) are simliar to s2i and allow for taking
source code and transforming it into a container image, ready to run by
a container runtime. Using Buildpacks we can create source to container images
for Node.js or other languages, for example
[deno-buildpack](https://github.com/danbev/deno-buildpack) which is a buildpack
for Deno (Rust). 

### Example
The following example is based on the nodejs/npm example from
https://paketo.io/docs/.

Configure so that Podman is used by Paketo:
```console
$ systemctl enable --user podman.socket
$ systemctl start --user podman.socket
$ export DOCKER_HOST="unix://$(podman info -f "{{.Host.RemoteSocket.Path}}")"
$ sudo chmod 666 /var/run/docker.sock
```

Building:
```console
$ cd paketo
$ pack build paketo-example-app --builder paketobuildpacks/builder:base
...
Saving paketo-example-app...
*** Images (972109eaea73):
      paketo-example-app
Adding cache layer 'paketo-buildpacks/node-engine:node'
Adding cache layer 'paketo-buildpacks/node-module-bom:cyclonedx-node-module'
Adding cache layer 'cache.sbom'
Successfully built image paketo-example-app
```

_wip_

Running the example:
```console
$ podman run -d -p 8080:8080 -e PORT=8080 paketo-example-app
```



