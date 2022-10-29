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
$ pack build paketo-example-app --builder paketobuildpacks/builder:base --docker-host=inherit
...
Saving paketo-example-app...
*** Images (972109eaea73):
      paketo-example-app
Adding cache layer 'paketo-buildpacks/node-engine:node'
Adding cache layer 'paketo-buildpacks/node-module-bom:cyclonedx-node-module'
Adding cache layer 'cache.sbom'
Successfully built image paketo-example-app
```
```console
$ podman images
REPOSITORY                            TAG         IMAGE ID      CREATED        SIZE
...
docker.io/library/paketo-example-app  latest      3dca7a093c61  42 years ago   207 MB
```

Running the example:
```console
$ podman run -p 8088:8080 -e PORT=8080 library/paketo-example-app
```
We should now be able to access http://localhost:8088


### Adding custom labels
When deploying to certain cloud environments there can be requirements that
certain labels be added to an image. Custom lables can be added using
`BP_IMAGE_LABLES` which is a command line options and should contain a a space
delimited key-value pairs of lables. For example:
```console
$ pack build paketo-example-app --builder paketobuildpacks/builder:base --docker-host=inherit --env 'BP_IMAGE_LABELS=io.openshift.expose-services="8081:http" io.openshift.tags="builder,paketo"' --env BPE_PORT="8080" --env BPE_EXPOSE="8080" --env BLE_PORT="8080" --env BPL_PORT="8080" --env BPL_EXPOSE="8080" --env EXPOSE="8080"
...
Reusing layer 'process-types'
Adding label 'io.buildpacks.lifecycle.metadata'
Adding label 'io.buildpacks.build.metadata'
Adding label 'io.buildpacks.project.metadata'
Adding label 'io.openshift.expose-services'
Adding label 'io.openshift.tags'
Setting default process type 'web'
Saving paketo-example-app...
*** Images (598ba9faa718):
      paketo-example-app
```
And we can verify the lables in the built image using `podman inspect`:
```console
$ podman inspect 598ba9faa718 | grep openshift
                    "io.openshift.expose-services": "8080:http",
                    "io.openshift.tags": "builder,paketo",
               "io.openshift.expose-services": "8080:http",
               "io.openshift.tags": "builder,paketo",
```

