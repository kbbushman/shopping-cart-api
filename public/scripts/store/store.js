// console.log('Store JS');
const itemSection = document.getElementById('items');
const body = document.querySelector('body');

const renderStoreItems = (items) => {
  console.log(items)
  const itemTemplates = [];
  items.forEach(item => {
    itemTemplates.push(`
      <div id="${item._id}" class="card">
        <div class="card-content">
          <h4>${item.name}</h4>
          <small>${item.brand}</small>
          <img src="${item.imageSrc}" height="150" />
        </div>
        <div class="cart-buttons">
          ${
            item.inStock === true
              ? '<button class="add-to-cart">Add to Cart</button>'
              : '<span class="out-of-stock">Out of Stock</span>'
          }
          <a class="view-details" href="/products/${item._id}">View Details</a>
        </div>
      </div>
    `);
  });

  itemSection.insertAdjacentHTML('beforeend', itemTemplates.join(''));
};


// CLOSE MODAL
const handleCloseModal = (event) => {
  if (event.target.classList.contains('close-modal') || event.target.id === 'modal') {
    document.getElementById('modal').remove();
  }
};


// SHOW MODAL
const showModal = (item) => {
  body.insertAdjacentHTML('beforeend',`
    <div id="modal" class="modal">
      <span id="closeModal" class="close-modal">x</span>
      <div class="modal-body">
        <div class="modal-content">
          <h4>${item.name} Has Been Added To Your Cart</h4>
          <img src="${item.imageSrc}" alt="${item.name}" height="200" />
          <p>$${item.price}</p>
          <div class="button-group">
            <a class="button" href="/cart">View Cart</a>
            <button class="close-modal continue-shopping">Continue Shopping</button>
          </div>
        </div>
      </div>
    </div>
  `);
};


// GET ALL STORE ITEMS
const getAllItems = () => {
  fetch('/api/v1/items', {
    credentials: 'include',
  })
    .then(stream => stream.json())
    .then(res => renderStoreItems(res.data))
    .catch(err => console.log(err));
};

getAllItems();


// HANDLE ADD TO CART CLICK
const handleAddToCartClick = (event) => {
  if (event.target.classList.contains('add-to-cart')) {
    let cartId;
    const itemId = event.target.parentElement.parentElement.id;

    if (localStorage.getItem('cartId')) {
      console.log('Getting cart ID...', localStorage.getItem('cartId'));
      cartId = localStorage.getItem('cartId');
      fetch(`/api/v1/carts/${cartId}/items/${itemId}`, {
        credentials: 'include',
        method: 'POST',
      })
        .then(stream => stream.json())
        .then(res => {
          console.log('Cart Updated...', res);
          showModal(res.data.item);
        })
        .catch(err => console.log(err));
    } else {
      fetch(`/api/v1/carts/null/items/${itemId}`, {
        credentials: 'include',
        method: 'POST',
      })
        .then(stream => stream.json())
        .then(res => {
          console.log('Cart does not exist. Creating New Cart...');
          console.log(res);
          localStorage.setItem('cartId', res.data.cart._id);
          showModal(res.data.item);
        })
        .catch(err => console.log(err));
    }

  };
};


// ADD ITEM TO CART LISTENER
itemSection.addEventListener('click', handleAddToCartClick);

// CLOSE MODAL LISTENER
body.addEventListener('click', handleCloseModal);
