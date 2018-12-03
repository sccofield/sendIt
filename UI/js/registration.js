const registration = async (event) => {
  event.preventDefault();
  document.getElementById('submit').disabled = true;
  const registerationUrl = 'https://mysendit-api.herokuapp.com/api/v1/auth/signup';
  const paragraph = document.createElement('P'); // Create a <p> element

  const data = {
    firstName: document.getElementById('register-firstName').value,
    lastName: document.getElementById('register-firstName').value,
    email: document.getElementById('register-email').value,
    username: document.getElementById('register-username').value,
    password: document.getElementById('register-password').value,
    confirmPassword: document.getElementById('register-cPassword').value,
  };

  if (data.password !== data.confirmPassword) {
    const message = document.createTextNode('Passwords do not match');
    paragraph.appendChild(message);
    document.getElementById('error-message').appendChild(paragraph);
  } else {
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
    if (result.status !== 201) {
      const message = document.createTextNode(result.data[0].message);
      paragraph.appendChild(message);
      document.getElementById('error-message').appendChild(paragraph);
    } else {
      localStorage.setItem('token', result.data[0].token);
      localStorage.setItem('user', JSON.stringify(result.data[0].user));
      window.location.href = './dashboard.html';
    }
  }

  document.getElementById('submit').disabled = false;
};
