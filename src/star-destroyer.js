import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


export class StarDestroyer{
    constructor(model){
        this.starDestroyerObject = model.clone();
        this.travelDistance = 0;    
        this.anchorPathPoints;
        this.path;
        this.pathPoints;
        this.animationToggled = false;
    }

    toggleAnimation(){
        this.animationToggled = true;
    }

    hasAnimation(){
        return this.animationToggled;
    }


    update(){
        if(!this.path || !this.animationToggled){return;}
        if(this.travelDistance<this.pathPoints.length){
            const pointOnCurve = this.pathPoints[this.travelDistance];
            this.starDestroyerObject.position.copy(pointOnCurve);
        }
        else{
            this.animationToggled = false;
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
        if(this.starDestroyerObject.position.distanceTo(new THREE.Vector3(0,0,0))>4400){
            const scaleFactor = 0.99;
            this.starDestroyerObject.scale.set(this.starDestroyerObject.scale.x*scaleFactor, this.starDestroyerObject.scale.y*scaleFactor, this.starDestroyerObject.scale.z*scaleFactor);
        }        
        if(!this.animationToggled){
            this.starDestroyerObject.visible = false;
            return;
        }
        this.travelDistance += 1;
    }

    setPath(anchorPathPoints){
        this.starDestroyerObject.visible = true;
        this.starDestroyerObject.scale.set(20,20,20);
        this.anchorPathPoints = anchorPathPoints;
        this.path = new THREE.CatmullRomCurve3(this.anchorPathPoints);
        this.pathPoints = this.path.getPoints(3600);
    }


    getInstance(){
        return this.starDestroyerObject;
    }
}