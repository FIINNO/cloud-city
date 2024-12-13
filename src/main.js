
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


// Scene setup
const scene = new THREE.Scene();

// Camera
let camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 45, 30000);
camera.position.set(1200, -250, 4000);


// Lightning
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);


// Model loader

const modelLoader = new GLTFLoader().setPath('./models/cloud_city_model/');
modelLoader.load('scene.gltf', (gltf) => {
    const mesh = gltf.scene;
    mesh.position.set(1000.0, 0.0, -1000.0);
    mesh.scale.set(0.2,0.2,0.2);
    scene.add(mesh);
});

// Renderer
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls( camera, renderer.domElement );

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("imgs/skybox/cloud-city2_upscaled.png");

const sphereGeometry = new THREE.SphereGeometry(5000, 60, 40);
const sphereMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    overdraw: 0.5
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

animate();



// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    renderer.render(scene, camera);
}


