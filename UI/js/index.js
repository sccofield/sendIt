const mobileNav = () => {
  const nav = document.getElementById('nav');
  if (nav.className === 'close') {
    nav.classList.remove('close');
  } else {
    nav.classList.add('close');
  }
};
