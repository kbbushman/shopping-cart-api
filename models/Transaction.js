const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Cart = require('./Cart');

const transactionSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
  },
  cart: Cart.schema,
  total: Number,
  transactionDate: {
    type: Date,
    default: Date.now,
  },
  paymentInfo: {
    name: {
      type: String,
      required: true,
    },
    cardNumber: {
      type: String,
      required: true,
    },
    expiration: {
      type: String,
      required: true,
    },
    cvv: {
      type: String,
      required: true,
    },
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
