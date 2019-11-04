console.log('Admin Store Items JS...');
const form = document.querySelector('form');
let item;

const renderEditForm = (item) => {
  document.getElementById('name').value = item.name;
  document.getElementById('brand').value = item.brand;
  document.getElementById('quantity').value = item.quantity;
  document.getElementById('price').value = item.price;
  document.getElementById('category').value = item.category;
  document.getElementById('imageSrc').value = item.imageSrc;
}


const updateStoreItem = (event) => {
  event.preventDefault();

  const updatedItem = {
    name: document.getElementById('name').value,
    brand: document.getElementById('brand').value,
    quantity: document.getElementById('quantity').value,
    inStock: document.getElementById('quantity').value > 0 ? 'true' : 'false',
    price: document.getElementById('price').value,
    category: document.getElementById('category').value,
    imageSrc: document.getElementById('imageSrc').value,
  };

  console.log(updatedItem);

  fetch(`/api/v1/items/${itemId}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(updatedItem),
  })
    .then(stream => stream.json())
    .then(res => {
      console.log(res);
      if (res.status === 200) {
        item = res.data;
        window.location = '/admin/items';
      } else if (res.status === 400 || 401) {
        if (localStorage.getItem('aid')) {
          localStorage.removeItem('aid');
          window.location = '/admin';
        }
      }
    })
    .catch(err => console.log(err));

}


// GET PROFILE ON PAGE LOAD
if (localStorage.getItem('aid')) {
  itemId = window.location.pathname.split('/')[3];
  console.log(itemId);

  fetch(`/api/v1/items/${itemId}`, {
    method: 'GET',
    credentials: 'include',
  })
    .then(stream => stream.json())
    .then(res => {
      console.log(res);
      if (res.status === 200) {
        item = res.data;
        renderEditForm(item);
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


// EDIT FORM SUBMIT LISTENER
form.addEventListener('submit', updateStoreItem);
