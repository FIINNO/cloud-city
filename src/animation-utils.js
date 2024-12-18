import * as THREE from 'three';


function updateCloudCarPosition(cloudCarObject, camera){
    console.log("too small...");
    cloudCarObject.scale.set(0.5,0.5,0.5);
    

    const nearPlane = camera.near;
    const randomValueZ = Math.random() * (500-nearPlane+100)+nearPlane+100;

    const height = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * randomValueZ;
    const width = height * camera.aspect;
    console.log("Width and height: ", width, " ", height);
    console.log("Camera position: ", camera.position);

    let randomValueX = (Math.random() - 0.5) * (width * 2);
    let randomValueY = (Math.random() - 0.5) * (height * 2); 
    let newPositionX = camera.position.x+randomValueX;
    let newPositionY = camera.position.y+randomValueY;

    // Spacing to the camera near plane.
    const widthOffset = width*0.4;
    const heightOffset = height*0.4;

    //Ensure the ship is not spawning in the close area of the xy-plane as the near plane. 
    while(newPositionX > (-width-widthOffset) && newPositionX < (width+widthOffset) && newPositionY > (-height-heightOffset) && newPositionY < (height+heightOffset)){
        randomValueX = (Math.random() - 0.5) * (width * 2);
        randomValueY = (Math.random() - 0.5) * (height * 2);
        newPositionX = camera.position.x+randomValueX;
        newPositionY = camera.position.y+randomValueY;
    }

    let randomPosition = new THREE.Vector3(newPositionX, newPositionY, 0);
    console.log(randomPosition);
    // Cloud car travels in from the right
    if(randomPosition.x<camera.position.x){
        console.log(cloudCarObject.rotation);
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


export function animateCloudCar(cloudCarObject, camera){
    if(!cloudCarObject){return;}    // Ensure cloudCarObject is defined...
    const previousScale = cloudCarObject.scale;
    const previousCameraDistance = camera.position.distanceTo(cloudCarObject.position);
    const velocity = 4;
    if(cloudCarObject.position.distanceTo(new THREE.Vector3(0,0,0))>4500){
        cloudCarObject = updateCloudCarPosition(cloudCarObject, camera);
        return cloudCarObject;
    }

    const direction = cloudCarObject.direction.clone();
    const movement = direction.multiplyScalar(velocity);
    cloudCarObject.position.add(movement);

    // Scale the cloud car with respect of its distance to the camera. 
    const scaleFactor = previousCameraDistance / camera.position.distanceTo(cloudCarObject.position);
    cloudCarObject.scale.set(previousScale.x * scaleFactor, previousScale.y * scaleFactor, previousScale.z * scaleFactor);
    return cloudCarObject;
}