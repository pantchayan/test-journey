// 
// IMPORTS =============================================================================
// 
import * as THREE from './lib/three.module.js'
import { OrbitControls } from './lib/addons/OrbitControls.js';
import { GLTFLoader } from './lib/addons/GLTFLoader.js';
import { DRACOLoader } from './lib/addons/DRACOLoader.js';
import { FontLoader } from './lib/addons/FontLoader.js';
import { TextGeometry } from './lib/addons/TextGeometry.js';
import { MeshSurfaceSampler } from './lib/addons/MeshSurfaceSampler.js';

// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
// import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';

// import { FontLoader } from 'three/addons/loaders/FontLoader.js';
// import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';


// import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';

// import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';

// import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
// import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js'

import GUI from './lib/lil-gui.js';

import planeVertexShader from "./shaders/plane/vertex.js";
import planeFragmentShader from "./shaders/plane/fragment.js";
import blobVertexShader from "./shaders/blob/vertex.js";
import blobFragmentShader from "./shaders/blob/fragment.js";
// import foamFragmentShader from "./shaders/foam/fragment.js";

//
// Loading Manager
//
const progressText = document.querySelector('label.progress-bar');
const progressContainer = document.querySelector('div.progress-bar-container');
const progressBar = document.querySelector('progress#progress-bar');
let loadingManager = new THREE.LoadingManager();
let startTime = Date.now();
loadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
  // console.log('Start time : ', startTime);
  // console.log('Started loading files.');
  setTimeout(() => {
    progressText.innerText = 'Loading Assets...';
  }, 100);
};

loadingManager.onLoad = function () {

  // console.log('End time : ', Date.now());
  console.log('Total time : ' + (Date.now() - startTime) + ' ms');
  console.log('Made by: @pantchayan');
  // console.log('Loading complete!');
  progressText.innerText = 'Constructing Experience...';
  setTimeout(() => {
    progressContainer.style.display = 'none';
  }, 50);


  setTimeout(() => {
    document.querySelector('.theme-toggle-btn').click()
  }, 2500)
};

loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
  // console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
  let progressPercentage = Math.round(itemsLoaded / itemsTotal * 100);
  progressBar.value = progressPercentage / 100 - 0.02;
  // console.log(progressPercentage, progressBar.value);
};

loadingManager.onError = function (url) {
  console.log('There was an error loading ' + url);
};



// 
// INITIALIZING UTILITY CLASSES =======================================================
// 
const gui = new GUI();
const textureLoader = new THREE.TextureLoader(loadingManager);
const gltfLoader = new GLTFLoader(loadingManager);
const dracoLoader = new DRACOLoader(loadingManager);
let fontLoader = new FontLoader(loadingManager);
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
dracoLoader.setDecoderConfig({ type: 'js' });
gltfLoader.setDRACOLoader(dracoLoader);

// 
// LOADING ASSETS =====================================================================
// 
let skyImg = textureLoader.load('./assets/images/alpha-img.png');
let sceneBgImg = textureLoader.load('./assets/images/scene-bg4.png')
let orangeMatcap = textureLoader.load('./assets/images/matcap-orange.png');
let whiteMatcap = textureLoader.load('./assets/images/matcap-white3.png');
let cloudMatcap = textureLoader.load('./assets/images/matcap-white2.png');
let ballMatCap = whiteMatcap;

let gradientMap = textureLoader.load('./assets/images/fourTone.jpg');
gradientMap.minFilter = THREE.NearestFilter
gradientMap.magFilter = THREE.NearestFilter

let menuMap = textureLoader.load('./assets/images/game-menu.jpg');
let menuAlphaMap = textureLoader.load('./assets/images/menu-alpha.jpg');

let showBoat = true;
let boatModel;
gltfLoader.load('./assets/models/boat.gltf', (gltf) => {
  boatModel = gltf.scene;
  // boatModel.position.y = 2;
  boatModel.position.z = 1.2;
  boatModel.position.x = -24.5;
  boatModel.rotation.y = -Math.PI / 2.5;
  boatModel.scale.set(2, 2, 2);
  scene.add(boatModel)
})

let islandModel;
gltfLoader.load('./assets/models/island2.glb', (gltf) => {
  islandModel = gltf.scene;
  gltf.scene.position.y = -0.45;
  gltf.scene.rotation.y = -Math.PI / 3;
  gltf.scene.scale.set(10, 10, 10);

  // let islandFolder = gui.addFolder('Island');

  // islandFolder.add(islandModel.position, 'x').min(-10).max(10).step(0.001);
  // islandFolder.add(islandModel.position, 'y').min(-10).max(10).step(0.001);
  // islandFolder.add(islandModel.position, 'z').min(-10).max(10).step(0.001);

  scene.add(gltf.scene);
})


let audioVisAnimMixer;
let audioVisAnimations;
let audioVisModel;
gltfLoader.load('./assets/models/audio_vis_compressed.glb', (gltf) => {
  audioVisModel = gltf.scene;
  gltf.scene.position.x = -4;
  gltf.scene.scale.set(5, 3, 5);
  audioVisAnimations = gltf.animations[0];
  // module7Animation('build');
})

let plugeeModel;
gltfLoader.load('./assets/models/compressed-plugee.glb', (gltf) => {
  plugeeModel = gltf.scene;
  gltf.scene.position.y = 3;
  gltf.scene.position.z = 7;
  gltf.scene.position.x = -5.56;
  gltf.scene.rotation.y = -0.1019;
  gltf.scene.rotation.x = -0.1019;

  let plugeeFolder = gui.addFolder('Plugee');
  plugeeFolder.add(plugeeModel.position, 'x').min(-20).max(20).step(0.001).name('position x');
  plugeeFolder.add(plugeeModel.position, 'y').min(-20).max(20).step(0.001).name('position y');
  plugeeFolder.add(plugeeModel.position, 'z').min(-20).max(20).step(0.001).name('position z');

  plugeeFolder.add(plugeeModel.rotation, 'x').min(-3.14).max(3.14).step(0.0001).name('rotation x');
  plugeeFolder.add(plugeeModel.rotation, 'y').min(-3.14).max(3.14).step(0.0001).name('rotation y');
  plugeeFolder.add(plugeeModel.rotation, 'z').min(-3.14).max(3.14).step(0.0001).name('rotation z');
  plugeeFolder.close();

  gltf.scene.scale.set(5, 5, 5);
  scene.add(gltf.scene);
})

let dogAnimMixer;
let dogModel;
let dogAnimations;
gltfLoader.load('./assets/models/dog2.glb', (gltf) => {
  gltf.scene.scale.set(0.7, 0.7, 0.7);
  gltf.scene.position.x = 0;
  gltf.scene.position.y = 10;
  dogModel = gltf.scene;
  dogAnimations = gltf.animations;
  // scene.add(dogModel)
  // module4Animation('build')
})

let bunnyModel;
gltfLoader.load('assets/models/stanford_bunny_decimated.glb', (gltf) => {
  bunnyModel = gltf.scene;
  bunnyModel.rotation.x = Math.PI / 2;
})


let minecraftBlock;
gltfLoader.load('./assets/models/minecraft_grass_block.glb', (gltf) => {
  minecraftBlock = gltf.scene;
  gltf.scene.position.y = -0.5;
  gltf.scene.rotation.y = -Math.PI / 3;
  gltf.scene.scale.set(1, 1, 1);
})

let christmasTree;
gltfLoader.load('./assets/models/christmas-tree-compressed.glb', (gltf) => {
  christmasTree = gltf.scene;
  gltf.scene.position.y = -6.5;
  gltf.scene.position.z += 8;
  gltf.scene.scale.set(0.27, 0.27, 0.27);
})


let computerModel;
gltfLoader.load('./assets/models/computer.glb', (gltf) => {
  computerModel = gltf.scene;
  gltf.scene.position.y = -4;
  gltf.scene.scale.set(4, 4, 4);
})

let dogFoodModel;
gltfLoader.load('./assets/models/dog-food.glb', (gltf) => {
  dogFoodModel = gltf.scene;
  gltf.scene.scale.set(6.5, 6.5, 6.5);
  gltf.scene.rotation.y = Math.PI;
  gltf.scene.position.y = 2.1;
  gltf.scene.position.z = 4;
  gltf.scene.position.x = 4;
})


let carModel;
gltfLoader.load('./assets/models/car_lowpoly.glb', (gltf) => {
  gltf.scene.scale.set(6, 6, 6);
  gltf.scene.position.set(0.3, 5.2, 0);
  carModel = gltf.scene;

  let carFolder = gui.addFolder('Car');
  carFolder.add(carModel.position, 'x').min(-20).max(20).step(0.001).name('position x');
  carFolder.add(carModel.position, 'y').min(-20).max(20).step(0.001).name('position y');
  carFolder.add(carModel.position, 'z').min(-20).max(20).step(0.001).name('position z');

  carFolder.add(carModel.rotation, 'x').min(-5).max(5).step(0.0001).name('rotation x');
  carFolder.add(carModel.rotation, 'y').min(-5).max(5).step(0.0001).name('rotation y');
  carFolder.close()
})


let carButtonModel;
gltfLoader.load('./assets/models/button.glb', (gltf) => {
  carButtonModel = gltf.scene;
  gltf.scene.scale.set(0.55, 0.55, 0.55);
  gltf.scene.position.set(0, 4.2, 9);
  gltf.scene.rotation.x = 1.3127;

  let btnFolder = gui.addFolder('Car color button');
  btnFolder.add(gltf.scene.position, 'x').min(-20).max(20).step(0.001).name('position x');
  btnFolder.add(gltf.scene.position, 'y').min(-20).max(20).step(0.001).name('position y');
  btnFolder.add(gltf.scene.position, 'z').min(-20).max(20).step(0.001).name('position z');

  btnFolder.add(gltf.scene.rotation, 'x').min(-5).max(5).step(0.0001).name('rotation x');
  btnFolder.add(gltf.scene.rotation, 'y').min(-5).max(5).step(0.0001).name('rotation y');
  btnFolder.close()
})

let gramophoneModel;
gltfLoader.load('./assets/models/gramophone4.glb', (gltf) => {
  gramophoneModel = gltf.scene;
  gltf.scene.position.y = 3;
  gltf.scene.position.z = -4;
  gltf.scene.scale.set(5, 5, 5)
})

let moleModel;
let bombModel;
gltfLoader.load('./assets/models/mole.glb', (gltf) => {
  gltf.scene.scale.set(0.1, 0.1, 0.1);
  gltf.scene.position.y = 2.3;
  gui.add(gltf.scene.position, 'x').min(-1.2).max(5).step(0.001);
  gui.add(gltf.scene.position, 'y').min(-5).max(5).step(0.001);
  gui.add(gltf.scene.position, 'z').min(-5.6).max(5).step(0.001);
  moleModel = gltf.scene;

})

gltfLoader.load('./assets/models/bomb.glb', (gltf) => {
  gltf.scene.scale.set(0.8, 0.8, 0.8);
  gltf.scene.position.y = 3;
  bombModel = gltf.scene;

})

// 
// 3D Text
// 
let jerseyFont;
fontLoader.load('./assets/fonts/jerysey_10.typeface.json', (font) => {
  // console.log(font);
  jerseyFont = font;
})

// 
// DATA POINTS ===========================================================================
// 
const canvas = document.querySelector("canvas");
const sizes = { width: window.innerWidth, height: window.innerHeight };

// 
// SCENE ==================================================================================
// 
const scene = new THREE.Scene();
// scene.background = skyImg
scene.background = sceneBgImg;
gui.add(scene, 'backgroundBlurriness').min(0).max(5).step(0.01)
gui.add(scene, 'backgroundIntensity').min(0).max(5).step(0.01)


// 
// Cloud
// 
let cloudModel;
let cloudModelArr = [];
let cloudPosArr = [[-10, 15, -3], [10, 20, -5], [30, 18, -4]];
gltfLoader.load('./assets/models/cloud_compressed.glb', (gltf) => {
  cloudModel = gltf.scene;
  cloudModel.rotation.y = Math.PI / 2
  cloudModel.position.y = 15;
  cloudModel.position.x = -10;
  cloudModel.scale.z = 1.3;
  cloudModel.traverse((obj) => {
    if (obj.isMesh) {
      obj.material = new THREE.MeshMatcapMaterial({ matcap: cloudMatcap, color: '#f7f7f7' });
      // obj.material = new THREE.MeshToonMaterial({ color: '#c9c9c9', gradientMap: gradientMap })
    }
  })

  cloudPosArr.forEach((pos) => {
    let cloudMesh = cloudModel.clone();
    cloudMesh.scale.z = 1.4;
    cloudMesh.rotation.y = Math.PI / 2;
    cloudMesh.position.set(pos[0], pos[1], pos[2]);
    cloudModelArr.push(cloudMesh);
    scene.add(cloudMesh);
  })

  cloudModelArr[1].rotation.z = 0.5
  cloudModelArr[2].rotation.z = 0.5
  // cloudModelArr[1].scale.set(2.3, 1, 1.5)
  let cloudDebug = {
    color: '#f7f7f7'
  }
  let cloudFolder = gui.addFolder('Cloud');
  cloudFolder.add(cloudModelArr[2].position, 'x').min(-100).max(20).step(0.001).name('position x');
  cloudFolder.add(cloudModelArr[2].position, 'y').min(-20).max(20).step(0.001).name('position y');
  cloudFolder.add(cloudModelArr[2].position, 'z').min(-20).max(20).step(0.001).name('position z');

  cloudFolder.add(cloudModelArr[2].rotation, 'x').min(-3.14).max(3.14).step(0.0001).name('rotation x');
  cloudFolder.add(cloudModelArr[2].rotation, 'y').min(-3.14).max(3.14).step(0.0001).name('rotation y');
  cloudFolder.add(cloudModelArr[2].rotation, 'z').min(-3.14).max(3.14).step(0.0001).name('rotation z');

  cloudFolder.add(cloudModelArr[2].scale, 'x').min(0).max(20).step(0.0001).name('scale x');
  cloudFolder.add(cloudModelArr[2].scale, 'y').min(0).max(20).step(0.0001).name('scale y');
  cloudFolder.add(cloudModelArr[2].scale, 'z').min(0).max(20).step(0.0001).name('scale z');

  cloudFolder.addColor(cloudDebug, 'color').onChange(() => {
    cloudModel.traverse((obj) => {
      if (obj.isMesh) {
        // obj.material = new THREE.MeshMatcapMaterial({ matcap: whiteMatcap });
        // obj.material = new THREE.MeshToonMaterial({ color: cloudDebug.color, gradientMap: gradientMap })
        obj.material.color = new THREE.Color(cloudDebug.color)
      }
    })
  })
  cloudFolder.close();
})


