var gesClient = require('../lib/event-store-client')();
var eventstore = require('geteventstore-promise');

var cart = new function() {

    // Given a Stream
    this.constitute = function(stream, cb) {
      this.eventNumber = -1;
      this.products = {}; // mapping of product ids to qty in cart
      this.errors = [];

      gesClient.readEvents(stream).then( function(events) {
        console.log(events);
      });
    }

    // Event Application

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
