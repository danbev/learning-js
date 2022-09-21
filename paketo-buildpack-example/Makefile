
bin/detect: cmd/detect/main.go node/detect.go
	go build -ldflags="-s -w" -o $@ ./$< 

pack: bin/detect
	pack build paketo-buildpack-example \
	--path ../paketo \
	--buildpack . \
	--builder paketobuildpacks/builder:base \
	--verbose

