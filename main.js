import * as THREE from './js/three.module.js';
//import {OrbitControls} from './js/OrbitControls.js';
import { FlyControls } from './js/FlyControls.js';
import {fileUpload, audioControls} from './audioControls.js';
import {sphereVisualizer} from './sphereVisualizer.js';
import { planeVisualizer } from './planeVisualizer.js';
import {cubeVisualizer} from './cubeVisualizer.js';
import { cylinderVisualizer } from './cylinderVisualizer.js';
import { glassVisualizer } from './glassVisualizer.js';
import { ballsVisualizer } from './ballsVisualizer.js';
import { ballsLightVisualizer } from './ballsLightVisualizer.js';
import { ballsWarpVisualizer } from './ballsWarpVisualizer.js';
import {glslVisualizer} from "./glslVisualizer.js";
import {icosahedronVisualizer} from './icosahedronVis.js';
import {instancesVisualizer} from './instancesVisualizer.js';
import {particlesVisualizer} from './particlesVisualizer.js';
import {discVisualizer} from './discVisualizer.js';
import {waterBallVisualizer} from './waterBallVisualizer.js';
import {spaceBlue, spaceRed, gloomy, pereaBeach, storm, photoStudio} from './backgrounds.js';
import {marchVisualizer} from './marchVisualizer.js';
import {waterPaintVisualizer} from './waterPaintVisualizer.js';
import {rubiksCubeVisualizer} from './rubiksCubeVisualizer.js';
import { liquidCubeVisualizer } from './liquidCubeVisualizer.js';

fileUpload();

const gui = new dat.GUI();
gui.domElement.id = 'gui';
document.body.appendChild(gui.domElement);

const canvas = document.getElementById('canvas1');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight; 
fitToContainer(canvas);

function fitToContainer(canvas){
  // fill the parent, then set the size to match
  canvas.style.width ='100%';
  canvas.style.height='100%';
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
};