// 
// WAVE PLANE =============================================================================
// 
let objDebug = {
  topColor: '#d6ffff',
  bottomColor: '#51b4c8',
  sceneBG: '#98dafb',
  directionalLightColor: '#ffffff',
  ambientLightColor: '#ffffff'
}
// scene.background = new THREE.Color(objDebug.sceneBG);

let planeGeometry = new THREE.PlaneGeometry(150, 70, 256, 256);
let planeMaterial = new THREE.ShaderMaterial({
  vertexShader: planeVertexShader,
  fragmentShader: planeFragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uWaveSpeed: { value: 0.4 },
    uWaveAmplitude: { value: 0.45 },
    uWaveFrequency: { value: 0.07 },
    uTopColor: { value: new THREE.Color(objDebug.topColor) },
    uBottomColor: { value: new THREE.Color(objDebug.bottomColor) },
    uColorOffset: { value: 0.4 },
    uColorMult: { value: 1.27 }
  }
});

/*
uColorOffset: { value: 0.32 },
    uColorMult: { value: 1.35 }
*/

let waveFolder = gui.addFolder('Wave');

waveFolder.add(planeMaterial.uniforms.uWaveAmplitude, 'value')
  .name('uWaveAmplitude')
  .min(0)
  .max(1)
  .step(0.001)

waveFolder.add(planeMaterial.uniforms.uWaveFrequency, 'value')
  .name('uWaveFrequency')
  .min(0)
  .max(1)
  .step(0.001)

waveFolder.addColor(objDebug, 'topColor').onChange(() => {
  planeMaterial.uniforms.uTopColor.value.set(objDebug.topColor);
})

waveFolder.addColor(objDebug, 'bottomColor').onChange(() => {
  planeMaterial.uniforms.uBottomColor.value.set(objDebug.bottomColor);
})

waveFolder.add(planeMaterial.uniforms.uColorOffset, 'value')
  .name('uColorOffset')
  .min(0)
  .max(3)
  .step(0.01);

waveFolder.add(planeMaterial.uniforms.uColorMult, 'value')
  .name('uColorMult')
  .min(0)
  .max(3)
  .step(0.01);

waveFolder.add(planeMaterial.uniforms.uWaveSpeed, 'value')
  .name('uWaveSpeed')
  .min(0)
  .max(10)
  .step(0.01);

waveFolder.addColor(objDebug, 'sceneBG').onChange(() => {
  scene.background = new THREE.Color(objDebug.sceneBG);
})

waveFolder.close();

let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
// planeMesh.position.y = -1;
// planeMesh.rotation.z = Math.PI / 4;
scene.add(planeMesh);

planeMesh.rotation.x = -Math.PI / 2;
planeMesh.position.y = 2;
let bgPlaneMaterial = new THREE.MeshStandardMaterial()
bgPlaneMaterial.transparent = true;
bgPlaneMaterial.alphaMap = skyImg;
let bgPlane = new THREE.Mesh(new THREE.PlaneGeometry(150, 3, 1, 1), bgPlaneMaterial);
bgPlane.position.y = 2;
bgPlane.position.z = -30;
scene.add(bgPlane);

let planeDebug = {
  color: '#ffffff'
};
gui.addColor(planeDebug, 'color').onChange(() => {
  bgPlane.material.color = new THREE.Color(planeDebug.color);
})




// 
// CAMERA =============================================================================
// 

let camera;
let perspectiveCamera = new THREE.PerspectiveCamera(
  55,
  sizes.width / sizes.height,
  0.1,
  300
);
perspectiveCamera.position.set(-8, 8, 25);
camera = perspectiveCamera;

const cameraData = {
  frustumSize: 20,
  type: 'Perspective'
}
let aspect = window.innerWidth / window.innerHeight;
const orthographicCamera = new THREE.OrthographicCamera(
  (cameraData.frustumSize * aspect) / -2,
  (cameraData.frustumSize * aspect) / 2,
  cameraData.frustumSize / 2,
  cameraData.frustumSize / -2.5,
  0.1,
  300
)
// camera.zoom = 0.2;
orthographicCamera.position.set(-8, 20, 200);
// camera = orthographicCamera; // Uncomment to make orthographic by default

camera.lookAt(new THREE.Vector3(-8, 8, 0));


let cameraFolder = gui.addFolder('Camera');

cameraFolder.add(orthographicCamera.position, 'x').min(-30).max(100).step(0.01).onChange(() => {
  camera.lookAt(new THREE.Vector3(camera.position.x, 8, 0));
});
cameraFolder.add(orthographicCamera.position, 'y').min(0).max(100).step(0.01).onChange(() => {
  camera.lookAt(new THREE.Vector3(camera.position.x, 8, 0));
});
cameraFolder.add(orthographicCamera.position, 'z').min(0).max(300).step(0.01).onChange(() => {
  camera.lookAt(new THREE.Vector3(camera.position.x, 8, 0));
});

cameraFolder.add(cameraData, 'frustumSize').min(1).max(100).step(1).onChange(() => {
  camera.left = (-cameraData.frustumSize * aspect) / 2
  camera.right = (cameraData.frustumSize * aspect) / 2
  camera.top = cameraData.frustumSize / 2
  camera.bottom = -cameraData.frustumSize / 2
  camera.updateProjectionMatrix();
})

cameraFolder.add(cameraData, 'type', ['Perspective', 'Othrographic']).onChange(() => {
  if (cameraData.type === 'Perspective') {
    camera = perspectiveCamera;
    camera.updateProjectionMatrix();
    renderPass.camera = camera;
  }
  else {
    camera = orthographicCamera;
    camera.updateProjectionMatrix();
    renderPass.camera = camera;
  }
  camera.lookAt(new THREE.Vector3(-8, 8, 0));
})

cameraFolder.close();

// 
// AXES HELPER =============================================================================
// 
let axesHelper = new THREE.AxesHelper(10);
axesHelper.position.y = 3;
axesHelper.visible = false;
scene.add(axesHelper);
gui.add(axesHelper, 'visible').name('Axes helper')

// 
// LIGHTS =============================================================================
// 
let ambientLight = new THREE.AmbientLight('white', 3);
scene.add(ambientLight);

let directionalLight = new THREE.DirectionalLight('#c7c7c7', 6);
// directionalLight.position.x = -1.71;
directionalLight.position.x = 5.66;
directionalLight.position.y = 0.5;
directionalLight.position.z = -2;
scene.add(directionalLight);


let lightFolder = gui.addFolder('Light');
lightFolder.add(directionalLight.position, 'x').min(-30).max(30).step(0.01)
lightFolder.add(directionalLight.position, 'y').min(-30).max(30).step(0.01)
lightFolder.add(directionalLight.position, 'z').min(-30).max(30).step(0.01)


lightFolder.addColor(objDebug, 'directionalLightColor').onChange(() => {
  directionalLight.color = new THREE.Color(objDebug.directionalLightColor);
})


lightFolder.addColor(objDebug, 'ambientLightColor').onChange(() => {
  ambientLight.color = new THREE.Color(objDebug.ambientLightColor);
})


lightFolder.close();

// 
// RENDERER ============================================================================
//

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.gammaOutput = true;
renderer.gammaFactor = 3;
renderer.toneMapping = THREE['LinearToneMapping'];
renderer.toneMappingExposure = 1.13;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.render(scene, camera);

let rendererFolder = gui.addFolder('Renderer');

let rendererDebugObj = {
  toneMapping: 'LinearToneMapping'
}
rendererFolder.add(rendererDebugObj,
  'toneMapping',
  [
    'NoToneMapping',
    'LinearToneMapping',
    'ReinhardToneMapping',
    'CineonToneMapping',
    'ACESFilmicToneMapping',
    'AgXToneMapping',
    'NeutralToneMapping'
  ]
).onChange(() => {
  renderer.toneMapping = THREE[rendererDebugObj.toneMapping]
})

rendererFolder.add(renderer, 'toneMappingExposure').min(0).max(3).step(0.001);

rendererFolder.close();

// const labelRenderer = new CSS2DRenderer();
// labelRenderer.setSize(window.innerWidth, window.innerHeight);
// labelRenderer.domElement.style.position = 'absolute';
// labelRenderer.domElement.style.top = '0px';
// labelRenderer.domElement.style.pointerEvents = 'none';
// document.body.appendChild(labelRenderer.domElement);


// 
// POST PROCESSING =============================================================================
// 
// const renderTarget = new THREE.WebGLRenderTarget(
//   500,
//   500
// )

// const effectsComposer = new EffectComposer(renderer, renderTarget);
// effectsComposer.setSize(sizes.width, sizes.height);
// effectsComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// effectsComposer.alpha = true;

// const renderPass = new RenderPass(scene, camera);
// effectsComposer.addPass(renderPass);
// console.log(scene)
// let selectedObjects = [];

// let outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera, selectedObjects);
// outlinePass.renderToScreen = true;
// outlinePass.selectedObjects = selectedObjects;
// effectsComposer.addPass(outlinePass);
// let params = {
//   edgeStrength: 2,
//   edgeGlow: 1,
//   edgeThickness: 1.0,
//   pulsePeriod: 0,
//   usePatternTexture: false
// };

// outlinePass.edgeStrength = params.edgeStrength;
// outlinePass.edgeGlow = params.edgeGlow;
// outlinePass.visibleEdgeColor.set(0xffffff);
// outlinePass.hiddenEdgeColor.set(0xffffff);


// const unrealBloomPass = new UnrealBloomPass();
// unrealBloomPass.strength = 0.127;
// unrealBloomPass.radius = 0.1;
// unrealBloomPass.threshold = 0.68;
// effectsComposer.addPass(unrealBloomPass);

// let sMAAPass = new SMAAPass(
//   window.innerWidth * renderer.getPixelRatio(),
//   window.innerHeight * renderer.getPixelRatio()
// );

// effectsComposer.addPass(sMAAPass);

// let unrealBloomFolder = gui.addFolder('Unreal Bloom')

// unrealBloomFolder.add(unrealBloomPass, 'strength').min(0).max(1).step(0.001);

// unrealBloomFolder.add(unrealBloomPass, 'radius').min(0).max(1).step(0.001);

// unrealBloomFolder.add(unrealBloomPass, 'threshold').min(0).max(1).step(0.001);
// unrealBloomFolder.add(unrealBloomPass, 'enabled');

// unrealBloomFolder.add(sMAAPass, 'enabled').name('SMAA');

// unrealBloomFolder.close();


// 
// RESIZE =============================================================================
// 
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  aspect = window.innerWidth / window.innerHeight;

  if (cameraData.type === 'Orthographic') {
    camera.left = (-cameraData.frustumSize * aspect) / 2
    camera.right = (cameraData.frustumSize * aspect) / 2
    camera.top = cameraData.frustumSize / 2
    camera.bottom = -cameraData.frustumSize / 2
    camera.updateProjectionMatrix();
  }
  else {
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
  }


  renderer.setSize(sizes.width, sizes.height);
  // labelRenderer.setSize(window.innerWidth, window.innerHeight);
  // effectsComposer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);
});

// 
// ORBIT CONTROLS =====================================================================
// 
let controls;
// controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.enabled = true;

// gui.add(controls, 'enabled').name('OrbitControls')

// 
// ANIMATION UTILS ===================================================================
// 

const levelChangeAudio = document.getElementById('levelChangeAudio');
const crashAudio = document.getElementById('crashAudio');
crashAudio.volume = 0.5
const pointAudio = document.getElementById('PointAudio');
const bombAudio = document.getElementById('BombAudio');
const itemUpAudio = document.getElementById('ItemUpAudio');
const itemDownAudio = document.getElementById('ItemDownAudio');
pointAudio.volume = 0.5;
bombAudio.volume = 0.5;
itemUpAudio.volume = 0.4;
itemDownAudio.volume = 0.4;

const waveAudio = document.getElementById('WaveAudio');
waveAudio.volume = 0.3;
waveAudio.loop = true;
const swingAudio = document.getElementById('SwingAudio');
swingAudio.volume = 0.1;
swingAudio.loop = true;

let allAudioArr = [levelChangeAudio, crashAudio, pointAudio, bombAudio, itemDownAudio, itemUpAudio, waveAudio, swingAudio];

// gui.add(waveAudio, 'volume').min(0).max(1).step(0.01);
// gui.add(swingAudio, 'volume').min(0).max(1).step(0.01);

// gui.add(levelChangeAudio, 'volume').min(0).max(1).step(0.01);
// gui.add(crashAudio, 'volume').min(0).max(1).step(0.01);

let module1Group;
let module2Group;
let module2Interval;
let module3Group;
let module4Group;
let module5Group;
let module6Group;
let module6Interval;
let module7Group;
let module8Group;
let module9Group;

//
// Raycaster
//

let raycaster = new THREE.Raycaster();
let btnIntersectionFlag; // RELATED TO MODULE 5 - Car btns

const mouse = new THREE.Vector2()

// window.addEventListener('mousemove', (event) => {
// })


// Throttling function
function throttleForMouse(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      // console.log('Lowering')
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  }
}

// Throttle the mousemove event
const throttledMouseMove = throttleForMouse((event) => {
  var canvasBounds = renderer.domElement.getBoundingClientRect();

  mouse.x = ((event.clientX - canvasBounds.left) / (canvasBounds.width)) * 2 - 1;
  mouse.y = - ((event.clientY - canvasBounds.top) / (canvasBounds.height)) * 2 + 1;
  // updateRaycasting();
}, 100);

