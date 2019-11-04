const express = require('express');
const router = express.Router();

// Current Path = /api/v1

// ----------------------------- STATIC PAGES -------------------------- //

// GET Home
router.get('/', (req, res) => {
  res.sendFile('views/home.html', {
    root: `${__dirname}/../`
  });
});


// GET About
router.get('/about', (req, res) => {
  res.sendFile('views/about.html', {
    root: `${__dirname}/../`
  });
});


// ----------------------------- STORE/CART -------------------------- //

// GET Store
router.get('/store', (req, res) => {
  // req.session.cart = [];
  res.sendFile('views/store/storeIndex.html', {
    root: `${__dirname}/../`
  });
});


// GET Cart
router.get('/cart', (req, res) => {
  // console.log('Session Cart --> ', req.session.cart);
  res.sendFile('views/store/cartIndex.html', {
    root: `${__dirname}/../`
  });
});


// GET Checkout
router.get('/checkout', (req, res) => {
  // console.log('Session Cart --> ', req.session.cart);
  res.sendFile('views/store/checkout.html', {
    root: `${__dirname}/../`
  });
});


// GET Success
router.get('/success', (req, res) => {
  // console.log('Session Cart --> ', req.session.cart);
  res.sendFile('views/store/success.html', {
    root: `${__dirname}/../`
  });
});


// -------------------------------- ITEMS ----------------------------- //

// Get Item
router.get('/products/:itemId', (req, res) => {
  res.sendFile('views/store/itemShow.html', {
    root: `${__dirname}/../`
  });
});


// ----------------------------- CUSTOMER AUTH -------------------------- //

// Get Signup
router.get('/signup', (req, res) => {
  res.sendFile('views/auth/signup.html', {
    root: `${__dirname}/../`
  });
});

// Get Login
router.get('/login', (req, res) => {
  res.sendFile('views/auth/login.html', {
    root: `${__dirname}/../`
  });
});


// --------------------------- CUSTOMER PROFILE ------------------------ //

// Get Customer Profile
router.get('/profile', (req, res) => {
  res.sendFile('views/customer/profileShow.html', {
    root: `${__dirname}/../`
  });
});


// ---------------------------- CUSTOMER ORDERS ------------------------- //

// Get Customer Profile
router.get('/orders/:transaction_id', (req, res) => {
  res.sendFile('views/customer/transactionShow.html', {
    root: `${__dirname}/../`
  });
});


// -------------------------------- ADMIN ------------------------------ //

// Get Admin Login
router.get('/admin', (req, res) => {
  res.sendFile('views/admin/auth/login.html', {
    root: `${__dirname}/../`
  });
});

// Get Admin Dashboard
router.get('/admin/dashboard', (req, res) => {
  if (!req.session.currentAdmin) {
    return res.redirect('/admin');
  }

  res.sendFile('views/admin/dashboard/dashboard.html', {
    root: `${__dirname}/../`
  });
});

// Get Admin Dashboard Customers
router.get('/admin/customers', (req, res) => {
  if (!req.session.currentAdmin) {
    return res.redirect('/admin');
  }
  
  res.sendFile('views/admin/dashboard/customerIndex.html', {
    root: `${__dirname}/../`
  });
});

// Get Admin Dashboard Customer Details
router.get('/admin/customers/:customerId', (req, res) => {
  if (!req.session.currentAdmin) {
    return res.redirect('/admin');
  }
  
  res.sendFile('views/admin/dashboard/customerShow.html', {
    root: `${__dirname}/../`
  });
});

// Get Admin Dashboard Transactions
router.get('/admin/transactions', (req, res) => {
  if (!req.session.currentAdmin) {
    return res.redirect('/admin');
  }
  
  res.sendFile('views/admin/dashboard/transactionIndex.html', {
    root: `${__dirname}/../`
  });
});

// Get Admin Dashboard Transaction Details
router.get('/admin/transactions/:transactionId', (req, res) => {
  if (!req.session.currentAdmin) {
    return res.redirect('/admin');
  }
  
  res.sendFile('views/admin/dashboard/transactionShow.html', {
    root: `${__dirname}/../`
  });
});

// Get Admin Dashboard Store Items
router.get('/admin/items', (req, res) => {
  if (!req.session.currentAdmin) {
    return res.redirect('/admin');
  }
  
  res.sendFile('views/admin/dashboard/storeItemIndex.html', {
    root: `${__dirname}/../`
  });
});

// Get Admin Dashboard Store Item Details
router.get('/admin/items/:id', (req, res) => {
  if (!req.session.currentAdmin) {
    return res.redirect('/admin');
  }
  
  res.sendFile('views/admin/dashboard/storeItemShow.html', {
    root: `${__dirname}/../`
  });
});

// Get Admin Dashboard Edit Store Item
router.get('/admin/items/:id/edit', (req, res) => {
  if (!req.session.currentAdmin) {
    return res.redirect('/admin');
  }
  
  res.sendFile('views/admin/dashboard/storeItemEdit.html', {
    root: `${__dirname}/../`
  });
});


module.exports = router;
