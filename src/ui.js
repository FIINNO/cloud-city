
let controlMenuBtn = document.getElementById('control-menu-btn');
let controlMenu = document.getElementById('control-menu');
controlMenuBtn.addEventListener('click', () => {
    controlMenu.classList.toggle('visible');
    controlMenuBtn.classList.toggle('open'); 
});

let toggleSunBtn = document.getElementById('toggle-sunlight');
let toggleAmbientBtn = document.getElementById('toggle-ambient-light');
let toggleCamAnimBtn = document.getElementById('toggle-cam-animation');
toggleSunBtn.classList.add('clicked');
toggleAmbientBtn.classList.add('clicked');

toggleSunBtn.addEventListener('click', () => {
    toggleSunBtn.classList.toggle('clicked'); 
});
toggleAmbientBtn.addEventListener('click', () => {
    toggleAmbientBtn.classList.toggle('clicked'); 
});
toggleCamAnimBtn.addEventListener('click', () => {
    toggleCamAnimBtn.classList.toggle('clicked'); 
});

document.addEventListener("keydown", (e) => {
    if(e.code == "Space") {
        e.preventDefault();
        toggleCamAnimBtn.classList.toggle('clicked'); 
    }
});


let textLayer = document.getElementById('text-layer');

window.addEventListener('scroll', () => {
    if(window.scrollY == 0) {
        textLayer.style.opacity = '1';
    } else {
        textLayer.style.opacity = '0';
    }
});