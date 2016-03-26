var gesClient = require('../lib/event-store-client')();
var eventstore = require('geteventstore-promise');

var cart = new function() {

    // Commands

    this.createCart = function(cb) {
      this.id = uuid.v4();
      this.productQty = {};
      this.errors = [];

      var events = [eventstore.eventFactory.NewEvent('cartCreated', {id: id})];
      gesClient.writeEvents(stream, events).then( function(events) {
        res.write(stream);
        res.end();
      });
    }

    this.removeProduct = function(productId) {

    }

    // Events

    this.productAdded = function(productId) {
      if (this.products[productId]) {
        // If this product is in cart increase the qty
        this.products[productId] = this.products[productId] + 1;
      } else {
        // if this product is not in the cart add it
        this.products[productId] = 1;
      }
    }

    this.productRemoved = function(productId) {
      if (this.products[productId]) {
        // If this product is in cart decrase the qty
        this.products[productId] = this.products[productId] + 1;
      } else {
        // This should never happen
        this.errors.push('Product removed event for product '+ productId + ' does not make sense given product is not in cart.');
      }
    }

    this.toString = function () {
        return this.color + ' ' + this.type + ' apple';
    };
}