window.addEventListener('mousemove', throttledMouseMove);


// 
// PHYSICS
// 
let objectsToUpdate = [];
let world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
// world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;

let defaultMaterial = new CANNON.Material('default');

let defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.7
  }
)
world.addContactMaterial(defaultContactMaterial);

// 
///////////////////////////////////////////////////////////////Debugger//////////////////////////////////////////////////////////////////////////////
// 
let CannonDebugRenderer = function (scene, world, options) {
  options = options || {};

  this.scene = scene;
  this.world = world;

  this._meshes = [];

  // this._material = new THREE.MeshBasicMaterial({
  //   color: 0x00ff00,
  //   wireframe: true,
  // });
  this._material = new THREE.MeshStandardMaterial({ color: 'red', wireframe: true })
  this._sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
  this._boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  this._planeGeometry = new THREE.PlaneGeometry(10, 10, 20, 20);
  this._cylinderGeometry = new THREE.CylinderGeometry(1, 1, 10, 10);
};

let _GlobalSphereArr = [];
let _GlobalSphereBodyArr = [];
CannonDebugRenderer.prototype = {
  tmpVec0: new CANNON.Vec3(),
  tmpVec1: new CANNON.Vec3(),
  tmpVec2: new CANNON.Vec3(),
  tmpQuat0: new CANNON.Vec3(),

  update: function () {
    var bodies = this.world.bodies;
    var meshes = this._meshes;
    var shapeWorldPosition = this.tmpVec0;
    var shapeWorldQuaternion = this.tmpQuat0;

    var meshIndex = 0;

    for (var i = 0; i !== bodies.length; i++) {
      var body = bodies[i];
      var bodyColor = body.bodyColor;
      for (var j = 0; j !== body.shapes.length; j++) {
        var shape = body.shapes[j];

        this._updateMesh(meshIndex, body, shape, bodyColor);

        var mesh = meshes[meshIndex];

        if (mesh) {
          // Get world position
          body.quaternion.vmult(body.shapeOffsets[j], shapeWorldPosition);
          body.position.vadd(shapeWorldPosition, shapeWorldPosition);

          // Get world quaternion
          body.quaternion.mult(body.shapeOrientations[j], shapeWorldQuaternion);

          // Copy to meshes
          mesh.position.copy(shapeWorldPosition);
          mesh.quaternion.copy(shapeWorldQuaternion);
        }

        meshIndex++;
      }
    }

    for (var i = meshIndex; i < meshes.length; i++) {
      var mesh = meshes[i];
      if (mesh) {
        this.scene.remove(mesh);
      }
    }

    meshes.length = meshIndex;
  },

  _updateMesh: function (index, body, shape, bodyColor) {
    var mesh = this._meshes[index];
    if (!this._typeMatch(mesh, shape)) {
      if (mesh) {
        this.scene.remove(mesh);
      }
      mesh = this._meshes[index] = this._createMesh(shape, bodyColor);
    }
    this._scaleMesh(mesh, shape);
  },

  _typeMatch: function (mesh, shape) {
    if (!mesh) {
      return false;
    }
    var geo = mesh.geometry;
    return (
      (geo instanceof THREE.SphereGeometry && shape instanceof CANNON.Sphere) ||
      (geo instanceof THREE.BoxGeometry && shape instanceof CANNON.Box) ||
      (geo instanceof THREE.PlaneGeometry && shape instanceof CANNON.Plane) ||
      (geo.id === shape.geometryId &&
        shape instanceof CANNON.ConvexPolyhedron) ||
      (geo.id === shape.geometryId && shape instanceof CANNON.Trimesh) ||
      (geo.id === shape.geometryId && shape instanceof CANNON.Heightfield)
    );
  },

  _createMesh: function (shape, bodyColor) {
    var mesh;
    var material = this._material;

    switch (shape.type) {
      case CANNON.Shape.types.SPHERE:
        mesh = new THREE.Mesh(this._sphereGeometry, new THREE.MeshMatcapMaterial({ matcap: ballMatCap }));

        mesh.material.color = bodyColor;
        _GlobalSphereArr.push(mesh);
        break;

      case CANNON.Shape.types.BOX:
        mesh = new THREE.Mesh(this._boxGeometry, material);
        material.color = new THREE.Color('lightgreen')
        mesh.visible = false;
        break;

      case CANNON.Shape.types.PLANE:
        mesh = new THREE.Mesh(this._planeGeometry, material);
        break;

      case CANNON.Shape.types.CONVEXPOLYHEDRON:
        // Create mesh
        var geo = new THREE.Geometry();

        // Add vertices
        for (var i = 0; i < shape.vertices.length; i++) {
          var v = shape.vertices[i];
          geo.vertices.push(new THREE.Vector3(v.x, v.y, v.z));
        }

        for (var i = 0; i < shape.faces.length; i++) {
          var face = shape.faces[i];

          // add triangles
          var a = face[0];
          for (var j = 1; j < face.length - 1; j++) {
            var b = face[j];
            var c = face[j + 1];
            geo.faces.push(new THREE.Face3(a, b, c));
          }
        }
        geo.computeBoundingSphere();
        geo.computeFaceNormals();

        mesh = new THREE.Mesh(geo, material);
        shape.geometryId = geo.id;
        break;

      case CANNON.Shape.types.TRIMESH:
        var geometry = new THREE.Geometry();
        var v0 = this.tmpVec0;
        var v1 = this.tmpVec1;
        var v2 = this.tmpVec2;
        for (var i = 0; i < shape.indices.length / 3; i++) {
          shape.getTriangleVertices(i, v0, v1, v2);
          geometry.vertices.push(
            new THREE.Vector3(v0.x, v0.y, v0.z),
            new THREE.Vector3(v1.x, v1.y, v1.z),
            new THREE.Vector3(v2.x, v2.y, v2.z)
          );
          var j = geometry.vertices.length - 3;
          geometry.faces.push(new THREE.Face3(j, j + 1, j + 2));
        }
        geometry.computeBoundingSphere();
        geometry.computeFaceNormals();
        mesh = new THREE.Mesh(geometry, material);
        shape.geometryId = geometry.id;
        break;

      case CANNON.Shape.types.HEIGHTFIELD:
        var geometry = new THREE.Geometry();
        var v0 = this.tmpVec0;
        var v1 = this.tmpVec1;
        var v2 = this.tmpVec2;
        for (var xi = 0; xi < shape.data.length - 1; xi++) {
          for (var yi = 0; yi < shape.data[xi].length - 1; yi++) {
            for (var k = 0; k < 2; k++) {
              shape.getConvexTrianglePillar(xi, yi, k === 0);
              v0.copy(shape.pillarConvex.vertices[0]);
              v1.copy(shape.pillarConvex.vertices[1]);
              v2.copy(shape.pillarConvex.vertices[2]);
              v0.vadd(shape.pillarOffset, v0);
              v1.vadd(shape.pillarOffset, v1);
              v2.vadd(shape.pillarOffset, v2);
              geometry.vertices.push(
                new THREE.Vector3(v0.x, v0.y, v0.z),
                new THREE.Vector3(v1.x, v1.y, v1.z),
                new THREE.Vector3(v2.x, v2.y, v2.z)
              );
              var i = geometry.vertices.length - 3;
              geometry.faces.push(new THREE.Face3(i, i + 1, i + 2));
            }
          }
        }
        geometry.computeBoundingSphere();
        geometry.computeFaceNormals();
        mesh = new THREE.Mesh(geometry, material);
        shape.geometryId = geometry.id;
        break;
    }

    if (mesh) {
      this.scene.add(mesh);
    }

    return mesh;
  },

  _scaleMesh: function (mesh, shape) {
    switch (shape.type) {
      case CANNON.Shape.types.SPHERE:
        var radius = shape.radius;
        mesh.scale.set(radius, radius, radius);
        break;

      case CANNON.Shape.types.BOX:
        mesh.scale.copy(shape.halfExtents);
        mesh.scale.multiplyScalar(2);
        break;

      case CANNON.Shape.types.CONVEXPOLYHEDRON:
        mesh.scale.set(1, 1, 1);
        break;

      case CANNON.Shape.types.TRIMESH:
        mesh.scale.copy(shape.scale);
        break;

      case CANNON.Shape.types.HEIGHTFIELD:
        mesh.scale.set(1, 1, 1);
        break;
    }
  },
};

