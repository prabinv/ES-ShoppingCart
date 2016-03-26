var express = require('express');
var router = express.Router();
var gesClient = require('../lib/event-store-client')();
var repo = require('../lib/event-store-repo');
var eventstore = require('geteventstore-promise');

/* POST cart command */
router.post('/carts/createcart', function(req, res, next) {
    var stream = repo.createCart();
    var events = [eventstore.eventFactory.NewEvent('cartCreated', {})];
    gesClient.writeEvents(stream, events).then( function(events) {
      res.write(stream);
      res.end();
    });
});

router.post('/carts/:id/addproduct', function(req, res, next){
	var stream = req.params.id;
	var payload = req.body;
	var events = [eventstore.eventFactory.NewEvent('productAddedToCart', {
		cartID: stream, 
		productID: payload.productID,
		productQuantity: payload.productQuantity

	})];
	gesClient.writeEvents(stream, events).then( function(events) {
      res.write(stream);
      res.end();
  	});
});

router.post('/carts/:id/removeproduct', function(req, res, next){

});

module.exports = router;
