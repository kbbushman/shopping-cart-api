console.log('Customer Profile JS...');
const body = document.querySelector('body');
let profileSection = document.getElementById('customerProfile');
let transactionSection = document.getElementById('transactions');
let profile;

// CREATE PROFILE VIEW
const renderProfile = (profile) => {
  const transactions = [];
  profileSection.innerHTML = '';

  // Render profile
  profileSection.insertAdjacentHTML('beforeend', `
    <div class="card">
      <div class="card-content">
        <h4>${profile.firstName} ${profile.lastName}</h4>
        <p>${profile.email}</p>
        <button id="editProfile">Edit Profile</button>
      </div>
    </div>
  `);

  // If transactions, render transactions
  if (profile.transactions.length) {
    profile.transactions.forEach(transaction => {
      transactions.push(`
        <tr>
          <td><a href="/orders/${transaction._id}">${transaction._id}</a></td>
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
        <p>No orders on file.</p>
      </div>
    `);
  }
};


// GET PROFILE ON PAGE LOAD
if (localStorage.getItem('uid')) {
  customerId = localStorage.getItem('uid');
  console.log(customerId);

  fetch(`/api/v1/customers/${customerId}`, {
    credentials: 'include',
  })
    .then(stream => stream.json())
    .then(res => {
      console.log(res);
      if (res.status === 200) {
        profile = res.data;
        renderProfile(profile);
      } else if (res.status === 400 || 401) {
        if (localStorage.getItem('uid')) {
          localStorage.removeItem('uid');
          window.location = '/login';
        }
      }
    })
    .catch(err => console.log(err));
} else {
  window.location = '/login';
}


// CLOSE MODAL
const handleCloseModal = (event) => {
  if (event.target.classList.contains('close-modal') || event.target.id === 'modal') {
    document.getElementById('modal').remove();
  }
};


// SHOW MODAL
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
                <input type="text" id="firstName" name="firstName" value="${profile.firstName}" />
              </div>
              <div class="form-control">
                <label for="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" value="${profile.lastName}" />
              </div>
            </div>
            <div class="form-control">
              <label for="email">Email</label>
              <input type="text" id="email" name="email" value="${profile.email}" />
            </div>
            <div class="form-control">
              <label for="street">Street Address</label>
              <input type="text" id="street" name="street" value="${profile.address.street}" />
            </div>
            <div class="address-group">
              <div class="form-control">
                <label for="city">City</label>
                <input type="text" id="city" name="city" value="${profile.address.city}" />
              </div>
              <div class="form-control">
                <label for="state">State</label>
                <input type="text" id="state" name="state" value="${profile.address.state}" />
              </div>
              <div class="form-control">
                <label for="zipcode">Zipcode</label>
                <input type="text" id="zipcode" name="zipcode" value="${profile.address.zipcode}" />
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


// HANDLE EDIT PROFILE CLICK
const handleProfileClick = () => {
  if (event.target.id === 'editProfile') {
    console.log('Edit');
    showModal();
  }
}


// EDIT PROFILE CLICK LISTENER
profileSection.addEventListener('click', handleProfileClick);

// CLOSE MODAL LISTENER
body.addEventListener('click', handleCloseModal);
