package main

import (
	"paketo-buildpack-example/node"
	"github.com/paketo-buildpacks/packit"
)

func main() {
	packit.Detect(node.Detect())
}
