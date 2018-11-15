
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
    v8::Local<v8::Value> hardware_mapping = options->Get(Nan::New<v8::String>("hardware_mapping").ToLocalChecked());
    string hardware_mapping_string;

    if (!hardware_mapping->IsUndefined()) {
        v8::String::Utf8Value value(hardware_mapping->ToString());
        hardware_mapping_string = string(*value);        
        opts.hardware_mapping = hardware_mapping_string.c_str(); 
    }

    // rows
    v8::Local<v8::Value> rows = options->Get(Nan::New<v8::String>("rows").ToLocalChecked());

    if (!rows->IsUndefined())
        opts.rows = rows->Int32Value();

    // cols
    v8::Local<v8::Value> cols = options->Get(Nan::New<v8::String>("cols").ToLocalChecked());

    if (!cols->IsUndefined())
        opts.cols = cols->Int32Value();


    // chain_length
    v8::Local<v8::Value> chain_length = options->Get(Nan::New<v8::String>("chain_length").ToLocalChecked());

    if (!chain_length->IsUndefined())
        opts.chain_length = chain_length->Int32Value();

    // parallel
    v8::Local<v8::Value> parallel = options->Get(Nan::New<v8::String>("parallel").ToLocalChecked());

    if (!parallel->IsUndefined())
        opts.parallel = parallel->Int32Value();

    // pwm_bits
    v8::Local<v8::Value> pwm_bits = options->Get(Nan::New<v8::String>("pwm_bits").ToLocalChecked());

    if (!pwm_bits->IsUndefined())
        opts.pwm_bits = pwm_bits->Int32Value();

    // pwm_lsb_nanoseconds
    v8::Local<v8::Value> pwm_lsb_nanoseconds = options->Get(Nan::New<v8::String>("pwm_lsb_nanoseconds").ToLocalChecked());

    if (!pwm_lsb_nanoseconds->IsUndefined())
        opts.pwm_lsb_nanoseconds = pwm_lsb_nanoseconds->Int32Value();

    // pwm_dither_bits
    v8::Local<v8::Value> pwm_dither_bits = options->Get(Nan::New<v8::String>("pwm_dither_bits").ToLocalChecked());

    if (!pwm_dither_bits->IsUndefined())
        opts.pwm_dither_bits = pwm_dither_bits->Int32Value();

    // brightness
    v8::Local<v8::Value> brightness = options->Get(Nan::New<v8::String>("brightness").ToLocalChecked());

    if (!brightness->IsUndefined())
        opts.brightness = brightness->Int32Value();

    // scan_mode
    v8::Local<v8::Value> scan_mode = options->Get(Nan::New<v8::String>("scan_mode").ToLocalChecked());

    if (!scan_mode->IsUndefined())
        opts.scan_mode = scan_mode->Int32Value();

    // row_address_type
    v8::Local<v8::Value> row_address_type = options->Get(Nan::New<v8::String>("row_address_type").ToLocalChecked());

    if (!row_address_type->IsUndefined())
        opts.row_address_type = row_address_type->Int32Value();

    // multiplexing
    v8::Local<v8::Value> multiplexing = options->Get(Nan::New<v8::String>("multiplexing").ToLocalChecked());

    if (!multiplexing->IsUndefined())
        opts.multiplexing = multiplexing->Int32Value();

    // disable_hardware_pulsing
    v8::Local<v8::Value> disable_hardware_pulsing = options->Get(Nan::New<v8::String>("disable_hardware_pulsing").ToLocalChecked());

    if (!disable_hardware_pulsing->IsUndefined())
        opts.disable_hardware_pulsing = disable_hardware_pulsing->Int32Value();

    // show_refresh_rate
    v8::Local<v8::Value> show_refresh_rate = options->Get(Nan::New<v8::String>("show_refresh_rate").ToLocalChecked());

    if (!show_refresh_rate->IsUndefined())
        opts.show_refresh_rate = show_refresh_rate->Int32Value();

    // inverse_colors
    v8::Local<v8::Value> inverse_colors = options->Get(Nan::New<v8::String>("inverse_colors").ToLocalChecked());

    if (!inverse_colors->IsUndefined())
        opts.inverse_colors = inverse_colors->Int32Value();

    // led_rgb_sequence
    v8::Local<v8::Value> led_rgb_sequence = options->Get(Nan::New<v8::String>("led_rgb_sequence").ToLocalChecked());
    string led_rgb_sequence_string;

    if (!led_rgb_sequence->IsUndefined()) {
        v8::String::Utf8Value value(led_rgb_sequence->ToString());
        led_rgb_sequence_string = string(*value);        
        opts.led_rgb_sequence = led_rgb_sequence_string.c_str(); 
    }

    // pixel_mapper_config
    v8::Local<v8::Value> pixel_mapper_config = options->Get(Nan::New<v8::String>("pixel_mapper_config").ToLocalChecked());
    string pixel_mapper_config_string;

    if (!pixel_mapper_config->IsUndefined()) {
        v8::String::Utf8Value value(pixel_mapper_config->ToString());
        pixel_mapper_config_string = string(*value);        
        opts.pixel_mapper_config = pixel_mapper_config_string.c_str(); 
    }

    printf("hardware_mapping         : %s\n", opts.hardware_mapping == NULL ? "" : opts.hardware_mapping);
    printf("rows                     : %d\n", opts.rows);
    printf("cols                     : %d\n", opts.cols);
    printf("chain_length             : %d\n", opts.chain_length);
    printf("parallel                 : %d\n", opts.parallel);
    printf("pwm_bits                 : %d\n", opts.pwm_bits);
    printf("pwm_lsb_nanoseconds      : %d\n", opts.pwm_lsb_nanoseconds);
    printf("pwm_dither_bits          : %d\n", opts.pwm_dither_bits);
    printf("brightness               : %d\n", opts.brightness);
    printf("scan_mode                : %d\n", opts.scan_mode);
    printf("row_address_type         : %d\n", opts.row_address_type);
    printf("multiplexing             : %d\n", opts.multiplexing);
    printf("disable_hardware_pulsing : %d\n", opts.disable_hardware_pulsing);
    printf("show_refresh_rate        : %d\n", opts.show_refresh_rate);
    printf("inverse_colors           : %d\n", opts.inverse_colors);
    printf("led_rgb_sequence         : %s\n", opts.led_rgb_sequence == NULL ? "" : opts.led_rgb_sequence);
    printf("pixel_mapper_config      : %s\n", opts.pixel_mapper_config == NULL ? "" : opts.pixel_mapper_config);

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



