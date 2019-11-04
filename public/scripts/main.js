console.log('Hello Dave...');
const currentPath = window.location.pathname;
const navLinks = document.querySelectorAll('.nav-link');
const logoutButton = document.getElementById('logout');


// ADD NAV ACTIVE CLASS
navLinks.forEach(link => currentPath === link.pathname && link.classList.add('active'));

// ADD NAV ACTIVE CLASS (Long Form)
// navLinks.forEach(link => {
//   if (currentPath === link.pathname) {
//     link.classList.add('active');
//   }
// });


// LISTEN FOR LOGOUT CLICK
logoutButton && logoutButton.addEventListener('click', (event) => {
  event.preventDefault();
  // console.log('LOG OUT');
  fetch('/api/v1/auth/logout', {
    method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
  })
    .then(dataStream => dataStream.json())
    .then(res => {
      if (res.status === 200) {
        if (localStorage.getItem('uid')) {
          localStorage.removeItem('uid');
        }
        window.location = '/login';
      }
    });
});


// Clear Flash Message After 4 Seconds
const clearMessage = () => {
  setTimeout(() => {
    document.querySelector('.message').remove();
  }, 4000)
}


// Flash Message
const flashMessage = (type, message) => {
  const messageTarget = document.querySelector('nav');

  // Create Message Template
  const messageTemplate = `
    <div class="message ${type}">
      <div class="message-content">
        <p class="message-text">${message}</p>
      </div>
    </div>
  `;

  // Append Message
  messageTarget.insertAdjacentHTML('afterend', messageTemplate);

  // Scroll To Top Of Page
  window.scrollTo(0, 0);

  // Clear Message
  clearMessage();
};
