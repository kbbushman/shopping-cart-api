console.log('Admin Store Item JS...');
const body = document.querySelector('body');
let itemSection = document.getElementById('itemSection');
let item;

// CREATE ITEM DETAIL VIEW
const renderItem = (item) => {
  itemSection.innerHTML = '';

  // Render Item
  itemSection.insertAdjacentHTML('beforeend', `
    <div>
      <h4>${item.name}</h4>
      <img src="${item.imageSrc}" height="300" />
      <p>
        <strong>item ID:</strong> ${item._id}<br />
        <strong>Name:</strong> ${item.name}</<strong><br />
        <strong>Brand:</strong> ${item.brand}</<strong><br />
        <strong>Category:</strong> ${item.category}</<strong><br />
        <strong>Price:</strong> $${item.price}<br />
        <strong>Quantity:</strong> ${item.quantity}<br />
        <strong>Date Added:</strong> ${new Date(item.dateAdded).toLocaleDateString()}
      </p>
      <button id="editItem">Edit Item</button>
    </div>
  `);
};


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
          <h4>Edit Item</h4>
          <form>
            <div class="input-group">
              <div class="form-control">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" value="${item.name}" />
              </div>
              <div class="form-control">
                <label for="brand">Brand</label>
                <input type="text" id="brand" name="brand" value="${item.brand}" />
              </div>
            </div>
            <div class="input-group">
              <div class="form-control">
                <label for="quantity">Quantity</label>
                <input type="number" id="quantity" name="quantity" value="${item.quantity}" />
              </div>
              <div class="form-control">
                <label for="price">Price</label>
                <input type="number" id="price" name="price" value="${item.price}" />
              </div>
            </div>
            <div class="form-control">
              <label for="category">Category</label>
              <input type="text" id="category" name="category" value="${item.category}" />
            </div>
            <div class="form-control">
              <label for="imageSrc">Image Source</label>
              <input type="text" id="imageSrc" name="imageSrc" value="${item.imageSrc}" />
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


// GET ITEM ON PAGE LOAD
if (localStorage.getItem('aid')) {
  itemId = window.location.pathname.split('/')[3];
  console.log(itemId);

  fetch(`/api/v1/items/${itemId}`, {
    credentials: 'include',
  })
    .then(stream => stream.json())
    .then(res => {
      console.log(res);
      if (res.status === 200) {
        item = res.data;
        renderItem(item);
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


// HANDLE EDIT ITEM CLICK
const handleItemClick = () => {
  if (event.target.id === 'editItem') {
    console.log('Edit Item');
    showModal();
  }
}


// EDIT ITEM CLICK LISTENER
itemSection.addEventListener('click', handleItemClick);

// CLOSE MODAL LISTENER
body.addEventListener('click', handleCloseModal);
