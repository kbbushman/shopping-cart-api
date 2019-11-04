const db = require('../models');


// POST Create Cart/Items
const create = (req, res) => {
  // Update Cart if one already exists
  if (req.params.cartId !== 'null') {
    // console.log('Cart Already Exists --> ', req.params.cartId);
    db.Cart.findById(req.params.cartId, (err, foundCart) => {
      if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });

      db.Item.findById(req.params.itemId, (err, foundItem) => {
        if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });

        const cartItem = foundCart.items.id(foundItem._id);

        // If the item already exists in the cart, update the cart quantity
        if (cartItem) {
          // console.log('Item Already Exists in Cart. Upating Cart Quantity');

          // This is as subdoc, not a document. So no need, or ability, to save the edit below
          cartItem.cartQuantity++;
          // cartItem.save((err, savedCartItem) => {
            // if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });

            foundCart.save((err, savedCart) => {
              if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });

              res.status(201).json({
                status: 201,
                data: { cart: savedCart, item: foundItem },
                dateRequested: new Date().toLocaleString(),
              });
            });
          // })
        } else {
          // If the item does not already exist in the cart, add it

          // Update foundItem cart quantity, but do not save foundItem
          // Saving would update the item record we are using for future requests
          // We just want to edit the item so we can push the editted version into cart.items
          foundItem.cartQuantity = 1;
          // foundItem.save((err, savedItem) => {
          //   if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });

            // foundCart.items.push(savedItem);
            foundCart.items.push(foundItem);
  
            foundCart.save((err, savedCart) => {
              if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });
              res.status(201).json({
                status: 201,
                // data: savedCart,
                data: { cart: savedCart, item: foundItem },
                dateRequested: new Date().toLocaleString(),
              });
            });
          // });
        }
      });
    });
  } else {
    // Create cart if one does not already exist
    // console.log('Cart Does Not Exist --> ', req.params.cartId);
    db.Item.findById(req.params.itemId, (err, foundItem) => {
      if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });


      // Update foundItem cart quantity, but do not save foundItem
      // Saving would update the item record we are using for future requests
      // We just want to edit the item so we can push the editted version into cart.items
      foundItem.cartQuantity = 1;

      // Create New Cart
      const newCart = new db.Cart();
      newCart.items.push(foundItem);
      newCart.save((err, savedCart) => {
        if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });

        res.status(201).json({
          status: 201,
          // data: savedCart,
          data: { cart: savedCart, item: foundItem },
          dateRequested: new Date().toLocaleString(),
        });
      });

    });
  }
};


// GET Index Cart Items
const index = (req, res) => {
  db.Cart.findById(req.params.cartId, (err, foundCart) => {
    if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });

    res.status(200).json({
      status: 200,
      itemCount: foundCart.items.length,
      data: foundCart,
      dateRequested: new Date().toLocaleString(),
    });
  });
};


// PUT Remove Cart Item
const removeItem = (req, res) => {
  db.Cart.findById(req.params.cartId, (err, foundCart) => {
    if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });

    const cartItem = foundCart.items.id(req.params.itemId);

    if (cartItem) {
      cartItem.remove();
    }

    foundCart.save((err, savedCart) => {
      if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });

      res.status(200).json({
        status: 200,
        data: cartItem,
        dateRequested: new Date().toLocaleString(),
      });
    });
  });
};


// PUT Update Cart Item
const decrementItem = (req, res) => {
  db.Cart.findById(req.params.cartId, (err, foundCart) => {
    if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });

    const cartItem = foundCart.items.id(req.params.itemId);

    if (cartItem) {
      cartItem.cartQuantity--;

      foundCart.save((err, savedCart) => {
        if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });
  
        res.status(200).json({
          status: 200,
          data: cartItem,
          dateRequested: new Date().toLocaleString(),
        });
      });
    }

    
  });
};


module.exports = {
  create,
  index,
  decrementItem,
  removeItem,
};
