console.log('Login JS...');

const form = document.querySelector('form');

// If form is not falsey, listen for form submit event
form && form.addEventListener('submit', (event) => {
  let formIsValid = true;
  const userData = {};
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
      userData[input.name] = input.value;
    }
  });

  // console.log(userData);

  // Handle Login
  if (formIsValid) {
    console.log('Submitting user login --> ', userData);
    fetch('/api/v1/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
      .then(dataStream => dataStream.json())
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          localStorage.setItem('uid', res.data);
          return window.location = `/profile`;
        } else if (res.status === 400) {
          flashMessage('error', res.error);
        }
      })
      .catch(err => console.log(err));
  }
});
