console.log('Item JS...');
const itemId = window.location.pathname.split('/')[2];
const itemSection = document.getElementById('item');

const getItemSuccess = (item) => {
  console.log(item)
  const template = `
    <div id="${item._id}" class="">
      <h4>${item.name}</h4>
      <img src="${item.imageSrc}" height="260" />
      <p><strong>Brand:</strong> ${item.brand}</p>
      <p class=""><strong>Price:</strong> $${item.price.toFixed(2)}</p>
      <p class=""><strong>Category:</strong> ${item.category}</p>
      <p><strong>${item.inStock === true ? 'In Stock!' : 'Sorry, Out of Stock'}</strong></p>
    </div>
  `;

  itemSection.insertAdjacentHTML('beforeend', template);
}

const getItem = () => {
  fetch(`/api/v1/items/${itemId}`, {
    credentials: 'include',
  })
    .then(stream => stream.json())
    .then(res => getItemSuccess(res.data))
    .catch(err => console.log(err));
}

getItem();
