NPM=./node_modules/.bin
ISPARTA=./node_modules/isparta/bin/isparta

node_modules:
	@echo "Installing dependencies..."
	@npm install

.PHONY: lint
lint: node_modules
	@$(NPM)/eslint --config ./.eslintrc ./bin/ ./src/ ./test/

.PHONY: test
test: build
	@$(NPM)/babel-node $(NPM)/_mocha \
		--reporter spec \
		--slow 600 --timeout 5000 \
        --recursive \
		./test/

.PHONY: coverage
coverage: build
	@rm -rf ./coverage
	@$(NPM)/babel-node $(ISPARTA) cover --report html $(NPM)/_mocha -- \
        --reporter spec \
        --recursive \
        ./test/
	# @open ./coverage/index.html

.PHONY: build
build: node_modules
	@$(NPM)/babel ./src/ --out-dir ./lib/

.PHONY: rebuild
rebuild: clean build

.PHONY: clean
clean:
	@rm -rf ./lib/*

.PHONY: distclean
distclean: clean
	@rm -rf ./node_modules

.PHONY: repl
repl:
	@$(NPM)/babel-node
