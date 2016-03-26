var gesClient = require('../lib/event-store-client')();
var eventstore = require('geteventstore-promise');

module.exports.createCart = function() {
	var stream = 'Cart-some-foo-here';
	return stream;
}