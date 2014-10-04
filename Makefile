REPORTER=spec
TESTS=$(shell find ./test -type f -name "*.js")

test:
	clear
	node runTests.js --reporter list --recursive
dev:
	clear
	nodemon app.js --harmony
.PHONY: test