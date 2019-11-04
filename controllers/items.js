const db = require('../models');


// POST Create Item
const create = (req, res) => {
  req.body.price = Number(req.body.price);
  req.body.quantity = Number(req.body.quantity);
  req.body.inStock = Boolean(req.body.quantity);

  db.Item.create(req.body, (err, newItem) => {
    if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });

    res.status(201).json({
      status: 201,
      data: newItem,
      dateRequested: new Date().toLocaleString(),
    });
  });
};

// GET Index Items
const index = (req, res) => {
  db.Item.find({}, (err, allItems) => {
    if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });

    res.status(200).json({
      status: 200,
      count: allItems.length,
      data: allItems,
      dateRequested: new Date().toLocaleString(),
    });
  });
};


// GET Show Item
const show = (req, res) => {
  db.Item.findById(req.params.id, (err, foundItem) => {
    if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });

    res.status(200).json({
      status: 200,
      data: foundItem,
      dateRequested: new Date().toLocaleString(),
    });
  });
};


// PUT Update Item
const update = (req, res) => {
  req.body.price = Number(req.body.price);
  req.body.quantity = Number(req.body.quantity);
  req.body.inStock = Boolean(req.body.quantity);

  db.Item.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedItem) => {
    if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });

    res.status(200).json({
      status: 200,
      data: updatedItem,
      dateRequested: new Date().toLocaleString(),
    });
  });
};


// DELETE Destroy Item
const destroy = (req, res) => {
  db.Item.findByIdAndDelete(req.params.id, (err, deletedItem) => {
    if (err) return res.status(500).json({ status: 500, error: 'Something went wrong. Please try again' });

    res.status(200).json({
      status: 200,
      data: deletedItem,
      dateRequested: new Date().toLocaleString(),
    });
  });
};

module.exports = {
  create,
  show,
  index,
  update,
  destroy,
};
