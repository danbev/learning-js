### Buildpack Exporter issue
I'm seeing the following error when trying to follow
https://paketo.io/docs/howto/create-paketo-buildpack:
```console
$ make pack
GOOS=linux go build -ldflags="-s -w" -o bin/build ./cmd/build/main.go 
pack build paketo-buildpack-example \
--path ../paketo \
--buildpack . \
--builder paketobuildpacks/builder:base \
--pull-policy never \
--trust-builder \
--timestamps \
--verbose
2022/09/22 06:32:20.755533 Builder paketobuildpacks/builder:base is trusted
2022/09/22 06:32:20.912169 Selected run image index.docker.io/paketobuildpacks/run:base-cnb
2022/09/22 06:32:20.999772 Downloading buildpack from URI: file:///home/danielbevenius/work/javascript/learning-js/paketo-buildpack-exampl

...
===> RESTORING
Reading buildpack directory: /layers/paketo-buildpack-example
Reading buildpack directory: /layers/paketo-buildpack-example
2022/09/22 06:32:22.216916 ===> BUILDING
Starting build
2022/09/22 06:32:22.216941 Running build for buildpack paketo-buildpack-example@0.0.1
Looking up buildpack
2022/09/22 06:32:22.217105 Finding plan
Running build for buildpack Paketo Example Node Engine Buildpack 0.0.1
2022/09/22 06:32:22.217120 Creating plan directory
2022/09/22 06:32:22.218092 Preparing paths
2022/09/22 06:32:22.218673 Running build command
2022/09/22 06:32:22.221943 node::Build BuildContext::CNBPath: /cnb/buildpacks/paketo-buildpack-example/0.0.1
2022/09/22 06:32:22.221984 node::Build URI -> https://nodejs.org/dist/v18.9.0/node-v18.9.0-linux-x64.tar.xz
2022/09/22 06:32:22.222099 node::Build nodeLayer.name: node
node::Build nodeLayer.path: /layers/paketo-buildpack-example/node
2022/09/22 06:32:22.223539 node::Build Directory exists
node::Build Downloading node tar to directory: /tmp/danbev2966786495
2022/09/22 06:32:23.117443 node::Build Untaring /tmp/danbev2966786495/node.tar.xz
2022/09/22 06:32:25.282805 node::Build All done...
2022/09/22 06:32:25.291179 Processing layers
2022/09/22 06:32:25.291385 Updating environment
2022/09/22 06:32:25.291397 Reading output files
2022/09/22 06:32:25.292424 Updating buildpack processes
Updating process list
Finished running build for buildpack paketo-buildpack-example@0.0.1
Copying SBOM files
Creating SBOM files for legacy BOM
2022/09/22 06:32:25.292695 Listing processes
Finished build
2022/09/22 06:32:25.292854 ===> EXPORTING
2022/09/22 06:32:25.301851 ERROR: failed to export: get run image top layer SHA: image "paketo-buildpack-example" has no layers
2022/09/22 06:32:26.019037 ERROR: failed to build: executing lifecycle: failed with status code: 62
make: *** [Makefile:9: pack] Error 1
```
I've not figured out how to enable debug logging for the
[lifecycle](https://github.com/buildpacks/lifecycle) module but I can see that
`EXPORTING` above is logged from `cmd/lifecycle/creator.go`:
```go
func (c *createCmd) Exec() error {
    ...

        cmd.DefaultLogger.Phase("EXPORTING")                                        
        return exportArgs{                                                          
                appDir:              c.appDir,                                      
                docker:              c.docker,                                      
                gid:                 c.gid,                                         
                imageNames:          append([]string{c.outputImageRef}, c.additionalTags...),    
                keychain:            c.keychain,                                    
                launchCacheDir:      c.launchCacheDir,                              
                launcherPath:        c.launcherPath,                                
                layersDir:           c.layersDir,                                   
                platform:            c.platform,                                    
                processType:         c.processType,                                 
                projectMetadataPath: c.projectMetadataPath,                         
                reportPath:          c.reportPath,                                  
                runImageRef:         c.runImageRef,                                 
                stackMD:             c.stackMD,                                     
                stackPath:           c.stackPath,                                   
                targetRegistry:      c.targetRegistry,                              
                uid:                 c.uid,                                         
                useDaemon:           c.useDaemon,                                   
        }.export(group, cacheStore, analyzedMD)
```
`exportArgs` is a struct declared in `cmd/lifecycle/exporter.go`:
```go
type exportArgs struct {                                                        
        // inputs needed when run by creator                                    
        appDir              string                                              
        launchCacheDir      string                                              
        launcherPath        string                                              
        layersDir           string                                              
        processType         string                                              
        projectMetadataPath string                                              
        reportPath          string                                              
        runImageRef         string                                              
        stackPath           string                                              
        targetRegistry      string                                              
        imageNames          []string                                            
        stackMD             platform.StackMetadata                              
                                                                                
        useDaemon bool                                                          
        uid, gid  int                                                           
                                                                                
        platform Platform                                                       
                                                                                
        // construct if necessary before dropping privileges                    
        docker   client.CommonAPIClient                                         
        keychain authn.Keychain                                                 
}
```
And there is a function `export` which is defined for this struct:
```go
func (ea exportArgs) export(group buildpack.Group, cacheStore lifecycle.Cache, analyzedMD platform.AnalyzedMetadata) error {
    ...
        var appImage imgutil.Image                                                  
        var runImageID string                                                       
        if ea.useDaemon {                                                           
                appImage, runImageID, err = ea.initDaemonAppImage(analyzedMD)       
        } else {                                                                    
                appImage, runImageID, err = ea.initRemoteAppImage(analyzedMD)       
        }                                                                           
        if err != nil {                                                             
                return err                                                          
        }                   

        report, err := exporter.Export(lifecycle.ExportOptions{                 
                AdditionalNames:    ea.imageNames[1:],                          
                AppDir:             ea.appDir,                                  
                DefaultProcessType: ea.processType,                             
                LauncherConfig:     launcherConfig(ea.launcherPath),            
                LayersDir:          ea.layersDir,                               
                OrigMetadata:       analyzedMD.Metadata,                        
                Project:            projectMD,                                  
                RunImageRef:        runImageID,                                 
                Stack:              ea.stackMD,                                 
                WorkingImage:       appImage,                                   
        })
}
```
Which will call `Export` in `exporter.go`:
```go
func (e *Exporter) Export(opts ExportOptions) (platform.ExportReport, error) {
    var err error
    ...

    meta := platform.LayersMetadata{}                                       
    meta.RunImage.TopLayer, err = opts.WorkingImage.TopLayer()              
    if err != nil {                                                         
            return platform.ExportReport{}, errors.Wrap(err, "get run image top layer SHA")
    }       
    ....
}

type ExportOptions struct {                                                         
        LayersDir          string                                                   
        AppDir             string                                                   
        WorkingImage       imgutil.Image                                            
        RunImageRef        string                                                   
        OrigMetadata       platform.LayersMetadata                                  
        AdditionalNames    []string                                                 
        LauncherConfig     LauncherConfig                                           
        Stack              platform.StackMetadata                                   
        Project            platform.ProjectMetadata                                 
        DefaultProcessType string                                                   
}
```
That is the only occurence of `get run image top layer SHA` and this message
is getting wrapped with the `err`

Now, the `opt.WorkingImage` is passed in and is `appImage`, and notice the
check `if ea.useDaemon`. What I think is happening is that when I run `pack`
```console
$ pack build --help
--docker-host string          Address to docker daemon that will be exposed to the build container.
                              If not set (or set to empty string) the standard socket location will be used.
                              Special value 'inherit' may be used in which case DOCKER_HOST environment variable will be used.
                              This option may set DOCKER_HOST environment variable for the build container if needed.
```
Adding `--docker-host=inherit` to the pack command allowed the build to
succeed:
```console
$ make pack
env BP_LOG_LEVEL=debug pack build paketo-buildpack-example \
--path ../paketo \
--buildpack . \
--builder paketobuildpacks/builder:base \
--docker-host=inherit \
--verbose
Layer 'config' SHA: sha256:3debb20fdfcdb7cfa6cfd8061a2fa31a11a440f47ceb3d2602c323da38902b61
Adding label 'io.buildpacks.lifecycle.metadata'
Adding label 'io.buildpacks.build.metadata'
Adding label 'io.buildpacks.project.metadata'
Setting CNB_LAYERS_DIR=/layers
Setting CNB_APP_DIR=/workspace
Setting CNB_PLATFORM_API=0.9
Setting CNB_DEPRECATION_MODE=quiet
Prepending /cnb/process and /cnb/lifecycle to PATH
Setting WORKDIR: '/workspace'
no default process type
Setting ENTRYPOINT: '/cnb/lifecycle/launcher'
Saving paketo-buildpack-example...
*** Images (aa346f6779e5):
      paketo-buildpack-example

*** Image ID: aa346f6779e54c22a3e04839bf04a0464c03336eb19fdcd60b60b807f23eb85f
Reading buildpack directory: /layers/paketo-buildpack-example
Reading buildpack directory item: node
Reading buildpack directory item: node.toml
Reusing tarball for layer "paketo-buildpack-example:node" with SHA: sha256:36417994b31b999f367d9404e3acfc2bde82fa84c214ecd1905db708f8fa420f
Adding cache layer 'paketo-buildpack-example:node'
Layer 'paketo-buildpack-example:node' SHA: sha256:36417994b31b999f367d9404e3acfc2bde82fa84c214ecd1905db708f8fa420f
Successfully built image paketo-buildpack-example
```
