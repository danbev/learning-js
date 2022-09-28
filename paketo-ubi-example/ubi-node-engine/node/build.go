package node

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/BurntSushi/toml"
	"github.com/paketo-buildpacks/packit/v2"
)

func Build() packit.BuildFunc {
	return func(context packit.BuildContext) (packit.BuildResult, error) {
		fmt.Printf("node::Build BuildContext::CNBPath: %s\n", context.CNBPath)

		buildpack_toml, err := os.Open(filepath.Join(context.CNBPath, "buildpack.toml"))
		if err != nil {
			return packit.BuildResult{}, err
		}
		defer buildpack_toml.Close()

		fmt.Printf("node::Build BuildContext::Stack: %s\n", context.Stack)
		if context.Stack == "io.buildpacks.stacks.bionic" {
			return NodeDistInstall(context, buildpack_toml)
		}
		if context.Stack == "com.redhat.stacks.ubi" {
			return NodeDNFInstall(context, buildpack_toml)
		}

		return packit.BuildResult{}, fmt.Errorf("Stack %s currently not supported\n", context.Stack)
	}
}

func NodeDNFInstall(context packit.BuildContext, buildpack_toml *os.File) (packit.BuildResult, error) {
	var anon_struct struct {
		Metadata struct {
			Dependencies []struct {
				RPM string `toml:"rpm"`
			} `toml:"dependencies"`
		} `toml:"ubi-metadata"`
	}
	_, err := toml.DecodeReader(buildpack_toml, &anon_struct)
	if err != nil {
		return packit.BuildResult{}, err
	}
	rpm := anon_struct.Metadata.Dependencies[0].RPM
	fmt.Printf("node::Build (UBI) rpm -> %s\n", rpm)

	nodeLayer, err := context.Layers.Get("node")
	if err != nil {
		return packit.BuildResult{}, err
	}

	// Clear the layer
	nodeLayer, err = nodeLayer.Reset()
	if err != nil {
		return packit.BuildResult{}, err
	}

	nodeLayer.Launch = true

	_, cerr := exec.Command("sudo", "dnf", "install", "--installroot", nodeLayer.Path, "-y", rpm).Output()
	//log.Printf("out: %s\n", string(out))
	if cerr != nil {
		log.Printf("dnf output: %T", cerr)
		log.Println(cerr)
		return packit.BuildResult{}, fmt.Errorf("Could not install rpm: %s, %s", rpm, cerr)
	}

	return packit.BuildResult{
		Layers: []packit.Layer{nodeLayer},
	}, nil
}

func NodeDistInstall(context packit.BuildContext, buildpack_toml *os.File) (packit.BuildResult, error) {
	// Parse buildpack.toml by creating a struct and struct tags
	// for the fields which is a BurntSushi toml feature.
	var anon_struct struct {
		Metadata struct {
			Dependencies []struct {
				URI string `toml:"uri"`
			} `toml:"dependencies"`
		} `toml:"metadata"`
	}
	_, err := toml.DecodeReader(buildpack_toml, &anon_struct)
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

	fmt.Printf("node::Build nodeLayer.name: %s\n", nodeLayer.Name)
	fmt.Printf("node::Build nodeLayer.path: %s\n", nodeLayer.Path)

	downloadDir, err := os.MkdirTemp("", "danbev")
	if err != nil {
		return packit.BuildResult{}, err
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
		Layers: []packit.Layer{nodeLayer},
	}, nil
}
