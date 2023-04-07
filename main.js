import * as THREE from './js/three.module.js';
//import {OrbitControls} from './js/OrbitControls.js';
import { FlyControls } from './js/FlyControls.js';
import {fileUpload, audioControls} from './audioControls.js';
import {sphereVisualizer} from './sphereVisualizer.js';
import { planeVisualizer } from './planeVisualizer.js';
import {cubeVisualizer} from './cubeVisualizer.js';
import {doubleVisualizer} from "./doubleVisualizer.js";
import {glslVisualizer} from "./glslVisualizer.js";
import {createInstances} from './instances.js';
import {createParticles} from './particles.js';
import {setBackgroundBlue, setBackgroundRed} from './backgrounds.js';

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
               ctx.font = "12px Verdana";
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
let spotLight, ambientLight;

initThree();
createParticles(scene, camera, renderer);
createInstances(scene, camera, renderer,flyCamera);


function initThree(){
     scene = new THREE.Scene();
     //scene.background = new THREE.TextureLoader().load('./assets/textures/space-background.jpg');
    
    setBackgroundBlue(scene);

     camera = new THREE.PerspectiveCamera(
     75,
     canvas.width / canvas.height,
     0.1,
     2000
     )
     camera.position.set(0, 0, 100);
     camera.lookAt(0, 0, 0);

     renderer = new THREE.WebGLRenderer({
          canvas: canvas,
          antialias: true
     })
     renderer.setSize(canvas.width, canvas.height);

     //orbitCamera = new OrbitControls(camera, canvas);
     flyCamera = new FlyControls(camera, canvas);
     flyCamera.movementSpeed = 50;
     flyCamera.rollSpeed = Math.PI / 4;
     flyCamera.autoForward = false;
     flyCamera.dragToLook = true;

     ///// lights /////
     ambientLight = new THREE.AmbientLight(0x555555, intensity);
     scene.add(ambientLight);
     spotLight = new THREE.SpotLight(0xffffff, intensity);
     spotLight.position.set(0, 100, 20);
     spotLight.angle = Math.PI / 4;
     scene.add(spotLight);
     const pointLight = new THREE.PointLight(0xffffff, 1);
     pointLight.position.set(0, 0, 0);
     scene.add(pointLight);
    
     const clock = new THREE.Clock();
     function animate(){
          let deltaTime = clock.getDelta();
     
          
          flyCamera.update(deltaTime);
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
     }
     animate();
};

setBackgroundRed(scene);

///// select js file //should be like select file or toggle btn add/remove
let toggle = false;
const sphereBtn = document.getElementById('sphere_btn');
const cubeBtn = document.getElementById('cube_btn');
const planeBtn = document.getElementById('plane_btn');
const doubleBtn = document.getElementById('double_btn');
const glslBtn = document.getElementById('glsl_btn');

sphereBtn.addEventListener('click', visualizerSphere);
cubeBtn.addEventListener('click', visualizerCube);
planeBtn.addEventListener('click', visualizerPlane);
doubleBtn.addEventListener('click', visualizerDouble);
glslBtn.addEventListener('click', visualizerGlsl);
 
function visualizerSphere(){    
     if(toggle = false) {
          toggle = false;
          return;
     } else {
          sphereVisualizer(scene, camera, renderer, dataArray, analyser);
          toggle = true;
     }          
}
function visualizerCube(){
     cubeVisualizer(scene, camera, renderer, dataArray, analyser);
}
function visualizerPlane(){
     planeVisualizer(scene, camera, renderer, dataArray, analyser);
}
function visualizerDouble(){
     doubleVisualizer(scene, camera, renderer, dataArray, analyser);
}

function visualizerGlsl(){
 glslVisualizer(scene, camera, renderer, dataArray, analyser);
 }    


//// info modal ////
const modal = document.getElementById('info_modal');
const modalBtn = document.getElementById("modal_btn");
const span = document.getElementById('close');

modalBtn.addEventListener('click', () => {
     modal.style.display = 'block';     
})
span.addEventListener('click', () => {
     modal.style.display = 'none';     
})

window.addEventListener('resize', function(){
     camera.aspect = canvas.width/canvas.height;
     camera.updateProjectionMatrix();
     renderer.setSize(canvas.width, canvas.height);
     fitToContainer(canvas);
});

////////// image file upload
 
// let texture;
// const imageFile = document.getElementById('imageFile_upload');
// imageFile.addEventListener('change', selectBackgroundImg);

/* function selectBackgroundImg(){
     let newBackground;
     function previewImageFile(){
          let preview = document.querySelector('img');
          let file = document.querySelector('input[type=file]').files[0];
          let reader = new FileReader();
          reader.addEventListener('load', function(){
               newBackground = reader.result;
               let img = document.createElement('img');
               img.src = reader.result;
               texture = new THREE.Texture(img);
               texture.needsUpdate = true;
               scene.background = texture;
          }, false);
          if(file){
               reader.readAsDataURL(file);
          }
     }
     previewImageFile();
} */

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