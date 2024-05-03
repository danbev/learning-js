## Electron
This document is mainly about debugging electron using gdb.


### Building electron
Electron has a [build tool](https://github.com/electron/build-tools) which can
be used to build electron.
```console
$ cd ~/work/javascript
$ npm install --global yarn
$ npm i -g @electron/build-tools
$ e init --root=./new-electron --bootstrap testing
```
This command failed for me after awhile which I think is due to gclient sync
and happeded to me with the manual build as well. I was able to get it to
continue using:
```console
$ e sync
```
After that we can build:
```console
$ e d rbe login
$ e build
```
And this can then be started in a debugger using:
```console
$ e debug
```

### Building electron manully
The following section contains my first attempt to building electron and it
worked but I was not able to get a debug build to work so I resorted to using
the build-tool that Electron provides (see above).

Electron requires [depot-tools] and make sure that the depot-tools is in the
front of your PATH or you'll get an error when trying to build electron with
GN (Generate Ninja):
```console
$ export PATH=~/work/javascript/depot_tools:$PATH
```

Install Generate Ninja (GN)
```console
$ sudo apt install generate-ninja
```

Fetch the electron source code
```console
$ mkdir electron-js
$ gclient sync --with_branch_heads --with_tags
```
The above takes a long time to complete and failed a few times for me but
eventually it worked.

After that we have to set an environment variable:
```console
$ export CHROMIUM_BUILDTOOLS_PATH=/home/danbev/work/javascript/electron/electron-js/src/buildtools
```

Building should be done from the following directory:
```console
$ cd /home/danbev/work/javascript/electron/electron-js/src
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
And the executable will be in `out/Testing/electron`:
```console
$ file out/Testing/electron 
out/Testing/electron: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, for GNU/Linux 3.2.0, BuildID[xxHash]=1ed51451a53821b3, with debug_info, not stripped
```
We can see the version using:
```console
$ ./out/Testing/electron --version
v32.0.0-nightly.20240425
```
And the Node ABI version:
```console
$ ./out/Testing/electron --abi
123
```
There is also an interactive interpreter:
```console
$ ./out/Testing/electron -i
```

Enable debug symbols
```console
$ gn args out/Testing
```
is_debug = true
```

### Using different versions of Electron
If we need to use an older version of Electron and want to build for that we
have to configure the repository as follows:
```console
$ cd src/electron/
$ git remote remove origin
$ git remote add origin https://github.com/electron/electron
$ git co main
$ git fetch origin
$ git branch --set-upstream-to=origin/main
```
And to use a specific version we can checkout a tag:
```console
git checkout -b v24.6.3 v24.6.3
```
```console
$ pushd ../
$ gclient sync -f
$ popd
$ gn gen out/Testing --args="import(\"//electron/build/args/testing.gn\")"
```


### Debugging Electron using GDB
After building electron using the "Testing" configuration we can start it using
```console
$ pushd out/Testing
$ gdb --args ./electron --help
```

`content/app/content_main_runner_impl.cc`:
```c++
exit_code = content_main_runner->Run();
```


[depot-tools] : https://commondatastorage.googleapis.com/chrome-infra-docs/flat/depot_tools/docs/html/depot_tools_tutorial.html#_setting_up
