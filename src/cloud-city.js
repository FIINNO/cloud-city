import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class CloudCity {
    constructor(model) {
        this.cloudCityObject = model.clone();
    }

    getInstance() {
        return this.cloudCityObject;
    }
} 