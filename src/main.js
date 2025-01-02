
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Camera } from "./camera.js";
import { CloudCity } from './cloud-city.js';
import * as animationUtils from './animation-utils.js'


// Scene setup
const scene = new THREE.Scene();

// Camera
const cameraController = new Camera();
const camera = cameraController.getInstance();
scene.add(camera);

const loadingScreen = document.getElementById('loading-screen');
const loadingBar = document.getElementById('loading-bar');


// Lightning
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 6.0);
sunLight.position.set(-3500,1000.0,5000);
sunLight.castShadow = true;
scene.add(sunLight);

const sunHelper = new THREE.DirectionalLightHelper(sunLight, 100);
scene.add(sunHelper);


const loadingManager = new THREE.LoadingManager();

loadingManager.onProgress = (url, loaded, total) => {
    const progress = (loaded / total) * 100;
    loadingBar.style.width = `${progress}%`;
}

loadingManager.onLoad = () => {
    loadingScreen.style.display = 'none';
    cameraController.startInitialAnimation();
}


// Model loader


var cloudCarObject; 


const modelLoader = new GLTFLoader(loadingManager).setPath('./models/');

modelLoader.load('./cloud_city_model/scene.gltf', (gltf) => {
    cloudCityModel = gltf.scene;
    cloudCityModel.position.set(200, -100, -1200);
    cloudCityModel.scale.set(0.05, 0.05, 0.05);
    cloudCityModel.name = 'cloud_city';
    scene.add(cloudCityModel);
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
    
    /*const cameraPath = new THREE.CatmullRomCurve3(initialCamPoints); 
    
    const pathPoints = cameraPath.getPoints(50);
    const pathGeometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
    const pathMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const pathLine = new THREE.Line(pathGeometry, pathMaterial);
    scene.add(pathLine); */
    
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onresize = onWindowResize;

// Animation loop
let lastTime = performance.now();
function animate() {
    cloudCarObject = animationUtils.animateCloudCar(cloudCarObject, camera);
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    cameraController.initialAnimation(deltaTime);
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
    
}
animate();



