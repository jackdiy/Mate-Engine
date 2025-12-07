import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';

// Application state
const state = {
    vrm: null,
    mixer: null,
    currentAction: null,
    audioElement: null,
    clothingMeshes: [],
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    clock: null,
    mousePosition: { x: 0, y: 0 },
    autoRotate: true,
    followMouse: true
};

// Initialize Three.js scene
function initScene() {
    const container = document.getElementById('canvas-container');
    
    // Create scene
    state.scene = new THREE.Scene();
    state.scene.background = new THREE.Color(0x212121);
    
    // Create camera
    state.camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );
    state.camera.position.set(0, 1.4, 1.5);
    
    // Create renderer
    state.renderer = new THREE.WebGLRenderer({ antialias: true });
    state.renderer.setSize(window.innerWidth, window.innerHeight);
    state.renderer.setPixelRatio(window.devicePixelRatio);
    state.renderer.outputColorSpace = THREE.SRGBColorSpace;
    state.renderer.shadowMap.enabled = true;
    state.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(state.renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    state.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 2, 1);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    state.scene.add(directionalLight);
    
    const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
    backLight.position.set(-1, 1, -1);
    state.scene.add(backLight);
    
    // Add ground plane
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    state.scene.add(ground);
    
    // Add orbit controls
    state.controls = new OrbitControls(state.camera, state.renderer.domElement);
    state.controls.target.set(0, 1, 0);
    state.controls.enableDamping = true;
    state.controls.dampingFactor = 0.05;
    state.controls.minDistance = 0.5;
    state.controls.maxDistance = 5;
    state.controls.update();
    
    // Clock for animations
    state.clock = new THREE.Clock();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Track mouse for head following
    window.addEventListener('mousemove', onMouseMove);
}

function onWindowResize() {
    state.camera.aspect = window.innerWidth / window.innerHeight;
    state.camera.updateProjectionMatrix();
    state.renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    state.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    state.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Load VRM model
async function loadVRM(file) {
    showLoading('Loading VRM model...');
    
    try {
        // Remove existing VRM if any
        if (state.vrm) {
            state.scene.remove(state.vrm.scene);
            VRMUtils.deepDispose(state.vrm.scene);
            state.vrm = null;
        }
        
        // Create URL from file
        const url = URL.createObjectURL(file);
        
        // Load VRM
        const loader = new GLTFLoader();
        loader.register((parser) => {
            return new VRMLoaderPlugin(parser);
        });
        
        const gltf = await loader.loadAsync(url);
        
        // Get VRM
        const vrm = gltf.userData.vrm;
        
        if (!vrm) {
            throw new Error('No VRM data found in file');
        }
        
        state.vrm = vrm;
        
        // Add to scene
        state.scene.add(vrm.scene);
        
        // Setup model
        vrm.scene.traverse((obj) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.frustumCulled = false;
            }
        });
        
        // Create animation mixer
        state.mixer = new THREE.AnimationMixer(vrm.scene);
        
        // Detect clothing meshes
        detectClothingMeshes();
        
        // Update UI
        updateModelStatus('success', `Loaded: ${file.name}`);
        enableControls(true);
        
        // Start with idle animation
        playIdleAnimation();
        
        URL.revokeObjectURL(url);
        hideLoading();
        
    } catch (error) {
        console.error('Error loading VRM:', error);
        updateModelStatus('error', `Error: ${error.message}`);
        hideLoading();
    }
}

// Detect clothing meshes for toggle controls
function detectClothingMeshes() {
    state.clothingMeshes = [];
    
    if (!state.vrm) return;
    
    const clothingKeywords = ['cloth', 'dress', 'shirt', 'pants', 'skirt', 'jacket', 'coat', 'top', 'bottom'];
    
    state.vrm.scene.traverse((obj) => {
        if (obj.isMesh) {
            const name = obj.name.toLowerCase();
            const isClothing = clothingKeywords.some(keyword => name.includes(keyword));
            
            if (isClothing) {
                state.clothingMeshes.push({
                    mesh: obj,
                    name: obj.name,
                    visible: obj.visible
                });
            }
        }
    });
    
    updateClothingControls();
}

