import * as THREE from 'three';

export class Environment {
    constructor(scene, gui) {
        this.scene = scene;
        this.gui = gui;

        this.setupLighting();
        this.setupGround();
        this.setupSky();
        this.setupDust();
    }

    setupDust() {
        const dustCount = 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(dustCount * 3);
        
        for(let i=0; i<dustCount; i++) {
            positions[i*3] = (Math.random() - 0.5) * 800;
            positions[i*3+1] = Math.random() * 50;
            positions[i*3+2] = (Math.random() - 0.5) * 800;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0xffccaa,
            size: 0.5,
            transparent: true,
            opacity: 0.4,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending
        });
        
        this.dust = new THREE.Points(geometry, material);
        this.scene.add(this.dust);
    }

    setupLighting() {
        // Golden Hour / Sunset Vibe
        this.ambientLight = new THREE.AmbientLight(0xffaa44, 0.4);
        this.scene.add(this.ambientLight);

        this.sunLight = new THREE.DirectionalLight(0xffddaa, 2.5);
        this.sunLight.position.set(-50, 20, -50);
        this.sunLight.castShadow = true;
        
        // Shadow properties
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 0.5;
        this.sunLight.shadow.camera.far = 500;
        this.sunLight.shadow.camera.left = -100;
        this.sunLight.shadow.camera.right = 100;
        this.sunLight.shadow.camera.top = 100;
        this.sunLight.shadow.camera.bottom = -100;
        this.sunLight.shadow.bias = -0.0005;

        this.scene.add(this.sunLight);

        // Helper
        // const helper = new THREE.CameraHelper(this.sunLight.shadow.camera);
        // this.scene.add(helper);
    }

    setupGround() {
        // Infinite-looking plane
        const geometry = new THREE.PlaneGeometry(2000, 2000, 128, 128);
        
        // Displace vertices for simple terrain
        const positions = geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i); // This is actually Z in world space if rotated, but local Y
            // Simple noise-like displacement
            const z = Math.sin(x * 0.05) * Math.cos(y * 0.05) * 2 + Math.random() * 0.5;
            positions.setZ(i, z);
        }
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({
            color: 0x8B4513, // SaddleBrown
            roughness: 0.9,
            metalness: 0.1,
        });

        this.ground = new THREE.Mesh(geometry, material);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);
    }

    setupSky() {
        this.scene.background = new THREE.Color(0xff8833);
        this.scene.fog = new THREE.FogExp2(0xff8833, 0.005);
    }

    update(deltaTime, elapsedTime) {
        // Optional: Animate sun or clouds
    }
}