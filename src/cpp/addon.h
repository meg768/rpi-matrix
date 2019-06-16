
#ifndef _addon_h
#define _addon_h

#include "includes.h"

typedef struct {
    uint8_t red;     // 0 - 255 
    uint8_t green;   // 0 - 255 
    uint8_t blue;    // 0 - 255 
    uint8_t alpha;   // 0 - 255 
} RGBA;

typedef struct {
    uint8_t blue;    // 0 - 255 
    uint8_t green;   // 0 - 255 
    uint8_t red;     // 0 - 255 
    uint8_t alpha;   // 0 - 255 
} BGRA;

class Addon {

public:
	Addon();

	static NAN_METHOD(configure);
	static NAN_METHOD(render);
	static NAN_METHOD(sleep);

};

#endif
