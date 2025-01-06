import * as THREE from 'three';



export function randomCloudCarPosition(cloudCarObject, camera){    
    const randomDirection = Math.random() < 0.5 ? "behind" : "right";
    const nearPlane = camera.near;

    let randomPosition = new THREE.Vector3(0, 0, 0);
    // Cloud car travels in from the right
    if(randomDirection === "right"){
        const randomValueZ = Math.random() * 2000 + 500;
        const heightFar = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * randomValueZ;
        const widthFar = heightFar * camera.aspect;
        const heightNear = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * nearPlane;

        let randomValueX = Math.random() * widthFar + widthFar/2;
        let randomValueY = (Math.random() - 0.5) * heightFar * 0.8;
        let newPositionX = randomValueX;
        let newPositionY = randomValueY;
        
        while(newPositionX < widthFar && newPositionY < (-heightNear*2) && newPositionY > (heightNear*2)){
            randomValueX = Math.random() * widthFar + widthFar/2;
            randomValueY = (Math.random() - 0.5) * heightFar * 0.8;
            newPositionX = randomValueX;
            newPositionY = randomValueY;
        }


        cloudCarObject.direction = new THREE.Vector3(-1,0,0);        
        randomPosition.x = newPositionX;
        randomPosition.y = newPositionY;
        
        randomPosition.z = -Math.max(randomValueZ, nearPlane + 500)

        const initialRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
        cloudCarObject.quaternion.copy(initialRotation);

        const scaleFactor = 0.2*(2000 / Math.max(camera.position.distanceTo(cloudCarObject.position), 3000));
        cloudCarObject.scale.set(scaleFactor,scaleFactor,scaleFactor);
    }
    // Cloud car travels in from behind 
    else{
        const randomValueZ = Math.random() * 400 + nearPlane + 400;
        const heightFar = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * randomValueZ;
        const widthFar = heightFar * camera.aspect;

        let randomValueX = (Math.random() - 0.5) * (widthFar * 3);
        let randomValueY = (Math.random() - 0.5) * (heightFar * 2); 
        let newPositionX = randomValueX;
        let newPositionY = randomValueY;

        while(newPositionX > (-widthFar) && newPositionX < (widthFar) && newPositionY > (-heightFar) && newPositionY < (heightFar)){
            randomValueX = (Math.random() - 0.5) * (widthFar * 3);
            randomValueY = (Math.random() - 0.5) * (heightFar * 2);
            newPositionX = randomValueX;
            newPositionY = randomValueY;
        }
        cloudCarObject.direction = new THREE.Vector3(0,0,-1);
        randomPosition.x = newPositionX;
        randomPosition.y = newPositionY;
        randomPosition.z = camera.near + 100;

        const initialRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI/2);
        cloudCarObject.quaternion.copy(initialRotation);
        cloudCarObject.scale.set(0.3,0.3,0.3);
    }
    
    let localDirection = cloudCarObject.direction.clone();
    let worldDirection = localDirection.clone().applyQuaternion(camera.quaternion).normalize();
    worldDirection.y = 0;
    cloudCarObject.direction = worldDirection;

    // Rotate the object to its world direction.
    const quaternion = new THREE.Quaternion().setFromUnitVectors(localDirection, worldDirection);
    cloudCarObject.quaternion.multiply(quaternion);
   

    const randomWorldPosition = randomPosition.clone();
    camera.localToWorld(randomWorldPosition);
    randomPosition = randomWorldPosition;
    cloudCarObject.position.set(randomPosition.x, randomPosition.y, randomPosition.z);
    return cloudCarObject;
}



export function animateCloudCars(cloudCarObjects, camera, scene){
    const cloudCityObject = scene.getObjectByName('cloud_city');
    if(!cloudCarObjects){return;}    // Ensure cloudCarObject is defined...
    for(let i = 0; i<cloudCarObjects.length;++i){
        const cloudCarInstance = cloudCarObjects[i].getInstance();
        if(!cloudCarInstance || !cloudCarInstance.visible){continue;}
        const previousScale = cloudCarInstance.scale;
        const previousCameraDistance =  camera.position.distanceTo(cloudCarInstance.position);
        const velocity = 4;
        if(cloudCarInstance.position.distanceTo(new THREE.Vector3(0,0,0))>4800 || previousScale.x < 0.01){
            cloudCarInstance.visible = false;
            continue;   
        }

        const direction = cloudCarInstance.direction.clone();
        const movement = direction.multiplyScalar(velocity);
        cloudCarInstance.position.add(movement);

        let scaleFactor;
        if(cloudCarInstance.position.distanceTo(cloudCityObject.position)<1000 || cloudCarInstance.position.distanceTo(cloudCityObject.position)<500){
            scaleFactor = 0.999;
        }
        else{
            scaleFactor = previousCameraDistance / camera.position.distanceTo(cloudCarInstance.position);
        }
        
        cloudCarInstance.scale.set(previousScale.x * scaleFactor, previousScale.y * scaleFactor, previousScale.z * scaleFactor);
    }
    return cloudCarObjects;
}



export function addCloudCar(cloudCarObjects, camera){
    if(!cloudCarObjects){return;}
    for(let i = 0; i<cloudCarObjects.length;++i){
        let cloudCarInstance = cloudCarObjects[i].getInstance();
        if(!cloudCarInstance){continue;}

        if(!cloudCarInstance.visible){
            cloudCarInstance = randomCloudCarPosition(cloudCarInstance, camera);
            cloudCarInstance.visible = true;
            return cloudCarObjects;
        }
    }
    return cloudCarObjects;
}



export function animateStarDestroyer(starDestroyerObject, camera){
    const depth = -2500;
    const heightFar = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * Math.abs(depth);
    const widthFar = heightFar * camera.aspect;
    const startX = -widthFar/2 - 300;
    const startY = heightFar/2;
    const endX = 6000;

    const anchorPathPoints = [];

    let deltaY = 10;
    let y = startY;
    let z = depth;
    for(let i = startX; i<endX;i+=100){
        if(i<0){
            const x = i;
            y -= deltaY;
            const anchorPoint = camera.localToWorld(new THREE.Vector3(x,y,z));
            anchorPathPoints.push(anchorPoint);
        }
        else{
            const x = i
            y += deltaY;
            const anchorPoint = camera.localToWorld(new THREE.Vector3(x,y,z));
            anchorPathPoints.push(anchorPoint);
        }
    }
    const starDestroyerInstance = starDestroyerObject.getInstance();

    starDestroyerInstance.quaternion.set(0, 0, 0, 1);
    starDestroyerInstance.direction = new THREE.Vector3(1,0,0);
    let localDirection = starDestroyerInstance.direction.clone();
    let worldDirection = localDirection.clone().applyQuaternion(camera.quaternion).normalize();
    worldDirection.y = 0;
    starDestroyerInstance.direction = worldDirection;

    // Rotate the object to its world direction.
    const quaternion = new THREE.Quaternion().setFromUnitVectors(localDirection, worldDirection);
    starDestroyerInstance.quaternion.multiply(quaternion);
    starDestroyerObject.setPath(anchorPathPoints);
}