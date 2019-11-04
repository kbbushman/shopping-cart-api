console.log('Admin Customers JS...');
const customersSection = document.getElementById('customers');

const getCustomersSuccess = (customers) => {
  const template = customers.map(customer => {
    return `
      <tr>
        <td>${customer.firstName} ${customer.lastName}</td>
        <td>${customer.email}</td>
        <td>${customer.accountEnabled ? 'Customer' : 'Guest'}</td>
        <td>${customer._id}</td>
        <td><a href="#">edit</a> <a href="/admin/customers/${customer._id}">details</a> <a href="#">delete</a></td>
      </tr>
    `;
  }).join('');

  customersSection.insertAdjacentHTML('beforeend', template);
}

const getCustomers = () => {
  fetch(`/api/v1/customers`, {
    credentials: 'include',
  })
    .then(stream => stream.json())
    .then(res => getCustomersSuccess(res.data))
    // .then(res => console.log(res.data))
    .catch(err => console.log(err));
}

getCustomers();
