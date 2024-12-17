
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as animationUtils from './animation-utils.js'


// Scene setup
const scene = new THREE.Scene();

// Camera
let camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 45, 10000);
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
var cloudCarObjects = [];

var modelLoader = new GLTFLoader().setPath('./models/');
modelLoader.load('./cloud_city_model/scene.gltf', (gltf) => {
    cloudCityObject = gltf.scene;
    cloudCityObject.position.set(200, -100, -1200);
    cloudCityObject.scale.set(0.05, 0.05, 0.05);
    scene.add(cloudCityObject);
});

addCloudCar();


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
}


