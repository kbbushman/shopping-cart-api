console.log('Admin Login JS...');
const form = document.querySelector('form');

// If form is not falsey, listen for form submit event
form && form.addEventListener('submit', (event) => {
  let formIsValid = true;
  const adminData = {};
  event.preventDefault();
  
  // Add Alert Message
  [...form.elements].forEach(input => {
    if (input.type !== 'submit' && input.value === '') {
      formIsValid = false;
      input.classList.add('input-error');
      input.insertAdjacentHTML('afterend', `
        <div class='alert ${input.id}-message'>
          Please enter your ${input.id}
        </div>
    `);
    } else if (input.type === 'password' && input.value.length < 4) {
      formIsValid = false;
      input.classList.add('input-error');
      input.insertAdjacentHTML('afterend', `
        <div class='alert ${input.id}-message'>
          Password must be at least 4 characters
        </div>
    `);
    }

    if (input.type !== 'submit' && formIsValid) {
      // console.log(input.value);
      adminData[input.name] = input.value;
    }
  });

  // console.log(adminData);

  // Handle Login
  if (formIsValid) {
    console.log('Submitting admin login --> ', adminData);
    fetch('/api/v1/admin/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adminData),
    })
      .then(dataStream => dataStream.json())
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          localStorage.setItem('aid', res.data);
          return window.location = `/admin/dashboard`;
        }
      })
      .catch(err => console.log(err));
  }
});
