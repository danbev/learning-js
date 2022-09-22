package node

import (
	"fmt"
	"log"
	"os"
	"os/exec"
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

		// Parse buildpack.toml by creating a struct and struct tags
		// for the fields which is a BurntSushi toml feature.
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

		// Gets the first URI from the parsed structure.
		uri := anon_struct.Metadata.Dependencies[0].URI
		fmt.Printf("node::Build URI -> %s\n", uri)

		// Get the layer named node which might have been added by
		// earlier builds, which I think would be another buildpack
		// which might have added this layer. The returned layer may in
		// that case have been populated with metadata.
		nodeLayer, err := context.Layers.Get("node")
		if err != nil {
			return packit.BuildResult{}, err
		}

		// Clear the layer
		nodeLayer, err = nodeLayer.Reset()
		if err != nil {
			return packit.BuildResult{}, err
		}
		// Specify that this layer needs to be available during the
		// launch phase. Without this it will not be avilable (once
		// we add something to the layer that is.
		nodeLayer.Launch = true
		nodeLayer.Cache = true
		nodeLayer.Build = true
		/*
		nodeLayer.Metadata = map[string]interface{} {
			DepKey: "0137e43f5492dd97b6ef1f39ea4581975016e5f1e70db461d7292c6853ace066",
		}
		*/

		fmt.Printf("node::Build nodeLayer.name: %s\n", nodeLayer.Name)
		fmt.Printf("node::Build nodeLayer.path: %s\n", nodeLayer.Path)

		downloadDir, err := os.MkdirTemp("", "danbev")
		if err != nil {
			return packit.BuildResult{}, err
		}
		if _, err := os.Stat(downloadDir); err == nil {
			fmt.Printf("node::Build Directory exists\n");
		} else {
			fmt.Printf("node;:Build Directory does not exist\n");
		}
		// This will run when this function returns.
		defer os.RemoveAll(downloadDir)

		fmt.Printf("node::Build Downloading node tar to directory: %s\n", downloadDir)
		err = exec.Command("curl",
			uri,
			"-o", filepath.Join(downloadDir, "/node.tar.xz"),
		).Run()
		if err != nil {
			return packit.BuildResult{}, err
		}

		fmt.Printf("node::Build Untaring %s\n", filepath.Join(downloadDir, "node.tar.xz"))
		// This will untar
		err = exec.Command("tar",
			"-xf",
			filepath.Join(downloadDir, "node.tar.xz"),
			"--strip-components=1",
			"-C", nodeLayer.Path,
		).Run()

		if err != nil {
			fmt.Printf("node::Build Could not untar file: %s\n", filepath.Join(downloadDir, "node.tar.xz"))
			log.Fatal(err)
			return packit.BuildResult{}, err
		}

		fmt.Printf("node::Build All done...\n")

		return packit.BuildResult{
			Layers: []packit.Layer { nodeLayer, },
		}, nil
	}
}
