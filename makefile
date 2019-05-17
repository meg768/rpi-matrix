
all: build/Release/rpi-matrix.node 

pull:
	git pull

commit:
	git add -A && git commit -m '-' && git push

publish:
	npm publish

hzeller/lib/librgbmatrix.a: hzeller/lib/*.cc hzeller/lib/*.h
	make -C ./hzeller/lib

build/Release/rpi-matrix.node: hzeller/lib/librgbmatrix.a src/cpp/*.cpp src/cpp/*.h 
	node-gyp rebuild



