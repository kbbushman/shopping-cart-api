console.log('Admin Transactions JS...');
const transactionsSection = document.getElementById('transactions');

const getTransactionsSuccess = (transactions) => {
  const template = transactions.map(transaction => {
    return `
      <tr>
        <td>${new Date(transaction.transactionDate).toLocaleDateString()}</td>
        <td>${new Date(transaction.transactionDate).toLocaleTimeString()}</td>
        <td>$${transaction.total}</td>
        <td>${transaction._id}</td>
        <td><a href="/admin/customers/${transaction.customer}">${transaction.customer}</a></td>
        <td><a href="/admin/transactions/${transaction._id}">details</a></td>
      </tr>
    `;
  }).join('');

  transactionsSection.insertAdjacentHTML('beforeend', template);
}

const getTransactions = () => {
  fetch(`/api/v1/transactions`, {
    credentials: 'include',
  })
    .then(stream => stream.json())
    // .then(res => console.log(res.data))
    .then(res => getTransactionsSuccess(res.data))
    .catch(err => console.log(err));
}

getTransactions();
