
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as animationUtils from './animation-utils.js'


// Scene setup
const scene = new THREE.Scene();

// Camera
let camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 45, 30000);
camera.position.set(-2000, 200, -3000);


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

const modelLoader = new GLTFLoader().setPath('./models/');
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

const controls = new OrbitControls( camera, renderer.domElement );

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

animate();

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    cloudCarObject = animationUtils.animateCloudCar(cloudCarObject, camera);
    renderer.render(scene, camera);
}


