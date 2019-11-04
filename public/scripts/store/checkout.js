console.log('Checkout JS');
const itemSection = document.getElementById('items');
const customerData = {};
let customer;
let cart;

// CREATE CART ITEMS VIEW
const renderCartItems = (items) => {
  itemSection.innerHTML = '';

  if (!items.length) {
    document.querySelector('.checkout-form-container').remove();
    document.querySelector('.checkout-page').insertAdjacentHTML('beforeend', `
      <div class="cart-item">
        <p>There are no items in your cart. Handle it... <a href="/store/">Back to Store</a><p>
      </div>
    `);
  } else {
    const result = [];
    cartTotal = 0;
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
          <div class="item-quantity"><span class="quantity-text">${item.cartQuantity}</span></div>
        </div>
      `);
    });
  
    result.push(`
      <div class="cart-checkout">
        <div class="checkout-container">
          <span class="cart-total">Total: $${cartTotal.toFixed(2)}</span>
          <a class="checkout" href="/cart">Edit Cart</a>
        </div>
      </div>
    `);

    itemSection.insertAdjacentHTML('beforeend', result.join(''));
  }
};


// HANDLE CUSTOMER INFO
const handleCustomerInfo = (event) => {
  const customerForm = document.getElementById('customerInfo');
  event.preventDefault();
  console.log('Customer Info Submit');
  // Get All Form Inputs
  const formInputs = customerForm.elements;
  // Update customerData Object with Input Name & Value
  [...formInputs].forEach(input => {
    if (input.type !== 'submit' && input.name !== 'createAccount') {
      customerData[input.name] = input.value;
    }
  });

  console.log(customerData);

  document.querySelector('.customer-information').insertAdjacentHTML('beforeend', `
    <div class="customer-data">
      <p class="customer-data-name"><strong>${customerData.firstName} ${customerData.lastName}</strong></p>
      <p class="customer-data">${customerData.email}</p>
      <p class="customer-data">${customerData.street}</p>
      <p class="customer-data">${customerData.city}, ${customerData.state}</p>
      <p class="customer-data">${customerData.zipcode}</p>
    </div>
  `);

  // Hide Customer Info Form
  customerForm.classList.add('hide');
  // Show Payment Info Form
  document.querySelector('.payment-information').classList.remove('hide');
};


// HANDLE PAYMENT INFO & SUBMIT ORRDER
const handlePaymentInfo = (event) => {
  const paymentForm = document.getElementById('paymentInfo');
  const paymentData = {};
  event.preventDefault();
  console.log('Payment Info Submit');
  // Get All Form Inputs
  const formInputs = paymentForm.elements;
  // Update customerData Object with Input Name & Value
  [...formInputs].forEach(input => {
    if (input.type !== 'submit') {
      paymentData[input.name] = input.value;
    }
  });

  console.log(paymentData);

  // Disable Order Button & Inputs
  const placeOrderButton = document.querySelector('.place-order');
  placeOrderButton.disabled = true;
  placeOrderButton.textContent = 'Processing...';
  [...formInputs].forEach(input => {
    if (input.type !== 'submit') {
      input.disabled = true;
    }
  });

  console.log({ customer: customerData, payment: paymentData, total: cartTotal });

  // Place Order
  fetch(`/api/v1/transactions`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ customer: customerData, payment: paymentData, cart, total: cartTotal }),
  })
    .then(stream => stream.json())
    .then(res => {
      console.log(res);
      if (res.status === 201) {
        localStorage.removeItem('cartId');
        window.location = '/success';
      } else if (res.status === 400) {
        flashMessage('error', res.error);
      }
    })
    .catch(err => console.log(err));
};


// ADD ACCOUNT FIELDS TO CUSTOMER INFO FORM
const handleShowPasswords = (event) => {
  const passwordConatiner = document.getElementById('passwordContainer');
  // console.log(event.target.checked);

  passwordConatiner.innerHTML = '';

  if (event.target.checked) {
    passwordConatiner.insertAdjacentHTML('beforeend', `
    <div class="input-group">
      <div class="form-control">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" />
      </div>
      <div class="form-control">
        <label for="password2">Confirm Your Password</label>
        <input type="password" id="password2" name="password2" />
      </div>
    </div>
  `);
  }
};


// HANDLE CUSTOMER ADDRESS DROPDOW MENU CHANGE
const handleAddressChange = (event) => {
  if (event.target.id === 'selectAddress') {
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const street = document.getElementById('street');
    const city = document.getElementById('city');
    const state = document.getElementById('state');
    const zipcode = document.getElementById('zipcode');

    firstName.value = customer.firstName;
    lastName.value = customer.lastName;
    email.value = customer.email;
    street.value = customer.address.street;
    city.value = customer.address.city;
    state.value = customer.address.state;
    zipcode.value = customer.address.zipcode;
  }
}


// SHOW CUSTOMER ADDRESS IN CHECKOUT FORM
const showCustomerAddressField = (customer) => {
  document.querySelector('.create-account-container').remove();
  const addressForm = document.getElementById('customerInfo');
  if (customer.address) {
    addressForm.insertAdjacentHTML('beforebegin', `
      <div id="address-select-container">
        <p><strong>Shipping Address on File:</strong></p>
        <select name="address" id="selectAddress">
          <option>Please Select...</option>
          <option value=${JSON.stringify(customer.address)}>${customer.address.street}, ${customer.address.city}, ${customer.address.zipcode}</option>
        </select>
      </div>
    `);
  }
};


// GET CART ITEMS ON PAGE LOAD
if (localStorage.getItem('cartId')) {
  cartId = localStorage.getItem('cartId');
  console.log(cartId);

  // Get Cart Info
  fetch(`/api/v1/carts/${cartId}`, {
    credentials: 'include',
  })
    .then(stream => stream.json())
    .then(res => {
      console.log(res);
      cart = res.data;
      cartItems = res.data ? res.data.items : [];
      renderCartItems(cartItems);
    })
    .catch(err => console.log(err));

    if (localStorage.getItem('uid')) {
      // Get Customer Info
      fetch(`/api/v1/customers/${localStorage.getItem('uid')}`, {
        credentials: 'include',
      })
        .then(stream => stream.json())
        .then(res => {
          console.log(res);
          customer = res.data;
          showCustomerAddressField(customer);
        })
        .catch(err => console.log(err));
    }
} else {
  itemSection.insertAdjacentHTML('beforeend', `
    <div class="cart-item">
      <p>There are no items in your cart. Handle it...</p>
    </div>
  `);
}


// ------------------------------------------------ EVENT LISTENERS ----------------------------------------- //

document.getElementById('customerInfo').addEventListener('submit', handleCustomerInfo);
document.getElementById('paymentInfo').addEventListener('submit', handlePaymentInfo);
document.getElementById('createAccount').addEventListener('change', handleShowPasswords);
document.querySelector('body').addEventListener('change', handleAddressChange)