NAN_METHOD(Addon::scroll)
{
	Nan::HandleScope();


    try {
        if (_matrix == NULL) {
            return Nan::ThrowError("Matrix is not configured.");
        }

    	int argc   = info.Length();
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

            }
        }

        if (!info[0]->IsUint8ClampedArray())
            return Nan::ThrowError("Image must be a Uint8ClampedArray");

        v8::Local<v8::Uint8ClampedArray> array = info[0].As<v8::Uint8ClampedArray>();


        if (true) {

            int imageHeight = height;
            int imageWidth  = array->Length() / height / 4;

            printf("ImageHeight %d\n", imageHeight);
            printf("ImageWidth %d\n", imageWidth);

            void *data = array->Buffer()->GetContents().Data();
            RGBA *image = static_cast<RGBA *>(data);        
            int scrollOffset = 0;

            for (int i = 0; i < imageWidth; i++) {

                for (int y = 0; y < height; y++) {
                    for (int x = 0; x < width; x++) {
                        RGBA *dst = _pixels + (y * width) + x;
                        
                        if (x == width - 1) {
                            RGBA *src = image + (y * imageWidth) + x + i + 1;

                            dst->red   = (src->red   * src->alpha) / 255;
                            dst->green = (src->green * src->alpha) / 255;
                            dst->blue  = (src->blue  * src->alpha) / 255;
                            dst->alpha = 255;


                        }
                        else {
                            RGBA *src = _screen + (y * width) + x + 1;

                            *dst = *src;


                        }
                        _matrix->setPixel(x, y, dst->red, dst->green, dst->blue);                    

                    }
                }
                _matrix->refresh();
                memcpy(_screen, _pixels, width * height * sizeof(RGBA));

                usleep(1000 * 10);

            }
            if (sleep > 0) {
                usleep(sleep * 1000);
            }            


        }
/*
        else {
            int imageHeight = height;
            int imageWidth  = array->Length() / height / 4;

            printf("ImageHeight %d\n", imageHeight);
            printf("ImageWidth %d\n", imageWidth);

            void *data = array->Buffer()->GetContents().Data();
            RGBA *image = static_cast<RGBA *>(data);        

            for (int scrollOffset = 0; scrollOffset < imageWidth; scrollOffset++) {

                for (int y = 0; y < height; y++) {
                    for (int x = 0; x < width; x++) {

                        RGBA *dst = _pixels + (y * width) + x;

                        int scrollX = x + scrollOffset - width;
                        int scrollY = y;

                        if (scrollX < 0) {
                            RGBA *src = _screen + (y * width) + x;

                            *dst = *src;
                        }
                        else if (scrollX >= imageWidth) {
                            dst->red   = 128;
                            dst->green = 0;
                            dst->blue  = 0;
                            dst->alpha = 255;
                        }
                        else {
                            RGBA *src = image + (scrollY * imageWidth) + scrollX;

                            dst->red   = (src->red   * src->alpha) / 255;
                            dst->green = (src->green * src->alpha) / 255;
                            dst->blue  = (src->blue  * src->alpha) / 255;
                            dst->alpha = 255;
                        }

                        _matrix->setPixel(x, y, dst->red, dst->green, dst->blue);                    

                    }
        
                }

                _matrix->refresh();
                memcpy(_screen, _pixels, width * height * sizeof(RGBA));

                if (sleep > 0) {
                    usleep(sleep * 1000);
                }

            }


        }
        */

    }
    
    catch (exception &error) {
        string what = error.what();
        string message = string("Failed scrolling: ") + what;

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
	Nan::SetMethod(target, "scroll",     Addon::scroll);
}


NODE_MODULE(addon, initAddon);