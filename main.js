import * as THREE from './js/three.module.js';
//import {OrbitControls} from './js/OrbitControls.js';
import { FlyControls } from './js/FlyControls.js';
import {fileUpload, audioControls} from './audioControls.js';

import {icosahedronVisualizer, groupIcosahedron, rafIcosahedron} from './icosahedronVis.js';
import {waterBallVisualizer, groupWaterBall} from './waterBallVisualizer.js';
import {discVisualizer, disc} from './discVisualizer.js';
import {rubiksCubeVisualizer, rubiksCube} from './rubiksCubeVisualizer.js';

import {sphereVisualizer, rafSphereVisualizer, groupRing} from './sphereVisualizer.js';
import { planeVisualizer, planeGroup} from './planeVisualizer.js';
import {cubeVisualizer, cubeGroup} from './cubeVisualizer.js';
import { cylinderVisualizer, groupCylinders } from './cylinderVisualizer.js';
import {glslVisualizer, plains} from "./glslVisualizer.js";
import { glassVisualizer, groupGlass} from './glassVisualizer.js';
import {instancesVisualizer, instancedMeshGroup} from './instancesVisualizer.js';
import {particlesVisualizer, particleGroup} from './particlesVisualizer.js';
import { ballsVisualizer, ballGroup } from './ballsVisualizer.js';
import { ballsLightVisualizer, ballLightGroup } from './ballsLightVisualizer.js';
import { ballsWarpVisualizer, warpGroup } from './ballsWarpVisualizer.js';
import {spaceBlue, spaceRed, gloomy, pereaBeach, storm, photoStudio} from './backgrounds.js';
//import {marchVisualizer} from './marchVisualizer.js';
import {waterPaintVisualizer, sphereObj} from './waterPaintVisualizer.js';
import { liquidCubeVisualizer, effectObj} from './liquidCubeVisualizer.js';
import {lineSphereVisualizer, rafId, lineGroup} from './lineSphereVisualizer.js'; 

///// variables /////

const canvas = document.getElementById('canvas1');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;  

const gui = new dat.GUI();
gui.domElement.id = 'gui';
document.body.appendChild(gui.domElement);

///// audio setup /////
let analyser;
let dataArray = [];

let scene, camera, renderer;
//let orbitCamera;
let flyCamera;
let spotLight, spotLight2, ambientLight;

///// setup functions /////

fitToContainer(canvas);
fileUpload();
audioAnalyser();
audioControls();
initThree();


function fitToContainer(canvas){
  // fill the parent, then set the size to match
  canvas.style.width ='100%';
  canvas.style.height='100%';
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
};

