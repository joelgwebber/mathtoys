# Builds the server
.PHONY: server
server:
	go build -o server go/src/mathtoys/server/server.go

# Builds the client.
.PHONY: client
client:
	tsc --out web/mathtoys.js ts/MathToys.ts


# Builds the server, runs it in the background, and starts the js-client auto-compiling.
.PHONY: js-client-auto
client-auto: server
	./server --port=2112 &
	tsc -w --out web/mathtoys.js ts/mathtoys.ts
	killall server

# Builds and runs the server.
.PHONY: run
run: client server
	./server --port=2112

all: server client
