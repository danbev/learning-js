## Electron
This document is mainly about debugging electron using gdb.


### Building electron
Electron requires [depot-tools] and make sure that the depot-tools is in the
front of your PATH or you'll get an error when trying to build electron with
GN (Generate Ninja):
```console
$ export PATH=~/work/javascript/depot_tools/:$PATH
```

Install Generate Ninja (GN)
```console
$ sudo apt install generate-ninja
```

Fetch the electron source code
```console
$ mkdir electron
$ gclient sync --with_branch_heads --with_tags
```
The above takes a long time to complete and failed a few times for me but
eventually it worked.

After that we have to set an environment variable:
```console
$ export CHROMIUM_BUILDTOOLS_PATH=/home/danbev/work/javascript/electron/electron/src/buildtools
```
If we don't do that we'll get the following error:
```console
$ gn gen out/Testing --args="import(\"//electron/build/args/testing.gn\")"
ERROR at //build/nocompile.gni:153:9: Invalid substitution type.
        args += [
        ^--------
The substitution {{cflags}} isn't valid for something
operating on a source file such as this.
See //third_party/blink/renderer/platform/BUILD.gn:2070:3: whence it was called.
  nocompile_source_set("blink_platform_nocompile_tests") {
  ^-------------------------------------------------------
See //BUILD.gn:207:9: which caused the file to be included.
        "//third_party/blink/renderer/platform:blink_platform_unittests",
        ^---------------------------------------------------------------
```

The we use GN to generate the build files for ninja:
```console
$ gn gen out/Testing --args="import(\"//electron/build/args/testing.gn\")"
Done. Made 20544 targets from 3672 files in 1798ms
```
And then build using ninja:
```console
$ ninja -j8 -C out/Testing electron
```

### Debugging Electron using GDB
TODO:



[depot-tools] : https://commondatastorage.googleapis.com/chrome-infra-docs/flat/depot_tools/docs/html/depot_tools_tutorial.html#_setting_up
