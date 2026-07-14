import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const ANIMAL_COUNT = 2000;

export class Herd {
    constructor(scene, gui) {
        this.scene = scene;
        this.gui = gui;
        this.count = ANIMAL_COUNT;
        
        this.params = {
            count: this.count,
            speed: 10,
            spread: 400
        };

        this.dummy = new THREE.Object3D();
        this.instanceData = []; // Store custom data for each instance (speed, phase)

        this.init();
        this.setupGUI();
    }

    createAnimalGeometry() {
        const geometries = [];
        const boxGeo = new THREE.BoxGeometry(1, 1, 1);
        const cylGeo = new THREE.CylinderGeometry(1, 1, 1, 8);

        // Helper to create a part with specific transforms and attributes
        const addPart = (geo, scale, position, partIndex, pivotPoint) => {
            const cloned = geo.clone();
            cloned.scale(scale.x, scale.y, scale.z);
            cloned.translate(position.x, position.y, position.z);

            const count = cloned.attributes.position.count;
            const partIndices = new Float32Array(count).fill(partIndex);
            const pivots = new Float32Array(count * 3);
            
            for(let i=0; i<count; i++) {
                pivots[i*3] = pivotPoint.x;
                pivots[i*3+1] = pivotPoint.y;
                pivots[i*3+2] = pivotPoint.z;
            }

            cloned.setAttribute('aPartIndex', new THREE.BufferAttribute(partIndices, 1));
            cloned.setAttribute('aPivot', new THREE.BufferAttribute(pivots, 3));
            
            geometries.push(cloned);
        };

        // Body (Index 0) - Brown
        addPart(boxGeo, new THREE.Vector3(0.8, 0.8, 1.8), new THREE.Vector3(0, 1.4, 0), 0, new THREE.Vector3(0,0,0));

        // Neck
        addPart(boxGeo, new THREE.Vector3(0.5, 0.6, 0.8), new THREE.Vector3(0, 1.8, 1.0), 0, new THREE.Vector3(0,0,0));

        // Head
        addPart(boxGeo, new THREE.Vector3(0.5, 0.5, 0.8), new THREE.Vector3(0, 2.0, 1.6), 0, new THREE.Vector3(0,0,0));

        // Legs (Indices 1-4)
        const legScale = new THREE.Vector3(0.2, 1.2, 0.2);
        const legY = 0.6; // Center of leg
        const pivotY = 1.2; // Top of leg

        // FL (Index 1)
        addPart(boxGeo, legScale, new THREE.Vector3(-0.3, legY, 0.7), 1, new THREE.Vector3(-0.3, pivotY, 0.7));
        // FR (Index 2)
        addPart(boxGeo, legScale, new THREE.Vector3(0.3, legY, 0.7), 2, new THREE.Vector3(0.3, pivotY, 0.7));
        // BL (Index 3)
        addPart(boxGeo, legScale, new THREE.Vector3(-0.3, legY, -0.7), 3, new THREE.Vector3(-0.3, pivotY, -0.7));
        // BR (Index 4)
        addPart(boxGeo, legScale, new THREE.Vector3(0.3, legY, -0.7), 4, new THREE.Vector3(0.3, pivotY, -0.7));

        const merged = mergeGeometries(geometries);
        return merged;
    }

