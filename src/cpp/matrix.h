#ifndef _matrix_h
#define _matrix_h

#include "includes.h"

typedef struct {
	uint8_t red;     // 0 - 255 */
	uint8_t green;   // 0 - 255 */
	uint8_t blue;    // 0 - 255 */
} RGB;

typedef struct {
	uint16_t hue;       // 0 - 360  */
	uint8_t saturation; // 0 - 100  */
	uint8_t luminance;  // 0 - 100  */
} HSL;


static void *__matrix = 0;
static rgb_matrix::GPIO __io;


class Matrix {

public:

	class Options : public rgb_matrix::RGBMatrix::Options {
	};

	static void Initialize() {
		static int initialized = false;

		if (!initialized) {
			initialized = true;

			srand(time(NULL));

			// Trap ctrl-c to call quit function
			signal(SIGINT, Matrix::quit);
			signal(SIGKILL, Matrix::quit);

			if (!__io.Init())
				exit(-1);

		}
	}

	Matrix(Matrix::Options &options) {
		
		Matrix::Initialize();		

		__matrix    = this;

		_matrix     = new rgb_matrix::RGBMatrix(&__io, options);
		_canvas     = _matrix->CreateFrameCanvas();
		_width      = _matrix->width();
		_height     = _matrix->height();  

	}


	virtual ~Matrix() {
		if (_matrix == __matrix) {
			__matrix = 0;
		}

		delete _matrix;
	}
	
	static void quit(int sig)
	{
		Matrix *matrix = (Matrix *)__matrix;
		
		if (matrix != 0) {
			matrix->clear();
			matrix->refresh();
		}
		
		exit(-1);
	}
	
	inline int width() {
		return _width;
	}
	
	inline int height() {
		return _height;
	}

	inline void clear() {
		_canvas->Clear();
	}

	inline void setPixel(int x, int y, int r, int g, int b) {
		_canvas->SetPixel(x, y, r, g, b);
	}

	
	void refresh() {
		_canvas = _matrix->SwapOnVSync(_canvas);
	}


	
protected:
	int _width;
	int _height;
	rgb_matrix::RGBMatrix *_matrix;
	rgb_matrix::FrameCanvas *_canvas;
};


#endif
