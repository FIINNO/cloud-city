import * as THREE from 'three'; 
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class CloudCity {
    constructor(loadingManager, scene) {
        this.position = new THREE.Vector3(200, -100, -1200);
        this.scale = new THREE.Vector3(0.05, 0.05, 0.05);
        
        this.modelLoader = new GLTFLoader(loadingManager).setPath('./models/');
        this.modelLoader.load('./cloud_city_model/scene.gltf', (gltf) => {
            this.cloudCityObject = gltf.scene;
            this.cloudCityObject.position.set(this.position);
            this.cloudCityObject.scale.set(this.scale);
            scene.add(this.cloudCityObject);
        });
    }

    getPosition() {
        return this.position;
    }

    getInstance() {
        this.cloudCityObject;
    }
} 