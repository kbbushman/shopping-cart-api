const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  brand: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageSrc: String,
  inStock: {
    type: Boolean,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  cartQuantity: Number,
  category: String,
  dateAdded: {
    type: Date,
    default: Date.now,
  }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
