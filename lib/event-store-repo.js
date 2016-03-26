var gesClient = require('../lib/event-store-client')();
var eventstore = require('geteventstore-promise');
var uuid = require('node-uuid');

module.exports.createCart = function() {
	var stream = 'cart-'+uuid.v4();
	return stream;
}
