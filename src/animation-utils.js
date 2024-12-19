import * as THREE from 'three';



export function randomCloudCarPosition(cloudCarObject, camera, scene){
    cloudCarObject.scale.set(0.5,0.5,0.5);
    const cloudCityObject = scene.getObjectByName('cloud_city');
    
    const randomDirection = Math.random() < 0.5 ? "behind" : "right";
    console.log("Direction: ", randomDirection);
    const nearPlane = camera.near;

    console.log("Camera position: ", camera.position);

    let randomPosition = new THREE.Vector3(0, 0, 0);
    // Cloud car travels in from the right
    if(randomDirection === "right"){
        const randomValueZ = Math.random() * 2000 + 500;
        const heightFar = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * randomValueZ;
        const widthFar = heightFar * camera.aspect;
        const heightNear = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * nearPlane;
        console.log("Width far: ", widthFar);
        console.log("From the right...");
        
        // TODO: Scale by distance from camera. 

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
        console.log("Z from the right: ", randomPosition.z);
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
    }
    
    // TODO: Update the rotation of the cloud cars. Seems like they need rotation with pi/2
    // TODO: Fix the y-position of cars coming in from the right. Maybe split up isPositionValid or even better, pass the offsets in the separate if-else above. For cars coming in to the right the height should be inside the viewPlane? 
    let localDirection = cloudCarObject.direction.clone();
    const worldDirection = localDirection.clone().applyQuaternion(camera.quaternion).normalize();
    cloudCarObject.direction = worldDirection;

    const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,-1), worldDirection);
    cloudCarObject.quaternion.copy(quaternion);

    console.log(worldDirection, cloudCarObject.direction);
    

    const randomWorldPosition = randomPosition.clone();
    console.log("Local pos:", randomWorldPosition);
    camera.localToWorld(randomWorldPosition);
    console.log("World pos:", randomWorldPosition);
    randomPosition = randomWorldPosition;
    cloudCarObject.position.set(randomPosition.x, randomPosition.y, randomPosition.z);
    console.log("Cloud car position: ", cloudCarObject.position);
    return cloudCarObject;
}



export function animateCloudCars(cloudCarObjects, camera, scene){
    const cloudCityObject = scene.getObjectByName('cloud_city');
    if(!cloudCarObjects){return;}    // Ensure cloudCarObject is defined...
    for(let i = 0; i<cloudCarObjects.length;++i){
        if(!cloudCarObjects[i] || !cloudCarObjects[i].visible){continue;}
        const previousScale = cloudCarObjects[i].scale;
        const previousCameraDistance = camera.position.distanceTo(cloudCarObjects[i].position);
        const velocity = 4;
        if(cloudCarObjects[i].position.distanceTo(new THREE.Vector3(0,0,0))>4500){
            cloudCarObjects[i].visible = false;
            continue;
        }

        const direction = cloudCarObjects[i].direction.clone();
        const movement = direction.multiplyScalar(velocity);
        cloudCarObjects[i].position.add(movement);

        // Scale the cloud car with respect of its distance to the camera. 
        const scaleFactor = previousCameraDistance / camera.position.distanceTo(cloudCarObjects[i].position);
        cloudCarObjects[i].scale.set(previousScale.x * scaleFactor, previousScale.y * scaleFactor, previousScale.z * scaleFactor);
    }
    return cloudCarObjects;
}



export function addCloudCar(cloudCarObjects, camera, scene){
    if(!cloudCarObjects){return;}
    for(let i = 0; i<cloudCarObjects.length;++i){
        if(!cloudCarObjects[i]){continue;}

        if(!cloudCarObjects[i].visible){
            cloudCarObjects[i] = randomCloudCarPosition(cloudCarObjects[i], camera, scene);
            cloudCarObjects[i].visible = true;
            console.log("Visible");
            return cloudCarObjects;
        }
    }
    return cloudCarObjects;
}