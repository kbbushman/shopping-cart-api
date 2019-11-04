const express = require('express');
const router = express.Router();
const ctrl = require('../controllers');

// Current Path = /api/v1

// ----------------------------- CARTS -------------------------- //

router.post('/carts/', ctrl.carts.create);
router.get('/carts', ctrl.carts.index);
router.get('/carts/:id', ctrl.carts.show);
router.delete('/carts/:id', ctrl.carts.destroy);


// ----------------------------- ITEMS -------------------------- //

router.get('/items', ctrl.items.index);
router.post('/items/', ctrl.items.create);
router.get('/items/:id', ctrl.items.show);
router.put('/items/:id', ctrl.items.update);
router.delete('/items/:id', ctrl.items.destroy);


// ----------------------------- CART ITEMS -------------------------- //

router.get('/cart/items/', ctrl.cartItems.index);
router.post('/carts/:cartId/items/:itemId', ctrl.cartItems.create);
router.put('/carts/:cartId/items/:itemId/decrement', ctrl.cartItems.decrementItem);
router.put('/carts/:cartId/items/:itemId/remove', ctrl.cartItems.removeItem);


// ---------------------------- TRANSACTIONS ------------------------- //

router.post('/transactions', ctrl.transactions.create);
router.get('/transactions', ctrl.transactions.index);
router.get('/transactions/:transaction_id', ctrl.transactions.show);


// ---------------------------- CUSTOMERS ------------------------- //

router.get('/customers', ctrl.customers.index);
router.get('/customers/:customer_id', ctrl.customers.show);


// ------------------------------ AUTH --------------------------- //

router.post('/auth/signup', ctrl.auth.signup);
router.post('/auth/login', ctrl.auth.login);
router.delete('/auth/logout', ctrl.auth.logout);
router.get('/auth/verify', ctrl.auth.verify);


// ------------------------------ ADMIN --------------------------- //

router.post('/admin/auth/login', ctrl.adminAuth.login);
router.delete('/admin/auth/logout', ctrl.adminAuth.logout);
router.get('/admin/auth/verify', ctrl.adminAuth.verify);



module.exports = router;
