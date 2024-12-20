import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


export class CloudCar{
    constructor(model){
        this.cloudCarObject = model.clone();
    }

    getInstance(){
        return this.cloudCarObject;
    }
}