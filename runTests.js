process.env.NODE_ENV = 'test';

var app = require('./app');
var mongoose = require('mongoose');

app.set('port', process.env.PORT || 3001);
mongoose.connection.on('connected', function () {
	mongoose.connection.db.dropDatabase(start);
});
function start() {
	var server = app.listen(app.get('port'), function() {
		console.log('Express server listening on port ' + server.address().port);
	});

	require('./node_modules/mocha/bin/_mocha');
}