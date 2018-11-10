
#include "addon.h"

Matrix *Addon::_matrix = NULL;


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

	if (_matrix != NULL)
		delete _matrix;

	_matrix = new Matrix(width, height);

	info.GetReturnValue().Set(Nan::Undefined());
};


NAN_METHOD(Addon::render)
{
	Nan::HandleScope();


    typedef struct {
        uint8_t red;    // 0 - 255 */
        uint8_t green;   // 0 - 255 */
        uint8_t blue;     // 0 - 255 */
        uint8_t alpha;   // 0 - 255 */
    } RGBA;

    typedef struct {
        uint8_t blue;    // 0 - 255 */
        uint8_t green;   // 0 - 255 */
        uint8_t red;     // 0 - 255 */
        uint8_t alpha;   // 0 - 255 */
    } BGRA;

    try {
        if (_matrix == NULL) {
            return Nan::ThrowError("Matrix is not configured.");
        }

    	int argc = info.Length();
        int delay = 0;

        if (argc < 1) {
            return Nan::ThrowError("draw requires at least one argument.");
        }

        if (argc > 1) {
        	delay = info[1]->IntegerValue();
        }

        int width = _matrix->width();
        int height = _matrix->height();
    

        v8::Local<v8::Uint32Array> array = info[0].As<v8::Uint32Array>();

        void *data = array->Buffer()->GetContents().Data();
        int32_t *contents = static_cast<int32_t*>(data);        

        if (contents == NULL)
            return Nan::ThrowError("Image must be a Buffer, Uint32Array or Uint8ClampedArray");

        if (info[0]->IsUint8ClampedArray()) {
            RGBA *pixels = (RGBA *)contents;


            for (int y = 0; y < height; y++) {
                for (int x = 0; x < width; x++, pixels++) {
                    
                    int red   = (pixels->red   * pixels->alpha) / 255;
                    int green = (pixels->green * pixels->alpha) / 255;
                    int blue  = (pixels->blue  * pixels->alpha) / 255;
                    
                    _matrix->setPixel(x, y, red, green, blue);
                }
            }

        }
        else {
            BGRA *pixels = (BGRA *)contents;

            for (int y = 0; y < height; y++) {
                for (int x = 0; x < width; x++, pixels++) {
                    _matrix->setPixel(x, y, pixels->red, pixels->green, pixels->blue);
                }
            }

        }


        _matrix->refresh();

        if (delay > 0) {
            usleep(delay * 1000);

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