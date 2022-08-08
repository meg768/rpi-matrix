
#include "addon.h"


static int _width = 0;
static int _height = 0;

static RGBA *_tmp = NULL;
static RGBA *_pixels = NULL;

static rgb_matrix::RGBMatrix *_matrix = NULL;
static rgb_matrix::FrameCanvas *_canvas = NULL;
static rgb_matrix::GPIO _io;

static void clear() 
{
    if (_canvas != NULL)
        _canvas->Clear();
}

static void refresh() 
{
    if (_matrix != NULL && _canvas != NULL)
        _canvas = _matrix->SwapOnVSync(_canvas);
}

static void quit(int sig)
{
    clear();
    refresh();        
    exit(-1);
}


NAN_METHOD(Addon::configure)
{
	Nan::HandleScope();

    if (_matrix != NULL) {
		return Nan::ThrowError("matrix.configure() already called.");
    }

    rgb_matrix::RGBMatrix::Options opts;

	if (info.Length() != 1 ) {
		return Nan::ThrowError("matrix.configure() requires an argument.");
	}

	v8::Local<v8::Object> options = v8::Local<v8::Object>::Cast(info[0]);

    ///////////////////////////////////////////////////////////////////////////
    // debug
    v8::Local<v8::Value> debug = options->Get(Nan::New<v8::String>("debug").ToLocalChecked());

    ///////////////////////////////////////////////////////////////////////////
    // hardware_mapping
    v8::Local<v8::Value> hardware_mapping = options->Get(Nan::New<v8::String>("led-gpio-mapping").ToLocalChecked());

    if (hardware_mapping->IsUndefined())
        hardware_mapping = options->Get(Nan::New<v8::String>("led_gpio_mapping").ToLocalChecked());
    
    string hardware_mapping_string;

    if (!hardware_mapping->IsUndefined()) {
        v8::String::Utf8Value value(hardware_mapping->ToString());
        hardware_mapping_string = string(*value);        
        opts.hardware_mapping = hardware_mapping_string.c_str(); 
    }

    ///////////////////////////////////////////////////////////////////////////
    // rows
    v8::Local<v8::Value> rows = options->Get(Nan::New<v8::String>("led-rows").ToLocalChecked());

    if (rows->IsUndefined())
        rows = options->Get(Nan::New<v8::String>("led_rows").ToLocalChecked());

    if (!rows->IsUndefined()) {
        opts.rows = Nan::To<int32_t>(rows).FromMaybe(opts.rows);
    }

    ///////////////////////////////////////////////////////////////////////////
    // cols
    v8::Local<v8::Value> cols = options->Get(Nan::New<v8::String>("led-cols").ToLocalChecked());

    if (cols->IsUndefined())
        cols = options->Get(Nan::New<v8::String>("led_cols").ToLocalChecked());

    if (!cols->IsUndefined())
        opts.cols = Nan::To<int32_t>(cols).FromMaybe(opts.cols);

    ///////////////////////////////////////////////////////////////////////////
    // chain_length
    v8::Local<v8::Value> chain_length = options->Get(Nan::New<v8::String>("led-chain").ToLocalChecked());

    if (chain_length->IsUndefined())
        chain_length = options->Get(Nan::New<v8::String>("led_chain").ToLocalChecked());

    if (!chain_length->IsUndefined())
        opts.chain_length = Nan::To<int32_t>(chain_length).FromMaybe(opts.chain_length);

    ///////////////////////////////////////////////////////////////////////////
    // parallel
    v8::Local<v8::Value> parallel = options->Get(Nan::New<v8::String>("led-parallel").ToLocalChecked());

    if (parallel->IsUndefined())
        parallel = options->Get(Nan::New<v8::String>("led_parallel").ToLocalChecked());

    if (!parallel->IsUndefined())
        opts.parallel = Nan::To<int32_t>(parallel).FromMaybe(opts.parallel);

    ///////////////////////////////////////////////////////////////////////////
    // pwm_bits
    v8::Local<v8::Value> pwm_bits = options->Get(Nan::New<v8::String>("led-pwm-bits").ToLocalChecked());

    if (pwm_bits->IsUndefined())
        pwm_bits = options->Get(Nan::New<v8::String>("led_pwm_bits").ToLocalChecked());

    if (!pwm_bits->IsUndefined())
        opts.pwm_bits = Nan::To<int32_t>(pwm_bits).FromMaybe(opts.pwm_bits);

    ///////////////////////////////////////////////////////////////////////////
    // pwm_lsb_nanoseconds
    v8::Local<v8::Value> pwm_lsb_nanoseconds = options->Get(Nan::New<v8::String>("led-pwm-lsb-nanoseconds").ToLocalChecked());

    if (pwm_lsb_nanoseconds->IsUndefined())
        pwm_lsb_nanoseconds = options->Get(Nan::New<v8::String>("led_pwm_lsb_nanoseconds").ToLocalChecked());

    if (!pwm_lsb_nanoseconds->IsUndefined())
        opts.pwm_lsb_nanoseconds = Nan::To<int32_t>(pwm_lsb_nanoseconds).FromMaybe(opts.pwm_lsb_nanoseconds);

    ///////////////////////////////////////////////////////////////////////////
    // pwm_dither_bits
    v8::Local<v8::Value> pwm_dither_bits = options->Get(Nan::New<v8::String>("led-pwm-dither-bits").ToLocalChecked());

    if (pwm_dither_bits->IsUndefined())
        pwm_dither_bits = options->Get(Nan::New<v8::String>("led_pwm_dither_bits").ToLocalChecked());

    if (!pwm_dither_bits->IsUndefined())
        opts.pwm_dither_bits = Nan::To<int32_t>(pwm_dither_bits).FromMaybe(opts.pwm_dither_bits);

    ///////////////////////////////////////////////////////////////////////////
    // brightness
    v8::Local<v8::Value> brightness = options->Get(Nan::New<v8::String>("led-brightness").ToLocalChecked());

   if (brightness->IsUndefined())
        brightness = options->Get(Nan::New<v8::String>("led_brightness").ToLocalChecked());

    if (!brightness->IsUndefined())
        opts.brightness = Nan::To<int32_t>(brightness).FromMaybe(opts.brightness);

    ///////////////////////////////////////////////////////////////////////////
    // scan_mode
    v8::Local<v8::Value> scan_mode = options->Get(Nan::New<v8::String>("led-scan-mode").ToLocalChecked());

    if (scan_mode->IsUndefined())
        scan_mode = options->Get(Nan::New<v8::String>("led_scan_mode").ToLocalChecked());

    if (!scan_mode->IsUndefined())
        opts.scan_mode = Nan::To<int32_t>(scan_mode).FromMaybe(opts.scan_mode);

    ///////////////////////////////////////////////////////////////////////////
    // row_address_type
    v8::Local<v8::Value> row_address_type = options->Get(Nan::New<v8::String>("led-row-addr-type").ToLocalChecked());

    if (row_address_type->IsUndefined())
        row_address_type = options->Get(Nan::New<v8::String>("led_row_addr_type").ToLocalChecked());

    if (!row_address_type->IsUndefined())
        opts.row_address_type = Nan::To<int32_t>(row_address_type).FromMaybe(opts.row_address_type);

    ///////////////////////////////////////////////////////////////////////////
    // multiplexing
    v8::Local<v8::Value> multiplexing = options->Get(Nan::New<v8::String>("led-multiplexing").ToLocalChecked());

    if (multiplexing->IsUndefined()) 
        multiplexing = options->Get(Nan::New<v8::String>("led_multiplexing").ToLocalChecked());

    if (!multiplexing->IsUndefined())
        opts.multiplexing = Nan::To<int32_t>(multiplexing).FromMaybe(opts.multiplexing);

    ///////////////////////////////////////////////////////////////////////////
    // disable_hardware_pulsing
    v8::Local<v8::Value> disable_hardware_pulsing = options->Get(Nan::New<v8::String>("led-no-hardware-pulse").ToLocalChecked());

    if (disable_hardware_pulsing->IsUndefined()) 
        disable_hardware_pulsing = options->Get(Nan::New<v8::String>("led_no_hardware_pulse").ToLocalChecked());

    if (!disable_hardware_pulsing->IsUndefined())
        opts.disable_hardware_pulsing = Nan::To<int32_t>(disable_hardware_pulsing).FromMaybe(opts.disable_hardware_pulsing);

    ///////////////////////////////////////////////////////////////////////////
    // show_refresh_rate
    v8::Local<v8::Value> show_refresh_rate = options->Get(Nan::New<v8::String>("led-show-refresh").ToLocalChecked());

    if (show_refresh_rate->IsUndefined()) 
        show_refresh_rate = options->Get(Nan::New<v8::String>("led_show_refresh").ToLocalChecked());

    if (!show_refresh_rate->IsUndefined())
        opts.show_refresh_rate = Nan::To<int32_t>(show_refresh_rate).FromMaybe(opts.show_refresh_rate);

    ///////////////////////////////////////////////////////////////////////////
    // inverse_colors
    v8::Local<v8::Value> inverse_colors = options->Get(Nan::New<v8::String>("led-inverse").ToLocalChecked());

    if (inverse_colors->IsUndefined())
        inverse_colors = options->Get(Nan::New<v8::String>("led_inverse").ToLocalChecked());

    if (!inverse_colors->IsUndefined())
        opts.inverse_colors = Nan::To<int32_t>(inverse_colors).FromMaybe(opts.inverse_colors);

    ///////////////////////////////////////////////////////////////////////////
    // led_rgb_sequence
    v8::Local<v8::Value> led_rgb_sequence = options->Get(Nan::New<v8::String>("led-rgb-sequence").ToLocalChecked());
    string led_rgb_sequence_string;

    if (led_rgb_sequence->IsUndefined()) 
        led_rgb_sequence = options->Get(Nan::New<v8::String>("led_rgb_sequence").ToLocalChecked());

    if (!led_rgb_sequence->IsUndefined()) {
        v8::String::Utf8Value value(led_rgb_sequence->ToString());
        led_rgb_sequence_string = string(*value);        
        opts.led_rgb_sequence = led_rgb_sequence_string.c_str(); 
    }

    ///////////////////////////////////////////////////////////////////////////
    // pixel_mapper_config
    v8::Local<v8::Value> pixel_mapper_config = options->Get(Nan::New<v8::String>("led-pixel-mapper").ToLocalChecked());
    string pixel_mapper_config_string;

    if (pixel_mapper_config->IsUndefined()) 
        pixel_mapper_config = options->Get(Nan::New<v8::String>("led_pixel_mapper").ToLocalChecked());

    if (!pixel_mapper_config->IsUndefined()) {
        v8::String::Utf8Value value(pixel_mapper_config->ToString());
        pixel_mapper_config_string = string(*value);        
        opts.pixel_mapper_config = pixel_mapper_config_string.c_str(); 
    }

/*
    if (!debug->IsUndefined()) {
        printf("Creating matrix with the following options.\n");
        printf("led-hardware-mapping     : %s\n", opts.hardware_mapping == NULL ? "-" : opts.hardware_mapping);
        printf("led-rows                 : %d\n", opts.rows);
        printf("led-cols                 : %d\n", opts.cols);
        printf("led-chain                : %d\n", opts.chain_length);
        printf("led-parallel             : %d\n", opts.parallel);
        printf("led-pwm_bits             : %d\n", opts.pwm_bits);
        printf("led-pwm-lsb-nanoseconds  : %d\n", opts.pwm_lsb_nanoseconds);
        printf("led-pwm-dither-bits      : %d\n", opts.pwm_dither_bits);
        printf("led-brightness           : %d\n", opts.brightness);
        printf("led-scan_mode            : %d\n", opts.scan_mode);
        printf("led-row-addr-type        : %d\n", opts.row_address_type);
        printf("led-multiplexing         : %d\n", opts.multiplexing);
        printf("led-no-hardware-pulse    : %d\n", opts.disable_hardware_pulsing);
        printf("led-show-refresh         : %d\n", opts.show_refresh_rate);
        printf("led-inverse              : %d\n", opts.inverse_colors);
        printf("led-rgb-sequence         : %s\n", opts.led_rgb_sequence == NULL ? "-" : opts.led_rgb_sequence);
        printf("led-pixel-mapper         : %s\n", opts.pixel_mapper_config == NULL ? "-" : opts.pixel_mapper_config);

    }
*/v
    srand(time(NULL));

    // Trap ctrl-c to call quit function
    signal(SIGINT, quit);
    signal(SIGKILL, quit);

    if (!_io.Init())
        exit(-1);

    _matrix     = new rgb_matrix::RGBMatrix(&_io, opts);
    _canvas     = _matrix->CreateFrameCanvas();
    _width      = _matrix->width();
    _height     = _matrix->height();  

    int size = _matrix->width() * _matrix->height();

	_pixels = new RGBA[size];
	_tmp = new RGBA[size];

    memset(_pixels, 0, sizeof(RGBA) * size);
    memset(_tmp, 0, sizeof(RGBA) * size);

	info.GetReturnValue().Set(Nan::Undefined());
};


