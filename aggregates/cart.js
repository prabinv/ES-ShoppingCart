var httpClient = require('../lib/event-store-client')();
var tcpClient = require('../lib/event-store-tcp-client')();
var eventstore = require('geteventstore-promise');
var uuid = require('node-uuid');

var Cart = function(stream) {
    this.lastEventNumber = -1;
    if (stream) {
      this.stream = stream;
    } else {
      this.stream = 'cart-' + uuid.v4();
    }
    this.productQtys = {}; // mapping of product ids to qty in cart
    this.errors = [];

    this.reconstitute = function(cb) {
      var page = {start: 0, length: 1000};
      this.constituteHelper(page, cb);
    }

    this.constituteHelper = function(page, cb) {
      var self = this;
      tcpClient.getEvents(this.stream, page.start, page.length, 'forward').then(function(events){
        events.forEach(function(event) {
          self.apply(event);
        });
        cb();
      });
    }

    // commands
    this.createCart = function(cb) {
      var events = [eventstore.eventFactory.NewEvent('cartCreated', {})];
      httpClient.writeEvents(this.stream, events).then( function() {
        cb(events);
      });
    }

    this.addProduct = function(payload, cb) {
      var events = [eventstore.eventFactory.NewEvent('productAddedToCart', {
        cartID: this.stream,
        productID: payload.productID,
        productQuantity: payload.productQuantity
      })];
      httpClient.writeEvents(this.stream, events).then( function() {
        cb(events);
      });
    }

    this.removeProduct = function(payload, cb) {
      console.log('removeCart');
      var events = [eventstore.eventFactory.NewEvent('productRemovedFromCart', {
        cartID: this.stream,
        productID: payload.productID,
        productQuantity: payload.productQuantity
      })];
      httpClient.writeEvents(this.stream, events).then( function() {
        cb(events);
      });
    }

    // events
    this.apply = function(event) {
      this.lastEventNumber = event.eventNumber;
      switch (event.eventType ) {
        case 'cartCreated':
          break;
        case 'productAddedToCart':
          this.productAddedToCart(event.data);
          break;
        case 'productRemovedFromCart':
          this.productRemovedFromCart(event.data);
          break;
        default:
          this.errors.push('Unhandled Event '+ event.eventType);
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
      console.log(JSON.stringify(this.productQtys, null, 2));
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
