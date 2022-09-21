package node

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/paketo-buildpacks/packit/v2"
	"github.com/BurntSushi/toml"
)

func Build() packit.BuildFunc {
	return func(context packit.BuildContext) (packit.BuildResult, error) {
		fmt.Printf("node::Build BuildContext::CNBPath: %s\n", context.CNBPath)

		file, err := os.Open(filepath.Join(context.CNBPath, "buildpack.toml"))
		if err != nil {
			return packit.BuildResult{}, err
		}

		var anon_struct struct {
			Metadata struct {
				Dependencies []struct {
					URI string `toml:"uri"`
				} `toml:"dependencies"`
			} `toml:"metadata"`
		}
		_, err = toml.DecodeReader(file, &anon_struct)
		if err != nil {
			return packit.BuildResult{}, err
		}
		uri := anon_struct.Metadata.Dependencies[0].URI
		fmt.Printf("URI -> %s\n", uri)

		return packit.BuildResult{}, fmt.Errorf("node::Build should always fail")
	}
}
