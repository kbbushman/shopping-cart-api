const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/express-cart';

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully...'))
  .catch((err) => console.log(err));

  module.exports = {
    Item: require('./Item'),
    Cart: require('./Cart'),
    Customer: require('./Customer'),
    Transaction: require('./Transaction'),
    Admin: require('./Admin'),
  };