var cannonDebugRenderer = new CannonDebugRenderer(scene, world);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 
// GAME LOOP ==========================================================================
// 
const clock = new THREE.Clock();
let oldElapsedTime;
let animate = () => {
  let elapsedTime = clock.getElapsedTime();
  let deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;


  if (module8Group || objectsToUpdate.length > 0) {
    if (!module8Group) {
      // console.log('Deleting Spheres', elapsedTime)
      _GlobalSphereBodyArr.forEach((sphere) => {
        world.removeBody(sphere)
      })
      _GlobalSphereArr.forEach((sphere) => {
        scene.remove(sphere)
      })
      objectsToUpdate = []
      _GlobalSphereArr = []
      _GlobalSphereBodyArr = []
    }
    // console.log('Updating Spheres', elapsedTime)
    cannonDebugRenderer.update();
    world.step(1 / 50);
  }

  // for (let i = 0; i < objectsToUpdate.length; i++) {
  //   objectsToUpdate[i].mesh.position.copy(objectsToUpdate[i].body.position);
  //   objectsToUpdate[i].mesh.quaternion.copy(objectsToUpdate[i].body.quaternion);
  // }

  // objectsToUpdate.forEach((object) => {
  //   // object.mesh.position.copy(new THREE.Vector3(object.body.position.x, object.body.position.y - 2.6, object.body.position.z));
  //   object.mesh.position.copy(object.body.position);
  //   object.mesh.quaternion.copy(object.body.quaternion);
  // })

  // GRAMOPHONE ANIMATION
  if (audioVisAnimMixer && module7Group) {
    // let delta = clock.getDelta();
    audioVisAnimMixer.update(0.016) // Constant delta time to battle the getDelta glitch
  }

  // DOG ANIMATION
  if (dogAnimMixer && module4Group) {
    // let delta = clock.getDelta();
    dogAnimMixer.update(0.016 * 0.6); // Constant delta time to battle the getDelta glitch
  }

  // BOAT ANIMATION
  if (boatModel && showBoat) {
    let yDiff = (Math.sin(elapsedTime * 0.5 * 2.5) * 0.1 + 1.9);
    if (boatModel.position.y - yDiff < 0.001 || yDiff - boatModel.position.y < 0.001)
      boatModel.position.y = yDiff
    boatModel.rotation.z = Math.cos(elapsedTime * 0.5 * 2.5) * 0.05;
  }
  planeMaterial.uniforms.uTime.value = elapsedTime;

  // CLOUDS ANIMATION
  if (cloudModelArr.length > 0) {
    cloudModelArr.forEach((cloudMesh) => {
      if (cloudMesh.position.x <= -40) {
        cloudMesh.position.x = 25;
      }
    })

    cloudModelArr[0].position.x -= 0.0025;
    cloudModelArr[1].position.x -= 0.0035;
    cloudModelArr[2].position.x -= 0.0025;
    // lowPolyClouds.position.x = Math.sin(elapsedTime * 0.3);
    // lowPolyClouds.position.z = Math.cos(elapsedTime * 0.2);
  }

  // PLUGEE ANIMATION
  if (plugeeModel) {
    plugeeModel.position.y = 3 - 0.1 * Math.cos(elapsedTime * 1.25);
    plugeeModel.lookAt(camera.position)
  }

  // ORBIT CONTROLS HANDLER
  if (controls) {
    controls.update();
    camera.lookAt(new THREE.Vector3(-1, 5, 0));
  }

  // DIRECTIONAL LIGHT TRANSFORM
  if (module4Group || module7Group) {
    if (directionalLight.position.x <= 30) {
      directionalLight.position.x += 0.02;
    }
  }
  else {
    if (directionalLight.position.x >= -1.71) {
      directionalLight.position.x -= 0.05;
    }
  }

  if (module1Group) {
    module1Group.children[0].rotation.y += 0.006;
    module1Group.children[0].rotation.x += 0.004;
    module1Group.children[1].position.y = Math.sin(clock.getElapsedTime()) * 0.5 + 1;
    module1Group.children[2].position.y = Math.cos(clock.getElapsedTime()) * 0.6 + 0.6;
  }

  // AMBIENT LIGHT INTENSITY
  if (module2Group) {
    if (ambientLight.intensity >= 1) {
      ambientLight.intensity -= 0.01;
    }
    pLights.forEach(l => l.update());
  }
  else {
    if (ambientLight.intensity < 3) {
      ambientLight.intensity += 0.01;
    }
  }

  document.documentElement.style.cursor = 'auto';

  // 
  // CAR MODEL - RAYCASTING
  // 
  if (module5Group && module5Group.children.length > 2) {
    if (carModel) {
      carModel.rotation.y += 0.006;
    }
    // Tween.update()
    let btnArr = module5Group.children.filter((obj) => {
      return obj.name.includes('Btn') ? obj : false;
    })
    // raycaster.set(mouse, cameraDirection);
    camera.updateMatrix();
    camera.updateMatrixWorld();
    // scene.updateMatrixWorld(true)
    let currentBtnFlag = btnIntersectionFlag;
    raycaster.setFromCamera(mouse, camera);
    let redBtnIntersect = raycaster.intersectObject(btnArr[0]);
    if (redBtnIntersect.length > 0) {
      gsap.to(btnArr[0].scale, { x: 0.6, y: 0.6, z: 0.6, duration: 0.5 })
      document.documentElement.style.cursor = 'pointer';
      btnIntersectionFlag = 0;
    }
    else {
      gsap.to(btnArr[0].scale, { x: 0.55, y: 0.55, z: 0.55, duration: 0.5 })
    }

    let blueBtnIntersect = raycaster.intersectObject(btnArr[1]);
    if (blueBtnIntersect.length > 0) {
      gsap.to(btnArr[1].scale, { x: 0.6, y: 0.6, z: 0.6, duration: 0.5 })
      document.documentElement.style.cursor = 'pointer';
      btnIntersectionFlag = 1;
    }
    else {
      gsap.to(btnArr[1].scale, { x: 0.55, y: 0.55, z: 0.55, duration: 0.5 })
    }


    let yellowBtnIntersect = raycaster.intersectObject(btnArr[2]);
    if (yellowBtnIntersect.length > 0) {
      gsap.to(btnArr[2].scale, { x: 0.6, y: 0.6, z: 0.6, duration: 0.5 })
      document.documentElement.style.cursor = 'pointer';
      btnIntersectionFlag = 2;
    }
    else {
      gsap.to(btnArr[2].scale, { x: 0.55, y: 0.55, z: 0.55, duration: 0.5 })
    }

    // if(currentBtnFlag === btnIntersectionFlag){
    //   btnIntersectionFlag = undefined;
    // }

  }

  // 
  // WHACK A MOLE - Raycaster Logic
  // 
  if (module9Group && module9Group.children.length > 0) {
    menuHover = false;
    currItemHover = undefined;
    camera.updateMatrix();
    camera.updateMatrixWorld();
    raycaster.setFromCamera(mouse, camera);

    if (gameFlag == false) {
      let intersectArr = raycaster.intersectObject(menuPlane);
      if (intersectArr.length > 0) {
        document.documentElement.style.cursor = 'pointer';
        menuHover = true;
      }
    }
    else {
      let intersectArr = raycaster.intersectObjects(trackerArr);
      if (intersectArr.length > 0) {
        document.documentElement.style.cursor = 'pointer';
        let obj = intersectArr[0].object;
        currItemHover = obj;
      }
    }

  }


  // 
  // BLOB SHADER UPDATES
  // 
  if (module6Group) {
    // module6Group.children[0].material.uniforms.uTime.value += 0.05;

    module6Group.children[0].material.uniforms.Tiempo.value += 0.01
    module6Group.children[0].rotation.x += 0.005;
    module6Group.children[0].rotation.y += 0.005;


    module6Group.children[1].material.uniforms.Tiempo.value += 0.005
    module6Group.children[1].rotation.x += 0.005;
    module6Group.children[1].rotation.y += 0.005;
  }

  // 
  // BLOB SHADER UPDATES
  // 
  if (module7Group && module7Group.children.length > 2) {
    module7Group.children[1].rotation.y += 0.005;
  }
  // effectsComposer.render();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

// 
// DOM INTERACTIONS ===============================================================================
// 
let renewControls = () => {
  if (controls)
    controls.dispose()
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.005;
  controls.enabled = true;
  controls.minPolarAngle = 1;
  controls.maxPolarAngle = Math.PI * 0.42;
  // How far you can orbit horizontally, upper and lower limits.
  // If set, the interval [ min, max ] must be a sub-interval of [ - 2 PI, 2 PI ], with ( max - min < 2 PI )
  controls.minAzimuthAngle = -Math.PI / 8; // radians
  controls.maxAzimuthAngle = Math.PI / 8; // radians
  controls.maxZoom = 3;
  controls.minZoom = 1;
}
let cameraPos = { x: 0, y: 26, z: 100 }
let switchOrthographicView = () => {
  if (VOLUME_MODE == 'On') {
    gsap.killTweensOf(swingAudio);
    waveAudio.play();
    waveAudio.volume = 0.7;
    swingAudio.play();
    swingAudio.volume = 0;
    gsap.to(
      swingAudio,
      {
        volume: 0.3,
        duration: 3.5
      }
    )
  }
  cameraData.type = 'Orthographic'
  camera = orthographicCamera;
  camera.position.set(0, 26, 100);

  // gui.add(camera.position, 'x').min(-10).max(50).step(0.01);
  // gui.add(camera.position, 'y').min(-10).max(50).step(0.01);
  // gui.add(camera.position, 'z').min(-10).max(50).step(0.01);

  if (window.innerWidth < 650) {
    cameraData.frustumSize = 32;
    camera.position.y = 30;
    cameraPos.y = 30;
    // lowPolyClouds.position.y = 15;
  }
  else {
    cameraData.frustumSize = 25;
    // lowPolyClouds.position.y = 15;
  }
  camera.left = (-cameraData.frustumSize * aspect) / 2
  camera.right = (cameraData.frustumSize * aspect) / 2
  camera.top = cameraData.frustumSize / 2
  camera.bottom = -cameraData.frustumSize / 2
  // camera.lookAt(new THREE.Vector3(-1, 5, 0));
  camera.updateProjectionMatrix();
  directionalLight.position.x = 5
  planeMaterial.uniforms.uWaveFrequency.value = 0.04
  planeMaterial.uniforms.uWaveSpeed.value = 0.2
  scene.remove(bgPlane)
  planeMesh.scale.set(1, 1.6, 1);
  // document.querySelector('.change-view').style.display = 'none';
  // document.querySelector('.next-view').style.display = 'block';
  // document.querySelector('.prev-view').style.display = 'block';

  document.querySelector('div.module-btn').classList.remove('hide');
  document.querySelector('div.module-desc-container').classList.remove('hide');
  document.querySelector('div.close-btn').classList.remove('hide');
  document.querySelector('div.sound-toggle-btn').classList.remove('hide');
  document.querySelector('div.enter-interaction').classList.add('hide');
  document.querySelector('div.theme-toggle-btn').classList.add('left-align');


  let pointer = document.querySelector('div.pointer');
  pointer.classList.remove('hide');
  const centerX = window.innerWidth / 2;
  gsap.killTweensOf(pointer);
  gsap.set(pointer, {       // Time it takes to complete one oscillation
    x: centerX + 100,
  })

  gsap.to(pointer, {
    duration: 1,        // Time it takes to complete one oscillation
    x: centerX - 100,             // Move to the right by 300px
    repeat: 5,         // Infinite repeats
    yoyo: true,         // Reverses back after moving to the right
    ease: "power1.inOut", // Smooth in-out effect
    onComplete: () => {
      // Fade out the pointer div after 5 oscillations
      pointer.classList.add('hide');
    }
  });
  // gsap.to(pointer, {x: 100, duration:1, repeat:-1})
  // gsap.to(pointer, {x: -100, duration:1, delay:1, repeat:-1})

  loadModule()
  updateModuleBtn();

  renewControls();
  if (controls) {
    gui.add(controls, 'enabled').name('OrbitControls')
  }
  plugeeModel.position.x -= 1.5;
  boatModel.position.x -= 1.5;
  islandModel.position.x -= 1.5;

  cloudModelArr[0].position.y -= 1;
  cloudModelArr[1].position.y -= 4;
  cloudModelArr[2].position.y -= 2;
}

let animHappened = false;
let delIslandTimeout;
let switchPerspectiveView = () => {
  gsap.to(
    swingAudio,
    {
      volume: 0,
      duration: 2,

      onComplete: () => {
        waveAudio.currentTime = 0;
        swingAudio.currentTime = 0;
        waveAudio.pause();
        swingAudio.pause();
      }
    }
  )

  gsap.to(
    waveAudio,
    {
      volume: 0,
      duration: 2,
    }
  )

  if (currModuleNum != 0) {
    // scene.remove(landMesh);
    landMesh.position.x += 1.5;
    // let pseudoLand;
    // islandModel.traverse((obj) => {
    //   if (obj.isMesh) {
    //     if (obj.name == 'land') {
    //       pseudoLand = obj.clone();
    //       scene.add(pseudoLand);
    //       // landMesh.position.x = -1.5;
    //       // landMesh.position.y = -0.45;
    //       // landMesh.rotation.y = -Math.PI / 3;
    //       // landMesh.scale.set(10, 10, 10);
    //     }
    //   }
    // })
    let func = (animFuncArr[currModuleNum])
    func('destroy');
    clearTimeout(delIslandTimeout);
    module0Animation('build');
    setTimeout(() => {
      scene.remove(landMesh)
    }, 2000)
  }

  if (animHappened && currModuleNum == 0) {
    // console.log('HERe')
    scene.remove(landMesh)
  }


  cameraData.type = 'Perspective'
  camera = perspectiveCamera;
  camera.position.set(-8, 8, 25);
  controls = undefined;
  camera.lookAt(new THREE.Vector3(-8, 8, 0));

  plugeeModel.position.x += 1.5;
  boatModel.position.x += 1.5;
  islandModel.position.x += 1.5;

  cloudModelArr[0].position.y += 1;
  cloudModelArr[1].position.y += 4;
  cloudModelArr[2].position.y += 2;


  planeMaterial.uniforms.uWaveFrequency.value = 0.07
  planeMaterial.uniforms.uWaveSpeed.value = 0.4
  planeMesh.scale.set(1, 1, 1);
  scene.add(bgPlane)

  document.querySelector('div.module-btn').classList.add('hide');
  document.querySelector('div.module-desc-container').classList.add('hide');
  document.querySelector('div.close-btn').classList.add('hide');
  document.querySelector('div.enter-interaction').classList.remove('hide');
  document.querySelector('div.sound-toggle-btn').classList.add('hide');
  document.querySelector('div.theme-toggle-btn').classList.remove('left-align');
  document.querySelector('div.pointer').classList.add('hide');

  prevModuleNum = -1;
  currModuleNum = 0;
  nextModuleNum = 1;
}


let changeViewEventListener = () => {
  if (camera.type === 'PerspectiveCamera')
    switchOrthographicView();
  else
    switchPerspectiveView();
}

document.querySelector('.change-view').addEventListener('click', changeViewEventListener);
document.querySelector('div.close-btn').addEventListener('click', changeViewEventListener);

let VOLUME_MODE = 'On';
document.querySelector('div.sound-toggle-btn').addEventListener('click', () => {
  if (VOLUME_MODE === 'On') {
    document.querySelector('div.sound-toggle-btn>svg.sound-on').classList.add('hide');
    document.querySelector('div.sound-toggle-btn>svg.sound-off').classList.remove('hide');
    VOLUME_MODE = 'Off'

    allAudioArr.forEach((audio) => {
      // audio.currentTime = 0;
      audio.pause();
      // console.log(audio.volume)
      audio.volume = 0;
    })
  }
  else {
    document.querySelector('div.sound-toggle-btn>svg.sound-on').classList.remove('hide');
    document.querySelector('div.sound-toggle-btn>svg.sound-off').classList.add('hide');
    VOLUME_MODE = 'On'
    levelChangeAudio.volume = 1;
    crashAudio.volume = 0.5;
    pointAudio.volume = 0.5;
    bombAudio.volume = 0.5;
    itemUpAudio.volume = 0.4;
    itemDownAudio.volume = 0.4;

    gsap.killTweensOf(swingAudio);
    waveAudio.play();
    waveAudio.volume = 0.7;
    swingAudio.play();
    swingAudio.volume = 0;
    gsap.to(
      swingAudio,
      {
        volume: 0.3,
        duration: 3.5
      }
    )
  }
})

let CURRENT_MODE = 'Day';
let MODE_CHANGING = false;
document.querySelector('.theme-toggle-btn').addEventListener('click', () => {
  // console.log('Toggle mode:', CURRENT_MODE);
  if (CURRENT_MODE == 'Day' && !MODE_CHANGING && document.querySelector('.toggle-mode').innerText == 'NIGHT MODE') {
    CURRENT_MODE = 'Night'
    changeMode();
    document.querySelector('div.theme-toggle-btn').style.backgroundColor = '#0A365D';
    document.querySelector('div.theme-toggle-btn>svg.sun').classList.remove('hide');
    document.querySelector('div.theme-toggle-btn>svg.moon').classList.add('hide');
    document.querySelector('.toggle-mode').innerText = 'DAY MODE';
    MODE_CHANGING = true;
  }
  else if (CURRENT_MODE == 'Night' && !MODE_CHANGING && document.querySelector('.toggle-mode').innerText == 'DAY MODE') {
    CURRENT_MODE = 'Day'
    changeMode();
    document.querySelector('div.theme-toggle-btn').style.backgroundColor = '#fff';
    document.querySelector('div.theme-toggle-btn>svg.sun').classList.add('hide');
    document.querySelector('div.theme-toggle-btn>svg.moon').classList.remove('hide');
    document.querySelector('.toggle-mode').innerText = 'NIGHT MODE'
    MODE_CHANGING = true;
  }
})

let changeMode = () => {
  let topColor;
  let bottomColor;
  let lightColor;
  let cloudColor;
  let bgGradient;
  let bgPlaneColor;
  let sunColor;
  let targetSunColor;
  let currSunPos;
  let targetSunPos;
  let textColor2D;
  let bgColor2D;
  let svgColor;
  if (CURRENT_MODE == 'Night') {
    topColor = new THREE.Color('#fdbe35')
    bottomColor = new THREE.Color('#4d3c00')
    lightColor = new THREE.Color('#cc6d00');
    cloudColor = topColor;
    sunColor = new THREE.Color('yellow');
    targetSunColor = new THREE.Color('#ff7300')
    bgGradient = 'rgb(4, 36, 87)'
    // bgPlaneColor = new THREE.Color('#bfbfbf');
    // 7f9bc7
    bgPlaneColor = new THREE.Color('#6f96b3');
    currSunPos = [-60, 55, -50];
    targetSunPos = [20, -5, -50];
    gsap.to(scene, { backgroundIntensity: 0.58, duration: 2 });

    textColor2D = '#fff';
    bgColor2D = '#ebebeb';
    svgColor = '#0084FF'


    document.querySelector('div.close-btn').style.backgroundColor = '#0A365D';
    document.querySelector('div.close-btn>svg').style.fill = '#ebebeb';
    document.querySelector('div.sound-toggle-btn').style.backgroundColor = '#0A365D';
    document.querySelector('div.sound-toggle-btn>svg.sound-on').style.fill = '#ebebeb';
    document.querySelector('div.sound-toggle-btn>svg.sound-off').style.fill = '#ebebeb';
    // bgGradient = `linear-gradient(rgba(2, 4, 42, 1) 0%, rgba(9, 70, 121, 1) 20%, rgb(225 141 75) 46%)`;
  }
  else {
    topColor = new THREE.Color(objDebug.topColor)
    bottomColor = new THREE.Color(objDebug.bottomColor)
    lightColor = new THREE.Color('#c7c7c7');
    bgPlaneColor = new THREE.Color('#ffffff');
    sunColor = new THREE.Color('orange')
    targetSunColor = new THREE.Color('yellow');
    cloudColor = new THREE.Color('#f7f7f7');
    bgGradient = `rgba(0, 212, 255, 1)`;
    currSunPos = [20, -5, -50];
    targetSunPos = [-60, 55, -50];

    textColor2D = '#000';
    bgColor2D = '#fff';
    svgColor = 'blue'
    gsap.to(scene, { backgroundIntensity: 1, duration: 2 })


    document.querySelector('div.close-btn').style.backgroundColor = '#fff';
    document.querySelector('div.close-btn>svg').style.fill = '#0A365D';
    document.querySelector('div.sound-toggle-btn').style.backgroundColor = '#fff';
    document.querySelector('div.sound-toggle-btn>svg.sound-on').style.fill = '#0A365D';
    document.querySelector('div.sound-toggle-btn>svg.sound-off').style.fill = '#0A365D';
  }
  gsap.to(planeMaterial.uniforms.uTopColor.value, { r: topColor.r, g: topColor.g, b: topColor.b, duration: 2 })
  gsap.to(planeMaterial.uniforms.uBottomColor.value, { r: bottomColor.r, g: bottomColor.g, b: bottomColor.b, duration: 2 })
  // console.log(lightColor)
  gsap.to(directionalLight.color, { r: lightColor.r, g: lightColor.g, b: lightColor.b, duration: 2 })
  gsap.to(document.querySelector('body'), {
    background: bgGradient,
    yoyo: false, duration: 2
  })

  gsap.to(bgPlane.material.color, { r: bgPlaneColor.r, g: bgPlaneColor.g, b: bgPlaneColor.b, duration: 2 })

  if (cloudModelArr.length > 0) {
    cloudModelArr.forEach((cloudMesh) => {
      cloudMesh.traverse((obj) => {
        if (obj.isMesh)
          gsap.to(obj.material.color, { r: cloudColor.r, g: cloudColor.g, b: cloudColor.b, duration: 2 })
      })
    })
  }

  let sunR = 3;
  if (camera.type === 'OrthographicCamera') {
    currSunPos[2] -= 10;
    targetSunPos[2] -= 10;
    sunR = 2;
  }
  let sunMesh = new THREE.Mesh(new THREE.SphereGeometry(sunR, 64, 64), new THREE.MeshBasicMaterial({ color: sunColor }));
  sunMesh.position.set(currSunPos[0], currSunPos[1], currSunPos[2]);
  scene.add(sunMesh);

  gsap.to(sunMesh.position, { x: targetSunPos[0], y: targetSunPos[1], z: targetSunPos[2], duration: 2, onComplete: () => { scene.remove(sunMesh) } })

  gsap.to(sunMesh.material.color, { r: targetSunColor.r, g: targetSunColor.g, b: targetSunColor.b, duration: 2 })

  document.querySelector('.change-view').style.backgroundColor = bgColor2D
  // document.querySelector('.change-view').style.color = textColor2D

  document.querySelector('div.module-btn').style.backgroundColor = bgColor2D
  // document.querySelector('div.module-btn').style.color = textColor2D

  document.querySelector('div.module-desc-container').style.backgroundColor = bgColor2D
  // document.querySelector('div.module-desc-container').style.color = textColor2D



  setTimeout(() => {
    MODE_CHANGING = false;
  }, 2000)
}

let landMesh;
let module0Animation = (stage) => {
  if (stage === 'build') {
    scene.add(islandModel);
    setTimeout(() => {
      crashAudio.play();
      setTimeout(() => {
        showBoat = true;
      }, 1000)
    }, 1000)
    gsap.to(islandModel.position, { y: -0.45, duration: 1.0, delay: 1.0, ease: "expoScale(0.5,7,power1.in)", })
    gsap.to(boatModel.position, { y: 2, duration: 1.0, delay: 1.0, ease: "expoScale(0.5,7,power1.in)", })

  }
  else if (stage === 'destroy') {
    islandModel.traverse((obj) => {
      if (obj.isMesh) {
        if (obj.name == 'land') {
          landMesh = obj.clone();
          scene.add(landMesh);
          landMesh.position.x = -1.5;
          landMesh.position.y = -0.45;
          landMesh.rotation.y = -Math.PI / 3;
          landMesh.scale.set(10, 10, 10);
        }
      }
    })

    setTimeout(() => {
      crashAudio.play();
    }, 200)
    gsap.to(islandModel.position, { y: -15, duration: 1.0, delay: 0.5, ease: "expoScale(0.5,7,power1.in)", })
    gsap.to(boatModel.position, { y: -3, duration: 1.0, delay: 0.9, ease: "expoScale(0.5,7,power1.in)", })
    showBoat = false;
    delIslandTimeout = setTimeout(() => {
      scene.remove(islandModel)
    }, 1500)
  }
}

let module1Animation = (stage) => {
  if (stage === 'build') {
    module1Group = new THREE.Group();

    let torusKnotMesh = new THREE.Mesh(new THREE.TorusKnotGeometry(0.75, 0.3, 64, 64), new THREE.MeshMatcapMaterial())
    torusKnotMesh.material.matcap = orangeMatcap;
    torusKnotMesh.position.x -= 2.5
    torusKnotMesh.position.z -= 1.5
    torusKnotMesh.position.y += 0.5

    module1Group.add(minecraftBlock);


    let sphereMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), new THREE.MeshToonMaterial({ color: 'pink' }));
    sphereMesh.position.x += 2.5
    sphereMesh.position.z -= 1.5
    sphereMesh.position.y += 0.5
    sphereMesh.material.gradientMap = gradientMap

    module1Group.add(torusKnotMesh);
    module1Group.add(minecraftBlock);
    module1Group.add(sphereMesh);
    module1Group.position.y = -4.5;
    module1Group.position.x -= 1.5;
    // let spotLight = new THREE.SpotLight('white', 15);
    // spotLight.position.y = 1;

    // spotLight.penumbra = 0.5;
    // spotLight.angle = 0.5;
    // spotLight.distance = 3;
    // spotLight.decay = 3;
    // module1Group.add(spotLight)

    // let spotLightHelper = new THREE.SpotLightHelper(spotLight);
    // module1Group.add(spotLightHelper);

    module1Group.scale.set(2, 2, 2)
    module1Group.position.y = -6
    scene.add(module1Group);

    let groupAnimation = () => {
      levelChangeAudio.currentTime = 0;
      levelChangeAudio.play()
    }
    gsap.to(module1Group.position, {
      y: 4, duration: 1.0, delay: 1.5, onStart: groupAnimation
    })

  }
  else if (stage == 'destroy') {
    if (module1Group) {
      gsap.to(module1Group.position, {
        y: -5, duration: 1.0, delay: 0, ease: "expoScale(0.5,7,power1.in)", onComplete: () => {
          scene.remove(module1Group);
          module1Group = undefined;
        }
      })
    }
  }
}
const pLights = [];
let module2Animation = (stage) => {
  if (stage === 'build') {
    module2Group = new THREE.Group();
    module2Group.add(christmasTree);

    function getPointLight(color) {
      const light = new THREE.PointLight(color, 6, 50);
      // light ball
      const geo = new THREE.IcosahedronGeometry(0.1, 4);
      const mat = new THREE.MeshBasicMaterial({ color: color });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.add(light);

      const circle = new THREE.Object3D();
      circle.position.y = 1;
      const radius = 5;
      mesh.position.x = radius;
      circle.rotation.x = THREE.MathUtils.degToRad(45);
      circle.rotation.y = Math.random() * Math.PI * 2;
      circle.add(mesh);

      const glowMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.15
      });

      const glowMesh = new THREE.Mesh(geo, glowMat);
      glowMesh.scale.multiplyScalar(1.5);
      const glowMesh2 = new THREE.Mesh(geo, glowMat);
      glowMesh2.scale.multiplyScalar(2.5);
      const glowMesh3 = new THREE.Mesh(geo, glowMat);
      glowMesh3.scale.multiplyScalar(4);
      const glowMesh4 = new THREE.Mesh(geo, glowMat);
      glowMesh4.scale.multiplyScalar(6);

      mesh.add(glowMesh);
      mesh.add(glowMesh2);
      mesh.add(glowMesh3);
      mesh.add(glowMesh4);

      const rate = Math.random() * 0.01 + 0.005;
      function update() {
        circle.rotation.z += rate;
      }

      return {
        obj: circle,
        update,
      };
    }

    const colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x0099FF];

    let pLight;
    for (let i = 0; i < 6; i += 1) {
      pLight = getPointLight(colors[i]);
      module2Group.add(pLight.obj);
      pLights.push(pLight);
    }

    module2Group.position.x = 2;
    module2Group.position.y = -7;

    module2Group.position.x -= 1.5;
    scene.add(module2Group)

    let groupAnimation = () => {
      levelChangeAudio.currentTime = 0;
      levelChangeAudio.play()
    }
    gsap.to(module2Group.position, {
      y: 9, duration: 1.0, delay: 1, onStart: groupAnimation
    })
  }
  else if (stage === 'destroy') {
    setTimeout(() => {
      clearInterval(module2Interval);
    }, 1000)

    gsap.to(module2Group.position, {
      y: -7, duration: 1.0, delay: 0, onComplete: () => { scene.remove(module2Group); module2Group = undefined; }
    })
  }
}

