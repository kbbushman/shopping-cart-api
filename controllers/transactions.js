const bcrypt = require('bcryptjs');
const db = require('../models');


// POST Transaction Create
const create = async (req, res) => {
  console.log('New Transaction ---> ', req.body);
  // Prep Transaction Data
  const paymentData = req.body.payment;
  const customerData = {
    firstName: req.body.customer.firstName,
    lastName: req.body.customer.lastName,
    email: req.body.customer.email,
    address: {
      street: req.body.customer.street,
      city: req.body.customer.city,
      state: req.body.customer.state,
      zipcode: req.body.customer.zipcode,
    },
  };

  // Hash Password if Sent In Req Body
  if (req.body.customer.password) {
    customerData.accountEnabled = true;
    try {
      const salt = await bcrypt.genSalt(10);
      customerData.password = await bcrypt.hash(req.body.customer.password, salt);
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Something went wrong, please try again' });
    }
  }

  // console.log({ customerData, paymentData });


  // Decrement Cart Items
  try {
    for (item in req.body.cart.items) {
      const itemRecord = await db.Item.findById(req.body.cart.items[item]);
      if (itemRecord.quantity > 0 && itemRecord.quantity >= req.body.cart.items[item].cartQuantity) {
        itemRecord.quantity -= req.body.cart.items[item].cartQuantity;
        // Check if still in stock
        itemRecord.inStock = Boolean(itemRecord.quantity);
        await itemRecord.save();
      } else {
        return res.status(400).json({ status: 400, error: `There is not enough ${req.body.cart.items[item].name} to fulfill your request` });
      }
    }
  } catch (err) {
    return res.status(500).json({ status: 500, error: 'Something went wrong, please try again' });
  }





  // Check If Customer Exists
  db.Customer.findOne({ email: customerData.email }, (err, foundCustomer) => {
    if (err) res.status(500).json({ error: 'Something went wrong, please try again' });

    // If Customer Exists
    if (foundCustomer) {
      // Create New Transaction
      db.Transaction.create({
        customer: foundCustomer,
        cart: req.body.cart,
        total: req.body.total,
        paymentInfo: paymentData,
      }, (err, newTransaction) => {
        if (err) res.status(500).json({ error: 'Something went wrong, please try again' });

        // Add New Transaction To Customer If Account Enabled
        if (foundCustomer.accountEnabled || customerData.accountEnabled) {
          foundCustomer.accountEnabled = true;
          foundCustomer.transactions.push(newTransaction);
          foundCustomer.address = customerData.address;
          foundCustomer.save((err) => {
            if (err) res.status(500).json({ error: 'Something went wrong, please try again' });

            res.status(201).json({ status: 201, data: newTransaction });
          });
        } else {
          // Do Not Add Transaction To Customer If Account Is Not Enabled
          res.status(201).json({ status: 201, data: newTransaction });
        }
      });
    } else {
      // Create Customer If Customer Does Not Exist
      db.Customer.create(customerData, (err, newCustomer) => {
        if (err) res.status(500).json({ error: 'Something went wrong, please try again' });

        // Create New Transaction
        db.Transaction.create({
          customer: newCustomer,
          cart: req.body.cart,
          total: req.body.total,
          paymentInfo: paymentData,
        }, (err, newTransaction) => {
          if (err) res.status(500).json({ error: 'Something went wrong, please try again' });

          // Add New Transaction To New Customer If Account Enabled
          if (customerData.accountEnabled) {
            newCustomer.transactions.push(newTransaction);
            newCustomer.save((err, savedCustomer) => {
              if (err) res.status(500).json({ error: 'Something went wrong, please try again' });

              res.status(201).json({ status: 201, data: newTransaction });
            });
          } else {
            // Do Not Add Transaction To Customer If Account Is Not Enabled
            res.status(201).json({ status: 201, data: newTransaction });
          }
        });
      });
    }
  });
};


// GET Transaction Index
const index = (req, res) => {
  db.Transaction.find({}, (err, allTransactions) => {
    if (err) res.status(500).json({ error: 'Something went wrong, please try again' });

    res.status(200).json({ status: 200, count: allTransactions.length, data: allTransactions });
  });
};


// GET Transaction Show
const show = (req, res) => {
  db.Transaction.findById(req.params.transaction_id)
    .populate('customerId', '-transactions')
    .exec((err, foundTransaction) => {
      if (err) res.status(500).json({ error: 'Something went wrong, please try again' });
  
      res.status(200).json({ status: 200, data: foundTransaction });
    });
};


module.exports = {
  create,
  index,
  show,
};
