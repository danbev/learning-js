package node

import (
	"fmt"
	"github.com/paketo-buildpacks/packit/v2"
)

func Build() packit.BuildFunc {
	return func(context packit.BuildContext) (packit.BuildResult, error) {
		return packit.BuildResult{}, fmt.Errorf("node::Build shouldl always fail")
	}
}