let module3Animation = (stage) => {
  if (stage === 'build') {
    module3Group = new THREE.Group();
    module3Group.add(computerModel);
    const video = document.getElementById('video');
    video.play()
    let videoTexture = new THREE.VideoTexture(video);
    let planeGeometry = new THREE.PlaneGeometry(6.5, 4.5);
    let planeMaterial = new THREE.MeshBasicMaterial();

    let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.position.set(0.35, 3.8, 0.7)
    planeMesh.material.map = videoTexture
    module3Group.add(planeMesh);

    module3Group.position.x = 2;
    module3Group.position.y = -7;
    module3Group.position.z = 2.13;
    module3Group.position.x -= 1.5;
    module3Group.scale.set(0.8, 0.8, 0.8);
    scene.add(module3Group)

    let groupAnimation = () => {
      levelChangeAudio.currentTime = 0;
      levelChangeAudio.play()
    }
    gsap.to(module3Group.position, {
      y: 7, duration: 1.0, delay: 1, onStart: groupAnimation
    })
  }
  else if (stage === 'destroy') {
    gsap.to(module3Group.position, {
      y: -7, duration: 1.0, delay: 0, onComplete: () => { scene.remove(module3Group) }
    })


  }
}

let module4Animation = (stage) => {
  if (stage === 'build') {
    module4Group = new THREE.Group();
    dogModel.position.y = 5.5;


    module4Group.add(dogFoodModel);

    module4Group.add(dogModel);

    module4Group.position.y = -20;

    scene.add(module4Group);
    let dogAnimOrder = [0, 0, 7, 8, 3, 5, 2, 2, 9, 10, 1];
    dogAnimMixer = new THREE.AnimationMixer(dogModel);

    let currAnimIdx = 0;

    let animationAction;
    let onAnimFinish = () => {
      // console.log('anim finished', currAnimIdx)
      currAnimIdx++;
      playNextAnimation();
    }

    function playNextAnimation() {
      if (currAnimIdx < dogAnimOrder.length) {
        if (animationAction)
          animationAction.stop();
        animationAction = dogAnimMixer.clipAction(dogAnimations[dogAnimOrder[currAnimIdx]]);
        animationAction.loop = THREE.LoopOnce;
        animationAction.clampWhenFinished = true;
        animationAction.play();
        // console.log('anim played', currAnimIdx)
        dogAnimMixer.removeEventListener('finished', onAnimFinish, false)
        dogAnimMixer.addEventListener('finished', onAnimFinish, false);
      } else {
        currAnimIdx = 0; // Reset to loop the animations
        playNextAnimation(); // Start from the first animation
      }
    }

    // Start the first animation
    playNextAnimation();

    let groupAnimation = () => {
      levelChangeAudio.currentTime = 0;
      levelChangeAudio.play()
      // module3Interval = setInterval(() => {

      // }, 16)
    }
    gsap.to(module4Group.position, {
      y: 0.5, duration: 1.0, delay: 1, onStart: groupAnimation
    })

  }
  else if (stage === 'destroy') {
    dogAnimMixer = undefined;
    gsap.to(module4Group.position, {
      y: -11.7, duration: 1.0, delay: 0, onComplete: () => { scene.remove(module4Group); module4Group = undefined; }
    })
  }
}

