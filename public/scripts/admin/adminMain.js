console.log('AdminMain JS...');
const currentPath = window.location.pathname;
const navLinks = document.querySelectorAll('.nav-link');
const adminLogoutButton = document.getElementById('adminLogout');

// ADD NAV ACTIVE CLASS
navLinks.forEach(link => currentPath === link.pathname && link.classList.add('active'));

// LISTEN FOR ADMIN LOGOUT CLICK
adminLogoutButton && adminLogoutButton.addEventListener('click', (event) => {
  event.preventDefault();
  console.log('ADMIN LOG OUT');
  fetch('/api/v1/admin/auth/logout', {
    method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
  })
    .then(dataStream => dataStream.json())
    .then(res => {
      console.log(res);
      if (res.status === 200) {
        if (localStorage.getItem('aid')) {
          localStorage.removeItem('aid');
        }
        window.location = '/admin';
      }
    });
});
