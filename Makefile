NPM=./node_modules/.bin

test: lint
	@node $(NPM)/_mocha \
		--reporter $(if $(or $(TEST),$(V)),spec,dot) \
		--slow 600 --timeout 2000 \
		--grep '$(TEST)'

compile: dependencies
	@$(NPM)/babel --presets es2015,stage-3 ./bin/sey --out-file ./build/bin/sey
	@$(NPM)/babel --presets es2015,stage-3 ./src/ --out-dir ./build/src/
	@$(NPM)/babel --presets es2015,stage-3 ./tests/ --out-dir ./build/tests/
	@cp ./package.json ./build/

lint: dependencies
	@$(NPM)/eslint --config ./.eslintrc ./bin/*.js ./src/*.js ./tests/*.js

dependencies: node_modules

node_modules:
	@echo "Installing dependencies..."
	@npm install

coverage: dependencies
	@$(NPM)/istanbul cover $(NPM)/_mocha -- --reporter spec
	@open ./coverage/lcov-report/sey/sey.html

clean:
	@rm -rf ./coverage
	@rm -rf ./build/bin/*
	@rm -rf ./build/src/*
	@rm -rf ./build/tests/*
	@rm ./build/package.json

distclean: clean
	@rm -rf ./node_modules

check: test