let carBtnClickListener;
let carSpotLight = new THREE.SpotLight('white', 0);
let module5Animation = (stage) => {
  if (stage === 'build') {
    module5Group = new THREE.Group();

    module5Group.add(carModel);

    let redBtn = carButtonModel.clone();
    redBtn.name = 'redBtn';

    redBtn.traverse((obj) => {
      if (obj.isMesh && obj.name.includes('10')) {
        obj.material = new THREE.MeshBasicMaterial({ color: '#FF0104' })
      }
    })

    let blueBtn = carButtonModel.clone();
    blueBtn.name = 'blueBtn';
    blueBtn.position.x -= 3.5;

    blueBtn.traverse((obj) => {
      if (obj.isMesh && obj.name.includes('10')) {
        obj.material = new THREE.MeshBasicMaterial({ color: '#327EF7' })
      }
    })

    let yellowBtn = carButtonModel.clone();
    yellowBtn.name = 'yellowBtn';
    yellowBtn.position.x += 3.5;

    yellowBtn.traverse((obj) => {
      if (obj.isMesh && obj.name.includes('10')) {
        obj.material = new THREE.MeshBasicMaterial({ color: '#f0df29' })
      }
    })

    module5Group.add(redBtn);
    module5Group.add(blueBtn);
    module5Group.add(yellowBtn);

    carSpotLight.position.y = 14;
    carSpotLight.penumbra = 0;
    carSpotLight.angle = 1;
    carSpotLight.distance = 10;
    carSpotLight.decay = 0;
    carSpotLight.position.z = 5;
    scene.add(carSpotLight);

    carBtnClickListener = () => {
      if (btnIntersectionFlag !== undefined) {
        if (btnIntersectionFlag == 0) {
          carModel.traverse((obj) => {
            if (obj.isMesh && obj.name === 'Mesh_body014') {
              let c = new THREE.Color('#BD0003')
              obj.material.flatShading = true;
              obj.material.emmisiveIntensity = 0;
              gsap.to(obj.material.color, { r: c.r, g: c.g, b: c.b, duration: 2 })
              gsap.to(carSpotLight, { intensity: 0, duration: 1.5 })
            }
          })
        }
        else if (btnIntersectionFlag == 1) {
          carModel.traverse((obj) => {
            if (obj.isMesh && obj.name === 'Mesh_body014') {
              let c = new THREE.Color('#327EF7')
              obj.material.flatShading = true;
              obj.material.emmisiveIntensity = 0;
              gsap.to(obj.material.color, { r: c.r, g: c.g, b: c.b, duration: 2 })
              gsap.to(carSpotLight, { intensity: 6, duration: 1.5 })
            }
          })
        }
        else if (btnIntersectionFlag == 2) {
          carModel.traverse((obj) => {
            if (obj.isMesh && obj.name === 'Mesh_body014') {
              let c = new THREE.Color('#f0df29')
              obj.material.flatShading = true;
              obj.material.emmisiveIntensity = 0;
              gsap.to(obj.material.color, { r: c.r, g: c.g, b: c.b, duration: 2 })
              gsap.to(carSpotLight, { intensity: 0, duration: 1.5 })
            }
          })
        }
      }
    }

    canvas.addEventListener('click', carBtnClickListener, true)
    // let spotLightHelper = new THREE.SpotLightHelper(spotLight);
    // module5Group.add(spotLightHelper);

    scene.add(module5Group)


    module5Group.position.y = -10;

    let groupAnimation = () => {
      levelChangeAudio.currentTime = 0;
      levelChangeAudio.play()
      // module3Interval = setInterval(() => {

      // }, 16)
    }
    gsap.to(module5Group.position, {
      y: 0, duration: 1.0, delay: 1, onStart: groupAnimation
    })
    gsap.to(carSpotLight, { intensity: 5, duration: 2, delay: 2 })
  }
  else if (stage === 'destroy') {
    canvas.removeEventListener('click', carBtnClickListener, true)
    gsap.to(carSpotLight, { intensity: 0, duration: 1, delay: 0 })


    gsap.to(module5Group.position, {
      y: -11, duration: 1.0, delay: 0, onComplete: () => { scene.remove(module5Group); module5Group = undefined; btnIntersectionFlag = undefined; scene.remove(carSpotLight); }
    })
  }
}

let module6Animation = (stage) => {
  if (stage === 'build') {
    module6Group = new THREE.Group();

    // Create the shader material
    const material = new THREE.ShaderMaterial({
      vertexShader: blobVertexShader,
      fragmentShader: blobFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uFrequency: { value: 1.5 },
        uAmplitude: { value: 0.3 },
        uColorA: { value: new THREE.Color(0xff0000) },
        uColorB: { value: new THREE.Color(0x7055f7) },
        MouseDentro: { type: 'bool', value: false },
        Color: { type: 'vec3', value: new THREE.Color(0xFF4040) },
        Tiempo: { type: '1f', value: 0 }
      },
      wireframe: true
    });
    let objDebug = {
      colorA: '#ff0000',
      colorB: '#7055f7'
    }
    let blobFolder = gui.addFolder('Blob');
    blobFolder.addColor(objDebug, 'colorA').onChange(() => {
      blob2Material.uniforms.uColorA.value = new THREE.Color(objDebug.colorA);
    })

    blobFolder.addColor(objDebug, 'colorB').onChange(() => {
      128
      blob2Material.uniforms.uColorB.value = new THREE.Color(objDebug.colorB);
    })

    blobFolder.close();

    let blob1Material = material.clone();
    let blob2Material = material.clone();
    blob2Material.wireframe = false;
    blob2Material.uniforms.uColorA.value = new THREE.Color('#9fe2fe');
    blob2Material.uniforms.uColorB.value = new THREE.Color('#c800ff');

    // Create a blob geometry
    const blob1Geometry = new THREE.SphereGeometry(4, 64, 64);
    const blob2Geometry = new THREE.SphereGeometry(2, 64, 64);

    // Create the mesh and add it to the scene
    const blob1 = new THREE.Mesh(blob1Geometry, blob1Material);
    blob1.position.y = -5;
    module6Group.add(blob1);

    const blob2 = new THREE.Mesh(blob2Geometry, blob2Material);
    blob2.position.x = 2;
    blob2.position.y = -9;
    blob2.position.z = 4;
    module6Group.add(blob2);

    scene.add(module6Group);

    let groupAnimation = () => {
      levelChangeAudio.currentTime = 0;
      levelChangeAudio.play()
    }

    gsap.to(module6Group.position, { y: 15, duration: 1, delay: 1, onStart: groupAnimation })
  }
  else if ('destroy') {
    clearInterval(module6Interval);
    gsap.to(module6Group.position, {
      y: 0, duration: 1.0, delay: 0, onComplete: () => { scene.remove(module6Group); module6Group = undefined; }
    })
  }
}

let module7Animation = (stage) => {
  if (stage === 'build') {
    module7Group = new THREE.Group();
    audioVisAnimMixer = new THREE.AnimationMixer(audioVisModel);
    let animationAction = audioVisAnimMixer.clipAction(audioVisAnimations);
    animationAction.loop = THREE.LoopRepeat;
    // animationAction.clampWhenFinished = true;
    animationAction.play();
    audioVisModel.position.y += 0.1;
    module7Group.add(audioVisModel);


    module7Group.add(gramophoneModel);
    let pointLightGram = new THREE.PointLight('white', 6);
    pointLightGram.position.y = 12
    pointLightGram.position.z = 1
    module7Group.add(pointLightGram);
    module7Group.position.y = -12

    scene.add(module7Group);

    let groupAnimation = () => {
      levelChangeAudio.currentTime = 0;
      levelChangeAudio.play()
    }

    gsap.to(module7Group.position, { y: 2.5, duration: 1, delay: 1, onStart: groupAnimation })
  }
  else if (stage === 'destroy') {
    audioVisAnimMixer = undefined;
    gsap.to(module7Group.position, {
      y: -12, duration: 1.0, delay: 0, onComplete: () => { scene.remove(module7Group); module7Group = undefined; }
    })
  }
}