async function audioAnalyser(){    
     let audioSource;
     const audioElement = document.getElementById('audio1');

     const audioCtx = new AudioContext();
     analyser = audioCtx.createAnalyser();
     audioSource = audioCtx.createMediaElementSource(audioElement);
     audioSource.connect(analyser);
     analyser.connect(audioCtx.destination);
     analyser.fftSize = 512;
     let bufferLength = analyser.frequencyBinCount;
     dataArray = new Uint8Array(bufferLength);

   //canvas2 bar visualizer
    const canvas2 = document.getElementById('canvas2');
     const ctx = canvas2.getContext('2d');
     canvas2.width = 840;
     canvas2.height = 80;
         
     let x;
     let barWidth = canvas2.width / bufferLength - 0.5;
     let barHeight;
     
     function drawBarVisualizer(){
          ctx.clearRect(0, 0, canvas2.width, canvas2.height);
          function drawText(){
               ctx.font = "12px Verdana";
               ctx.fillStyle = 'white';
               ctx.fillText('Bar Visualizer', 10, 16);              
          }
          drawText();

          x = 0;
          analyser.getByteFrequencyData(dataArray);
          for(let i = 0; i < bufferLength; i++){
               barHeight = dataArray[i] / 5;     
               //draw
               const h = i + barHeight / 5;
               const s = 90;
               const l = 50;
     
               ctx.fillStyle = 'white';
               ctx.fillRect(x + canvas2.width/2, canvas2.height - 10 - barHeight, barWidth, 4);
     
               ctx.fillStyle = 'hsl('+ h +' , '+ s +'%, '+ l +'%)';
               ctx.fillRect(x + canvas2.width / 2, canvas2.height -5 -barHeight, barWidth, barHeight);
               
               ctx.fillStyle = 'white';
               ctx.fillRect(canvas2.width/2 - x , canvas2.height - 10 - barHeight, barWidth, 4);
     
               ctx.fillStyle = 'hsl('+ h +' , '+ s +'%, '+ l +'%)';
               ctx.fillRect(canvas2.width / 2 - x, canvas2.height - 5 - barHeight , barWidth, barHeight);
     
             x += barWidth;          
          }
          requestAnimationFrame(drawBarVisualizer);
     }; 

     drawBarVisualizer();
     
     


     /* const playBtn = document.getElementById('playBtn');
     const stopBtn = document.getElementById('stopBtn');
     const pauseBtn = document.getElementById('pauseBtn');

     playBtn.addEventListener('click', function(e){     
          e.preventDefault();
          audioElement.play();
     })
     stopBtn.addEventListener('click', (e) => {
          e.preventDefault();
          audioElement.pause();
     })
     pauseBtn.addEventListener('click', (e) => {
          e.preventDefault();
          audioElement.pause();
     }) */
   
      
     ///// video recording ////////
     const recordBtn = document.getElementById('recordBtn');
     const stopRecordBtn = document.getElementById('stopRecordBtn');
     let recording = false;
     let mediaRecorder;
     let recordedChunks = [];

     recordBtn.addEventListener('click', (e) => {
          e.preventDefault();
          let dest = audioCtx.createMediaStreamDestination();
          audioSource.connect(dest);
          let audioTrack = dest.stream.getAudioTracks()[0];
          recording = !recording;
          if(recording){
               recordBtn.innerText = "recordings...";
               const canvasStream = canvas.captureStream(60);
               mediaRecorder = new MediaRecorder(canvasStream, {
                    mimeType: 'video/webm;codecs=vp9'
               })
               canvasStream.addTrack(audioTrack);
               mediaRecorder.ondataavailable = e => {
                    if(e.data.size > 0){
                         recordedChunks.push(e.data);
                    }
               }
               mediaRecorder.start();
          }
     });

     stopRecordBtn.addEventListener('click', (e) => {  
          e.preventDefault();
          recordBtn.innerText = "Start Record";
          mediaRecorder.stop();
          setTimeout((e) => {
               const blob = new Blob(recordedChunks, {
                    type: 'video/webm'
               })
               const url = URL.createObjectURL(blob);
               const a = document.createElement('a');
               a.href = url;
               a.download = 'recording.webm';
               a.click();
               URL.revokeObjectURL(url);
          }, 100);
     });
} 

//////// THREE //////////////////////////

