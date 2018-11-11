
#include "addon.h"

Matrix *Addon::_matrix = NULL;
RGBA *Addon::_pixels = NULL;
RGBA *Addon::_screen = NULL;

NAN_METHOD(Addon::configure)
{
	static int initialized = 0;

	Nan::HandleScope();

	if (!initialized) {
		initialized = 1;
	}


	if (info.Length() != 1 ) {
		return Nan::ThrowError("configure requires an argument.");
	}

	v8::Local<v8::Object> options = v8::Local<v8::Object>::Cast( info[ 0 ] );


	int width = options->Get(Nan::New<v8::String>("width").ToLocalChecked() )->Int32Value();
	int height = options->Get(Nan::New<v8::String>("height").ToLocalChecked() )->Int32Value();

    if (_screen != NULL)
        delete _screen;

    if (_pixels != NULL)
        delete _pixels;

	if (_matrix != NULL)
		delete _matrix;

	_matrix = new Matrix(width, height);
	_pixels = new RGBA[width * height];
	_screen = new RGBA[width * height];

    memset(_pixels, 0, sizeof(RGBA) * width * height);
    memset(_screen, 0, sizeof(RGBA) * width * height);

	info.GetReturnValue().Set(Nan::Undefined());
};


NAN_METHOD(Addon::render)
{
	Nan::HandleScope();


    try {
        if (_matrix == NULL) {
            return Nan::ThrowError("Matrix is not configured.");
        }

    	int argc   = info.Length();
        int blend  = 0;
        int sleep  = 0;
        int width  = _matrix->width();
        int height = _matrix->height();

        if (argc < 1) {
            return Nan::ThrowError("draw requires at least one argument.");
        }

        if (argc > 1) {

            if (info[1]->IsObject()) {
                v8::Local<v8::Object> options = v8::Local<v8::Object>::Cast(info[1]);

                sleep = options->Get(Nan::New<v8::String>("sleep").ToLocalChecked())->Int32Value();
                blend = options->Get(Nan::New<v8::String>("blend").ToLocalChecked())->Int32Value();

            }
        }

        v8::Local<v8::Uint32Array> array = info[0].As<v8::Uint32Array>();

        void *data = array->Buffer()->GetContents().Data();
        int32_t *contents = static_cast<int32_t*>(data);        

        if (contents == NULL)
            return Nan::ThrowError("Image must be a Buffer, Uint32Array or Uint8ClampedArray");

        if (info[0]->IsUint8ClampedArray()) {

            RGBA *src = (RGBA *)contents;
            RGBA *dst = _pixels;

            for (int y = 0; y < height; y++) {
                for (int x = 0; x < width; x++) {
                    
                    dst->red   = (src->red   * src->alpha) / 255;
                    dst->green = (src->green * src->alpha) / 255;
                    dst->blue  = (src->blue  * src->alpha) / 255;
                    dst->alpha = 255;

                    src++, dst++;
                    
                }
            }

        }
        else {
            BGRA *src = (BGRA *)contents;
            RGBA *dst = _pixels;

            for (int y = 0; y < height; y++) {
                for (int x = 0; x < width; x++) {
                    
                    dst->red   = src->red;   // (src->red   * src->alpha) / 255;
                    dst->green = src->green; // (src->green * src->alpha) / 255;
                    dst->blue  = src->blue;  // (src->blue  * src->alpha) / 255;

                    //dst->red   = (src->red   * src->alpha) / 255;
                    //dst->green = (src->green * src->alpha) / 255;
                    //dst->blue  = (src->blue  * src->alpha) / 255;


                    dst->alpha = 255;

                    src++, dst++;
                    
                }
            }
        }

  

        if (blend > 0) {
            int numSteps = blend;

            for (int step = 0; step < numSteps; step++) {

                RGBA *pp = _pixels;
                RGBA *sp = _screen;

                for (int y = 0; y < height; y++) {
                    for (int x = 0; x < width; x++) {
                        int red   = (sp->red + (step * (pp->red - sp->red)) / numSteps);
                        int green = (sp->green + (step * (pp->green - sp->green)) / numSteps);
                        int blue  = (sp->blue + (step * (pp->blue - sp->blue)) / numSteps);

                        _matrix->setPixel(x, y, red, green, blue);
                        sp++, pp++;             
                    }
                }

                _matrix->refresh();

            }
        }

        if (true) {
            RGBA *pp = _pixels;
            RGBA *sp = _screen;

            for (int y = 0; y < height; y++) {
                for (int x = 0; x < width; x++) {
                    _matrix->setPixel(x, y, pp->red, pp->green, pp->blue);                    
                    *sp++ = *pp++;
                }
            }
            
        }

        _matrix->refresh();

        if (sleep > 0) {
            usleep(sleep * 1000);

        }
    }
    
    catch (exception &error) {
        string what = error.what();
        string message = string("Failed reading image: ") + what;

		return Nan::ThrowError(message.c_str());
    }
    catch (...) {
        return Nan::ThrowError("Unhandled error");
    }

	info.GetReturnValue().Set(Nan::Undefined());

};



NAN_MODULE_INIT(initAddon)
{
	Nan::SetMethod(target, "configure",  Addon::configure);
	Nan::SetMethod(target, "render",     Addon::render);
}


NODE_MODULE(addon, initAddon);