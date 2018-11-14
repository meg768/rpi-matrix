
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

    Matrix::Options opts;

	if (info.Length() != 1 ) {
		return Nan::ThrowError("configure requires an argument.");
	}

	v8::Local<v8::Object> options = v8::Local<v8::Object>::Cast(info[0]);

    // hardware_mapping
    if (true) {
    	v8::Local<v8::Value> value = options->Get(Nan::New<v8::String>("hardware_mapping").ToLocalChecked());

        if (!value->IsUndefined())
            opts.hardware_mapping = *v8::String::Utf8Value(value);
    }

    // rows
    if (true) {
    	v8::Local<v8::Value> value = options->Get(Nan::New<v8::String>("rows").ToLocalChecked());

        if (!value->IsUndefined())
            opts.rows = value->Int32Value();
    }

    // cols
    if (true) {
    	v8::Local<v8::Value> value = options->Get(Nan::New<v8::String>("cols").ToLocalChecked());

        if (!value->IsUndefined())
            opts.cols = value->Int32Value();
    }

    // chain_length
    if (true) {
    	v8::Local<v8::Value> value = options->Get(Nan::New<v8::String>("chain_length").ToLocalChecked());

        if (!value->IsUndefined())
            opts.chain_length = value->Int32Value();
    }

    // parallel
    if (true) {
    	v8::Local<v8::Value> value = options->Get(Nan::New<v8::String>("parallel").ToLocalChecked());

        if (!value->IsUndefined())
            opts.parallel = value->Int32Value();
    }

    // pwm_bits
    if (true) {
    	v8::Local<v8::Value> value = options->Get(Nan::New<v8::String>("pwm_bits").ToLocalChecked());

        if (!value->IsUndefined())
            opts.pwm_bits = value->Int32Value();
    }

    // pwm_lsb_nanoseconds
    if (true) {
    	v8::Local<v8::Value> value = options->Get(Nan::New<v8::String>("pwm_lsb_nanoseconds").ToLocalChecked());

        if (!value->IsUndefined())
            opts.pwm_lsb_nanoseconds = value->Int32Value();
    }

    // pwm_dither_bits
    if (true) {
    	v8::Local<v8::Value> value = options->Get(Nan::New<v8::String>("pwm_dither_bits").ToLocalChecked());

        if (!value->IsUndefined())
            opts.pwm_dither_bits = value->Int32Value();
    }

    // brightness
    if (true) {
    	v8::Local<v8::Value> value = options->Get(Nan::New<v8::String>("brightness").ToLocalChecked());

        if (!value->IsUndefined())
            opts.brightness = value->Int32Value();
    }

    // scan_mode
    if (true) {
    	v8::Local<v8::Value> value = options->Get(Nan::New<v8::String>("scan_mode").ToLocalChecked());

        if (!value->IsUndefined())
            opts.scan_mode = value->Int32Value();
    }

    // row_address_type
    if (true) {
    	v8::Local<v8::Value> value = options->Get(Nan::New<v8::String>("row_address_type").ToLocalChecked());

        if (!value->IsUndefined())
            opts.row_address_type = value->Int32Value();
    }

    // multiplexing
    if (true) {
    	v8::Local<v8::Value> value = options->Get(Nan::New<v8::String>("multiplexing").ToLocalChecked());

        if (!value->IsUndefined())
            opts.multiplexing = value->Int32Value();
    }

    // disable_hardware_pulsing
    if (true) {
    	v8::Local<v8::Value> value = options->Get(Nan::New<v8::String>("disable_hardware_pulsing").ToLocalChecked());

        if (!value->IsUndefined())
            opts.disable_hardware_pulsing = value->Int32Value();
    }

    // show_refresh_rate
    if (true) {
    	v8::Local<v8::Value> value = options->Get(Nan::New<v8::String>("show_refresh_rate").ToLocalChecked());

        if (!value->IsUndefined())
            opts.show_refresh_rate = value->Int32Value();
    }

    // inverse_colors
    if (true) {
    	v8::Local<v8::Value> value = options->Get(Nan::New<v8::String>("inverse_colors").ToLocalChecked());

        if (!value->IsUndefined())
            opts.inverse_colors = value->Int32Value();
    }

    // led_rgb_sequence
    if (true) {
    	v8::Local<v8::Value> value = options->Get(Nan::New<v8::String>("led_rgb_sequence").ToLocalChecked());

        if (!value->IsUndefined())
            opts.led_rgb_sequence = *v8::String::Utf8Value(value);
    }

    // pixel_mapper_config
    if (true) {
    	v8::Local<v8::Value> value = options->Get(Nan::New<v8::String>("pixel_mapper_config").ToLocalChecked());

        if (!value->IsUndefined())
            opts.pixel_mapper_config = *v8::String::Utf8Value(value);
    }

    if (_screen != NULL)
        delete _screen;

    if (_pixels != NULL)
        delete _pixels;

	if (_matrix != NULL)
		delete _matrix;

	_matrix = new Matrix(opts);

    int size = opts.rows * opts.cols;

	_pixels = new RGBA[size];
	_screen = new RGBA[size];

    memset(_pixels, 0, sizeof(RGBA) * size);
    memset(_screen, 0, sizeof(RGBA) * size);

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
                    
                    dst->red   = src->red;
                    dst->green = src->green;
                    dst->blue  = src->blue;
                    dst->alpha = 255;

                    /*
                    dst->red   = (src->red   * src->alpha) / 255;
                    dst->green = (src->green * src->alpha) / 255;
                    dst->blue  = (src->blue  * src->alpha) / 255;
                    dst->alpha = 255;
                    */
                   
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