function initThree(){
     scene = new THREE.Scene();
    //const texture = new THREE.TextureLoader().load('./assets/textures/space-background.jpg');
    scene.background = spaceBlue;
     camera = new THREE.PerspectiveCamera(
     75,
     canvas.width / canvas.height,
     0.1,
     2000
     )
     camera.position.set(0, 0, 50);
     camera.lookAt(0, 0, 0);

     renderer = new THREE.WebGLRenderer({
          canvas: canvas,
          antialias: true
     })
     renderer.outputEncoding = THREE.sRGBEncoding;
     renderer.setSize(canvas.clientWidth, canvas.clientHeight);
     renderer.setPixelRatio(window.devicePixelRatio);
     renderer.shadowMap.enabled = true;

    
     //orbitCamera = new OrbitControls(camera, canvas);
     flyCamera = new FlyControls(camera, canvas);
     flyCamera.movementSpeed = 25;
     flyCamera.rollSpeed = Math.PI / 4;
     flyCamera.autoForward = false;
     flyCamera.dragToLook = true;
  
     ///// lights /////
     ambientLight = new THREE.AmbientLight(0x222222, 0.51);
     scene.add(ambientLight);

     spotLight = new THREE.SpotLight(0xffffff, 0.51);
     spotLight2 = new THREE.SpotLight(0xffffff, 0.5);
     spotLight.position.set(-200, 400, 120);
     spotLight2.position.set(200, 400, -120);
     spotLight.angle = Math.PI / 18;
     spotLight.castShadow = true;
     spotLight2.castShadow = true;
     spotLight2.angle = Math.PI / 18;
     scene.add(spotLight, spotLight2);

     const pointLight = new THREE.PointLight(0xffffff, 0.51);
     const pointLight2 = new THREE.PointLight(0xffffff, 0.51);
     pointLight.position.set(0, 0, -500);
     pointLight2.position.set(0, 0, 0);
     scene.add(pointLight, pointLight2);

     const dirLight = new THREE.DirectionalLight(0x444444);
     dirLight.position.set(0, 1000, -500);
     dirLight.castShadow = true;
     scene.add(dirLight);
     
    
     const clock = new THREE.Clock();
     function basicRenderFrame(){
          let deltaTime = clock.getDelta();    
          flyCamera.update(deltaTime);
          renderer.render(scene, camera);
          requestAnimationFrame(basicRenderFrame);
     }
     basicRenderFrame();

     // Camera FlyControls programmed movement //
     document.getElementById('bg_fly').addEventListener('click', () => {
          let tl = gsap.timeline({repeat: 3, repeatDelay: 3});
          tl.to(camera.position, {z: 500, duration:12});
          tl.to(camera.position, {z: 100, duration:6});
          tl.to(camera.rotation, {z: Math.PI, duration: 8});
          tl.to(camera.rotation, {z: Math.PI*0, duration: 8});
          tl.to(camera.position, {x: 38, duration:4});
          tl.to(camera.position, {x: 1, duration:2});
          tl.to(camera.rotation, {y: Math.PI/2 , duration: 6});
          tl.to(camera.rotation, {y: -Math.PI/2 , duration: 12});
          tl.to(camera.rotation, {y: Math.PI * 0 , duration: 6});
          tl.to(camera.position, {z: 38, duration:6}); 
          tl.to(camera.position, {z: 100, duration:4}); 
          tl.to(camera.rotation, {z: -Math.PI * 2, duration:6}); 
          tl.to(camera.position, {z: 5, duration:8});  
          tl.to(camera.position, {z: 50, duration:4});  
          tl.to(camera.rotation, {y: -Math.PI/2, duration:6});  
          tl.to(camera.rotation, {y: Math.PI/2, duration:8});  
          tl.to(camera.rotation, {y: Math.PI * 0, duration:4});  
          tl.to(camera.position, {z: 100, duration:6});      
     })

     document.getElementById('bg_fly2').addEventListener('click', () => {
          let tl = gsap.timeline({repeat: 3, repeatDelay: 3});
          tl.to(camera.position, {z: 10, duration:12});
          tl.to(camera.position, {z: 100, duration:6});
          tl.to(camera.rotation, {z: Math.PI, duration: 8});
          tl.to(camera.rotation, {z: Math.PI*0, duration: 8});
          tl.to(camera.position, {y: 200, duration:4});
          tl.to(camera.rotation, {y: Math.PI/4 , duration: 6});
          tl.to(camera.position, {y: 0, duration:2});
          tl.to(camera.rotation, {y: -Math.PI/4 , duration: 12});
          tl.to(camera.rotation, {y: Math.PI * 0 , duration: 6});
          tl.to(camera.position, {z: 1, duration:6}); 
          tl.to(camera.position, {z: 800, duration:14}); 
          tl.to(camera.rotation, {z: -Math.PI * 2, duration:6}); 
          tl.to(camera.position, {z: 5, duration:8});  
          tl.to(camera.position, {z: 350, duration:4});  
          tl.to(camera.rotation, {y: -Math.PI/2, duration:6});  
          tl.to(camera.rotation, {y: Math.PI/2, duration:8});  
          tl.to(camera.rotation, {y: Math.PI * 0, duration:4});  
          tl.to(camera.position, {z: 50, duration:6});      
     })
};

///// Select Backgrounds /////

const blueBtn = document.getElementById('bg_blue');
const redBtn = document.getElementById('bg_red');
const gloomyBtn = document.getElementById('bg_gloomy');
const pereaBtn = document.getElementById('bg_perea');
const stormBtn = document.getElementById('bg_storm');
const studioBtn = document.getElementById('bg_studio');

let selectedBg = 'spaceBlue';

