import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { Environment } from './Environment.js';
import { Herd } from './Herd.js';

export class World {
    constructor() {
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);

        // Setup Scene
        this.scene = new THREE.Scene();
        
        // Setup Camera
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.camera.position.set(60, 20, 60); // Side/Rear view
        this.camera.lookAt(0, 0, -50);

        // Setup Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;

        // Setup Clock
        this.clock = new THREE.Clock();

        // Setup GUI
        this.gui = new GUI();
        
        // Resize Event
        window.addEventListener('resize', () => this.onResize());

        // Setup Controls
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent going under ground
        this.controls.minDistance = 10;
        this.controls.maxDistance = 200;
        this.controls.target.set(0, 0, -20); // Look slightly ahead

        // Initialize Components
        this.environment = new Environment(this.scene, this.gui);
        this.herd = new Herd(this.scene, this.gui);
    }

    start() {
        this.renderer.setAnimationLoop(() => this.update());
    }

    update() {
        const deltaTime = this.clock.getDelta();
        const elapsedTime = this.clock.getElapsedTime();

        this.herd.update(deltaTime, elapsedTime);
        this.environment.update(deltaTime, elapsedTime);
        
        // Cinematic slow drift if user isn't interacting heavily
        // (Just updating controls handles damping)
        this.controls.update();

        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
}