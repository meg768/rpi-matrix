
module.exports = class Server {

    constructor(options) {
		var AnimationQueue = require('./animation-queue.js');
        var express = require('express');

        this.options = Object.assign({}, {port:3013}, options);
		this.app = express();
		this.queue = new AnimationQueue(); 
		


    }


	defineRoutes(app) {
		var Matrix = require('../../../index.js');
		var ClockAnimation = require('../animations/clock-animation.js');
		var TextAnimation = require('../animations/text-animation.js');


		this.app.get('/hello', (request, response) => {
			response.status(200).json({status:'OK'});
		});

		this.app.post('/clock', (request, response) => {
			var options = Object.assign({}, request.body, request.query);

			var matrix = new Matrix(Object.assign({}, this.options, {mode:'canvas'}));
			var animation = new ClockAnimation(matrix, Object.assign({}, {duration:5000}, options));

			this.queue.enqueue(animation);
			response.status(200).json({status:'OK'});
		});

		this.app.post('/text', (request, response) => {
			console.log('BODY', request.body);
			console.log('QUERY', request.query);
			var options = Object.assign({}, request.body, request.query);

			var text = 'Hello world';
			
			if (request.body.queryResult) {
				text = request.body.queryResult.fulfillmentText;
			};

			var defaultOptions = {
				text: text,
				textColor: 'red'
			};

			var matrix = new Matrix(Object.assign({}, this.options, {mode:'canvas', 'led-scan-mode':1}));
			var animation = new TextAnimation(matrix, Object.assign({}, defaultOptions, options));

			this.queue.enqueue(animation);
			response.status(200).json({status:'OK'});
		});

		this.app.get('/text', (request, response) => {
			console.log('BODY', request.body);
			console.log('QUERY', request.query);
			var options = Object.assign({}, request.body, request.query);

			var text = 'Hello world';
			
			if (request.body.queryResult) {
				text = request.body.queryResult.fulfillmentText;
			};

			var defaultOptions = {
				text: text,
				textColor: 'red'
			};

			var matrix = new Matrix(Object.assign({}, this.options, {mode:'canvas', 'led-scan-mode':1}));
			var animation = new TextAnimation(matrix, Object.assign({}, defaultOptions, options));

			this.queue.enqueue(animation);
			response.status(200).json({status:'OK'});
		});


		this.app.get('/', (request, response) => {

			var foo = {};
			foo.kalle = 'HEJ';
			foo.route = request.route;
			foo.path = request.path;
			foo.params = request.params;
			foo.query = request.query;
			foo.method = request.method;
			response.status(200).json(foo);
		});

    }

	
	run() {


		Promise.resolve().then(() => {
            return Promise.resolve();
        })
        
		.then(() => {
			var path = require('path');
			var fs = require('fs');
			var https = require('https');
			var http = require('http');
			
            var cors = require('cors');
            var bodyParser = require('body-parser');
            var app = this.app;

			console.log('Initializing service...');

			app.set('port', (this.options.port || 3000));
			app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
			app.use(bodyParser.json({limit: '50mb'}));
			app.use(cors());

			this.defineRoutes(app);

			if (false) {
				var httpsOptions = {
					key: fs.readFileSync(path.join(__dirname, '../../key.pem')),
					cert: fs.readFileSync(path.join(__dirname, '../../cert.pem')),
					requestCert: false,
					rejectUnauthorized: false,
					passphrase: 'potatismos'
				};
	
				const server = https.createServer(httpsOptions, app).listen(app.get('port'), () => {
					console.log('server running at ' + app.get('port'))
				});
	
			}
			else {
				app.listen(app.get('port'), () => {
					console.log("Matrix service is running on port " + app.get('port'));
				});
	
			}

		})
		.catch((error) => {
			console.error(error.stack);

		});

	}


}

