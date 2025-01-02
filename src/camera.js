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
            new THREE.Vector3(-1000, 250, -800),
            new THREE.Vector3(-800, 250, -500),
            new THREE.Vector3(-600, 250, -400),
            new THREE.Vector3(-500, 250, -350),
            new THREE.Vector3(-400, 230, -300),
            new THREE.Vector3(-300, 220, -250),
            new THREE.Vector3(-200, 210, -200),
            new THREE.Vector3(-100, 210, -150),
            new THREE.Vector3(-0, 190, -150),
            new THREE.Vector3(50, 180, -175),
            new THREE.Vector3(150, 170, -200),
            new THREE.Vector3(250, 150, -225),
            new THREE.Vector3(350, 130, -250),
            new THREE.Vector3(450, 100, -275),
            new THREE.Vector3(550, 70, -300),
            new THREE.Vector3(650, 40, -350),
            new THREE.Vector3(700, 0, -400),
            new THREE.Vector3(750, -20, -450),
            new THREE.Vector3(800, -40, -500),
            new THREE.Vector3(825, -60, -550),
            new THREE.Vector3(850, -80, -575),
            new THREE.Vector3(875, -100, -600),
            new THREE.Vector3(925, -120, -650),
            new THREE.Vector3(950, -140, -700),
            new THREE.Vector3(1000, -160, -800),
            new THREE.Vector3(1050, -180, -900),
            new THREE.Vector3(1100, -200, -1000),
            new THREE.Vector3(1150, -200, -1200),
            new THREE.Vector3(1175, -200, -1300),
            new THREE.Vector3(1200, -190, -1400),
            new THREE.Vector3(1200, -180, -1500),
            new THREE.Vector3(1175, -170, -1600),
            new THREE.Vector3(1150, -150, -1700),
            new THREE.Vector3(1125, -130, -1800),
            new THREE.Vector3(1100, -100, -1900),
            new THREE.Vector3(1075, -50, -2000),
            new THREE.Vector3(1050, 0, -2100),
            new THREE.Vector3(1000, 50, -2200),
            new THREE.Vector3(950, 125, -2300),
            new THREE.Vector3(900, 200, -2400),
            new THREE.Vector3(850, 250, -2500),
            new THREE.Vector3(800, 300, -2600),
            new THREE.Vector3(725, 350, -2675),
            new THREE.Vector3(650, 400, -2750),
            new THREE.Vector3(550, 450, -2825),
            new THREE.Vector3(450, 500, -2900),
            new THREE.Vector3(350, 550, -2950),
            new THREE.Vector3(250, 600, -3000),
            new THREE.Vector3(150, 650, -3050),
            new THREE.Vector3(50, 700, -3100),
            new THREE.Vector3(-2000, 200, -3000),
        ];

        this.initialAnimationPoints = [
            new THREE.Vector3(-3000, 400, -2000),
            new THREE.Vector3(-2500, 300, -2500),
            new THREE.Vector3(-2250, 250, -2750),
            new THREE.Vector3(-2000, 200, -3000),
        ]

        this.initialAnimationActive = false;
        this.initialAnimationProgress = 0;
        this.elapsedTime = 0;
        this.initialAnimationDuration = 5;
        this.easingFunction = (t) => t * (2 - t);


        this.initialPath = new THREE.CatmullRomCurve3(this.initialAnimationPoints);
        this.initialStartLookAt = new THREE.Vector3(-4500, 400, -3000);
        this.initialTargetLookAt = new THREE.Vector3(0, 0, 0);

        this.cameraPath = new THREE.CatmullRomCurve3(this.cameraPathPoints);
        this.startLookAt = this.initialTargetLookAt;
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

    startInitialAnimation() {
        this.initialAnimationActive = true;
        console.log("Starting");
        this.camera.lookAt(-4500, 400, -3000);
        this.initialAnimation();
    }

    initialAnimation() {

        if(!this.initialAnimationActive) { return; }

        this.elapsedTime += 1 / 60;
        this.initialAnimationProgress = Math.min(this.elapsedTime / this.initialAnimationDuration, 1)

        const easedProgress = this.easingFunction(Math.min(this.initialAnimationProgress, 1));

        const pointOnCurve = this.initialPath.getPointAt(easedProgress);
        this.camera.position.copy(pointOnCurve);

        const currentLookAt = new THREE.Vector3().lerpVectors(
            this.initialStartLookAt,
            this.initialTargetLookAt,
            easedProgress
        );

        this.camera.lookAt(currentLookAt);
    
        if(this.initialAnimationProgress >= 1) {
            this.initialAnimationActive = false;
            return;
        }
        requestAnimationFrame(() => this.initialAnimation());
    }

    

    getInstance() {
        return this.camera;
    }

}