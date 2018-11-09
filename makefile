
all: ./build/Release/rpi-matrix.node 

pull:
	git pull

commit:
	git add -A && git commit -m '-' && git push

test: ./build/Release/rpi-matrix.node
	node ./tests/foo.js
	
./hzeller/lib/librgbmatrix.a: ./hzeller/lib/*.cc ./hzeller/lib/*.h
	make -C ./hzeller/lib

./build/Release/rpi-matrix.node: ./hzeller/lib/librgbmatrix.a ./src/*.cpp ./src/*.h 
	node-gyp rebuild



