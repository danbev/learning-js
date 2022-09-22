
bin/detect: cmd/detect/main.go node/detect.go
	go build -ldflags="-s -w" -o $@ ./$<

bin/build: cmd/build/main.go node/build.go
	go build -ldflags="-s -w" -o $@ ./$<

pack: bin/detect bin/build
	env BP_LOG_LEVEL=debug pack build paketo-buildpack-example \
	--path ../paketo \
	--buildpack . \
	--builder paketobuildpacks/builder:base \
	--docker-host=inherit \
	--verbose

