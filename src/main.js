
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


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
// modelLoader.load('./cloud_city_model/scene.gltf', (gltf) => {
//     cloudCityObject = gltf.scene;
//     cloudCityObject.position.set(200, -100, -1200);
//     cloudCityObject.scale.set(0.05, 0.05, 0.05);
//     scene.add(cloudCityObject);
// });

modelLoader.load('./cloud_car_model/scene.gltf', (gltf) => {
    cloudCarObject = gltf.scene;
    cloudCarObject.scale.set(0.5,0.5,0.5);
    cloudCarObject.rotation.set(0, -Math.PI/2,0);
    cloudCarObject.position.set(camera.position.x + 600, camera.position.y - 150, camera.position.z -100);
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
//sphere.rotateY(3.7 * Math.PI/ 4);
scene.add(sphere);

const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

animate();

// Randomizes position of a ship outside the near plane.
// TODO: Randomize direction of the ship. 
function randomizePosition(){
    const nearPlane = camera.near;
    const randomValueZ = Math.random() * (500-nearPlane)+nearPlane;

    const height = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * randomValueZ;
    const width = height * camera.aspect;
    console.log("Width and height: ", width, " ", height);

    let randomValueX = (Math.random() - 0.5) * (width * 2);
    let randomValueY = (Math.random() - 0.5) * (height * 2); 
    let newPositionX = camera.position.x+randomValueX;
    let newPositionY = camera.position.y+randomValueY;

    //Ensure the ship is not spawning in the same xy-plane as the near plane. 
    while(newPositionX > -width && newPositionX < width && newPositionY > -height && newPositionY < height){
        randomValueX = (Math.random() - 0.5) * (width * 2);
        randomValueY = (Math.random() - 0.5) * (height * 2);
        newPositionX = camera.position.x+randomValueX;
        newPositionY = camera.position.y+randomValueY;
    } 

    return new THREE.Vector3(newPositionX, newPositionY, camera.position.z-100);
}


function animateCloudCar(){
    if(!cloudCarObject){return;}    // Ensure cloudCarObject is defined...
    const previousScale = cloudCarObject.scale;
    const previousPosition = cloudCarObject.position;
    const previousCameraDistance = camera.position.distanceTo(cloudCarObject.position);
    const zVelocity = 4;
    if(cloudCarObject.position.z > 5000){
        console.log("too small...");
        cloudCarObject.scale.set(0.5,0.5,0.5);
        //cloudCarObject.position.set(camera.position.x + 600, camera.position.y - 150, camera.position.z -100);
        const newPosition = randomizePosition();
        console.log(newPosition);
        cloudCarObject.position.set(newPosition.x, newPosition.y, newPosition.z);
        //console.log(cloudCarObject.position);
        return;
    }

    cloudCarObject.position.set(previousPosition.x, previousPosition.y, previousPosition.z+zVelocity);
    const scaleFactor = previousCameraDistance / camera.position.distanceTo(cloudCarObject.position);
    cloudCarObject.scale.set(previousScale.x * scaleFactor, previousScale.y * scaleFactor, previousScale.z * scaleFactor);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    animateCloudCar();
    renderer.render(scene, camera);
}