const bgObj = {
     spaceBlue: {
          button: blueBtn,
          bg: spaceBlue,
          prev: 'photoStudio',
          next: 'spaceRed',
     },
     spaceRed: {
          button: redBtn,
          bg: spaceRed,
          prev: 'spaceBlue',
          next: 'gloomy',
     },
     gloomy: {
          button: gloomyBtn,
          bg: gloomy,
          prev: 'spaceRed',
          next: 'pereaBeach',
     },
     pereaBeach: {
          button: pereaBtn,
          bg: pereaBeach,
          prev: 'gloomy',
          next: 'storm',
     },
     storm: {
          button: stormBtn,
          bg: storm,
          prev: 'pereaBeach',
          next: 'photoStudio',
     },
     photoStudio: {
          button: studioBtn,
          bg: photoStudio,
          prev: 'storm',
          next: 'spaceBlue',
     },
}

const switchBg = (newBg) => {
    
     if (selectedBg !== newBg) {
       bgObj[selectedBg].button.classList.remove('active-bg')
       selectedBg = newBg
       bgObj[selectedBg].button.classList.add('active-bg')
       scene.background = bgObj[selectedBg].bg;  
                  
     }
}


blueBtn.onclick = () => {switchBg('spaceBlue')}
redBtn.onclick = () => {switchBg('spaceRed')}
gloomyBtn.onclick = () => {switchBg('gloomy')}
pereaBtn.onclick = () => {switchBg('pereaBeach')}
stormBtn.onclick = () => {switchBg('storm')}
studioBtn.onclick = () => {switchBg('photoStudio')}

////////// Select Center Visualizer ///////////

const waterBallBtn = document.getElementById('bg_water-ball');
const discBtn = document.getElementById('bg_disc');
const icosahedronBtn = document.getElementById('bg_icosahedron');
const rubiksCubeBtn = document.getElementById('bg_rubiks');

icosahedronBtn.addEventListener('click', visualizerIcosahedron);
let isIcosahedronOn = false;
function visualizerIcosahedron(){
     if(isIcosahedronOn){
          groupIcosahedron.parent.remove(groupIcosahedron);
          isIcosahedronOn = false;
          icosahedronBtn.classList.remove('active-bg');
     } else {
          icosahedronVisualizer(scene, camera, renderer, dataArray, analyser);
          isIcosahedronOn = true;
          icosahedronBtn.classList.add('active-bg');
     }
};

waterBallBtn.addEventListener('click', visualizerWaterBall);
let isWaterBallOn = false;
function visualizerWaterBall(){
     if(isWaterBallOn){
          groupWaterBall.parent.remove(groupWaterBall);
          isWaterBallOn = false;
          waterBallBtn.classList.remove('active-bg');
     } else {
          waterBallVisualizer(scene, camera, renderer, dataArray, analyser);
          isWaterBallOn = true;
          waterBallBtn.classList.add('active-bg');
     }
};

discBtn.addEventListener('click', visualizerDisc);
let isDiscOn = false;
function visualizerDisc(){
     if(isDiscOn){
          disc.parent.remove(disc);
          isDiscOn = false;
          discBtn.classList.remove('active-bg');
     } else {
          discVisualizer(scene, camera, renderer, dataArray, analyser);
          isDiscOn = true;
          discBtn.classList.add('active-bg');
     }
};

rubiksCubeBtn.addEventListener('click', visualizerRubiksCube);
let isRubiksCubeOn = false;
function visualizerRubiksCube(){
     if(isRubiksCubeOn){
          rubiksCube.parent.remove(rubiksCube);
          isRubiksCubeOn = false;
          rubiksCubeBtn.classList.remove('active-bg');
     } else {
          rubiksCubeVisualizer(scene, camera, renderer, dataArray, analyser);
          isRubiksCubeOn = true;
          rubiksCubeBtn.classList.add('active-bg');
     }
}; //did not remove why?????

///// Select Visualizer /////

const sphereBtn = document.getElementById('sphere_btn');
const cubeBtn = document.getElementById('cube_btn');
const planeBtn = document.getElementById('plane_btn');
const glslBtn = document.getElementById('glsl_btn');
const cylinderBtn = document.getElementById('cylinder_btn');
const particlesBtn = document.getElementById('particles_btn');
const instancesBtn = document.getElementById('instances_btn');
const glassBtn = document.getElementById('glass_btn');
const ballsBtn = document.getElementById('balls_btn');
const lightsBtn = document.getElementById('lights_btn');
const warpBtn = document.getElementById('warp_btn');
const waterPaintBtn = document.getElementById('water_btn');
const liquidBtn = document.getElementById('liquid_btn');
const lineSphereBtn = document.getElementById('line-sphere_btn');

