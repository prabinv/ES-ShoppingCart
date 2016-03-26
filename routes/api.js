var express = require('express');
var router = express.Router();
var gesClient = require('../lib/event-store-client')();
var repo = require('../lib/event-store-repo');
var eventstore = require('geteventstore-promise');
var Cart = require('../aggregates/Cart');

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

router.get('/carts/:id/products', function(req, res, next){
  var stream = req.params.id;
  var cart = new Cart();
  console.log("Calling gesClient.getEvents ...");
  gesClient.getEvents(stream).then( function(events) {
      console.log("gesClient resolved!"); // This isn't happening

      // I'm assuming we could just loop over events and apply
      events.forEach(function(event) {
        cart.apply(event);
      });
      res.write(JSON.stringify(cart.productQtys, null, 2));
      res.end();
  });
});

module.exports = router;
