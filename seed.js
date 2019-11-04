const db = require('./models');

const itemData = [
  {
    name: "Item One",
    brand: "Sony",
    price: 15.99,
    imageSrc: 'https://images-na.ssl-images-amazon.com/images/I/51STAO1VRrL._SX569_.jpg',
    inStock: true,
    quantity: 20,
    category: "accessories",
  },
  {
    name: "Item Two",
    brand: "Apple",
    price: 635.15,
    imageSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROx1xcf7vA7e0fAryhXVDguax8u7flhDgiyAzoW2g05-SbexHy&s',
    inStock: true,
    quantity: 10,
    category: "mobile phones",
  },
  {
    name: "Item Three",
    brand: "Samsung",
    price: 235.99,
    imageSrc: 'https://ss7.vzw.com/is/image/VerizonWireless/SAMSUNG_Galaxy_S9_Black?$device-lg$',
    inStock: true,
    quantity: 5,
    category: "mobile phones",
  },
  {
    name: "Item Four",
    brand: "LG",
    price: 45.99,
    imageSrc: 'https://www.lg.com/in/images/mobile-phones/md06067496/01_Blue-Rev2_350.jpg',
    inStock: false,
    quantity: 0,
    category: "accessories",
  },
];


// Delete All Carts
console.log('Deleting all Shopping Carts...');
db.Cart.deleteMany((err, result) => {
  if (err) console.log(err);
  console.log(`Successfully Deleted ${result.deletedCount} Shopping Carts.`);

  // Delete All Items
  console.log('Deleting all Items...');
  db.Item.deleteMany((err, result) => {
    if (err) console.log(err);
    console.log(`Successfully deleted ${result.deletedCount} Items.`);

    // Delete All Customers
    console.log('Deleting all Customers...');
    db.Customer.deleteMany((err, result) => {
      if (err) console.log(err);
      console.log(`Successfully deleted ${result.deletedCount} Customers.`);

      //Delete All Transactions
      console.log('Deleting all Transactions...') ;
      db.Transaction.deleteMany((err, result) => {
        if (err) console.log(err);
        console.log(`Successfully deleted ${result.deletedCount} Transactions.`);

        // Create New Items
        console.log('Creating new Items...');
        db.Item.create(itemData, (err, newItems) => {
          if (err) console.log(err);
          console.log(`Successfully created ${newItems.length} Items.`);
          console.log('Done!');

          // Exit
          process.exit();
        });
      });
    });
  });
});
