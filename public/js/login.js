document.addEventListener('DOMContentLoaded', (event) => { 



const handleLoginLinkClick = (event) => {
  event.preventDefault();
  $('#login-form-container').toggle();
}

$(`a#login-link`).on('click', handleLoginLinkClick);



const loginFormHandler = async (event) => {
  console.log('loginFormHandler is being called');
    event.preventDefault();
  
    // Collect values from the login form
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
  
    if (email && password) {
      // Send a POST request to the API endpoint
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        // If successful, redirect the browser to the home page
        document.location.replace('/');
      } else {
        alert(response.statusText);
      }
      const responseData = await response.json();
      console.log(responseData);
    }
  };
  
  const signupFormHandler = async (event) => {
    console.log('signupFormHandler is being called');
    event.preventDefault();
  
    const username = document.querySelector('#username-join').value.trim();
    const email = document.querySelector('#email-join').value.trim();
    const password = document.querySelector('#password-join').value.trim();
  
    if (username && email && password) {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace('/');
      } else {
        alert(response.statusText);
      }
    }
  };
  
  document
    .querySelector('.login-form')
    .addEventListener('submit', loginFormHandler);
  
  document
    .querySelector('.join-form')
    .addEventListener('submit', signupFormHandler);
  });