// Update clothing toggle controls
function updateClothingControls() {
    const container = document.getElementById('clothing-controls');
    container.innerHTML = '';
    
    if (state.clothingMeshes.length === 0) {
        container.innerHTML = '<p style="color: #888; font-size: 12px;">No clothing items detected</p>';
        return;
    }
    
    state.clothingMeshes.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'checkbox-group';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `clothing-${index}`;
        checkbox.checked = item.visible;
        checkbox.addEventListener('change', (e) => {
            item.mesh.visible = e.target.checked;
            item.visible = e.target.checked;
        });
        
        const label = document.createElement('label');
        label.htmlFor = `clothing-${index}`;
        label.textContent = item.name;
        
        div.appendChild(checkbox);
        div.appendChild(label);
        container.appendChild(div);
    });
}

// Animation functions
function playIdleAnimation() {
    if (!state.vrm) return;
    
    // Stop current animation
    if (state.currentAction) {
        state.currentAction.stop();
    }
    
    // Create simple idle animation
    const idleClip = createIdleAnimation();
    state.currentAction = state.mixer.clipAction(idleClip);
    state.currentAction.play();
}

function createIdleAnimation() {
    const tracks = [];
    
    // Simple breathing animation
    const times = [0, 2, 4];
    const values = [0, 0.02, 0];
    
    const positionTrack = new THREE.VectorKeyframeTrack(
        '.position[y]',
        times,
        values
    );
    
    tracks.push(positionTrack);
    
    return new THREE.AnimationClip('idle', 4, tracks);
}

function createDanceAnimation(type = 'dance1') {
    const tracks = [];
    const duration = 4;
    
    if (type === 'dance1') {
        // Simple dance pattern 1
        const times = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];
        const rotValues = [0, 0.2, 0, -0.2, 0, 0.2, 0, -0.2, 0];
        const posValues = [0, 0.05, 0.1, 0.05, 0, 0.05, 0.1, 0.05, 0];
        
        const rotationTrack = new THREE.QuaternionKeyframeTrack(
            '.quaternion',
            times,
            rotValues.map(v => {
                const q = new THREE.Quaternion();
                q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), v);
                return [q.x, q.y, q.z, q.w];
            }).flat()
        );
        
        const positionTrack = new THREE.VectorKeyframeTrack(
            '.position[y]',
            times,
            posValues
        );
        
        tracks.push(rotationTrack, positionTrack);
    } else if (type === 'dance2') {
        // Simple dance pattern 2
        const times = [0, 0.4, 0.8, 1.2, 1.6, 2, 2.4, 2.8, 3.2, 3.6, 4];
        const rotValues = [0, -0.3, 0.3, -0.3, 0.3, 0, -0.3, 0.3, -0.3, 0.3, 0];
        const posValues = [0, 0.08, 0.02, 0.08, 0.02, 0.1, 0.02, 0.08, 0.02, 0.08, 0];
        
        const rotationTrack = new THREE.QuaternionKeyframeTrack(
            '.quaternion',
            times,
            rotValues.map(v => {
                const q = new THREE.Quaternion();
                q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), v);
                return [q.x, q.y, q.z, q.w];
            }).flat()
        );
        
        const positionTrack = new THREE.VectorKeyframeTrack(
            '.position[y]',
            times,
            posValues
        );
        
        tracks.push(rotationTrack, positionTrack);
    } else if (type === 'wave') {
        // Wave animation
        const times = [0, 0.5, 1, 1.5, 2];
        const values = [0, 0.3, 0, 0.3, 0];
        
        const rotationTrack = new THREE.QuaternionKeyframeTrack(
            '.quaternion',
            times,
            values.map(v => {
                const q = new THREE.Quaternion();
                q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), v);
                return [q.x, q.y, q.z, q.w];
            }).flat()
        );
        
        tracks.push(rotationTrack);
    }
    
    return new THREE.AnimationClip(type, duration, tracks);
}

function playAnimation(animationType) {
    if (!state.vrm || !state.mixer) return;
    
    // Stop current animation
    if (state.currentAction) {
        state.currentAction.stop();
    }
    
    let clip;
    if (animationType === 'idle') {
        clip = createIdleAnimation();
    } else if (animationType === 'dance1' || animationType === 'dance2' || animationType === 'wave') {
        clip = createDanceAnimation(animationType);
    }
    
    if (clip) {
        state.currentAction = state.mixer.clipAction(clip);
        state.currentAction.setLoop(THREE.LoopRepeat);
        state.currentAction.play();
    }
}

// Audio handling
function loadAudio(file) {
    // Remove existing audio if any
    if (state.audioElement) {
        state.audioElement.pause();
        state.audioElement.remove();
        state.audioElement = null;
    }
    
    state.audioElement = new Audio(URL.createObjectURL(file));
    state.audioElement.loop = true;
    
    updateModelStatus('info', `Audio loaded: ${file.name}`);
    document.getElementById('play-dance-music').disabled = false;
}