///// audio setup /////
let analyser;
let dataArray = [];

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
     let barWidth = canvas2.width / bufferLength;
     let barHeight;
     
     function drawBarVisualizer(){
          ctx.clearRect(0, 0, canvas2.width, canvas2.height);
          function drawText(){
               ctx.font = "10px Verdana";
               ctx.fillStyle = 'white';
               ctx.fillText('Bar Visualizer', 10, 16);              
          }
          drawText();

          x = 0;
          analyser.getByteFrequencyData(dataArray);
          for(let i = 0; i < bufferLength; i++){
               barHeight = dataArray[i] / 6;     
               //draw
               const h = i + barHeight / 5;
               const s = 90;
               const l = 50;
     
               ctx.fillStyle = 'white';
               ctx.fillRect(x + canvas2.width/2, canvas2.height - 15 - barHeight, barWidth, 5);
     
               ctx.fillStyle = 'hsl('+ h +' , '+ s +'%, '+ l +'%)';
               ctx.fillRect(x + canvas2.width / 2, canvas2.height - 15 -barHeight, barWidth, barHeight);
               
               ctx.fillStyle = 'white';
               ctx.fillRect(canvas2.width/2 - x , canvas2.height - 15 - barHeight, barWidth, 5);
     
               ctx.fillStyle = 'hsl('+ h +' , '+ s +'%, '+ l +'%)';
               ctx.fillRect(canvas2.width / 2 - x, canvas2.height - 15 - barHeight , barWidth, barHeight);
     
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

audioAnalyser();
audioControls();

//////// THREE //////////////////////////

let scene, camera, renderer;
//let orbitCamera;
let flyCamera;
let intensity = 1;
let spotLight, spotLight2, ambientLight;

initThree();



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
     renderer.setSize(canvas.width, canvas.height);
     renderer.setPixelRatio(window.devicePixelRatio);
     renderer.shadowMap.enabled = true;

    
     //orbitCamera = new OrbitControls(camera, canvas);
     flyCamera = new FlyControls(camera, canvas);
     flyCamera.movementSpeed = 25;
     flyCamera.rollSpeed = Math.PI / 4;
     flyCamera.autoForward = false;
     flyCamera.dragToLook = true;
  
     ///// lights /////
     ambientLight = new THREE.AmbientLight(0xffffff, 0.71);
     scene.add(ambientLight);

     spotLight = new THREE.SpotLight(0xffffff, 1);
     spotLight2 = new THREE.SpotLight(0xffffff, intensity);
     spotLight.position.set(-200, 400, 120);
     spotLight2.position.set(200, 400, -120);
     spotLight.angle = Math.PI / 4;
     spotLight.castShadow = true;
     spotLight2.castShadow = true;
     scene.add(spotLight, spotLight2);

     const pointLight = new THREE.PointLight(0xffffff, 1);
     const pointLight2 = new THREE.PointLight(0xffffff, 1);
     pointLight.position.set(0, 0, -500);
     pointLight2.position.set(0, 0, 0);
     scene.add(pointLight, pointLight2);

     const dirLight = new THREE.DirectionalLight(0x444444);
     dirLight.position.set(0, 1000, -500);
     dirLight.castShadow = true;
     scene.add(dirLight);
     
    
     const clock = new THREE.Clock();
     function animate(){
          let deltaTime = clock.getDelta();    
          flyCamera.update(deltaTime);
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
     }
     animate();

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
};

//set Backgrounds
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
//not use prevBtn nextBtn//
/* const prevBg = () => {
switchBg(bgObj[selectedBg].prev)
}
const nextBg = () => {
switchBg(bgObj[selectedBg].next)
} 
document.getElementById('bg_next').addEventListener('click', () => {
     switchBg(bgObj[selectedBg].next)
     }); 
     */

blueBtn.onclick = () => {switchBg('spaceBlue')}
redBtn.onclick = () => {switchBg('spaceRed')}
gloomyBtn.onclick = () => {switchBg('gloomy')}
pereaBtn.onclick = () => {switchBg('pereaBeach')}
stormBtn.onclick = () => {switchBg('storm')}
studioBtn.onclick = () => {switchBg('photoStudio')}


////////// Working on... Center Visualizer ///////////

const waterBallBtn = document.getElementById('bg_water-ball');
const discBtn = document.getElementById('bg_disc');
const icosahedronBtn = document.getElementById('bg_icosahedron');
const rubiksBtn = document.getElementById('bg_rubiks');

let selectedCenter = 'icosahedron';

const centerObj = {
     icosahedron: {
          button: icosahedronBtn,
          center: icosahedronVisualizer,
          isOn: false
     },
     waterBall: {
          button: waterBallBtn,
          center: waterBallVisualizer,
          isOn: false
     },
     disc: {
          button: discBtn,
          center: discVisualizer,
          isOn: false
     },
     rubiks: {
          button: rubiksBtn,
          center: rubiksCubeVisualizer,
          isOn: false
     },
     
}

const createCenter = () => {
     if(centerObj[selectedCenter].isOn) return;
     centerObj[selectedCenter].center(scene, camera, renderer, dataArray, analyser);
     centerObj[selectedCenter].isOn = true;
}

const switchCenter = (newCenter) => {
     if(centerObj[newCenter].isOn) return;
     if (selectedCenter !== newCenter) {
       centerObj[selectedCenter].button.classList.remove('active-bg');
       
       selectedCenter = newCenter;
       centerObj[selectedCenter].button.classList.add('active-bg');
          createCenter();
      
     }  else {
          centerObj[selectedCenter].center(scene, camera, renderer, dataArray, analyser);
     } 
}

icosahedronBtn.onclick = () => {
     if(centerObj.icosahedron.isOn == false);
     switchCenter('icosahedron');
     centerObj.icosahedron.isOn = true;
     centerObj.waterBall.isOn = false;
};
waterBallBtn.onclick = () => {
     switchCenter('waterBall')
     centerObj.waterBall.isOn = true;
     centerObj.icosahedron.isOn = false;
};
discBtn.onclick = () => {switchCenter('disc')};
rubiksBtn.onclick = () => {switchCenter('rubiks')};


//marchVisualizer(scene, camera, renderer, dataArray, analyser);
///// select js file //should be like select file or toggle btn add/remove

const sphereBtn = document.getElementById('sphere_btn');
const cubeBtn = document.getElementById('cube_btn');
const planeBtn = document.getElementById('plane_btn');
const marchBtn = document.getElementById('march_btn');
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

sphereBtn.addEventListener('click', visualizerSphere);
cubeBtn.addEventListener('click', visualizerCube);
planeBtn.addEventListener('click', visualizerPlane);
marchBtn.addEventListener('click', visualizerMarch);
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
 
function visualizerSphere(){        
     sphereVisualizer(scene, camera, renderer, dataArray, analyser);
}
function visualizerCube(){
     cubeVisualizer(scene, camera, renderer, dataArray, analyser);
}
function visualizerPlane(){
     planeVisualizer(scene, camera, renderer, dataArray, analyser);
}
function visualizerMarch(){
     marchVisualizer(scene, camera, renderer, dataArray, analyser);
}
function visualizerGlsl(){
     glslVisualizer(scene, camera, renderer, dataArray, analyser);
}    
function visualizerCylinder(){
 cylinderVisualizer(scene, camera, renderer, dataArray, analyser);
}    
function visualizerParticles(){
     particlesVisualizer(scene, camera, renderer,dataArray, analyser);
}    
function visualizerInstances(){
     instancesVisualizer(scene, camera, renderer, dataArray, analyser);
}    
function visualizerGlass(){
     glassVisualizer(scene, camera, renderer, dataArray, analyser);
}    
function visualizerBalls(){
     ballsVisualizer(scene, camera, renderer, dataArray, analyser);
}    
function visualizerLights(){
     ballsLightVisualizer(scene, camera, renderer, dataArray, analyser);
}    
function visualizerWarp(){
     ballsWarpVisualizer(scene, camera, renderer, dataArray, analyser);
}   
function visualizerWaterPaint(){
     waterPaintVisualizer(scene, camera, renderer, dataArray, analyser);
}  
function visualizerLiquidCube(){

     liquidCubeVisualizer(scene, camera, renderer, dataArray, analyser);
}
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
