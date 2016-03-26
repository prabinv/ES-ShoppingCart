var express = require('express');
var router = express.Router();
var repo = require('../lib/event-store-repo');

/* POST cart command */
router.post('/carts/createcart', function(req, res, next) {
    var stream = repo.createCart();
    res.write(stream);
    res.end();
});

router.post('/carts/:id/addproduct', function(req, res, next){

});

router.post('/carts/:id/removeproduct', function(req, res, next){

});

module.exports = router;