'use strict';

require('pmx').init(); // log uncaught exceptions

/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	autoIncrement = require('mongoose-auto-increment'),
	chalk = require('chalk');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
 mongoose.connect(config.db);

var db = mongoose.connection;

db.on('error', function(err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
});

	// Mongoose promises deprecated, using Bluebird instead
	mongoose.Promise = require('bluebird');

db.once('open', function() {
	console.log("Connected to " + config.db);

	// Init the mongoose auto-increment-plugin
	autoIncrement.initialize(db);

	// Init the express application
	var app = require('./config/express')(db);

	// Bootstrap passport config
	require('./config/passport')();

	console.log("Loading app settings.");
	
	var Set = mongoose.model('Settings');
	Set.findOne({}, function(err, settings) {
		if (err) throw err;
		
	  if (settings)
			app.settings = settings;
		else
			app.settings = new mongoose.model('Settings')();

		// Start the app by listening on <port>
		app.listen(config.port);

		// Expose app
		exports = module.exports = app;

		// Logging initialization
		console.log('Application started on port ' + config.port);
	});
});
