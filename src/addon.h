
#ifndef _addon_h
#define _addon_h

#include "includes.h"

class Addon {

public:
	Addon();

	static NAN_METHOD(configure);
	static NAN_METHOD(render);

private:
	static Matrix *_matrix;

};

#endif