NAN_METHOD(Addon::sleep)
{
	Nan::HandleScope();

    usleep(info[0]->Int32Value() * 1000);

    info.GetReturnValue().Set(Nan::Undefined());

}



NAN_METHOD(Addon::render)
{
	Nan::HandleScope();

    try {
        if (_matrix == NULL) {
            return Nan::ThrowError("Matrix is not configured.");
        }

    	int argc    = info.Length();
        int width   = _matrix->width();
        int height  = _matrix->height();

    	v8::Local<v8::Value> scroll = Nan::Undefined();
    	v8::Local<v8::Value> scrollDelay = Nan::Undefined();
    	v8::Local<v8::Value> blend = Nan::Undefined();

        if (argc < 1) {
            return Nan::ThrowError("render() requires at least one argument.");
        }

        if (argc > 1) {
            if (info[1]->IsObject()) {
                v8::Local<v8::Object> options = v8::Local<v8::Object>::Cast(info[1]);

                scrollDelay = options->Get(Nan::New<v8::String>("scrollDelay").ToLocalChecked());
                scroll = options->Get(Nan::New<v8::String>("scroll").ToLocalChecked());
                blend = options->Get(Nan::New<v8::String>("blend").ToLocalChecked());

            }
        }

        v8::Local<v8::Uint32Array> array = info[0].As<v8::Uint32Array>();

        void *imageData = array->Buffer()->GetContents().Data();
        int imageWidth  = array->Buffer()->GetContents().ByteLength() / height / 4;
        int isRGBA      = info[0]->IsUint8ClampedArray();

        if (!scroll->IsUndefined()) {
            int delay = scrollDelay->IsUndefined() ? 0 : scrollDelay->Int32Value();

            for (int i = 0; i < imageWidth; i++) {

                // Shift pixels one step left
                if (false) {
                    for (int y = 0; y < height; y++) {
                        
                        for (int x = 1; x < width; x++) {
                            RGBA *src = _pixels + (y * width) + x;
                            RGBA *dst = _pixels + (y * width) + (x - 1);

                            *dst = *src;

                        }
                    }

                }


                if (true) {
                    for (int y = 0; y < height; y++) {
                        RGBA *row = _pixels + (y * width);
                        memmove(row, row + 1, (width - 1) * sizeof(RGBA));
                    }

                }


                // Render last column
                if (isRGBA) {
                    RGBA *image = static_cast<RGBA *>(imageData);        
                    RGBA *src   = image + i;
                    RGBA *dst   = _pixels + width - 1;

                    for (int y = 0; y < height; y++) {
                        dst->red   = (src->red   * src->alpha) / 255;
                        dst->green = (src->green * src->alpha) / 255;
                        dst->blue  = (src->blue  * src->alpha) / 255;
                        dst->alpha = 255;

                        src += imageWidth;
                        dst += width;
                    }
                }
                else {
                    BGRA *image = static_cast<BGRA *>(imageData);        
                    BGRA *src   = image + i;
                    RGBA *dst   = _pixels + width - 1;

                    for (int y = 0; y < height; y++) {
                        dst->red   = (src->red   * src->alpha) / 255;
                        dst->green = (src->green * src->alpha) / 255;
                        dst->blue  = (src->blue  * src->alpha) / 255;
                        dst->alpha = 255;

                        src += imageWidth;
                        dst += width;
                    }

                }

                if (true) {
                    RGBA *pp = _pixels;

                    for (int y = 0; y < height; y++) {
                        for (int x = 0; x < width; x++, pp++) {
                            _canvas->SetPixel(x, y, pp->red, pp->green, pp->blue);                    
                        }
                    }
                    
                    refresh();

                    if (delay > 0) {
                        usleep(delay * 1000);
                    }            

                }                    

            }

            memcpy(_tmp, _pixels, width * height * sizeof(RGBA));

        }
        else {

            if (isRGBA) {
                RGBA *image = static_cast<RGBA *>(imageData);        

                for (int y = 0; y < height; y++) {
                    for (int x = 0; x < width; x++) {
                        RGBA *src = image + (y * imageWidth) + x;
                        RGBA *dst = _tmp + (y * width) + x;

                        dst->red   = (src->red   * src->alpha) / 255;
                        dst->green = (src->green * src->alpha) / 255;
                        dst->blue  = (src->blue  * src->alpha) / 255;
                        dst->alpha = 255;                            
                    }
                }

            }
            else {
                BGRA *image = static_cast<BGRA *>(imageData);        

                for (int y = 0; y < height; y++) {
                    for (int x = 0; x < width; x++) {
                        BGRA *src = image + (y * imageWidth) + x;
                        RGBA *dst = _tmp + (y * width) + x;

                        dst->red   = src->red; // (src->red   * src->alpha) / 255;
                        dst->green = src->green; // (src->green * src->alpha) / 255;
                        dst->blue  = src->blue; //(src->blue  * src->alpha) / 255;
                        dst->alpha = 255;                            
                    }
                }
            }


            if (blend->IsInt32()) {
                int numSteps = blend->Int32Value();

                for (int step = 0; step < numSteps; step++) {

                    RGBA *tp = _tmp;
                    RGBA *pp = _pixels;

                    for (int y = 0; y < height; y++) {
                        for (int x = 0; x < width; x++) {
                            int red   = (pp->red   + (step   * (tp->red   - pp->red)) / numSteps);
                            int green = (pp->green + (step   * (tp->green - pp->green)) / numSteps);
                            int blue  = (pp->blue  + (step   * (tp->blue  - pp->blue)) / numSteps);

                            _canvas->SetPixel(x, y, red, green, blue);
                            pp++, tp++;             
                        }
                    }

                    refresh();

                }
            }

            if (true) {
                RGBA *src = _tmp;
                RGBA *dst = _pixels;

                for (int y = 0; y < height; y++) {
                    for (int x = 0; x < width; x++) {
                        _canvas->SetPixel(x, y, src->red, src->green, src->blue);                    
                        *dst++ = *src++;
                    }
                }

                refresh();

            }

        }



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
	Nan::SetMethod(target, "sleep",      Addon::sleep);
}


NODE_MODULE(addon, initAddon);