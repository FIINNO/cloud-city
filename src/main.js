import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Camera } from "./camera.js";
import { CloudCity } from './cloud-city.js';
import * as animationUtils from './animation-utils.js'
import { StarDestroyer } from './star-destroyer.js';
import { CloudCar } from './cloud-car.js';
import { computeMikkTSpaceTangents } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Scene setup
const scene = new THREE.Scene();

// Camera
const cameraController = new Camera();
const camera = cameraController.getInstance();
scene.add(camera);


const loadingScreen = document.getElementById('loading-screen');
const loadingBar = document.getElementById('loading-bar');

const loadingManager = new THREE.LoadingManager();

var cloudCityObject;
var cloudCityInstance;
var cloudCarObjects = new Array(3);
var starDestroyerObject;
var starDestroyerInstance;


// Lightning
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 6.0);
sunLight.position.set(-3500,1000.0,5000);
sunLight.castShadow = true;
scene.add(sunLight);

//const sunHelper = new THREE.DirectionalLightHelper(sunLight, 100);
//scene.add(sunHelper);



loadingManager.onProgress = (url, loaded, total) => {
    const progress = (loaded / total) * 100;
    loadingBar.style.width = `${progress}%`;
}


// Model loader

var cloudCityModel;
var cloudCarModel;
var starDestroyerModel;

const modelLoader = new GLTFLoader(loadingManager).setPath('./models/');

modelLoader.load('./cloud_city_model/scene.gltf', (gltf) => {
    cloudCityModel = gltf.scene;
    cloudCityModel.position.set(200, -100, -1200);
    cloudCityModel.scale.set(0.05, 0.05, 0.05);
    cloudCityModel.name = 'cloud_city';
});


modelLoader.load('./cloud_car_model/scene.gltf', (gltf) => {
    cloudCarModel = gltf.scene;
});

modelLoader.load('./star_destroyer_model/scene.gltf', (gltf) => {
    starDestroyerModel = gltf.scene;
    starDestroyerModel.scale.set(20,20,20);
    //this.starDestroyerObject.rotation.set(0,-Math.PI/2,0);
    starDestroyerModel.visible = false;
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

//const axesHelper = new THREE.AxesHelper(100);
//scene.add(axesHelper);



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onresize = onWindowResize;


loadingManager.onProgress = (url, loaded, total) => {
    const progress = (loaded / total) * 100;
    loadingBar.style.width = `${progress}%`;
}

let textLayer = document.getElementById('text-layer');
let controlMenuBtn = document.getElementById('control-menu-btn');


loadingManager.onLoad = () => {
    cloudCityObject = new CloudCity(cloudCityModel);
    cloudCityInstance = cloudCityObject.getInstance();
    scene.add(cloudCityInstance);
    starDestroyerObject = new StarDestroyer(starDestroyerModel);
    starDestroyerInstance = starDestroyerObject.getInstance();
    scene.add(starDestroyerInstance);

    for(let i = 0; i<cloudCarObjects.length; ++i){
        const cloudCarObject = new CloudCar(cloudCarModel);
        let cloudCarInstance = cloudCarObject.getInstance();
        cloudCarInstance = animationUtils.randomCloudCarPosition(cloudCarInstance, camera, scene);
        if(i==0){
            cloudCarInstance.position.set(0,0,0);
            cloudCarInstance.visible = true;
        }else{
            cloudCarInstance.visible = false;
        }
        scene.add(cloudCarInstance);
        cloudCarObjects[i] = cloudCarObject;
    }

    
    loadingScreen.style.display = 'none';
    
    renderer.compile(scene, camera);
    renderer.render(scene, camera);
    cameraController.startInitialAnimation();
    setTimeout( () => {
        textLayer.style.opacity = '1';
        textLayer.style.transition = 'opacity 0.5s ease';
        
        controlMenuBtn.style.opacity = '1';
        controlMenuBtn.style.transition = 'opacity 0.5s ease';
    }, 5000);
    startInterval();
    let cloudCarInstance = cloudCarObjects[0].getInstance();
    cloudCarInstance.visible = false;
    cameraController.startInitialAnimation();
    cloudCarInstance = animationUtils.randomCloudCarPosition(cloudCarInstance, camera, scene);
    animate();
}


const startInterval = () => {
    const intervalID = setInterval(() => {
        cloudCarObjects = animationUtils.addCloudCar(cloudCarObjects, camera, scene);
    }, 10000);
};


const toggleSunLightBtn = document.getElementById("toggle-sunlight");
const toggleAmbientLightBtn = document.getElementById("toggle-ambient-light");
const toggleCamAnimBtn = document.getElementById("toggle-cam-animation");
const toggleStarDestroyerBtn = document.getElementById("toggle-star-destroyer");

toggleSunLightBtn.addEventListener("click", () => {
    sunLight.visible = !sunLight.visible;
});
toggleAmbientLightBtn.addEventListener("click", () => {
    ambientLight.visible = !ambientLight.visible;
});
toggleStarDestroyerBtn.addEventListener("click", () => {
    if(!starDestroyerObject.hasAnimation()){
        console.log("Calling in star destroyer...");
        starDestroyerObject.toggleAnimation();
        animationUtils.animateStarDestroyer(starDestroyerObject, camera);
    }    
});

toggleCamAnimBtn.addEventListener("click", () => {
    cameraController.toggleAnimation();
});

document.addEventListener("keydown", (e) => {
    if(e.code == "Space") {
        e.preventDefault();
        cameraController.toggleAnimation();
    }
});



// Animation loop
function animate() {
    
    cloudCarObjects = animationUtils.animateCloudCars(cloudCarObjects, camera, scene);
    starDestroyerObject.update();
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
    
}



