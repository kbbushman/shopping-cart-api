console.log('Transaction Detail JS...');
const transactionId = window.location.pathname.split('/')[2];
const orderIdHeading = document.getElementById('orderNumber');
let detailSection = document.getElementById('transactionDetails');
// console.log(transactionId);

// CREATE ORDER DETAIL VIEW
const renderTransactionDetail = (transaction) => {
  const details = [];
  const items = transaction.cart.items.map(item => {
    return `
      <tr>
        <td>${item.name} - ${item.brand}</td>
        <td>$${item.price}</td>
        <td>${item.cartQuantity}</td>
      </tr>
    `;
  }).join('');
  detailSection.innerHTML = '';
  orderIdHeading.textContent = `${transaction._id}`

  // Render Order Details
  detailSection.insertAdjacentHTML('beforeend', `
    <div class="card">
      <div class="card-content">
        <p><strong>Date</strong>: ${new Date(transaction.transactionDate).toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${items}
          </tbody>
        </table>
        <p><strong>Total</strong>: $${transaction.total}</p>
      </div>
    </div>
  `);
  };


// GET PROFILE ON PAGE LOAD
if (localStorage.getItem('uid')) {
  customerId = localStorage.getItem('uid');
  console.log(customerId);

  fetch(`/api/v1/transactions/${transactionId}`, {
    credentials: 'include',
  })
    .then(stream => stream.json())
    .then(res => {
      console.log(res);
      if (res.status === 200) {
        renderTransactionDetail(res.data);
      } else if (res.status === 400) {
        if (localStorage.getItem('uid')) {
          localStorage.removeItem('uid');
          window.location = '/login';
        }
      }
    })
    .catch(err => console.log(err));
} else {
  const page = document.querySelector('.full-width-content');
  page.innerHTML = '';
  page.insertAdjacentHTML('beforeend', `
    <div class="message">
      <h4>You are not logged in. Please login and try again.</h4>
    </div>
  `);
}
