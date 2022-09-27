
bin/detect: cmd/detect/main.go node/detect.go
	go build -ldflags="-s -w" -o $@ ./$<

bin/build: cmd/build/main.go node/build.go
	go build -ldflags="-s -w" -o $@ ./$<

.PHONY: fmt
fmt:
	go fmt node/*.go
	go fmt cmd/build/*.go
	go fmt cmd/detect/*.go

pack: bin/detect bin/build
	env BP_LOG_LEVEL=debug pack build ubi-node-engine \
	--path ../../paketo \
	--buildpack . \
	--builder paketobuildpacks/builder:base \
	--docker-host=inherit \
	--verbose

