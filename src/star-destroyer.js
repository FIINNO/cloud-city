import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


export class StarDestroyer{
    constructor(loadingManager){
        this.modelLoader = new GLTFLoader(loadingManager).setPath('./models/');
        this.modelLoader.load('./star_destroyer_model/scene.gltf', (gltf) => {
            this.starDestroyerObject = gltf.scene;
            this.starDestroyerObject.scale.set(20,20,20);
            //this.starDestroyerObject.rotation.set(0,-Math.PI/2,0);
            this.starDestroyerObject.visible = false;
        });


        // this.anchorPathPoints = [
        //     new THREE.Vector3(1000,800,-2000),
        //     new THREE.Vector3(1000,700, -1700),
        //     new THREE.Vector3(1000,600, -1500),
        //     new THREE.Vector3(1000,500, -1200),
        //     new THREE.Vector3(1000,400,-1000),
        //     new THREE.Vector3(1000,300,-800),
        // ];

        // this.path = new THREE.CatmullRomCurve3(this.anchorPathPoints);
        // this.pathPoints = this.path.getPoints(3600);
        this.travelDistance = 0;    
        this.anchorPathPoints;
        this.path;
        this.pathPoints;
    }


    update(){
        if(!this.path){return;}
        this.travelDistance += 1;
        if(this.travelDistance<this.pathPoints.length){
            const pointOnCurve = this.pathPoints[this.travelDistance];
            this.starDestroyerObject.position.copy(pointOnCurve);
        }
        else{
            this.travelDistance = 0;
            const pointOnCurve = this.pathPoints[this.travelDistance];
            this.starDestroyerObject.position.copy(pointOnCurve);
        }
    }

    setPath(anchorPathPoints){
        this.starDestroyerObject.visible = true;
        this.anchorPathPoints = anchorPathPoints;
        this.path = new THREE.CatmullRomCurve3(this.anchorPathPoints);
        this.pathPoints = this.path.getPoints(3600);
    }


    getInstance(){
        return this.starDestroyerObject;
    }
}