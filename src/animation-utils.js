import * as THREE from 'three';


function randomizePosition(camera){
    const nearPlane = camera.near;
    const randomValueZ = Math.random() * (500-nearPlane)+nearPlane;

    const height = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * randomValueZ;
    const width = height * camera.aspect;
    console.log("Width and height: ", width, " ", height);

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

    return new THREE.Vector3(newPositionX, newPositionY, camera.position.z-100);
}


export function animateCloudCar(cloudCarObject, camera){
    if(!cloudCarObject){return;}    // Ensure cloudCarObject is defined...
    const previousScale = cloudCarObject.scale;
    const previousPosition = cloudCarObject.position;
    const previousCameraDistance = camera.position.distanceTo(cloudCarObject.position);
    const zVelocity = 4;
    if(cloudCarObject.position.z > 5000){
        console.log("too small...");
        cloudCarObject.scale.set(0.5,0.5,0.5);
        //cloudCarObject.position.set(camera.position.x + 600, camera.position.y - 150, camera.position.z -100);
        const newPosition = randomizePosition(camera);
        console.log(newPosition);
        cloudCarObject.position.set(newPosition.x, newPosition.y, newPosition.z);
        //console.log(cloudCarObject.position);
        return cloudCarObject;
    }

    cloudCarObject.position.set(previousPosition.x, previousPosition.y, previousPosition.z+zVelocity);
    const scaleFactor = previousCameraDistance / camera.position.distanceTo(cloudCarObject.position);
    cloudCarObject.scale.set(previousScale.x * scaleFactor, previousScale.y * scaleFactor, previousScale.z * scaleFactor);
    return cloudCarObject;
}