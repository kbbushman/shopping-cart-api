const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Transaction = require('./Transaction');

const customerSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  accountEnabled: {
    type: Boolean,
    default: false,
  },
  password: String,
  address: {
    street: {
      type: String,
      // required: true,
    },
    city: {
      type: String,
      // required: true,
    },
    state: {
      type: String,
      // required: true,
    },
    zipcode: {
      type: String,
      // required: true,
    },
  },
  transactions: [Transaction.schema],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
