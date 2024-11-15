const navMenuList = document.querySelector('.nav_menu_list');

let isDown = false;
let startX;
let scrollLeft;


navMenuList.addEventListener('mousedown', (e) => {
  isDown = true;
  navMenuList.classList.add('active');
  startX = e.pageX - navMenuList.offsetLeft;
  scrollLeft = navMenuList.scrollLeft;
});

navMenuList.addEventListener('mouseleave', () => {
  isDown = false;
  navMenuList.classList.remove('active');
});

navMenuList.addEventListener('mouseup', () => {
  isDown = false;
  navMenuList.classList.remove('active');
});

navMenuList.addEventListener('mousemove', (e) => {
  if (!isDown) return; 
  e.preventDefault();
  const x = e.pageX - navMenuList.offsetLeft;
  const walk = (x - startX) * 2; 
  navMenuList.scrollLeft = scrollLeft - walk;
});