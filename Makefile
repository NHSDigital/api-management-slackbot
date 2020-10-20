SHELL=/bin/bash -euo pipefail

install:
	poetry install
	cd docker && npm install

test:
	@echo "No tests configured."

clean:
	rm -rf dist

release: clean
	mkdir -p dist
	cp ecs-proxies-deploy dist/ecs-deploy-internal-dev.yml

check-licenses:
	@echo "Not configured"

lint:
	@echo "Not configured"
