/**
 * Mate-Engine-Web3D-Jack - 网页VRM查看器
 * 使用 Three.js + @pixiv/three-vrm
 * 
 * 功能：
 * - VRM模型加载（支持Lazuli, Aldina, Zome及自定义）
 * - 多种动画（待机、舞蹈、表情等）
 * - 音乐同步舞蹈
 * - 鼠标跟踪（头部、眼睛）
 * - 服装切换
 * - 表情控制（混合形状）
 * - 相机控制
 * - 截图功能
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';

// ========================================
// 应用状态管理
// ========================================
const state = {
    // 3D场景相关
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    clock: null,
    
    // VRM模型相关
    vrm: null,
    mixer: null,
    currentAction: null,
    currentAnimation: 'idle',
    
    // 音频相关
    audioElement: null,
    audioContext: null,
    audioAnalyser: null,
    
    // 模型组件
    clothingMeshes: [],
    blendShapes: {},
    
    // 交互状态
    mousePosition: { x: 0, y: 0 },
    autoRotate: true,
    followMouse: true,
    enableShadows: true,
    
    // 性能监控
    lastFrameTime: Date.now(),
    frameCount: 0,
    fps: 60,
    
    // 当前加载的角色
    currentCharacter: null
};

// 角色文件路径映射
const CHARACTER_PATHS = {
    lazuli: 'Assets/MATE ENGINE - Avatar/DLCs/Lazuli_VRM.vrm',
    aldina: 'Assets/MATE ENGINE - Avatar/DLCs/aldina.vrm',
    zome: 'Assets/MATE ENGINE - Avatar/Zome.vrm'
};

// 服装检测关键词配置
const CLOTHING_DETECTION_KEYWORDS = [
    'cloth', 'dress', 'shirt', 'pants', 'skirt', 
    'jacket', 'coat', 'top', 'bottom', 
    '服装', '衣服', '裙子', '裤子'
];

// ========================================
// 初始化场景
// ========================================
function initScene() {
    const container = document.getElementById('canvas-container');
    
    // 创建场景
    state.scene = new THREE.Scene();
    state.scene.background = null; // 透明背景，显示CSS渐变
    
    // 创建相机
    state.camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );
    state.camera.position.set(0, 1.4, 1.5);
    
    // 创建渲染器
    state.renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true // 允许透明背景
    });
    state.renderer.setSize(window.innerWidth, window.innerHeight);
    state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    state.renderer.outputColorSpace = THREE.SRGBColorSpace;
    state.renderer.shadowMap.enabled = true;
    state.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(state.renderer.domElement);
    
    // 添加光照
    setupLights();
    
    // 添加地面
    addGround();
    
    // 添加轨道控制器
    state.controls = new OrbitControls(state.camera, state.renderer.domElement);
    state.controls.target.set(0, 1, 0);
    state.controls.enableDamping = true;
    state.controls.dampingFactor = 0.05;
    state.controls.minDistance = 0.5;
    state.controls.maxDistance = 5;
    state.controls.update();
    
    // 时钟
    state.clock = new THREE.Clock();
    
    // 窗口resize事件
    window.addEventListener('resize', onWindowResize);
    
    // 鼠标移动事件
    window.addEventListener('mousemove', onMouseMove);
    
    console.log('✅ 场景初始化完成');
}

// 设置光照
function setupLights() {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    state.scene.add(ambientLight);
    
    // 主光源
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 2, 1);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 10;
    state.scene.add(directionalLight);
    
    // 补光
    const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
    backLight.position.set(-1, 1, -1);
    state.scene.add(backLight);
    
    // 侧光（增加层次感）
    const sideLight = new THREE.DirectionalLight(0xa78bfa, 0.3);
    sideLight.position.set(2, 1, 0);
    state.scene.add(sideLight);
}

// 添加地面
function addGround() {
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        roughness: 0.8,
        metalness: 0.2,
        transparent: true,
        opacity: 0.5
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    state.scene.add(ground);
}

// 窗口resize处理
function onWindowResize() {
    state.camera.aspect = window.innerWidth / window.innerHeight;
    state.camera.updateProjectionMatrix();
    state.renderer.setSize(window.innerWidth, window.innerHeight);
}

// 鼠标移动处理
function onMouseMove(event) {
    state.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    state.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// ========================================
// VRM模型加载
// ========================================
async function loadVRM(file) {
    showLoading('正在加载模型...');
    
    try {
        // 移除现有模型
        if (state.vrm) {
            state.scene.remove(state.vrm.scene);
            VRMUtils.deepDispose(state.vrm.scene);
            state.vrm = null;
        }
        
        let url;
        if (typeof file === 'string') {
            // 从文件路径加载（预设角色）
            try {
                const response = await fetch(file);
                if (!response.ok) {
                    throw new Error(`网络请求失败: ${response.status} ${response.statusText}`);
                }
                const blob = await response.blob();
                url = URL.createObjectURL(blob);
            } catch (fetchError) {
                throw new Error(`无法加载模型文件: ${fetchError.message}`);
            }
        } else {
            // 从文件对象加载（用户上传）
            url = URL.createObjectURL(file);
        }
        
        // 加载VRM
        const loader = new GLTFLoader();
        loader.register((parser) => {
            return new VRMLoaderPlugin(parser);
        });
        
        const gltf = await loader.loadAsync(url, (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            updateLoadingProgress(percent);
        });
        
        const vrm = gltf.userData.vrm;
        
        if (!vrm) {
            throw new Error('文件中未找到VRM数据');
        }
        
        state.vrm = vrm;
        
        // 添加到场景
        state.scene.add(vrm.scene);
        
        // 设置模型
        vrm.scene.traverse((obj) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
                obj.frustumCulled = false;
            }
        });
        
        // 创建动画混合器
        state.mixer = new THREE.AnimationMixer(vrm.scene);
        
        // 检测服装
        detectClothing();
        
        // 检测混合形状（表情）
        detectBlendShapes();
        
        // 更新UI
        updateModelStatus('success', `模型加载成功`);
        enableControls(true);
        
        // 开始待机动画
        playAnimation('idle');
        
        URL.revokeObjectURL(url);
        hideLoading();
        
        console.log('✅ VRM模型加载成功');
        
    } catch (error) {
        console.error('❌ VRM加载错误:', error);
        updateModelStatus('error', `加载失败: ${error.message}`);
        hideLoading();
    }
}

// 加载预设角色
async function loadCharacter(characterId) {
    const path = CHARACTER_PATHS[characterId];
    if (!path) {
        updateModelStatus('error', '未知角色');
        return;
    }
    
    state.currentCharacter = characterId;
    
    // 更新角色卡片状态
    document.querySelectorAll('.character-card').forEach(card => {
        card.classList.remove('active');
    });
    document.querySelector(`[data-character="${characterId}"]`)?.classList.add('active');
    
    await loadVRM(path);
}

// ========================================
// 服装检测与控制
// ========================================
function detectClothing() {
    state.clothingMeshes = [];
    
    if (!state.vrm) return;
    
    state.vrm.scene.traverse((obj) => {
        if (obj.isMesh) {
            const name = obj.name.toLowerCase();
            const isClothing = CLOTHING_DETECTION_KEYWORDS.some(keyword => name.includes(keyword));
            
            if (isClothing) {
                state.clothingMeshes.push({
                    mesh: obj,
                    name: obj.name,
                    visible: obj.visible
                });
            }
        }
    });
    
    updateClothingUI();
    console.log(`🔍 检测到 ${state.clothingMeshes.length} 件服装`);
}

// 更新服装UI
function updateClothingUI() {
    const container = document.getElementById('clothing-controls');
    container.innerHTML = '';
    
    if (state.clothingMeshes.length === 0) {
        container.innerHTML = '<p class="hint-text">未检测到可切换的服装</p>';
        return;
    }
    
    state.clothingMeshes.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'clothing-item';
        
        const label = document.createElement('label');
        label.className = 'toggle-label';
        label.style.margin = '0';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.visible;
        checkbox.addEventListener('change', (e) => {
            item.mesh.visible = e.target.checked;
            item.visible = e.target.checked;
        });
        
        const toggleSwitch = document.createElement('span');
        toggleSwitch.className = 'toggle-switch';
        
        const text = document.createElement('span');
        text.className = 'toggle-text';
        text.textContent = item.name;
        
        label.appendChild(checkbox);
        label.appendChild(toggleSwitch);
        label.appendChild(text);
        div.appendChild(label);
        container.appendChild(div);
    });
}

// ========================================
// 混合形状（表情）控制
// ========================================
function detectBlendShapes() {
    state.blendShapes = {};
    
    if (!state.vrm || !state.vrm.expressionManager) return;
    
    const expressionManager = state.vrm.expressionManager;
    const presets = expressionManager.expressionMap;
    
    console.log('🔍 检测到的表情预设:', Object.keys(presets));
}

// 设置表情
function setExpression(expressionName) {
    if (!state.vrm || !state.vrm.expressionManager) return;
    
    const expressionManager = state.vrm.expressionManager;
    
    // 重置所有表情
    Object.keys(expressionManager.expressionMap).forEach(key => {
        expressionManager.setValue(key, 0);
    });
    
    // 设置新表情
    switch(expressionName) {
        case 'happy':
            expressionManager.setValue('happy', 1);
            break;
        case 'sad':
            expressionManager.setValue('sad', 1);
            break;
        case 'angry':
            expressionManager.setValue('angry', 1);
            break;
        case 'surprised':
            expressionManager.setValue('surprised', 1);
            break;
        case 'fun':
            expressionManager.setValue('relaxed', 1);
            break;
        default:
            // neutral - 保持重置状态
            break;
    }
    
    console.log(`😊 切换表情: ${expressionName}`);
}

// ========================================
// 动画系统
// ========================================
function playAnimation(animationType) {
    if (!state.vrm || !state.mixer) return;
    
    // 停止当前动画
    if (state.currentAction) {
        state.currentAction.stop();
    }
    
    let clip;
    switch(animationType) {
        case 'idle':
            clip = createIdleAnimation();
            break;
        case 'dance1':
            clip = createDanceAnimation('dance1');
            break;
        case 'dance2':
            clip = createDanceAnimation('dance2');
            break;
        case 'wave':
            clip = createWaveAnimation();
            break;
        case 'joy':
            clip = createJoyAnimation();
            break;
        case 'jump':
            clip = createJumpAnimation();
            break;
        default:
            clip = createIdleAnimation();
    }
    
    if (clip) {
        state.currentAction = state.mixer.clipAction(clip);
        state.currentAction.setLoop(THREE.LoopRepeat);
        state.currentAction.play();
        state.currentAnimation = animationType;
        
        // 更新UI
        document.querySelectorAll('.animation-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-animation="${animationType}"]`)?.classList.add('active');
        
        console.log(`💃 播放动画: ${animationType}`);
    }
}

// 创建待机动画
function createIdleAnimation() {
    const tracks = [];
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

// 创建舞蹈动画
function createDanceAnimation(type) {
    const tracks = [];
    const duration = 4;
    
    if (type === 'dance1') {
        const times = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];
        const rotValues = [0, 0.3, 0, -0.3, 0, 0.3, 0, -0.3, 0];
        const posValues = [0, 0.08, 0.15, 0.08, 0, 0.08, 0.15, 0.08, 0];
        
        const rotationTrack = new THREE.QuaternionKeyframeTrack(
            '.quaternion',
            times,
            rotValues.flatMap(v => {
                const q = new THREE.Quaternion();
                q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), v);
                return [q.x, q.y, q.z, q.w];
            })
        );
        
        const positionTrack = new THREE.VectorKeyframeTrack(
            '.position[y]',
            times,
            posValues
        );
        
        tracks.push(rotationTrack, positionTrack);
    } else if (type === 'dance2') {
        const times = [0, 0.4, 0.8, 1.2, 1.6, 2, 2.4, 2.8, 3.2, 3.6, 4];
        const rotValues = [0, -0.4, 0.4, -0.4, 0.4, 0, -0.4, 0.4, -0.4, 0.4, 0];
        const posValues = [0, 0.1, 0.02, 0.1, 0.02, 0.12, 0.02, 0.1, 0.02, 0.1, 0];
        
        const rotationTrack = new THREE.QuaternionKeyframeTrack(
            '.quaternion',
            times,
            rotValues.flatMap(v => {
                const q = new THREE.Quaternion();
                q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), v);
                return [q.x, q.y, q.z, q.w];
            })
        );
        
        const positionTrack = new THREE.VectorKeyframeTrack(
            '.position[y]',
            times,
            posValues
        );
        
        tracks.push(rotationTrack, positionTrack);
    }
    
    return new THREE.AnimationClip(type, duration, tracks);
}

// 创建挥手动画
function createWaveAnimation() {
    const tracks = [];
    const times = [0, 0.5, 1, 1.5, 2];
    const values = [0, 0.3, 0, 0.3, 0];
    
    const rotationTrack = new THREE.QuaternionKeyframeTrack(
        '.quaternion',
        times,
        values.flatMap(v => {
            const q = new THREE.Quaternion();
            q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), v);
            return [q.x, q.y, q.z, q.w];
        })
    );
    
    tracks.push(rotationTrack);
    
    return new THREE.AnimationClip('wave', 2, tracks);
}

// 创建欢喜动画
function createJoyAnimation() {
    const tracks = [];
    const times = [0, 0.3, 0.6, 0.9, 1.2, 1.5];
    const posValues = [0, 0.15, 0, 0.15, 0, 0];
    const rotValues = [0, 0.2, -0.2, 0.2, -0.2, 0];
    
    const positionTrack = new THREE.VectorKeyframeTrack(
        '.position[y]',
        times,
        posValues
    );
    
    const rotationTrack = new THREE.QuaternionKeyframeTrack(
        '.quaternion',
        times,
        rotValues.flatMap(v => {
            const q = new THREE.Quaternion();
            q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), v);
            return [q.x, q.y, q.z, q.w];
        })
    );
    
    tracks.push(positionTrack, rotationTrack);
    
    return new THREE.AnimationClip('joy', 1.5, tracks);
}

// 创建跳跃动画
function createJumpAnimation() {
    const tracks = [];
    const times = [0, 0.3, 0.6, 1];
    const values = [0, 0.3, 0.15, 0];
    
    const positionTrack = new THREE.VectorKeyframeTrack(
        '.position[y]',
        times,
        values
    );
    
    tracks.push(positionTrack);
    
    return new THREE.AnimationClip('jump', 1, tracks);
}

// ========================================
// 音频处理
// ========================================
function loadAudio(file) {
    // 移除现有音频
    if (state.audioElement) {
        state.audioElement.pause();
        state.audioElement.remove();
        state.audioElement = null;
    }
    
    state.audioElement = new Audio(URL.createObjectURL(file));
    state.audioElement.loop = true;
    
    // 更新UI
    const audioInfo = document.getElementById('audio-info');
    const audioName = document.getElementById('audio-name');
    audioName.textContent = file.name;
    audioInfo.style.display = 'flex';
    
    document.getElementById('play-with-music').disabled = false;
    
    console.log(`🎵 音频已加载: ${file.name}`);
}

function playWithMusic() {
    if (!state.audioElement || !state.vrm) return;
    
    // 播放音频
    state.audioElement.play();
    
    // 播放舞蹈动画
    const danceType = state.currentAnimation.includes('dance') ? state.currentAnimation : 'dance1';
    playAnimation(danceType);
    
    document.getElementById('stop-all').disabled = false;
    
    console.log('🎵💃 开始音乐舞蹈');
}

function stopAll() {
    // 停止音频
    if (state.audioElement) {
        state.audioElement.pause();
        state.audioElement.currentTime = 0;
    }
    
    // 返回待机
    playAnimation('idle');
    
    console.log('⏹️ 停止播放');
}

// ========================================
// VRM更新（每帧调用）
// ========================================
function updateVRM(deltaTime) {
    if (!state.vrm) return;
    
    // 更新动画混合器
    if (state.mixer) {
        state.mixer.update(deltaTime);
    }
    
    // 头部跟随鼠标
    if (state.followMouse && state.vrm.humanoid) {
        const head = state.vrm.humanoid.getNormalizedBoneNode('head');
        if (head) {
            const targetX = state.mousePosition.x * 0.3;
            const targetY = state.mousePosition.y * 0.2;
            
            head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, targetX, 0.1);
            head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, targetY, 0.1);
        }
    }
    
    // 更新VRM
    state.vrm.update(deltaTime);
}

// ========================================
// 渲染循环
// ========================================
function animate() {
    requestAnimationFrame(animate);
    
    const deltaTime = state.clock.getDelta();
    
    // 更新VRM
    updateVRM(deltaTime);
    
    // 更新控制器
    if (state.controls) {
        state.controls.update();
    }
    
    // 自动旋转
    if (state.autoRotate && state.vrm) {
        state.vrm.scene.rotation.y += 0.003;
    }
    
    // FPS计数
    state.frameCount++;
    const now = Date.now();
    if (now - state.lastFrameTime >= 1000) {
        state.fps = state.frameCount;
        state.frameCount = 0;
        state.lastFrameTime = now;
        
        // 更新FPS显示
        const fpsCounter = document.getElementById('fps-counter');
        if (fpsCounter) {
            fpsCounter.textContent = state.fps;
        }
    }
    
    // 渲染
    state.renderer.render(state.scene, state.camera);
}

// ========================================
// UI辅助函数
// ========================================
function showLoading(text = '加载中...') {
    const loading = document.getElementById('loading');
    const loadingText = document.getElementById('loading-text');
    loadingText.textContent = text;
    loading.classList.add('active');
}

function hideLoading() {
    document.getElementById('loading').classList.remove('active');
}

function updateLoadingProgress(percent) {
    const progress = document.getElementById('loading-progress');
    progress.style.width = `${percent}%`;
}

function updateModelStatus(type, message) {
    const status = document.getElementById('model-status');
    status.className = `status-message ${type}`;
    status.textContent = message;
    status.style.display = 'block';
    
    setTimeout(() => {
        status.style.display = 'none';
    }, 3000);
}

function enableControls(enabled) {
    const animButtons = document.querySelectorAll('.animation-button');
    animButtons.forEach(btn => btn.disabled = !enabled);
    
    const exprButtons = document.querySelectorAll('.expression-button');
    exprButtons.forEach(btn => btn.disabled = !enabled);
}

// 截图功能
function takeScreenshot() {
    if (!state.renderer) return;
    
    state.renderer.render(state.scene, state.camera);
    state.renderer.domElement.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mate-engine-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
        
        updateModelStatus('success', '截图已保存');
    });
}

// ========================================
// 事件监听器设置
// ========================================
function setupEventListeners() {
    // 角色选择
    document.querySelectorAll('.character-card').forEach(card => {
        card.addEventListener('click', () => {
            const character = card.dataset.character;
            if (character === 'custom') {
                document.getElementById('vrm-file').click();
            } else {
                loadCharacter(character);
            }
        });
    });
    
    // 文件上传
    document.getElementById('vrm-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            state.currentCharacter = 'custom';
            loadVRM(file);
        }
    });
    
    // 动画按钮
    document.querySelectorAll('.animation-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const animation = btn.dataset.animation;
            playAnimation(animation);
        });
    });
    
    // 表情按钮
    document.querySelectorAll('.expression-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const expression = btn.dataset.expression;
            setExpression(expression);
            
            // UI反馈
            document.querySelectorAll('.expression-button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // 音频上传
    document.getElementById('audio-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            loadAudio(file);
        }
    });
    
    // 移除音频
    document.getElementById('remove-audio')?.addEventListener('click', () => {
        if (state.audioElement) {
            state.audioElement.pause();
            state.audioElement = null;
        }
        document.getElementById('audio-info').style.display = 'none';
        document.getElementById('play-with-music').disabled = true;
    });
    
    // 音乐舞蹈
    document.getElementById('play-with-music').addEventListener('click', playWithMusic);
    
    // 停止
    document.getElementById('stop-all').addEventListener('click', stopAll);
    
    // 音量控制
    document.getElementById('volume-slider').addEventListener('input', (e) => {
        const volume = e.target.value / 100;
        if (state.audioElement) {
            state.audioElement.volume = volume;
        }
        document.getElementById('volume-value').textContent = `${e.target.value}%`;
    });
    
    // 相机距离
    document.getElementById('camera-distance').addEventListener('input', (e) => {
        const distance = parseFloat(e.target.value);
        document.getElementById('distance-value').textContent = `${distance}m`;
        
        const direction = new THREE.Vector3();
        state.camera.getWorldDirection(direction);
        direction.negate().normalize();
        state.camera.position.copy(state.controls.target).add(direction.multiplyScalar(distance));
    });
    
    // 相机高度
    document.getElementById('camera-height').addEventListener('input', (e) => {
        const height = parseFloat(e.target.value);
        document.getElementById('height-value').textContent = `${height}m`;
        state.controls.target.y = height;
    });
    
    // 自动旋转
    document.getElementById('auto-rotate').addEventListener('change', (e) => {
        state.autoRotate = e.target.checked;
    });
    
    // 鼠标跟踪
    document.getElementById('follow-mouse').addEventListener('change', (e) => {
        state.followMouse = e.target.checked;
    });
    
    // 阴影效果
    document.getElementById('enable-shadows').addEventListener('change', (e) => {
        state.renderer.shadowMap.enabled = e.target.checked;
    });
    
    // 重置相机
    document.getElementById('reset-camera').addEventListener('click', () => {
        state.camera.position.set(0, 1.4, 1.5);
        state.controls.target.set(0, 1, 0);
        state.controls.update();
        
        if (state.vrm) {
            state.vrm.scene.rotation.set(0, 0, 0);
        }
        
        updateModelStatus('info', '相机已重置');
    });
    
    // 截图
    document.getElementById('take-screenshot').addEventListener('click', takeScreenshot);
    
    // 面板折叠
    document.getElementById('panel-toggle').addEventListener('click', () => {
        document.getElementById('controls').classList.toggle('collapsed');
        const icon = document.querySelector('.toggle-icon');
        icon.textContent = document.getElementById('controls').classList.contains('collapsed') ? '▶' : '◀';
    });
    
    // 信息面板
    document.getElementById('info-toggle').addEventListener('click', () => {
        document.getElementById('info-panel').classList.toggle('collapsed');
    });
}

// ========================================
// 应用初始化
// ========================================
function init() {
    console.log('🎭 Mate-Engine-Web3D-Jack 启动中...');
    
    initScene();
    setupEventListeners();
    animate();
    
    // 默认加载Lazuli
    setTimeout(() => {
        loadCharacter('lazuli');
    }, 500);
    
    console.log('✅ 应用初始化完成');
}

// DOM加载完成后启动
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
