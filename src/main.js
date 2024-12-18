
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Camera } from "./camera.js";
import * as animationUtils from './animation-utils.js'


// Scene setup
const scene = new THREE.Scene();

// Camera
<<<<<<< HEAD
let camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 45, 10000);
camera.position.set(-2000, 200, -3000);
=======
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
>>>>>>> origin/main


// Lightning
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 5.0);
sunLight.position.set(-3500,1000.0,5000);
sunLight.castShadow = true;
scene.add(sunLight);

const sunHelper = new THREE.DirectionalLightHelper(sunLight, 100);
scene.add(sunHelper);


// Model loader

var cloudCityObject;
var cloudCarObject; 
var cloudCarObjects = [];

<<<<<<< HEAD
var modelLoader = new GLTFLoader().setPath('./models/');
=======
const modelLoader = new GLTFLoader(loadingManager).setPath('./models/');
>>>>>>> origin/main
modelLoader.load('./cloud_city_model/scene.gltf', (gltf) => {
    cloudCityObject = gltf.scene;
    cloudCityObject.position.set(200, -100, -1200);
    cloudCityObject.scale.set(0.05, 0.05, 0.05);
    scene.add(cloudCityObject);
});

<<<<<<< HEAD
addCloudCar();
=======
modelLoader.load('./cloud_car_model/scene.gltf', (gltf) => {
    cloudCarObject = gltf.scene;
    cloudCarObject.scale.set(0.5,0.5,0.5);
    cloudCarObject.rotation.set(0, -Math.PI/2,0);
    cloudCarObject.position.set(camera.position.x + 600, camera.position.y - 150, camera.position.z -100);
    cloudCarObject.direction = new THREE.Vector3(0,0,1);
    scene.add(cloudCarObject);
}); 

>>>>>>> origin/main


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
    overdraw: 0.5
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
    new THREE.Vector3(-1000, 250, -1000),
];

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

<<<<<<< HEAD

function addCloudCarEvent(){
    const probability = 1/1000;
    const random = Math.random();
    if(random<probability){
        addCloudCar();
    }
    else{
        return;
    }
}

function addCloudCar(){
    if(cloudCarObjects.length>2){
        return;
    }
    console.log("Adding cloud car");
    modelLoader.load('./cloud_car_model/scene.gltf', (gltf) => {
        let cloudCar = gltf.scene;
        cloudCar = animationUtils.randomCloudCarPosition(cloudCar, camera);
        scene.add(cloudCar);
        cloudCarObjects.push(cloudCar);
        console.log("Current amount of cloud cars is: ", cloudCarObjects.length);
    });
    
}


setInterval(addCloudCar, 6000);


// Animation loop
function animate() {
    //addCloudCarEvent();
    cloudCarObjects = animationUtils.animateCloudCars(cloudCarObjects, camera, scene);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
=======
// Animation loop
function animate() {
    requestAnimationFrame(animate);
    cloudCarObject = animationUtils.animateCloudCar(cloudCarObject, camera);
    renderer.render(scene, camera);

>>>>>>> origin/main
}


