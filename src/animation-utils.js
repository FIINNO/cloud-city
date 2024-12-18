import * as THREE from 'three';


export function randomCloudCarPosition(cloudCarObject, camera){
    cloudCarObject.scale.set(0.5,0.5,0.5);
    

    const nearPlane = camera.near;
    const randomValueZ = Math.random() * (600-nearPlane+200)+nearPlane+200;

    const height = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * randomValueZ;
    const width = height * camera.aspect;
    console.log("Width and height: ", width, " ", height);
    console.log("Camera position: ", camera.position);

    let randomValueX = (Math.random() - 0.5) * (width * 3);
    let randomValueY = (Math.random() - 0.5) * (height * 2); 
    let newPositionX = camera.position.x+randomValueX;
    let newPositionY = camera.position.y+randomValueY;

    // Spacing to the camera near plane.
    const widthOffset = width*0.8;
    const heightOffset = height*0.8;

    //Ensure the ship is not spawning in the close area of the xy-plane as the near plane. 
    while(newPositionX > (-width-widthOffset) && newPositionX < (width+widthOffset) && newPositionY > (-height-heightOffset) && newPositionY < (height+heightOffset)){
        randomValueX = (Math.random() - 0.5) * (width * 3);
        randomValueY = (Math.random() - 0.5) * (height * 2);
        newPositionX = camera.position.x+randomValueX;
        newPositionY = camera.position.y+randomValueY;
    }

    let randomPosition = new THREE.Vector3(newPositionX, newPositionY, 0);
    // Cloud car travels in from the right
    if(randomPosition.x<camera.position.x){
        cloudCarObject.direction = new THREE.Vector3(1,0,0);
        randomPosition.z = camera.position.z + camera.near + (Math.random() * 600 + 300);
        cloudCarObject.rotation.set(0, 0, 0);
    }
    // Cloud car travels in from behind 
    else{
        cloudCarObject.direction = new THREE.Vector3(0,0,1);
        randomPosition.z = camera.position.z + camera.near - 100;
        cloudCarObject.rotation.set(0, -Math.PI/2,0);
    }
    cloudCarObject.position.set(randomPosition.x, randomPosition.y, randomPosition.z);
    return cloudCarObject;
}



export function animateCloudCars(cloudCarObjects, camera){
    if(!cloudCarObjects){return;}    // Ensure cloudCarObject is defined...
    for(let i = 0; i<cloudCarObjects.length;++i){
        if(!cloudCarObjects[i] || !cloudCarObjects[i].visible){continue;}
        const previousScale = cloudCarObjects[i].scale;
        const previousCameraDistance = camera.position.distanceTo(cloudCarObjects[i].position);
        const velocity = 4;
        if(cloudCarObjects[i].position.distanceTo(new THREE.Vector3(0,0,0))>4500){
            cloudCarObjects[i] = randomCloudCarPosition(cloudCarObjects[i], camera);
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



export function addCloudCar(cloudCarObjects){
    if(!cloudCarObjects){return;}
    for(let i = 0; i<cloudCarObjects.length;++i){
        if(!cloudCarObjects[i]){continue;}

        if(!cloudCarObjects[i].visible){
            cloudCarObjects[i].visible = true;
            console.log("Visible");
            return cloudCarObjects;
        }
    }
    return cloudCarObjects;
}