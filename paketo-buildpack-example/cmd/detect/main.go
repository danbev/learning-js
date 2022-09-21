package main

import (
	"paketo-buildpack-example/node"
	"github.com/paketo-buildpacks/packit/v2"
)

func main() {
	packit.Detect(node.Detect())
}
