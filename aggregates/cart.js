var gesClient = require('../lib/event-store-client')();
var eventstore = require('geteventstore-promise');

var Cart = function() {
    this.productQtys = {}; // mapping of product ids to qty in cart
    this.errors = [];

    this.apply = function(event) {
      switch (event.type) {
        case 'productAddedToCart':
          this.productAddedToCart(event.payload);
          break;
        case 'productRemovedFromCart':
          this.productRemovedFromCart(event.payload);
          break;
        default:
          this.errors.push('Unhandled Event '+event.type);
          break;
      }
    }

    this.productAddedToCart = function(payload) {
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

    this.productRemovedFromCart = function(payload) {
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
      return this.stream;
    };
}

module.exports = Cart;
