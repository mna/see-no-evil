REPORTER = spec
TESTS = test/*.test.js
TEST_COVERAGE = test/coverage.html
TEST_PATTERN = .

test:
	@TEST=1 ./node_modules/.bin/mocha --grep $(TEST_PATTERN) --reporter $(REPORTER) $(TESTS)

test-cov: lib-cov
	@COV=1 $(MAKE) -s test REPORTER=html-cov > $(TEST_COVERAGE) && chromium-browser $(TEST_COVERAGE)

lib-cov:
	@jscoverage --no-highlight lib lib-cov

lint:
	jshint index.js lib/
	
lint-test:
	jshint test/

clean:
	rm -f -r $(TEST_COVERAGE) lib-cov

.PHONY: test clean lint lint-test
