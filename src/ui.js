
let controlMenuBtn = document.getElementById('control-menu-btn');
let controlMenu = document.getElementById('control-menu');
controlMenuBtn.addEventListener('click', () => {
    controlMenu.classList.toggle('visible');
    controlMenuBtn.classList.toggle('open'); 
});