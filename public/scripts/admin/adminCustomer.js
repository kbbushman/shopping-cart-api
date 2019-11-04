console.log('Admin Customer JS...');
const body = document.querySelector('body');
let customerSection = document.getElementById('customerSection');
let transactionSection = document.getElementById('transactions');
let customer;

// CREATE PROFILE VIEW
const renderCustomer = (profile) => {
  const transactions = [];
  customerSection.innerHTML = '';

  // Render profile
  customerSection.insertAdjacentHTML('beforeend', `
    <div class="card">
      <div class="card-content">
        <h4>${profile.firstName} ${profile.lastName}</h4>
        <p>${profile.email}</p>
        <p>
          ${profile.address.street}<br />
          ${profile.address.city}, ${profile.address.state}<br />
          ${profile.address.zipcode}
        </p>
        <button id="editProfile">Edit Profile</button>
      </div>
    </div>
  `);

  // If transactions, render transactions
  if (profile.transactions.length) {
    profile.transactions.forEach(transaction => {
      transactions.push(`
        <tr>
          <td><a href="/admin/transactions/${transaction._id}">${transaction._id}</a></td>
          <td>${new Date(transaction.transactionDate).toLocaleDateString()}</td>
          <td>$${transaction.total}</td>
        </tr>
      `);
    });
    transactionSection.insertAdjacentHTML('beforeend', transactions.join(''));
  } else {
    // If no transactions, render no transactions
    document.querySelector('table').remove();
    document.querySelector('.full-width-content').insertAdjacentHTML('beforeend', `
      <div class="message">
        <p>No transactions on file.</p>
      </div>
    `);
  }
};


// CLOSE EDIT PROFILE MODAL
const handleCloseModal = (event) => {
  if (event.target.classList.contains('close-modal') || event.target.id === 'modal') {
    document.getElementById('modal').remove();
  }
};


// SHOW EDIT PROFILE MODAL
const showModal = () => {
  body.insertAdjacentHTML('beforeend',`
    <div id="modal" class="modal">
      <span id="closeModal" class="close-modal">x</span>
      <div class="modal-body">
        <div class="modal-content">
          <h4>Edit Profile</h4>
          <form>
            <div class="input-group">
              <div class="form-control">
                <label for="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" value="${customer.firstName}" />
              </div>
              <div class="form-control">
                <label for="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" value="${customer.lastName}" />
              </div>
            </div>
            <div class="form-control">
              <label for="email">Email</label>
              <input type="text" id="email" name="email" value="${customer.email}" />
            </div>
            <div class="form-control">
              <label for="street">Street Address</label>
              <input type="text" id="street" name="street" value="${customer.address.street}" />
            </div>
            <div class="address-group">
              <div class="form-control">
                <label for="city">City</label>
                <input type="text" id="city" name="city" value="${customer.address.city}" />
              </div>
              <div class="form-control">
                <label for="state">State</label>
                <input type="text" id="state" name="state" value="${customer.address.state}" />
              </div>
              <div class="form-control">
                <label for="zipcode">Zipcode</label>
                <input type="text" id="zipcode" name="zipcode" value="${customer.address.zipcode}" />
              </div>
            </div>
            <div class="button-group">
              <input class="button" type="submit" value="Update" />
              <button type="button" class="close-modal continue-shopping">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `);
};


// GET PROFILE ON PAGE LOAD
if (localStorage.getItem('aid')) {
  customerId = window.location.pathname.split('/')[3];
  console.log(customerId);

  fetch(`/api/v1/customers/${customerId}`, {
    credentials: 'include',
  })
    .then(stream => stream.json())
    .then(res => {
      console.log(res);
      if (res.status === 200) {
        customer = res.data;
        renderCustomer(customer);
      } else if (res.status === 400 || 401) {
        if (localStorage.getItem('aid')) {
          localStorage.removeItem('aid');
          window.location = '/admin';
        }
      }
    })
    .catch(err => console.log(err));
} else {
  window.location = '/admin';
}


// HANDLE EDIT PROFILE CLICK
const handleProfileClick = () => {
  if (event.target.id === 'editProfile') {
    console.log('Edit');
    showModal();
  }
}


// EDIT PROFILE CLICK LISTENER
customerSection.addEventListener('click', handleProfileClick);

// CLOSE MODAL LISTENER
body.addEventListener('click', handleCloseModal);
