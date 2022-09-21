package node

import (
	"fmt"
	"github.com/paketo-buildpacks/packit/v2"
)

func Build() packit.BuildFunc {
	return func(context packit.BuildContext) (packit.BuildResult, error) {
		fmt.Printf("BuildContext::CNBPATH: %s\n", context.CNBPath)
		//fmt.Println("BuildContext::Plan:", context.Plan.node)
		return packit.BuildResult{}, fmt.Errorf("node::Build shouldl always fail")
	}
}