function playDanceWithMusic() {
    if (!state.audioElement || !state.vrm) return;
    
    // Play audio
    state.audioElement.play();
    
    // Play dance animation
    const select = document.getElementById('animation-select');
    const animType = select.value;
    playAnimation(animType);
    
    document.getElementById('stop-all').disabled = false;
}

function stopAll() {
    // Stop audio
    if (state.audioElement) {
        state.audioElement.pause();
        state.audioElement.currentTime = 0;
    }
    
    // Return to idle
    playIdleAnimation();
}

// Update VRM with head tracking
function updateVRM(deltaTime) {
    if (!state.vrm) return;
    
    // Update animation mixer
    if (state.mixer) {
        state.mixer.update(deltaTime);
    }
    
    // Head follows mouse
    if (state.followMouse && state.vrm.humanoid) {
        const head = state.vrm.humanoid.getNormalizedBoneNode('head');
        if (head) {
            // Simple head tracking
            const targetX = state.mousePosition.x * 0.3;
            const targetY = state.mousePosition.y * 0.2;
            
            head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, targetX, 0.1);
            head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, targetY, 0.1);
        }
    }
    
    // Update VRM
    state.vrm.update(deltaTime);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const deltaTime = state.clock.getDelta();
    
    // Update VRM
    updateVRM(deltaTime);
    
    // Update controls
    if (state.controls) {
        state.controls.update();
    }
    
    // Auto rotate
    if (state.autoRotate && state.vrm) {
        state.vrm.scene.rotation.y += 0.002;
    }
    
    // Render
    state.renderer.render(state.scene, state.camera);
}

// UI helper functions
function showLoading(text = 'Loading...') {
    const loading = document.getElementById('loading');
    const loadingText = document.getElementById('loading-text');
    loadingText.textContent = text;
    loading.style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function updateModelStatus(type, message) {
    const status = document.getElementById('model-status');
    status.className = `status status-${type}`;
    status.textContent = message;
    status.style.display = 'block';
}

function enableControls(enabled) {
    document.getElementById('play-animation').disabled = !enabled;
    document.getElementById('stop-all').disabled = !enabled;
    
    if (!state.audioElement) {
        document.getElementById('play-dance-music').disabled = true;
    }
}

// Event listeners
function setupEventListeners() {
    // VRM file input
    document.getElementById('vrm-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            loadVRM(file);
        }
    });
    
    // Audio file input
    document.getElementById('audio-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            loadAudio(file);
        }
    });
    
    // Animation select
    document.getElementById('animation-select').addEventListener('change', (e) => {
        if (state.vrm) {
            playAnimation(e.target.value);
        }
    });
    
    // Play animation button
    document.getElementById('play-animation').addEventListener('click', () => {
        const select = document.getElementById('animation-select');
        playAnimation(select.value);
    });
    
    // Play dance with music button
    document.getElementById('play-dance-music').addEventListener('click', () => {
        playDanceWithMusic();
    });
    
    // Stop all button
    document.getElementById('stop-all').addEventListener('click', () => {
        stopAll();
    });
    
    // Camera distance slider
    const distanceSlider = document.getElementById('camera-distance');
    const distanceValue = document.getElementById('distance-value');
    distanceSlider.addEventListener('input', (e) => {
        const distance = parseFloat(e.target.value);
        distanceValue.textContent = distance.toFixed(1);
        
        // Update camera position
        const direction = new THREE.Vector3();
        state.camera.getWorldDirection(direction);
        direction.negate();
        direction.normalize();
        
        state.camera.position.copy(state.controls.target).add(direction.multiplyScalar(distance));
    });
    
    // Auto rotate checkbox
    document.getElementById('auto-rotate').addEventListener('change', (e) => {
        state.autoRotate = e.target.checked;
    });
    
    // Follow mouse checkbox
    document.getElementById('follow-mouse').addEventListener('change', (e) => {
        state.followMouse = e.target.checked;
    });
    
    // Reset camera button
    document.getElementById('reset-camera').addEventListener('click', () => {
        state.camera.position.set(0, 1.4, 1.5);
        state.controls.target.set(0, 1, 0);
        state.controls.update();
        
        if (state.vrm) {
            state.vrm.scene.rotation.set(0, 0, 0);
        }
    });
}

// Initialize application
function init() {
    initScene();
    setupEventListeners();
    animate();
    
    console.log('Mate Engine Web initialized');
    console.log('Upload a VRM model to begin!');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
