const mobileNav = () => {
  const nav = document.getElementById('nav');
  if (nav.className === 'close') {
    nav.classList.remove('close');
  } else {
    nav.classList.add('close');
  }
};

const loginState = () => {
  const login = document.getElementById('login-menu');
  const signup = document.getElementById('signup-menu');
  const dashboard = document.getElementById('dashboard-menu');
  const logout = document.getElementById('logout-menu');
  if (localStorage.user) {
    signup.classList.add('hide');
    login.classList.add('hide');
    dashboard.classList.remove('hide');
    logout.classList.remove('hide');
  } else {
    signup.classList.remove('hide');
    login.classList.remove('hide');
    dashboard.classList.add('hide');
    logout.classList.add('hide');
  }
};
loginState();

const logout = (event) => {
  event.preventDefault();
  window.location = './index.html';
  localStorage.clear();
};
