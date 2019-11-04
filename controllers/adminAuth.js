const db = require('../models');
const bcrypt = require('bcryptjs');


// POST Login Create Session
const login = (req, res) => {
  db.Admin.findOne({ email: req.body.email }, (err, foundAdmin) => {
    if (err) return res.status(500).json({ error: 'Something went wrong. Please try again' });

    console.log('Found Admin ---> ', foundAdmin);

    // Return 400 If Customer Not Found
    if (!foundAdmin) {
      return res.status(400).json({ status: 400, error: 'Email and/or Password are incorrect' });
    }

    // Compare sent password with saved customer hashed password
    bcrypt.compare(req.body.password, foundAdmin.password, (err, isMatch) => {
      if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });

      if (isMatch) {
        req.session.currentAdmin = foundAdmin._id;
        return res.status(201).json({
          status: 200,
          data: foundAdmin._id,
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
  if (req.session.currentAdmin) {
    delete req.session.currentAdmin;

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
  if (!req.session.currentAdmin) {
    return res.status(401).json({ status: 401, error: 'Not authorized. Please login and try again' });
  }

  res.status(200).json({ status: 200, userId: req.session.currentAdmin });
};


module.exports = {
  login,
  logout,
  verify,
};
