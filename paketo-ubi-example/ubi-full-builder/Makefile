.PHONY: build
build:
	pack builder create ubi-full-builder \
	--config ./builder.toml --pull-policy never --verbose

.PHONY: build-ubi-node-engine 
build-ubi-node-engine:
	$(MAKE) -C ../ubi-node-engine bin/build

.PHONY: pack
pack: build-ubi-node-engine build
	env BP_LOG_LEVEL=debug \
	pack build paketo-ubi-example --builder ubi-full-builder \
	--path ../../paketo \
	--docker-host=inherit \
	--pull-policy=never \
	--trust-builder \
	--verbose
