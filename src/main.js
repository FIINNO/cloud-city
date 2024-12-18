
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Camera } from "./camera.js";
import * as animationUtils from './animation-utils.js'


// Scene setup
const scene = new THREE.Scene();

// Camera
const cameraObject = new Camera();
const camera = cameraObject.getInstance();
scene.add(camera);

const loadingScreen = document.getElementById('loading-screen');
const loadingBar = document.getElementById('loading-bar');

const loadingManager = new THREE.LoadingManager();

loadingManager.onProgress = (url, loaded, total) => {
    const progress = (loaded / total) * 100;
    loadingBar.style.width = `${progress}%`;
}

loadingManager.onLoad = () => {
    loadingScreen.style.display = 'none';
}


// Lightning
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 6.0);
sunLight.position.set(-3500,1000.0,5000);
sunLight.castShadow = true;
scene.add(sunLight);

const sunHelper = new THREE.DirectionalLightHelper(sunLight, 100);
scene.add(sunHelper);


// Model loader

var cloudCityObject;
var cloudCarObject; 

const modelLoader = new GLTFLoader(loadingManager).setPath('./models/');
modelLoader.load('./cloud_city_model/scene.gltf', (gltf) => {
    cloudCityObject = gltf.scene;
    cloudCityObject.position.set(200, -100, -1200);
    cloudCityObject.scale.set(0.05, 0.05, 0.05);
    scene.add(cloudCityObject);
});

modelLoader.load('./cloud_car_model/scene.gltf', (gltf) => {
    cloudCarObject = gltf.scene;
    cloudCarObject.scale.set(0.5,0.5,0.5);
    cloudCarObject.rotation.set(0, -Math.PI/2,0);
    cloudCarObject.position.set(camera.position.x + 600, camera.position.y - 150, camera.position.z -100);
    cloudCarObject.direction = new THREE.Vector3(0,0,1);
    scene.add(cloudCarObject);
}); 



// Renderer
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



//const controls = new OrbitControls( camera, renderer.domElement );
   

const loader = new THREE.TextureLoader();
const texture = loader.load("imgs/skybox/cloud-city-env.png");

const sphereGeometry = new THREE.SphereGeometry(5000, 60, 40);
const sphereMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
}); 
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

// Camera path
const cameraPathPoints = [
    new THREE.Vector3(-2000, 200, -3000),
    new THREE.Vector3(-1800, 210, -2700),
    new THREE.Vector3(-1600, 220, -2400),
    new THREE.Vector3(-1400, 230, -1800),
    new THREE.Vector3(-1200, 240, -1200),   
    new THREE.Vector3(-1000, 250, -800),
    new THREE.Vector3(-800, 250, -500),
    new THREE.Vector3(-600, 250, -400),
    new THREE.Vector3(-500, 250, -350),
    new THREE.Vector3(-400, 230, -300),
    new THREE.Vector3(-300, 220, -250),
    new THREE.Vector3(-200, 210, -200),
    new THREE.Vector3(-100, 210, -150),
    new THREE.Vector3(-0, 190, -150),
    new THREE.Vector3(50, 180, -175),
    new THREE.Vector3(150, 170, -200),
    new THREE.Vector3(250, 150, -225),
    new THREE.Vector3(350, 130, -250),
    new THREE.Vector3(450, 100, -275),
    new THREE.Vector3(550, 70, -300),
    new THREE.Vector3(650, 40, -350),
    new THREE.Vector3(700, 0, -400),
    new THREE.Vector3(750, -20, -450),
    new THREE.Vector3(800, -40, -500),
    new THREE.Vector3(825, -60, -550),
    new THREE.Vector3(850, -80, -575),
    new THREE.Vector3(875, -100, -600),
    new THREE.Vector3(925, -120, -650),
    new THREE.Vector3(950, -140, -700),
    new THREE.Vector3(1000, -160, -800),
    new THREE.Vector3(1050, -180, -900),
    new THREE.Vector3(1100, -200, -1000),
    new THREE.Vector3(1150, -200, -1200),
    new THREE.Vector3(1175, -200, -1300),
    new THREE.Vector3(1200, -190, -1400),
    new THREE.Vector3(1200, -180, -1500),
    new THREE.Vector3(1175, -170, -1600),
    new THREE.Vector3(1150, -150, -1700),
    new THREE.Vector3(1125, -130, -1800),
    new THREE.Vector3(1100, -100, -1900),
    new THREE.Vector3(1075, -50, -2000),
    new THREE.Vector3(1050, 0, -2100),
    new THREE.Vector3(1000, 50, -2200),
    new THREE.Vector3(950, 125, -2300),
    new THREE.Vector3(900, 200, -2400),
    new THREE.Vector3(850, 250, -2500),
    new THREE.Vector3(800, 300, -2600),
    new THREE.Vector3(725, 350, -2675),
    new THREE.Vector3(650, 400, -2750),
    new THREE.Vector3(550, 450, -2825),
    new THREE.Vector3(450, 500, -2900),
    new THREE.Vector3(350, 550, -2950),
    new THREE.Vector3(250, 600, -3000),
    new THREE.Vector3(150, 650, -3050),
    new THREE.Vector3(50, 700, -3100),
    new THREE.Vector3(-2000, 200, -3000),
];

//(200, -100, -1200);


const cameraPath = new THREE.CatmullRomCurve3(cameraPathPoints); 

const pathPoints = cameraPath.getPoints(50);
const pathGeometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
const pathMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
const pathLine = new THREE.Line(pathGeometry, pathMaterial);
scene.add(pathLine);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onresize = onWindowResize;

animate();

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    cloudCarObject = animationUtils.animateCloudCar(cloudCarObject, camera);
    renderer.render(scene, camera);

}


