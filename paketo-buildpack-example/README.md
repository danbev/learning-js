## Paketo Node.js buildpack example
This example is based on https://paketo.io/docs/howto/create-paketo-buildpack/
and the motivation for creating this was to learn how we might be able to write
a similar buildpack but one that uses a stack based on Universal Base Image
([UBI](https://www.redhat.com/en/blog/introducing-red-hat-universal-base-image),
and instead of downloading a Node.js binary distribution and unpacking it into
the image, this buildpack would use rpm/dnf instead to install Node.js

### Building
```console
$ make pack
```

### Running
```console
$ podman run -ti docker.io/library/paketo-buildpack-example node --version
v17.9.1
```