let createBallsInterval;
let ballsBtnClickListener;
const pastelColorsArr = [
  "#FFB3BA", // Light Pink
  "#FFDFBA", // Light Orange
  "#FFFFBA", // Light Yellow
  "#BAFFC9", // Light Green
  "#BAE1FF", // Light Blue
  "#D9BAFF", // Light Purple
  "#FFCCE5", // Light Rose
  "#C2FFAD", // Light Lime
  "#FFD1DC", // Light Coral
  "#E6E6FA"  // Lavender
];
let module8Animation = (stage) => {
  if (stage === "build") {
    let numOfBalls = 80;
    function detectMob() {
      const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
      ];

      return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
      });
    }

    if (detectMob()) {
      numOfBalls = 10;
    }
    module8Group = new THREE.Group();
    let boxGroup = new THREE.Group();
    let boxHeight = 7;
    let boxWidth = 7;
    let modulePosY = 2.6;

    let planeGeometry = new THREE.PlaneGeometry(boxHeight, boxWidth);
    let planeMaterial = new THREE.MeshPhysicalMaterial({ wireframe: false, side: THREE.DoubleSide });
    planeMaterial.metalness = 0;
    planeMaterial.roughness = 0.004;
    planeMaterial.transmission = 0.791;
    planeMaterial.thickness = 0;

    gui.add(planeMaterial, 'metalness').min(0).max(1).step(0.001);
    gui.add(planeMaterial, 'roughness').min(0).max(1).step(0.001);
    gui.add(planeMaterial, 'transmission').min(0).max(1).step(0.001);
    gui.add(planeMaterial, 'thickness').min(-1).max(1).step(0.001);

    let plane1Mesh = new THREE.Mesh(planeGeometry, planeMaterial);
    let plane2Mesh = new THREE.Mesh(planeGeometry, planeMaterial);
    let plane3Mesh = new THREE.Mesh(planeGeometry, planeMaterial);
    let plane4Mesh = new THREE.Mesh(planeGeometry, planeMaterial);
    let plane5Mesh = new THREE.Mesh(planeGeometry, planeMaterial);

    boxGroup.add(plane1Mesh, plane2Mesh, plane3Mesh, plane4Mesh, plane5Mesh)

    let positionArr = [
      [-boxHeight / 2, boxHeight / 2, 0],
      [+boxHeight / 2, boxHeight / 2, 0],
      [0, boxHeight / 2, -boxWidth / 2],
      [0, boxHeight / 2, boxWidth / 2],
      [0, 0, 0]
    ]

    let rotationArr = [
      [0, Math.PI / 2, 0],
      [0, -Math.PI / 2, 0],
      [0, 0, 0],
      [0, 0, 0],
      [Math.PI / 2, 0, 0]
    ]

    const floorboxShape = new CANNON.Box(
      new CANNON.Vec3(boxHeight * 0.5, 0.01, boxHeight * 0.5)
    );
    const floorboxBody = new CANNON.Body({
      mass: 0,
      shape: floorboxShape,
      material: defaultMaterial,
    });
    floorboxBody.position.copy(new THREE.Vector3(0, modulePosY, 0))
    world.addBody(floorboxBody);

    // 
    // Cannon.js body
    // 
    const boxShape1 = new CANNON.Box(
      new CANNON.Vec3(0.01, boxHeight * 0.5, boxHeight * 0.5)
    );
    const boxBody1 = new CANNON.Body({
      mass: 0,
      shape: boxShape1,
      material: defaultMaterial,
    });
    boxBody1.position.copy(new THREE.Vector3(-boxWidth / 2, boxHeight * 0.5 + modulePosY, 0));
    world.addBody(boxBody1);

    const boxShape2 = new CANNON.Box(
      new CANNON.Vec3(0.01, boxHeight * 0.5, boxHeight * 0.5)
    );
    const boxBody2 = new CANNON.Body({
      mass: 0,
      shape: boxShape2,
      material: defaultMaterial,
    });
    boxBody2.position.copy(new THREE.Vector3(boxWidth / 2, boxHeight * 0.5 + modulePosY, 0));
    world.addBody(boxBody2);


    const boxShape3 = new CANNON.Box(
      new CANNON.Vec3(boxWidth * 0.5, boxHeight * 0.5, 0.01)
    );
    const boxBody3 = new CANNON.Body({
      mass: 0,
      shape: boxShape3,
      material: defaultMaterial,
    });
    boxBody3.position.copy(new THREE.Vector3(0, boxHeight * 0.5 + modulePosY, -boxWidth / 2));
    world.addBody(boxBody3);

    const boxShape4 = new CANNON.Box(
      new CANNON.Vec3(boxWidth * 0.5, boxHeight * 0.5, 0.01)
    );
    const boxBody4 = new CANNON.Body({
      mass: 0,
      shape: boxShape4,
      material: defaultMaterial,
    });
    boxBody4.position.copy(new THREE.Vector3(0, boxHeight * 0.5 + modulePosY, boxWidth / 2));
    world.addBody(boxBody4);

    for (let i = 0; i < 5; i++) {
      boxGroup.children[i].position.set(positionArr[i][0], positionArr[i][1], positionArr[i][2]);
      boxGroup.children[i].rotation.set(rotationArr[i][0], rotationArr[i][1], rotationArr[i][2]);
      // boxGroup.children[i].environment = studioEnvMap;
    }


    let samplerFromModel = (model) => {
      let sampler;
      model.traverse((child) => {
        if (child.isMesh) {
          sampler = new MeshSurfaceSampler(child).build()
        }
      })
      return sampler;
    }

    let bunnyGroup = new THREE.Group()
    let bunnySampler;
    let bunnyPoints;
    let bunnyPointsArr = [];
    let bunnyPosY = 2;
    let animCount = 0;
    // console.log('Delete Before Start Spheres')
    _GlobalSphereBodyArr.forEach((sphere) => {
      world.removeBody(sphere)
    })
    _GlobalSphereArr.forEach((sphere) => {
      scene.remove(sphere)
    })
    _GlobalSphereArr = [];
    _GlobalSphereBodyArr = [];
    objectsToUpdate = []

    setTimeout(() => {
      bunnySampler = samplerFromModel(bunnyModel);
      bunnyPoints = makeSamplePoints(bunnySampler, numOfBalls);
      // bunnyMesh.scale.set(0.03, 0.03, 0.03);
      // bunnyMesh.rotation.x = Math.PI / 2;
      bunnyGroup.add(bunnyPoints);

      let createBunnyPoints = () => {
        bunnySampler = samplerFromModel(bunnyModel);
        bunnyPoints = makeSamplePoints(bunnySampler, numOfBalls);
        bunnyGroup.add(bunnyPoints);
        bunnyPointsArr.push(bunnyPoints);
        animCount++;
        if (animCount >= 3) {
          resetBox();
        }
        // console.log('POINTS ARE BEING CREATED', _GlobalSphereBodyArr, world.bodies.length)
      }

      createBallsInterval = setInterval(createBunnyPoints, 5000)

      let resetBox = () => {
        clearInterval(createBallsInterval)
        animCount = 0;
        setTimeout(() => {
          world.removeBody(floorboxBody);
          setTimeout(() => {
            world.addBody(floorboxBody);
          }, 1000)
          bunnyPointsArr.forEach((bunnyPoints) => {
            bunnyPoints.traverse(point => {
              // gsap.to(point.scale)
              scene.remove(point)
            })
          })
          bunnyPointsArr = [];
          _GlobalSphereArr.forEach((sphere) => {
            setTimeout(() => {
              scene.remove(sphere);
            }, 1500)
          })

          _GlobalSphereBodyArr.forEach((sphere) => {
            setTimeout(() => {
              world.removeBody(sphere);
            }, 1500)
          })

          setTimeout(() => {
            _GlobalSphereBodyArr = [];
            _GlobalSphereArr = [];
          }, 2000)
          objectsToUpdate = [];
        }, 6000)

        setTimeout(() => {
          if (module8Group)
            createBallsInterval = setInterval(createBunnyPoints, 5000)
        }, 2000)
      }
    }, 1500)

    let wireframeBunnyModel = bunnyModel.clone();
    wireframeBunnyModel.traverse((obj) => {
      if (obj.isMesh) {
        obj.material = new THREE.MeshBasicMaterial();
        obj.material.wireframe = true
        obj.material.flatShading = true
        obj.material.color = new THREE.Color('white')
      }
    })
    wireframeBunnyModel.scale.set(35.5, 35.5, 35.5);
    wireframeBunnyModel.position.y = 5 + bunnyPosY;
    bunnyGroup.add(wireframeBunnyModel);

    bunnyGroup.position.set(0.413, 7.05, 6.84)
    bunnyGroup.rotation.x = -Math.PI / 2;
    // gui.add(bunnyGroup.position, 'x').min(-10).max(10).step(0.001);
    // gui.add(bunnyGroup.position, 'y').min(-10).max(10).step(0.001);
    // gui.add(bunnyGroup.position, 'z').min(-10).max(10).step(0.001);
    module8Group.add(bunnyGroup);

    let sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    let sphereMaterial = new THREE.MeshMatcapMaterial({ matcap: ballMatCap })
    let ballRadius = 0.4;
    let makeSamplePoints = (sampler, pointsNum) => {
      let sphereGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);
      let tempPosition = new THREE.Vector3();
      let pointGroup = new THREE.Group();
      for (let i = 0; i < pointsNum; i++) {
        let ran = Math.random();
        let mesh = new THREE.Mesh(sphereGeometry.clone(), sphereMaterial.clone(), pointsNum);
        // mesh.material.color = new THREE.Color(ran * 0xffffff);
        mesh.material.color = new THREE.Color(pastelColorsArr[i % pastelColorsArr.length]);
        sampler.sample(tempPosition);
        mesh.position.set(tempPosition.x * 35, tempPosition.y * 35 + (5 + bunnyPosY), tempPosition.z * 35);
        mesh.scale.set(0, 0, 0);
        ran = Math.random() + 0.2;
        let scaleFactor = ran > 1 ? 1 : ran;
        gsap.to(mesh.scale, { x: scaleFactor, y: scaleFactor, z: scaleFactor, duration: 1 })
        pointGroup.add(mesh);

        setTimeout(() => {
          mesh.visible = false;
          const sphereShape = new CANNON.Sphere(ballRadius * scaleFactor);
          const sphereBody = new CANNON.Body({
            mass: 1.5,
            shape: sphereShape,
            material: defaultMaterial
          });
          let meshPos = new THREE.Vector3();
          mesh.getWorldPosition(meshPos);
          sphereBody.position.copy(meshPos);
          sphereBody.bodyColor = mesh.material.color;

          world.addBody(sphereBody);
          _GlobalSphereBodyArr.push(sphereBody);
          objectsToUpdate.push({ mesh: mesh, body: sphereBody });
          // console.log(world, _GlobalSphereBodyArr.length, sphereBody, objectsToUpdate.)
        }, 1500)
      }

      return pointGroup;
    }

    let addSphere = (radius, position) => {
      let sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial.clone());
      sphereMesh.material.color = new THREE.Color(pastelColorsArr[Math.floor(Math.random() * 10) % pastelColorsArr.length])
      sphereMesh.castShadow = true;

      sphereMesh.scale.set(radius, radius, radius);

      scene.add(sphereMesh);

      const sphereShape = new CANNON.Sphere(radius);
      const sphereBody = new CANNON.Body({
        mass: 1.5,
        shape: sphereShape,
        material: defaultMaterial
      });
      // sphereBody.applyLocalForce(
      //   new CANNON.Vec3(0, 0, 600),
      //   new CANNON.Vec3(0, 0, 0)
      // )
      sphereBody.position.copy(position);
      sphereBody.bodyColor = sphereMesh.material.color;
      _GlobalSphereBodyArr.push(sphereBody);
      world.addBody(sphereBody);
      objectsToUpdate.push({ mesh: sphereMesh, body: sphereBody })
    }

    let physicsObjDebug = {
      addSphere: () => {
        let ran = Math.random();
        let r = ran < 0.15 ? 0.25 : ran;
        addSphere(r, { x: Math.random() * 2 - 1, y: 10.0, z: Math.random() * 2 - 1 });
      },

      addBox: () => {
        addBox(
          { x: Math.random(), y: Math.random(), z: Math.random() },
          { x: Math.random() * 2 - 1, y: 3.0, z: Math.random() * 2 - 1 }
        );
      }
    }

    gui.add(defaultContactMaterial, 'friction').min(0).max(12).step(0.001);
    gui.add(defaultContactMaterial, 'restitution').min(0).max(3).step(0.001);

    gui.add(physicsObjDebug, 'addSphere')

    ballsBtnClickListener = physicsObjDebug.addSphere;

    setTimeout(() => {
      canvas.addEventListener('click', ballsBtnClickListener, true);
    }, 2000)

    boxGroup.scale.set(1.01, 1, 1.01);
    gui.add(boxGroup.rotation, 'y').min(-3.14).max(3.14).step(0.001);

    module8Group.position.y = -13;

    module8Group.add(boxGroup);
    scene.add(module8Group);
    let groupAnimation = () => {
      levelChangeAudio.currentTime = 0;
      levelChangeAudio.play()
    }

    gsap.to(module8Group.position, { y: 2.6, duration: 1, delay: 1, onStart: groupAnimation })
  }
  else if (stage === "destroy") {
    // console.log('CLEAR EVERYTHING')
    canvas.removeEventListener('click', ballsBtnClickListener, true);
    // console.log(world);
    world = new CANNON.World();
    cannonDebugRenderer = new CannonDebugRenderer(scene, world);
    world.gravity.set(0, -9.82, 0);
    // world.broadphase = new CANNON.SAPBroadphase(world);
    world.allowSleep = true;

    defaultMaterial = new CANNON.Material('default');

    defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.1,
        restitution: 0.7
      }
    )
    world.addContactMaterial(defaultContactMaterial);
    // world.bodies.forEach((body) => {
    //   world.removeBody(body)
    // })
    clearInterval(createBallsInterval);
    // _GlobalSphereBodyArr.forEach((sphere) => {
    //   world.removeBody(sphere)
    // })
    _GlobalSphereArr.forEach((sphere) => {
      scene.remove(sphere)
    })
    _GlobalSphereArr = [];
    _GlobalSphereBodyArr = [];
    objectsToUpdate = []
    createBallsInterval = null;
    objectsToUpdate = [];
    gsap.to(module8Group.position, {
      y: -13, duration: 1.0, delay: 0, onComplete: () => { scene.remove(module8Group); module8Group = undefined; clearInterval(createBallsInterval); }
    })
  }
}

let gameFlag = false;
let menuPlane;
let menuHover;
let currItemHover;
let gameMenuBtnClickListener;
let gameBtnClickListener;
let itemsArr = [];
let trackerArr = [];
let roundInterval;
let textMesh
let highestScore = 0;
let module9Animation = (stage) => {
  let currScore = 0;
  if (stage === 'build') {
    module9Group = new THREE.Group();

    menuHover = undefined;
    currItemHover = undefined;
    menuPlane = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
    menuPlane.material.map = menuMap;
    menuPlane.material.transparent = true;
    menuPlane.material.alphaMap = menuAlphaMap;
    menuPlane.position.y = 7;
    menuPlane.position.z = 6;
    menuPlane.rotation.x = -Math.PI / 7;
    menuPlane.name = 'menu'
    module9Group.add(menuPlane);

    let createText = (string) => {
      let bevelSize = 0.002;
      let bevelThickness = 0.03;

      let textGeometry = new TextGeometry(string, {
        font: jerseyFont,
        size: 1,
        depth: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: bevelThickness,
        bevelSize: bevelSize,
        bevelOffset: 0,
        bevelSegments: 2
      });


      textGeometry.computeBoundingBox();
      // console.log(textGeometry.boundingBox);

      textGeometry.translate(
        -(textGeometry.boundingBox.max.x - bevelSize) * 0.5,
        -(textGeometry.boundingBox.max.y - bevelSize) * 0.5,
        -(textGeometry.boundingBox.max.z - bevelThickness) * 0.5,
      )

      return textGeometry
    }


    const textGeometry = createText(`Highest Score: ${highestScore}`)

    const textMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('white') });
    textMesh = new THREE.Mesh(textGeometry, textMaterial);

    textMesh.position.set(0.0, 10, 3.85)
    // textMesh.position.set(-3.52, 8, -2)

    // gui.add(textMesh.position, 'x').min(-10).max(10).step(0.01);
    // gui.add(textMesh.position, 'y').min(-10).max(10).step(0.01);
    // gui.add(textMesh.position, 'z').min(-10).max(10).step(0.01);

    module9Group.add(textMesh)


    let gameStart = () => {
      currScore = 0;
      itemsArr = [];
      trackerArr = [];

      textMesh.geometry = createText(`Score: ${currScore}`)
      gsap.to(textMesh.position, { x: -3.52, y: 8, z: -2, duration: 0.6 })


      let posArr = [[-1.425, -3], [1.125, -3], [3.675, -3], [6.225, -3], [-1.425, 1.2], [1.125, 1.2], [3.675, 1.2], [6.225, 1.2], [-2.425, 5], [0.125, 5], [2.675, 5], [5.225, 5]];
      let totalItemsCount = 2;
      let motionTime = 0.8; // seconds
      let stayTime = 0.8; // seconds
      let bombProbability = 0.25; // 0 -1
      let roundCount = 0;
      // posArr.forEach((pos) => {
      //   let mole = bombModel.clone();
      //   mole.position.x = pos[0];
      //   mole.position.z = pos[1];
      //   module9Group.add(mole)
      // })
      canvas.removeEventListener('click', gameMenuBtnClickListener, true);
      canvas.addEventListener('click', gameBtnClickListener, true)
      canvas.addEventListener('touchstart', gameBtnClickListener, true)

      let removeItem = (item) => {

        gsap.to(item.position, { y: 0, duration: motionTime, delay: stayTime, onStart: () => { itemDownAudio.play(); }, onComplete: () => { if (module9Group) module9Group.remove(item) } })
      }

      let addAnItem = () => {
        let idx = Math.floor(Math.random() * 20) % posArr.length;
        let randomPos = posArr[idx];
        posArr.splice(idx, 1);
        let item;

        let trackMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial());
        if (Math.random() < bombProbability) {
          item = bombModel.clone();
          trackMesh.name = 'bomb' + (trackerArr.length);
        }
        else {
          item = moleModel.clone();
          trackMesh.name = 'mole' + (trackerArr.length);
          trackMesh.position.y += 1;
        }
        trackMesh.material.wireframe = true;
        trackMesh.visible = false;
        trackerArr.push(trackMesh);
        itemsArr.push(item);
        let targetItemY = item.position.y;
        let targetTrackY = trackMesh.name.includes('mole') ? item.position.y + 1 : item.position.y;
        item.position.x = randomPos[0];
        item.position.y = 0;
        item.position.z = randomPos[1];
        trackMesh.position.copy(item.position)
        itemUpAudio.play();
        gsap.to(item.position, { y: targetItemY, duration: motionTime, onComplete: () => { removeItem(item) } })
        gsap.to(trackMesh.position, { y: targetTrackY, duration: motionTime, onComplete: () => { removeItem(trackMesh) } })
        module9Group.add(item, trackMesh);
      }

      setTimeout(() => {
        addAnItem();
      }, 600)

      roundInterval = setInterval(() => {
        itemsArr = [];
        trackerArr = [];
        posArr = [[-1.425, -3], [1.125, -3], [3.675, -3], [6.225, -3], [-1.425, 1.2], [1.125, 1.2], [3.675, 1.2], [6.225, 1.2], [-2.425, 5], [0.125, 5], [2.675, 5], [5.225, 5]]
        for (let i = 0; i < totalItemsCount; i++) {
          addAnItem();
        }

        roundCount++;


        if (roundCount === 1) {
          totalItemsCount++;
        }

        if (roundCount === 3) {
          totalItemsCount++;
          stayTime = 0.6;
        }

        if (roundCount === 6) {
          totalItemsCount = 5;
          bombProbability = 0.3;
          motionTime = 0.8;
          stayTime = 0.5;
        }

        if (roundCount === 8) {
          totalItemsCount = 6;
          bombProbability = 0.33;
          motionTime = 0.7;
          stayTime = 0.5;
        }
        if (roundCount === 11) {
          clearInterval(roundInterval);
          setTimeout(() => {
            bombAudio.currentTime = 0;
            bombAudio.play()
            module9Group.add(menuPlane);
            if (currScore > highestScore) {
              highestScore = currScore;
            }
            textMesh.geometry = createText(`Highest Score: ${currScore}`)
            gsap.to(textMesh.position, { x: 0.0, y: 10, z: 3.85, duration: 0.6 })
            canvas.removeEventListener('click', gameBtnClickListener, true);
            canvas.removeEventListener('touchstart', gameBtnClickListener, true)
            canvas.addEventListener('click', gameMenuBtnClickListener, true);
            gameFlag = false;
          }, 3000)
        }

      }, 3000)

    }

    gameBtnClickListener = () => {
      // console.log('IN GAME');
      if (currItemHover) {
        const index = trackerArr.indexOf(currItemHover);
        // console.log(index, currItemHover.name)
        module9Group.remove(currItemHover);
        module9Group.remove(itemsArr[index]);
        if (currItemHover.name.includes('bomb')) {
          currScore = currScore > 0 ? currScore - 10 : currScore;
          textMesh.geometry = createText(`Score: ${currScore}`)

          // console.log('Oops! You hit a bomb', currScore)
          bombAudio.currentTime = 0;
          bombAudio.play()
        }
        else if (currItemHover.name.includes('mole')) {
          currScore += 20;
          textMesh.geometry = createText(`Score: ${currScore}`)
          if (currScore > highestScore) {
            highestScore = currScore;
          }
          // console.log('Yay! You got a mole', currScore)
          pointAudio.currentTime = 0;
          pointAudio.play()
        }
        itemsArr.splice(index, 1);
        trackerArr.splice(index, 1);
      }
    };

    gameMenuBtnClickListener = () => {
      if (menuHover && !gameFlag) {
        // console.log('GAME STARTING')
        levelChangeAudio.currentTime = 0;
        levelChangeAudio.play()
        module9Group.remove(menuPlane);
        gameFlag = true;
        gameStart();
      }
    }

    canvas.addEventListener('click', gameMenuBtnClickListener, true);

    scene.add(module9Group);
    module9Group.position.y = -9;

    let groupAnimation = () => {
      levelChangeAudio.currentTime = 0;
      levelChangeAudio.play()
    }
    gsap.to(module9Group.position, {
      y: 0, duration: 1.0, delay: 1, onStart: groupAnimation
    })
  }
  else if (stage === "destroy") {
    menuHover = undefined;
    currItemHover = undefined;
    gameFlag = false;
    canvas.removeEventListener('click', gameBtnClickListener, true);
    canvas.removeEventListener('touchstart', gameBtnClickListener, true)
    canvas.removeEventListener('click', gameMenuBtnClickListener, true);
    clearInterval(roundInterval)
    gsap.to(module9Group.position, {
      y: -9, duration: 1.0, delay: 0, onComplete: () => {
        scene.remove(module9Group);
        module9Group = undefined;
        menuHover = undefined;
        currItemHover = undefined;
        gameFlag = false;
      }
    })

  }
}