sphereBtn.addEventListener('click', visualizerSphere);
cubeBtn.addEventListener('click', visualizerCube);
planeBtn.addEventListener('click', visualizerPlane);
//marchBtn.addEventListener('click', visualizerMarch);
glslBtn.addEventListener('click', visualizerGlsl);
cylinderBtn.addEventListener('click', visualizerCylinder);
particlesBtn.addEventListener('click', visualizerParticles);
instancesBtn.addEventListener('click', visualizerInstances);
glassBtn.addEventListener('click', visualizerGlass);
ballsBtn.addEventListener('click', visualizerBalls);
lightsBtn.addEventListener('click', visualizerLights);
warpBtn.addEventListener('click', visualizerWarp);
waterPaintBtn.addEventListener('click', visualizerWaterPaint);
liquidBtn.addEventListener('click', visualizerLiquidCube);
lineSphereBtn.addEventListener('click', visualizerLineSphere);

let isSphereOn = false;
function visualizerSphere(){
     if(isSphereOn) {
          groupRing.parent.remove(groupRing);
          isSphereOn = false;
          sphereBtn.classList.remove('active-bg');
     } else {
          sphereVisualizer(scene, camera, renderer, dataArray, analyser);
          isSphereOn = true;
          sphereBtn.classList.add('active-bg');
     }        
};

let isCubeOn = false;
function visualizerCube(){
     if(isCubeOn){
          cubeGroup.parent.remove(cubeGroup);
          isCubeOn = false;
          cubeBtn.classList.remove('active-bg');
     } else {
          cubeVisualizer(scene, camera, renderer, dataArray, analyser);
          isCubeOn = true;
          cubeBtn.classList.add('active-bg');
     }
};

let isPlaneOn = false;
function visualizerPlane(){
     if(isPlaneOn){
          planeGroup.parent.remove(planeGroup);
          isPlaneOn = false; 
          planeBtn.classList.remove('active-bg');
     } else {
          planeVisualizer(scene, camera, renderer, dataArray, analyser);
          isPlaneOn = true;
          planeBtn.classList.add('active-bg');
     }
};

let isCylinderOn = false;
function visualizerCylinder(){
     if(isCylinderOn){
          groupCylinders.parent.remove(groupCylinders);
          isCylinderOn = false;
          cylinderBtn.classList.remove('active-bg');
     } else {
          cylinderVisualizer(scene, camera, renderer, dataArray, analyser);
          isCylinderOn = true;
          cylinderBtn.classList.add('active-bg');
     }
};

let isPlainsOn = false;
function visualizerGlsl(){
     if(isPlainsOn){
          plains.parent.remove(plains);
          isPlainsOn = false;
          glslBtn.classList.remove('active-bg');
     } else {
          glslVisualizer(scene, camera, renderer, dataArray, analyser);
          isPlainsOn = true;
          glslBtn.classList.add('active-bg');
     }
}    

let isGlassOn = false;
function visualizerGlass(){
     if(isGlassOn){
          groupGlass.parent.remove(groupGlass);
          isGlassOn = false;
          glassBtn.classList.remove('active-bg');
          
     } else {
          glassVisualizer(scene, camera, renderer, dataArray, analyser);
          isGlassOn = true;
          glassBtn.classList.add('active-bg');
     }
}    

let isInstancedMeshOn = false;
function visualizerInstances(){
     if(isInstancedMeshOn){
          instancedMeshGroup.parent.remove(instancedMeshGroup);
          isInstancedMeshOn = false;
          instancesBtn.classList.remove('active-bg');
     } else {
          instancesVisualizer(scene, camera, renderer, dataArray, analyser);
          isInstancedMeshOn = true;
          instancesBtn.classList.add('active-bg');
     }
}    

let isParticleOn = false;
function visualizerParticles(){
     if(isParticleOn){
          particleGroup.parent.remove(particleGroup);
          isParticleOn = false;
          particlesBtn.classList.remove('active-bg');
     } else {
          particlesVisualizer(scene, camera, renderer,dataArray, analyser);
          isParticleOn = true;
          particlesBtn.classList.add('active-bg');

     }
}    

