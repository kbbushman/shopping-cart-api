const db = require('../models');

// POST Create Cart
const create = (req, res) => {
  db.Cart.create(req.body, (err, newCart) => {
    if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });

    res.status(201).json({
      status: 201,
      data: newCart,
      dateRequested: new Date().toLocaleString(),
    });
  });
};


// GET Index Cart
const index = (req, res) => {
  db.Cart.find({}, (err, allCarts) => {
    if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });

    res.status(200).json({
      status: 200,
      data: allCarts,
      dateRequested: new Date().toLocaleString(),
    });
  });
};


// GET Show Cart
const show = (req, res) => {
  db.Cart.findById(req.params.id, (err, foundCart) => {
    if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });

    res.status(200).json({
      status: 200,
      data: foundCart,
      dateRequested: new Date().toLocaleString(),
    });
  });
};


// DELETE Destroy Cart
const destroy = (req, res) => {
  db.Cart.findByIdAndDelete(req.params.id, (err, deletedCart) => {
    if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });

    res.status(200).json({
      status: 200,
      data: deletedCart,
      dateRequested: new Date().toLocaleString(),
    });
  });
};


module.exports = {
  create,
  index,
  show,
  destroy,
};
