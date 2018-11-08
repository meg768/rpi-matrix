
all: ./hzeller/lib/librgbmatrix.a ./build/Release/rpi-matrix.node 

./build/Release/rpi-matrix.node: ./src/*.cpp ./src/*.h
	node-gyp rebuild

./hzeller/lib/librgbmatrix.a: ./hzeller/lib/*.cc ./hzeller/lib/*.h
	make -C hzeller/lib


