import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


export class StarDestroyer{
    constructor(model){
        this.starDestroyerObject = model.clone();


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
        if(this.travelDistance<this.pathPoints.length){
            const pointOnCurve = this.pathPoints[this.travelDistance];
            this.starDestroyerObject.position.copy(pointOnCurve);
        }
        else{
            this.travelDistance = 0;
            const pointOnCurve = this.pathPoints[this.travelDistance];
            this.starDestroyerObject.position.copy(pointOnCurve);
        }
        if(this.travelDistance + 1 < this.pathPoints.length){
            const newDirection = new THREE.Vector3();
            newDirection.subVectors(this.pathPoints[this.travelDistance+1], this.pathPoints[this.travelDistance]).normalize();
            newDirection.y = 0;
            const quaternion = new THREE.Quaternion().setFromUnitVectors(this.starDestroyerObject.direction.normalize(), newDirection);
            this.starDestroyerObject.quaternion.multiply(quaternion);
            this.starDestroyerObject.direction = newDirection;
        }       
        this.travelDistance += 1;
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