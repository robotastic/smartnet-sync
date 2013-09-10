var watch = require('watch');
var fs = require('fs');
var path = require('path');
var config = require('./config.json');
var Db = require('mongodb').Db,
	Connection = require('mongodb').Connection,
	Server = require('mongodb').Server;

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;
var scanner = new Db('scanner', new Server(host, port, {}));

scanner.open(function(err, scannerDb) {
	scannerDb.collection('transmissions', function(err, transCollection) {
		scannerDb.authenticate(config.dbUser, config.dbPass, function() {

			watch.createMonitor('/home/luke/smartnet-sync/rx', function(monitor) {
				monitor.files['*.mp3'];
				monitor.on("created", function (f, stat) {
					if (path.extname(f) == '.mp3' ) {
						name = path.basename(f, '.mp3');
						var regex = /([0-9]*)-([0-9]*)/
						var result = name.match(regex);
						tg = parseInt(result[1]);
						time = new Date(parseInt(result[2])*1000);
						transItem = {
									talkgroup: tg,
									time: time,
									name: path.basename(f);
								};
						transCollection.insert(transItem);
						console.log("Added: " + f);	


					}
				});
			});
		});
	});
});