let moduleTitleInfo = [
  {
    num: 'Welcome to',
    name: 'PlugXR University'
  },
  {
    num: '01',
    name: 'Basic Concepts'
  },
  {
    num: '02',
    name: 'Intermediate<br>Techniques'
  },
  {
    num: '03',
    name: '3D Portfolio<br>Website'
  },
  {
    num: '04',
    name: '3D Models<br>& Animations'
  },
  {
    num: '05',
    name: 'Car<br>Configurator'
  },
  {
    num: '06',
    name: 'Shaders'
  },
  {
    num: '07',
    name: 'Making<br>Audio Visualiser'
  },
  {
    num: '08',
    name: 'Advance<br>Techniques'
  },
  {
    num: '09',
    name: '3D Game'
  },
]
let moduleDescArr = [
  [
    'Welcome to the Advanced 3D Web Development with Three.js course, where you will explore 9 exciting modules.',
    'Use the controls below to navigate and discover what each module covers in detail.'
  ],
  [
    'Start your journey by understanding the essentials of 3D web development with Three.js.',
    'This module covers topics like creating and manipulating 3D objects, adding textures and materials.',
    'By the end, you\'ll be able to build a basic interactive 3D scene.'
  ],
  [
    'Elevate your skills by diving into intermediate concepts such as lighting, shadows, and particles.',
    'Learn to implement interactive raycasting and work with tools like DebugUI and GSAP animations.',
    'These techniques will enhance the visual quality and interactivity of your projects.'
  ],
  [
    'Build your very own 3D portfolio website by integrating Three.js with HTML and CSS.',
    'Use GSAP animations and scroll-based effects to create an immersive website.',
    'Customise and stand-out with your unique portfolio website.'
  ],
  [
    'Learn the intricacies of working with 3D models in Three.js.',
    'This module covers the basics of importing and animating models using formats like FBX and GLTF.',
    'You’ll also explore environment maps and realistic rendering techniques to create stunning scenes.'
  ],
  [
    'Develop a fully functional 3D car configurator where users can modify and visualize a car model.',
    'This module teaches you how to change parts of a 3D model in real time.',
    'You will also learn to optimize model rendering and add loading screens for a seamless experience.'
  ],
  [
    'Explore the world of shaders to add advanced visual effects to your 3D scenes.',
    'Learn the basics of the shader pipeline and create configurable shaders for wave simulations.',
    'This module equips you with the skills to develop custom shaders for unique visual effects.'
  ],
  [
    'Combine 3D visuals with audio in this exciting module.',
    'Learn to synchronize visual elements with audio input using Shaders to create a dynamic audio visualizer.',
    'You will build a project demonstrating real-time visual effects responding to music or sounds.'
  ],
  [
    'Push the boundaries of 3D development with advanced techniques such as physics simulations.',
    'Learn post-processing effects, surface sampling for animations, and work with instanced meshes.',
    'These techniques enable you to handle large numbers of objects efficiently in your scenes.'
  ],
  [
    'Develop a fully-fledged 3D game from scratch, covering game loops, player controls, and more.',
    'This module walks you through core game mechanics such as collision detection and infinite world generation.',
    'Implement scoring, rewards, sounds, and storage for a complete gaming experience.'
  ]
];

let animFuncArr = [
  module0Animation,
  module1Animation,
  module2Animation,
  module3Animation,
  module4Animation,
  module5Animation,
  module6Animation,
  module7Animation,
  module8Animation,
  module9Animation
]

// Function to update button opacity
function updateButtonOpacity(opacity) {
  document.querySelector('div.module-btn>div.arrow-left>svg').style.opacity = opacity;
  document.querySelector('div.module-btn>div.arrow-right>svg').style.opacity = opacity;

  if (currModuleNum == 0) {
    document.querySelector('div.module-btn>div.arrow-left>svg').style.opacity = 0.2;
  }
  if (currModuleNum == 9) {
    document.querySelector('div.module-btn>div.arrow-right>svg').style.opacity = 0.2;
  }
}


// Throttling function
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      // console.log('Lowering')
      func.apply(context, args);
      inThrottle = true;
      updateButtonOpacity(0.2);
      setTimeout(() => { inThrottle = false; updateButtonOpacity(1); }, limit);
    }
  }
}

let prevModuleNum = -1;
let currModuleNum = 0;
let nextModuleNum = 1;
let moduleBtn = document.querySelector('div.module-btn>div.btn-content');
let moduleDesc = document.querySelector('div.module-desc-content');

let intervalId;
let timeoutID;
let currentLineIndex = 0;

// Function to clear previous text and prepare for animation
let clearText = () => {
  moduleDesc.innerHTML = '';
}
// Function to render each line letter by letter
let renderLineLetterByLetter = (line) => {
  clearInterval(intervalId);
  clearTimeout(timeoutID);
  clearText();
  let charIndex = 0;
  intervalId = setInterval(() => {
    if (charIndex < line.length) {
      moduleDesc.innerHTML += line[charIndex];
      charIndex++;
    } else {
      clearInterval(intervalId);
      // Call next line after 2 seconds delay
      timeoutID = setTimeout(nextLine, 2000);
    }
  }, 30); // Letter appears every 100ms
}

// Function to load the next line
function nextLine() {
  const moduleLineSet = moduleDescArr[currModuleNum];
  if (currentLineIndex < moduleLineSet.length) {
    renderLineLetterByLetter(moduleLineSet[currentLineIndex]);
    currentLineIndex++;
  } else {
    // Reset line index for the next module
    currentLineIndex = 0;
  }
}

// Function to load a specific module
function loadModule() {
  clearInterval(intervalId);
  clearTimeout(timeoutID);
  currentLineIndex = 0;
  nextLine(); // Start rendering the first line of the new module
}



let updateModuleBtn = () => {
  moduleBtn.innerHTML = `
  <div class="num">${moduleTitleInfo[currModuleNum].num}</div>
  <div class="name">${moduleTitleInfo[currModuleNum].name}</div>
  `

  if (currModuleNum == 0) {
    document.querySelector('div.module-btn>div.arrow-left>svg').style.opacity = 0.2;
  }
  else {
    document.querySelector('div.module-btn>div.arrow-left>svg').style.opacity = 1;
  }

  if (currModuleNum == 9) {
    document.querySelector('div.module-btn>div.arrow-right>svg').style.opacity = 0.2;
  }
  else {
    document.querySelector('div.module-btn>div.arrow-right>svg').style.opacity = 1;
  }
}



document.querySelector('.next-view').addEventListener('click', throttle(() => {
  animHappened = true;
  gsap.to(camera.position, { x: cameraPos.x, y: cameraPos.y, z: cameraPos.z, duration: 0.5 });
  renewControls()

  if (currModuleNum === 0) {
    module0Animation('destroy');
    prevModuleNum = currModuleNum;
    module1Animation('build');
    currModuleNum = nextModuleNum;
    nextModuleNum = currModuleNum + 1;
  }
  else if (currModuleNum === 1) {
    module1Animation('destroy');
    prevModuleNum = currModuleNum;
    module2Animation('build');
    currModuleNum = nextModuleNum;
    nextModuleNum = currModuleNum + 1;
  }
  else if (currModuleNum === 2) {
    module2Animation('destroy');
    prevModuleNum = currModuleNum;
    module3Animation('build');
    currModuleNum = nextModuleNum;
    nextModuleNum = currModuleNum + 1;
  }
  else if (currModuleNum === 3) {
    module3Animation('destroy');
    prevModuleNum = currModuleNum;
    module4Animation('build');
    currModuleNum = nextModuleNum;
    nextModuleNum = currModuleNum + 1;
  }
  else if (currModuleNum === 4) {
    module4Animation('destroy');
    prevModuleNum = currModuleNum;
    module5Animation('build');
    currModuleNum = nextModuleNum;
    nextModuleNum = currModuleNum + 1;
  }
  else if (currModuleNum === 5) {
    module5Animation('destroy');
    prevModuleNum = currModuleNum;
    module6Animation('build');
    currModuleNum = nextModuleNum;
    nextModuleNum = currModuleNum + 1;
  }
  else if (currModuleNum === 6) {
    module6Animation('destroy');
    prevModuleNum = currModuleNum;
    module7Animation('build');
    currModuleNum = nextModuleNum;
    nextModuleNum = currModuleNum + 1;
  }
  else if (currModuleNum === 7) {
    module7Animation('destroy');
    prevModuleNum = currModuleNum;
    module8Animation('build');
    currModuleNum = nextModuleNum;
    nextModuleNum = currModuleNum + 1;
  }
  else if (currModuleNum === 8) {
    module8Animation('destroy');
    prevModuleNum = currModuleNum;
    module9Animation('build');
    currModuleNum = nextModuleNum;
    nextModuleNum = currModuleNum + 1;

  }
  else if (currModuleNum === 9) {
    return;
  }

  // console.log(prevModuleNum, currModuleNum, nextModuleNum)

  loadModule();
  updateModuleBtn();
}, 2500))


document.querySelector('.prev-view').addEventListener('click', throttle(() => {
  renewControls()
  gsap.to(camera.position, { x: cameraPos.x, y: cameraPos.y, z: cameraPos.z, duration: 0.5 });


  if (currModuleNum === 0) {
    return;
  }
  else if (currModuleNum === 1) {
    module1Animation('destroy');
    nextModuleNum = currModuleNum;
    module0Animation('build')
    currModuleNum = prevModuleNum;
    prevModuleNum = currModuleNum - 1;
  }
  else if (currModuleNum === 2) {
    module2Animation('destroy');
    nextModuleNum = currModuleNum;
    module1Animation('build')
    currModuleNum = prevModuleNum;
    prevModuleNum = currModuleNum - 1;
  }
  else if (currModuleNum === 3) {
    module3Animation('destroy');
    nextModuleNum = currModuleNum;
    module2Animation('build')
    currModuleNum = prevModuleNum;
    prevModuleNum = currModuleNum - 1;
  }
  else if (currModuleNum === 4) {
    module4Animation('destroy');
    nextModuleNum = currModuleNum;
    module3Animation('build')
    currModuleNum = prevModuleNum;
    prevModuleNum = currModuleNum - 1;
  }
  else if (currModuleNum === 5) {
    module5Animation('destroy');
    nextModuleNum = currModuleNum;
    module4Animation('build')
    currModuleNum = prevModuleNum;
    prevModuleNum = currModuleNum - 1;
  }
  else if (currModuleNum === 6) {
    module6Animation('destroy');
    nextModuleNum = currModuleNum;
    module5Animation('build')
    currModuleNum = prevModuleNum;
    prevModuleNum = currModuleNum - 1;
  }
  else if (currModuleNum === 7) {
    module7Animation('destroy');
    nextModuleNum = currModuleNum;
    module6Animation('build')
    currModuleNum = prevModuleNum;
    prevModuleNum = currModuleNum - 1;

  }
  else if (currModuleNum === 8) {
    module8Animation('destroy');
    nextModuleNum = currModuleNum;
    module7Animation('build')
    currModuleNum = prevModuleNum;
    prevModuleNum = currModuleNum - 1;
  }
  else if (currModuleNum === 9) {
    module9Animation('destroy');
    nextModuleNum = currModuleNum;
    module8Animation('build')
    currModuleNum = prevModuleNum;
    prevModuleNum = currModuleNum - 1;
  }
  // console.log(prevModuleNum, currModuleNum, nextModuleNum)
  loadModule()
  updateModuleBtn();
}, 2500))

gui.close()
gui.hide()

window.addEventListener("keydown", (event) => {
  if (event.key === 'h') {
    gui.hide();
  }

  if (event.key === 's') {
    gui.show();
  }
});
