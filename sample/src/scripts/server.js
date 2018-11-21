

module.exports = class Server {

    constructor(options) {
		var AnimationQueue = require('./animation-queue.js');
        var express = require('express');

        this.options = Object.assign({}, {port:3013}, options);
		this.app = express();
        this.queue = new AnimationQueue(); 

    }

    

	defineRoutes(app) {
		this.app.get('/clock', (request, response) => {
			var options = Object.assign({}, request.body, request.query);

			var Matrix = require('../../../index.js');
			var ClockAnimation = require('../animations/clock-animation.js');

			var matrix = new Matrix(Object.assign({}, this.options, {mode:'canvas'}));
			var animation = new ClockAnimation(Object.assign({}, {matrix:matrix, duration:5000}, options));

			this.queue.enqueue(animation);
			response.status(200).json({status:'OK'});
		});


    }
    
	run() {


		Promise.resolve().then(() => {
            return Promise.resolve();
        })
        
		.then(() => {
            var cors = require('cors');
            var bodyParser = require('body-parser');
            var app = this.app;

			console.log('Initializing service...');

			app.set('port', (this.options.port || 3000));
			app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
			app.use(bodyParser.json({limit: '50mb'}));
			app.use(cors());

			this.defineRoutes(app);

			app.listen(app.get('port'), () => {
				console.log("Matrix service is running on port " + app.get('port'));
			});

		})
		.catch((error) => {
			console.error(error.stack);

		});

	}


}

