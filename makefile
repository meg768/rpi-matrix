
all: build/Release/rpi-matrix.node 

goto-github:
	open https://github.com/meg768/rpi-matrix

goto-npm:
	open https://www.npmjs.com/package/rpi-matrix

git-pull:
	git pull

git-commit:
	git add -A && git commit -m '-' && git push

git-reset:
	git reset --hard HEAD

npm-publish:
	npm publish

hzeller/lib/librgbmatrix.a: hzeller/lib/*.cc hzeller/lib/*.h
	make -C ./hzeller/lib

build/Release/rpi-matrix.node: hzeller/lib/librgbmatrix.a src/cpp/*.cpp src/cpp/*.h 
	node-gyp rebuild



