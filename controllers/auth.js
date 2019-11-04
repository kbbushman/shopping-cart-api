const bcrypt = require('bcryptjs')
const db = require('../models');


// POST Signup Create Customer
const signup = (req, res) => {
  db.Customer.findOne({ email: req.body.email }, (err, foundCustomer) => {
    if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });

    if (foundCustomer && foundCustomer.accountEnabled) {
      return res.status(400).json({ status: 400, error: 'Account already exists. Please login to continue' });
    }

    // Enable Account If Already Exists
    if (foundCustomer && !foundCustomer.accountEnabled) {
      foundCustomer.accountEnabled = true;
      foundCustomer.save((err, savedCustomer) => {
        if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });
        res.status(201).json({ status: 201, data: savedCustomer._id });
      });
    }

    const customerData = req.body;
    // Enable New Account
    customerData.accountEnabled = true;

    // Number of salt rounds
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });

      // Bcrypt takes password and salt
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });


        // Set user hashed password
        customerData.password = hash;

        db.Customer.create(customerData, (err, newCustomer) => {
          if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });

          // Init Session
          req.session.currentUser = newCustomer._id;

          res.status(201).json({
            status: 201,
            data: newCustomer._id,
          });
        });
      });
    });
  });
};


// POST Login Create Session
const login = (req, res) => {
  db.Customer.findOne({ email: req.body.email }, (err, foundCustomer) => {
    if (err) return res.status(500).json({ error: 'Something went wrong. Please try again' });

    console.log('Found Customer ---> ', foundCustomer);

    // Return 400 If Customer Not Found
    if (!foundCustomer) {
      return res.status(400).json({ status: 400, error: 'Email and/or Password are incorrect' });
    }

    // Compare sent password with saved customer hashed password
    bcrypt.compare(req.body.password, foundCustomer.password, (err, isMatch) => {
      if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });

      if (isMatch && foundCustomer.accountEnabled) {
        req.session.currentUser = foundCustomer._id;
        return res.status(201).json({
          status: 200,
          data: foundCustomer._id,
        });
      } else {
        // Passwords do not match, account does not exist, or accound is not enabled
        return res.status(400).json({ status: 400, error: 'Username or password is incorrect' });
      }
    });
  });
};


// Delete Logout Destroy Session
const logout = (req, res) => {
  if (req.session.currentUser) {
    delete req.session.currentUser;

    res.status(200).json({
      status: 200,
      message: 'Success',
    });
  } else {
    res.status(401).json({ status: 401, error: 'Unauthorized. Please login and try again' });
  }
  // req.session.destroy(err => {
  //   if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });

  //   res.status(200).json({
  //     status: 200,
  //     message: 'Success',
  //   });
  // });
};


// POST Verify Auth
const verify = (req, res) => {
  if (!req.session.currentUser) {
    return res.status(401).json({ status: 401, error: 'Not authorized. Please login and try again' });
  }

  res.status(200).json({ status: 200, userId: req.session.currentUser });
};


module.exports = {
  signup,
  login,
  logout,
  verify,
};
