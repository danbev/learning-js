package main

import (
	"github.com/paketo-buildpacks/packit/v2"
	"paketo-buildpack-example/node"
)

func main() {
	packit.Detect(node.Detect())
}
