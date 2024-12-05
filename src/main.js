
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


// Scene setup
const scene = new THREE.Scene();

// Camera
let camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 45, 30000);
camera.position.set(1200, -250, 4000);



// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls( camera, renderer.domElement );


//Skybox textures
const frontImg = new THREE.TextureLoader().load("./imgs/skybox/corona_ft.png");
const backImg = new THREE.TextureLoader().load("./imgs/skybox/corona_bk.png");
const upImg = new THREE.TextureLoader().load("./imgs/skybox/corona_up.png");
const downImg = new THREE.TextureLoader().load("./imgs/skybox/corona_dn.png");
const leftImg = new THREE.TextureLoader().load("./imgs/skybox/corona_lf.png");
const rightImg = new THREE.TextureLoader().load("./imgs/skybox/corona_rt.png");

// const frontImg = new THREE.TextureLoader().load("./imgs/skybox/cloudcity_front.png");
// const backImg = new THREE.TextureLoader().load("./imgs/skybox/cloudcity_back.png");
// const upImg = new THREE.TextureLoader().load("./imgs/skybox/cloudcity_up.png");
// const downImg = new THREE.TextureLoader().load("./imgs/skybox/cloudcity_down.png");
// const leftImg = new THREE.TextureLoader().load("./imgs/skybox/cloudcity_left.png");
// const rightImg = new THREE.TextureLoader().load("./imgs/skybox/cloudcity_right.png");

const textureLoaderArray = [frontImg, backImg, upImg, downImg, rightImg, leftImg];

const skyBoxMaterialArray = textureLoaderArray.map(texture => {
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
});



// Skybox cube
const skyboxGeometry = new THREE.BoxGeometry(10000,10000,10000);
let skybox = new THREE.Mesh(skyboxGeometry, skyBoxMaterialArray);
scene.add(skybox);

animate();



// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    renderer.render(scene, camera);
}


