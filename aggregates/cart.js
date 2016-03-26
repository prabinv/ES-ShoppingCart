var gesClient = require('../lib/event-store-client')();
var eventstore = require('geteventstore-promise');

var cart = new function() {

    // Given a stream build a model the beginning
    // return the hydrated model via the callback
    this.reconstitute = function(stream, cb) {
      this.eventNumber = -1;
      this.productQtys = {}; // mapping of product ids to qty in cart

      gesClient.readEvents(stream).then( function(events) {
      });
    }

    // Event Application

    this.applyEvent = function(event) {
      switch (event.type) {
        case 'productAddedToCart':
          this.productAdded(event.payload);
          break;
        case 'productRemovedFromCart':
          this.productRemoved(event.payload);
          break;
        default:
          this.errors.push('Unhandled Event '+event.type);
          break;
      }
    }

    this.productAdded = function(payload) {
      var productId = payload.productID;
      var productQty = payload.productQuantity;
      if (this.productQtys[productId]) {
        // If this product is in cart increase the qty
        this.productQtys[productId] = this.productQtys[productId] + productQty;
      } else {
        // if this product is not in the cart add it
        this.productQtys[productId] = productQty;
      }
    }

    this.productRemoved = function(payload) {
      var productId = payload.productID;
      var productQty = payload.productQuantity;
      if (this.productQtys[productId]) {
        // If this product is in cart decrase the qty
        this.productQtys[productId] = this.productQtys[productId] - productQty;
      } else {
        // This should never happen
        this.errors.push('Product removed event for product '+ productId + ' does not make sense given product is not in cart.');
      }
    }

    this.toString = function () {
      return "Cart " + this.id;
    };
}
