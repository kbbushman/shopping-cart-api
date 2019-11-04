console.log('Cart JS');
(() => {
const itemSection = document.getElementById('cartItems');
let cartTotal;
let cartItems;
let cartId;


// CREATE CART ITEMS VIEW
const renderCartItems = (items) => {
  const result = [];
  cartTotal = 0;
  itemSection.innerHTML = '';

  if (!items.length) {
    itemSection.insertAdjacentHTML('beforeend', `
      <div class="cart-item">
        <p>There are no items in your cart. Handle it...</p>
      </div>
    `);
  } else {
    items.forEach(item => {
      cartTotal += item.price * item.cartQuantity;
      result.push(`
        <div id="${item._id}" class="cart-item">
          <div class="item-image"><img src="${item.imageSrc}" alt="${item.name}" /></div>
          <div class="item-info">
            <h4>${item.name}</h4>
            <small>${item.brand}</small>
          </div>
          <div class="item-price">$${item.price}</div>
          <div class="item-quantity"><span class="quantity-arrow arrow-up">▲</span> <span class="quantity-text">${item.cartQuantity}</span> <span class="quantity-arrow arrow-down">▼</span></div>
          <button class="item-delete">x</button>
        </div>
      `);
    });
  
    result.push(`
      <div class="cart-checkout">
        <div class="checkout-container">
          <span class="cart-total">Total: $${cartTotal.toFixed(2)}</span>
          <a class="checkout" href="/checkout">Checkout</a>
        </div>
      </div>
    `);
  }

  itemSection.insertAdjacentHTML('beforeend', result.join(''));
};


// DELETE CART ITEM
const handleDeleteItem = (event) => {
  const itemId = event.target.parentElement.id;

  fetch(`/api/v1/carts/${cartId}/items/${itemId}/remove`, {
    credentials: 'include',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(stream => stream.json())
    .then(res => {
      // Remove Deleted Item from cartItems
      const itemIndex = cartItems.indexOf(cartItems.find(item => item._id === itemId));
      cartItems.splice(itemIndex, 1);
      // Update DOM
      renderCartItems(cartItems);
    })
    .catch(err => console.log(err));
};


// HANDLE UPDATE CART ITEM QUANTITY
const handleUpdateQuantity = (event) => {
  const itemId = event.target.parentElement.parentElement.id;
  const item = cartItems.find(item => item._id === itemId);
  if (event.target.classList.contains('arrow-up')) {
    console.log('INCREMENT ITEM QUANTITY', itemId);
    fetch(`/api/v1/carts/${cartId}/items/${itemId}`, {
      method: 'POST',
    })
      .then(stream => stream.json())
      .then(res => {
        console.log('Cart Item Incremented...', res);
        item.cartQuantity++;
        renderCartItems(cartItems);
      })
      .catch(err => console.log(err));

  } else if (event.target.classList.contains('arrow-down') && item.cartQuantity > 1) {
    console.log('DECREMENT ITEM QUANTITY', itemId);
    fetch(`/api/v1/carts/${cartId}/items/${itemId}/decrement`, {
      method: 'PUT',
    })
      .then(stream => stream.json())
      .then(res => {
        console.log('Cart Item Decremented...', res);
        item.cartQuantity--;
        renderCartItems(cartItems);
      })
      .catch(err => console.log(err));
  }
};


// HANDLE CART ITEM CLICK
const handleClick = (event) => {
  if (event.target.classList.contains('item-delete')) {
    handleDeleteItem(event);
  } else if (event.target.classList.contains('quantity-arrow')) {
    handleUpdateQuantity(event);
  }
};


// GET CART ITEMS ON PAGE LOAD
if (localStorage.getItem('cartId')) {
  cartId = localStorage.getItem('cartId');
  console.log(cartId);

  fetch(`/api/v1/carts/${cartId}`)
    .then(stream => stream.json())
    .then(res => {
      console.log(res);
      if (!res.data) {
        localStorage.removeItem('cartId');
        cartItems = [];
        renderCartItems(cartItems);
      }
      cartItems = res.data ? res.data.items : [];
      renderCartItems(cartItems);
    })
    .catch(err => console.log(err));
} else {
  itemSection.insertAdjacentHTML('beforeend', `
    <div class="cart-item">
      <p>There are no items in your cart. Handle it...</p>
    </div>
  `);
}


// CART ITEM CLICK LISTENER
itemSection.addEventListener('click', handleClick);

})()