let isBallGroupOn = false;
function visualizerBalls(){
     if(isBallGroupOn){
          ballGroup.parent.remove(ballGroup);
          isBallGroupOn = false;
          ballsBtn.classList.remove('active-bg');
     } else {
          isBallGroupOn = true;
          ballsVisualizer(scene, camera, renderer, dataArray, analyser);
          ballsBtn.classList.add('active-bg');
     }
}  

let isBallLightGroupOn = false;
function visualizerLights(){
     if(isBallLightGroupOn){
          ballLightGroup.parent.remove(ballLightGroup);
          isBallLightGroupOn = false;
          lightsBtn.classList.remove('active-bg');
     } else {
          isBallLightGroupOn = true;
          ballsLightVisualizer(scene, camera, renderer, dataArray, analyser);
          lightsBtn.classList.add('active-bg');
     }
}    
  
let isWarpOn = false;
function visualizerWarp(){
     if(isWarpOn){
          warpGroup.parent.remove(warpGroup);
          isWarpOn = false;
          warpBtn.classList.remove('active-bg');
     } else {
          isWarpOn = true;
          ballsWarpVisualizer(scene, camera, renderer, dataArray, analyser);
          warpBtn.classList.add('active-bg');
     }
}   

let isObjOn = false;
function visualizerWaterPaint(){
     if(isObjOn){
          sphereObj.parent.remove(sphereObj);
          isObjOn = false;
          waterPaintBtn.classList.remove('active-bg');
     } else {
          isObjOn = true;
          waterPaintVisualizer(scene, camera, renderer, dataArray, analyser);
          waterPaintBtn.classList.add('active-bg');
     }
};

let isEffectOn = false;
function visualizerLiquidCube(){
     if(isEffectOn){
          effectObj.parent.remove(effectObj);
          isEffectOn = false;
          liquidBtn.classList.remove('active-bg');
     } else {
          isEffectOn = true;
          liquidCubeVisualizer(scene, camera, renderer, dataArray, analyser);
          liquidBtn.classList.add('active-bg');
     }
};

let isLineOn = false;
function visualizerLineSphere(){
     if(isLineOn){
          lineGroup.parent.remove(lineGroup);
          isLineOn = false;
          lineSphereBtn.classList.remove('active-bg');
     } else {
          isLineOn = true;
          lineSphereVisualizer(scene, camera, renderer, dataArray, analyser);
          lineSphereBtn.classList.add('active-bg');
     }
}

// need to delete visualizer functions due to cpu memory usage.
// slowed down it get repeated after selections
////////
 

//// info modal ////
const modal = document.getElementById('info_modal');
const modalBtn = document.getElementById("modal_btn");
const span = document.getElementById('close');

modalBtn.addEventListener('click', () => {
      if(modalBtn.value === 'on') {
           modal.style.display = 'none';
           modalBtn.innerText = 'Info ?';
           modalBtn.value = 'off';
     } else if(modalBtn.value === 'off'){
          modal.style.display = 'block';     
          modalBtn.innerText = 'Close Info';
          modalBtn.value = 'on';
     }
}) 
span.addEventListener('click', () => {
     modal.style.display = 'none'; 
     modalBtn.value = 'off';
     modalBtn.innerText = 'Info ?';    
})

//////////
 
/////// dat GUI //////////////////////////////
const cameraFolder = gui.addFolder('Camera Movement');
cameraFolder.add(camera.position, "z", -200, 500, 0.1).name('ZOOM Z');
cameraFolder.add(camera.position, "x", -1000, 1000, 0.1).name('ZOOM X');
cameraFolder.add(camera.position, "y", -200, 300, 0.1).name('ZOOM Y');
//cameraFolder.open();
const lightnessFolder = gui.addFolder('Lightness');
lightnessFolder.add(ambientLight, 'intensity', 0, 10, 0.1).name('Ambient Light');
lightnessFolder.add(spotLight, 'intensity', 0, 10, 0.1).name('Spot Light');
gui.close();

window.addEventListener('resize', function(){
     camera.aspect = canvas.width/canvas.height;
     camera.updateProjectionMatrix();
     renderer.setSize(canvas.width, canvas.height);
     fitToContainer(canvas);
});
