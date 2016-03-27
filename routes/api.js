var express = require('express');
var router = express.Router();
var Cart = require('../aggregates/Cart');

/* POST cart command */
router.post('/carts/createcart', function(req, res, next) {
  var cart = new Cart();
  cart.createCart( function(events) {
    res.write(cart.stream);
    res.end();
  });
});

router.post('/carts/:id/addproduct', function(req, res, next){
  var stream = req.params.id;
  var cart = new Cart(stream);
  cart.reconstitute( function() {
    cart.addProduct(req.body, function(events) {
      res.write(JSON.stringify(events));
      res.end();
    });
  });
});

router.post('/carts/:id/removeproduct', function(req, res, next){
  var stream = req.params.id;
  var cart = new Cart(stream);

  cart.reconstitute( function() {
    cart.removeProduct(req.body, function(events) {
      res.write(JSON.stringify(events));
      res.end();
    });
  });
});

router.get('/carts/:id/products', function(req, res, next){
  var stream = req.params.id;
  var cart = new Cart(stream);

  cart.reconstitute( function(events) {
    res.write(JSON.stringify(cart.productQtys));
    res.end();
  });
});

module.exports = router;
