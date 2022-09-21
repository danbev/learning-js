
bin/detect: cmd/detect/main.go
	go build -ldflags="-s -w" -o $@ ./$<

.PHONY: pack
pack: bin/detect
	pack build paketo-buildpack-example \
	--path ../paketo \
	--buildpack . \
	--builder paketobuildpacks/builder:base \
	--verbose

