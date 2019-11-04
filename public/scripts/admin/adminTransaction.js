console.log('Admin Customer JS...');
const body = document.querySelector('body');
let transactionSection = document.getElementById('transactionSection');
let transaction;

// CREATE TRANSACTION VIEW
const renderTransaction = (transaction) => {
  transactionSection.innerHTML = '';

  const items = transaction.cart.items.map(item => {
    return `
      <tr>
        <td>${item.name}</td>
        <td>${item.brand}</td>
        <td>${item.category}</td>
        <td>$${item.price}</td>
        <td>${item.cartQuantity}</td>
      </tr>
    `;
  }).join('');

  // Render transaction
  transactionSection.insertAdjacentHTML('beforeend', `
    <div>
      <p><strong>Transaction ID:</strong> ${transaction._id}</p>
      <p><strong>Date:</strong> ${new Date(transaction.transactionDate).toLocaleString()}</p>
      <p><strong>Total:</strong> $${transaction.total}</p>
      <p><strong>Customer ID:</strong> <a href="/admin/customers/${transaction.customer}">${transaction.customer}</a></p>
      <p><strong>Cart Items:</strong></p>
      <table>
        <thead>
          <th>Name</th>
          <th>Brand</th>
          <th>Category</th>
          <th>Price</th>
          <th>Quantity</th>
        </thead>
        <tbody>
          ${items}
        </tbody>
      </table>
    </div>
  `);
};


// GET TRANSACTION ON PAGE LOAD
if (localStorage.getItem('aid')) {
  transactionId = window.location.pathname.split('/')[3];
  console.log(transactionId);

  fetch(`/api/v1/transactions/${transactionId}`, {
    credentials: 'include',
  })
    .then(stream => stream.json())
    .then(res => {
      console.log(res);
      if (res.status === 200) {
        transaction = res.data;
        renderTransaction(transaction);
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
