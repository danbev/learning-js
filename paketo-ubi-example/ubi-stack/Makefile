
.PHONY build-base:
build-base:
	podman build . -t cnbs/ubi-base-image --target base

.PHONY build-run:
build-run:
	podman build . -t cnbs/ubi-run-image --target run

.PHONY build-build:
build-build:
	podman build . -t cnbs/ubi-build-image --target build
