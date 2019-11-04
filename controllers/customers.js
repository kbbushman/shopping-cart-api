const db = require('../models');


const index = (req, res) => {
  // GET All Customers Index
  if (req.session.currentAdmin || req.session.currentAdmin) {
    db.Customer.find({}, (err, allCustomers) => {
      if (err) res.status(500).json({ status: 500, error: 'Something went wrong, please try again' });
  
      res.status(200).json({ status: 200, count: allCustomers.length, data: allCustomers });
    });
  } else {
    res.status(401).json({ status: 401, error: 'Unauthorized. Please login and try again' });
  }
};


// GET Customer Show
const show = (req, res) => {
  if (req.session.currentUser || req.session.currentAdmin) {
    db.Customer.findById(req.params.customer_id)
      .select('-password')
      .exec((err, foundCustomer) => {
        if (err) return res.status(500).json({ status: 500, error: 'Something went wrong, please try again' });
        if (!foundCustomer) return res.status(400).json({ status: 400, error: 'User account does not exist' });
        res.status(200).json({ status: 200, data: foundCustomer });
    });
  } else {
    res.status(401).json({ status: 401, error: 'Unauthorized. Please login and try again' });
  }
};

module.exports = {
  index,
  show,
};