    init() {
        const geometry = this.createAnimalGeometry();
        
        // Custom Material with shader modification
        const material = new THREE.MeshStandardMaterial({
            color: 0x5C4033, // Dark brown
            roughness: 0.9,
            metalness: 0.0
        });

        material.onBeforeCompile = (shader) => {
            shader.uniforms.uTime = { value: 0 };
            
            shader.vertexShader = `
                uniform float uTime;
                attribute float aPartIndex;
                attribute vec3 aPivot;
                
                // Rotation matrix helper
                mat4 rotationX( in float angle ) {
                    return mat4(	1.0,		0,			0,			0,
                                    0, 	cos(angle),	-sin(angle),		0,
                                    0, 	sin(angle),	 cos(angle),		0,
                                    0, 			0,			  0, 		1.0);
                }
            ` + shader.vertexShader;

            shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>',
                `
                #include <begin_vertex>
                
                float angle = 0.0;
                float speed = 15.0; // Running speed
                float phase = 0.0;
                
                // Add some randomness per instance based on position
                float instanceRand = instanceMatrix[3][0] * 0.1 + instanceMatrix[3][2] * 0.1;

                if (aPartIndex > 0.5) {
                    // It's a leg
                    vec3 pivot = aPivot;
                    vec3 posRelative = transformed - pivot;
                    
                    // Simple gait: diagonal pairs match
                    if (aPartIndex < 1.5) { // FL
                        phase = 0.0;
                    } else if (aPartIndex < 2.5) { // FR
                        phase = 3.14159;
                    } else if (aPartIndex < 3.5) { // BL
                        phase = 3.14159;
                    } else { // BR
                        phase = 0.0;
                    }
                    
                    angle = sin(uTime * speed + phase + instanceRand) * 0.8; // 0.8 rad swing
                    
                    // Apply rotation
                    posRelative = (rotationX(angle) * vec4(posRelative, 1.0)).xyz;
                    transformed = posRelative + pivot;
                } else {
                     // Body bobbing
                     float bob = sin(uTime * speed * 2.0 + instanceRand) * 0.1;
                     transformed.y += bob;
                }
                `
            );
            
            this.materialShader = shader;
        };

        this.mesh = new THREE.InstancedMesh(geometry, material, this.count);
        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.resetInstances();
        this.scene.add(this.mesh);
    }

    resetInstances() {
        this.instanceData = [];
        for (let i = 0; i < this.count; i++) {
            this.resetInstance(i);
        }
        this.mesh.instanceMatrix.needsUpdate = true;
    }

    resetInstance(i) {
        // Position
        const x = (Math.random() - 0.5) * this.params.spread;
        const z = (Math.random() - 0.5) * this.params.spread;
        const y = 0;

        this.dummy.position.set(x, y, z);
        
        // Random rotation (Face towards -Z)
        this.dummy.rotation.y = Math.PI + (Math.random() - 0.5) * 0.5;
        
        // Scale variation
        const s = 0.8 + Math.random() * 0.4;
        this.dummy.scale.set(s, s, s);

        this.dummy.updateMatrix();
        this.mesh.setMatrixAt(i, this.dummy.matrix);

        // Store velocity/data
        this.instanceData[i] = {
            velocity: (10 + Math.random() * 5) * 0.01, // Speed
            rotationSpeed: (Math.random() - 0.5) * 0.01
        };
    }

    setupGUI() {
        const folder = this.gui.addFolder('Herd');
        folder.add(this.params, 'count', 100, 5000).step(100).onChange((v) => {
            this.count = v;
            this.scene.remove(this.mesh);
            this.init();
        });
        folder.add(this.params, 'speed', 0, 20);
    }

    update(deltaTime, elapsedTime) {
        if (this.materialShader) {
            this.materialShader.uniforms.uTime.value = elapsedTime;
        }

        // Move instances
        for (let i = 0; i < this.count; i++) {
            this.mesh.getMatrixAt(i, this.dummy.matrix);
            this.dummy.matrix.decompose(this.dummy.position, this.dummy.quaternion, this.dummy.scale);

            // Move forward based on rotation (Run towards -Z, the "sunset")
            const speed = this.params.speed * deltaTime;
            // Geometry faces +Z, so +Z is "forward" for the model.
            // When rotated 180deg (facing -Z), (0,0,1) becomes (0,0,-1) in world space.
            const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(this.dummy.quaternion);
            
            this.dummy.position.add(direction.multiplyScalar(speed));

            // Wrap around logic (infinite runner)
            const bounds = this.params.spread / 2 + 50;
            
            // If they go too far -Z, wrap to +Z
            if (this.dummy.position.z < -bounds) this.dummy.position.z = bounds;
            
            // Keep X bounds
            if (this.dummy.position.x > bounds) this.dummy.position.x = -bounds;
            if (this.dummy.position.x < -bounds) this.dummy.position.x = bounds;

            this.dummy.updateMatrix();
            this.mesh.setMatrixAt(i, this.dummy.matrix);
        }
        this.mesh.instanceMatrix.needsUpdate = true;
    }
}