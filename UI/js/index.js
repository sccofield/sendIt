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
    console.log(localStorage.user)
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

const adminMenu = () => {
  let user;

  if (localStorage.user) {
    user = JSON.parse(localStorage.user)
  }
  const admin = document.getElementById('admin-menu');
  console.log(user);

  if (user && user.isadmin) {
    admin.classList.remove('hide');
  }
}
adminMenu();

const logout = () => {
  localStorage.clear();
  window.location.href = './index.html';
};
