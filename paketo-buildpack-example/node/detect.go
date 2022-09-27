package node

import (
	"github.com/paketo-buildpacks/packit/v2"
)

func Detect() packit.DetectFunc {
	// Note that this function returns a tuple
	return func(context packit.DetectContext) (packit.DetectResult, error) {
		return packit.DetectResult{
			Plan: packit.BuildPlan{
				Provides: []packit.BuildPlanProvision{
					{Name: "node"},
				},
				Requires: []packit.BuildPlanRequirement{
					{Name: "node"},
				},
			},
		}, nil // No error

	}
}
