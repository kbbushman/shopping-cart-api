console.log('Admin Store Items JS...');
const body = document.querySelector('body');
const itemsSection = document.getElementById('itemsSection');
const contentSection = document.querySelector('.full-width-content');

const getItemsSuccess = (items) => {
  itemsSection.innerHTML = '';
  const template = items.map(item => {
    return `
      <tr>
        <td>${item.name}</td>
        <td>${item.brand}</td>
        <td>$${item.price}</td>
        <td>${item.quantity}</td>
        <td>${item._id}</td>
        <td><a href="/admin/items/${item._id}/edit">edit</a> <a href="/admin/items/${item._id}">details</a> <button id="${item._id}" class="small delete">delete</button></td>
      </tr>
    `;
  }).join('');

  itemsSection.insertAdjacentHTML('beforeend', template);
}


// CLOSE EDIT ITEM MODAL
const handleCloseModal = (event) => {
  if (event.target.classList.contains('close-modal') || event.target.id === 'modal') {
    document.getElementById('modal').remove();
  }
};


// SHOW EDIT ITEM MODAL
const showModal = () => {
  body.insertAdjacentHTML('beforeend',`
    <div id="modal" class="modal">
      <span id="closeModal" class="close-modal">x</span>
      <div class="modal-body">
        <div class="modal-content">
          <h4>Add New Item</h4>
          <form>
            <div class="input-group">
              <div class="form-control">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" />
              </div>
              <div class="form-control">
                <label for="brand">Brand</label>
                <input type="text" id="brand" name="brand" />
              </div>
            </div>
            <div class="input-group">
              <div class="form-control">
                <label for="quantity">Quantity</label>
                <input type="number" id="quantity" name="quantity" />
              </div>
              <div class="form-control">
                <label for="price">Price</label>
                <input type="number" id="price" name="price" />
              </div>
            </div>
            <div class="form-control">
              <label for="category">Category</label>
              <input type="text" id="category" name="category" />
            </div>
            <div class="form-control">
              <label for="imageSrc">Image Source</label>
              <input type="text" id="imageSrc" name="imageSrc" />
            </div>
            <div class="button-group">
              <input class="button" type="submit" value="Add New Item" />
              <button type="button" class="close-modal continue-shopping">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `);
};


const handleSubmitNewItem = (event) => {
  event.preventDefault();
  console.log('Submit New Item');
  const newItem = {
    name: document.getElementById('name').value,
    brand: document.getElementById('brand').value,
    quantity: document.getElementById('quantity').value,
    inStock: document.getElementById('quantity').value > 0 ? 'true' : 'false',
    price: document.getElementById('price').value,
    category: document.getElementById('category').value,
    imageSrc: document.getElementById('imageSrc').value,
  };

  console.log('New Item = ', newItem);

  fetch(`/api/v1/items`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newItem),
  })
    .then(stream => stream.json())
    .then(res => {
      // console.log(res);
      getItems();
      // Close Modal
      document.getElementById('modal').remove();
    })
    .catch(err => console.log(err));
}


const getItems = () => {
  fetch(`/api/v1/items`, {
    credentials: 'include',
  })
    .then(stream => stream.json())
    // .then(res => console.log(res.data))
    .then(res => getItemsSuccess(res.data))
    .catch(err => console.log(err));
}

getItems();


const deleteItem = (event) => {
  // console.log(event.target.id);
  const itemId = event.target.id;
  fetch(`/api/v1/items/${itemId}`, {
    method: 'DELETE',
    credentials: 'include',
  })
    .then(stream => stream.json())
    .then(res => {
      console.log(res);
      getItems();
    })
    .catch(err => console.log(err));

}


// HANDLE ITEM SECTION CLICK
const handleClick = (event) => {
  if (event.target.id === 'newItemBtn') {
    console.log('New Item');
    showModal();
  } else if (event.target.classList.contains('delete')) {
    deleteItem(event);
  }
}


// NEW ITEM CLICK LISTENER
contentSection.addEventListener('click', handleClick);

// NEW ITEM SUBMIT LISTENER
body.addEventListener('submit', handleSubmitNewItem);

// CLOSE MODAL LISTENER
body.addEventListener('click', handleCloseModal);
