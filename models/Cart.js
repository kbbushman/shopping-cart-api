const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Item = require('./Item');

const cartSchema = new Schema({
  items: [Item.schema],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
