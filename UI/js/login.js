const login = async (event) => {
  event.preventDefault();
  document.getElementById('submit').disabled = true;
  const registerationUrl = 'https://mysendit-api.herokuapp.com/api/v1/auth/login';

  const data = {
    email: document.getElementById('login-email').value,
    password: document.getElementById('login-password').value,
  };

  const response = await fetch(registerationUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify(data),
  });

  // result = response.json();


  const result = await response.json();
  if (result.status !== 200) {
    console.log(result.data);
    document.getElementById('error-message').innerHTML = result.data[0].message;
  } else {
    localStorage.setItem('token', result.data[0].token);
    localStorage.setItem('user', JSON.stringify(result.data[0].user));
    window.location.href = './dashboard.html';
  }

  document.getElementById('submit').disabled = false;
};
