import * as THREE from 'three'; 

export class Camera {
    constructor() {
        this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 45, 30000);
        this.camera.position.set(-2000, 200, -3000);
        this.camera.lookAt(0, 0, 0);

        this.cameraPathPoints = [
            new THREE.Vector3(-2000, 200, -3000),
            new THREE.Vector3(-1800, 210, -2700),
            new THREE.Vector3(-1600, 220, -2400),
            new THREE.Vector3(-1400, 230, -1800),
            new THREE.Vector3(-1200, 240, -1200),   
            new THREE.Vector3(-1000, 250, -1000),
        ];

        this.cameraPath = new THREE.CatmullRomCurve3(this.cameraPathPoints);
        this.startLookAt = new THREE.Vector3(0, 0, 0);
        this.targetLookAt = new THREE.Vector3(200, 0, -1200);


        this.scrollProgress = 0;
        let scrollProgressElement = document.getElementById('scroll-progress');

        window.addEventListener('scroll', () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            this.scrollProgress = window.scrollY / maxScroll;
            scrollProgressElement.innerText = "Scroll Progress: " + this.scrollProgress.toFixed(2);
            this.update();
        });
    }

    update() {
        const pointOnCurve = this.cameraPath.getPointAt(this.scrollProgress);
        this.camera.position.copy(pointOnCurve);
        const currentLookAt = new THREE.Vector3().lerpVectors(
            this.startLookAt,
            this.targetLookAt,
            Math.min(this.scrollProgress * 2, 1)
        );
        this.camera.lookAt(currentLookAt);
    }

    getInstance() {
        return this.camera;
    }

}