import * as THREE from './js/three.module.js';
//import {OrbitControls} from './js/OrbitControls.js';
import { FlyControls } from './js/FlyControls.js';
import {sphereVisualizer} from './sphereVisualizer.js';
import { planeVisualizer } from './planeVisualizer.js';
import {cubeVisualizer} from './cubeVisualizer.js';


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

function fileUpload(){
     const file = document.getElementById('file_upload');
     file.addEventListener('change', function(){
          const files = this.files;
          audio1.src = URL.createObjectURL(files[0]);
          audio1.load();
     });
}

fileUpload();

async function audioVisualizer(){
     const audioTrack = WaveSurfer.create({
          container: '.waveform',
          waveColor: '#777',
          progressColor: '#fff',
          barWidth: 1,
          barHeight: 0.4,
     });

     let audioSource;
     const audioElement = document.getElementById('audio1');

     let url = audioElement.src;
     //audioTrack.load(url);
     console.log(url);

     const audioCtx = new AudioContext();
     analyser = audioCtx.createAnalyser();
     audioSource = audioCtx.createMediaElementSource(audioElement);
     audioSource.connect(analyser);
     analyser.connect(audioCtx.destination);
     analyser.fftSize = 512;
     let bufferLength = analyser.frequencyBinCount;
     dataArray = new Uint8Array(bufferLength);

     const playBtn = document.getElementById('playBtn');
     const stopBtn = document.getElementById('stopBtn');
     const pauseBtn = document.getElementById('pauseBtn');

     playBtn.addEventListener('click', function(e){     
          e.preventDefault();
          audioElement.play();
          audioTrack.play();
     })
     stopBtn.addEventListener('click', (e) => {
          e.preventDefault();
          audioElement.pause();
     })
     pauseBtn.addEventListener('click', (e) => {
          e.preventDefault();
          audioElement.pause();
     })

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
               url.revokeObjectURL(url);
          }, 100);
     });
}

audioVisualizer();

//////// THREE //////////////////////////

let scene, camera, renderer;
let orbitCamera;
let flyCamera;

initThree();

function initThree(){
     scene = new THREE.Scene();
     scene.background = new THREE.TextureLoader().load('./assets/textures/space-background.jpg');     camera = new THREE.PerspectiveCamera(
     75,
     canvas.width / canvas.height,
     0.1,
     2000
     )
     camera.position.set(0, 0, 120);
     camera.lookAt(0, 0, 0);

     renderer = new THREE.WebGLRenderer({
          canvas: canvas,
          antialias: true
     })
     renderer.setSize(canvas.width, canvas.height);

     //orbitCamera = new OrbitControls(camera, canvas);
     flyCamera = new FlyControls(camera, canvas);
     //flyCamera.movementSpeed = 10;
     //flyCamera.rollSpeed = Math.PI / 24;
     flyCamera.autoForward = false;
     flyCamera.dragToLook = true;

     ///// lights /////
     const ambientLight = new THREE.AmbientLight(0x555555, 1);
     scene.add(ambientLight);
     const spotLight = new THREE.SpotLight(0xffffff, 1);
     spotLight.position.set(0, 100, 20);
     spotLight.angle = Math.PI / 4;
     scene.add(spotLight);
     const pointLight = new THREE.PointLight(0xffffff, 1);
     pointLight.position.set(0, 0, 0);
     scene.add(pointLight);
};

///// select js file //should be like select file or toggle btn add/remove

let isPlaying = false;
const sphereBtn = document.getElementById('sphere_btn');
const cubeBtn = document.getElementById('cube_btn');
const planeBtn = document.getElementById('plane_btn');
sphereBtn.addEventListener('click', visualizerSphere);
cubeBtn.addEventListener('click', visualizerCube);
planeBtn.addEventListener('click', visualizerPlane);

function visualizerSphere(){
     //isPlaying == !isPlaying;
     if(isPlaying){
          isPlaying = false;
          return;
     } else {
          sphereVisualizer(scene, camera, renderer, dataArray, analyser, flyCamera);
          isPlaying = true;
     }
}

function visualizerCube(){
     cubeVisualizer(scene, camera, renderer, dataArray, analyser, flyCamera);
}
function visualizerPlane(){
     planeVisualizer(scene, camera, renderer, dataArray, analyser, flyCamera);
}
//// info modal ////
const modal = document.getElementById('info_modal');
const modalBtn = document.getElementById("modal_btn");
const span = document.getElementById('close');

modalBtn.addEventListener('click', () => {
     modal.style.display = 'block';
     console.log('Clinkeng');
})
span.addEventListener('click', () => {
     modal.style.display = 'none';
     console.log('Clink');
})

///// Modal //////////

window.addEventListener('resize', function(){
     camera.aspect = canvas.width/canvas.height;
     camera.updateProjectionMatrix();
     renderer.setSize(canvas.width, canvas.height);
     fitToContainer(canvas);
});

////////// image file upload
 
let texture;
const imageFile = document.getElementById('imageFile');
imageFile.addEventListener('change', selectBackgroundImg);

//getting images
function selectBackgroundImg(){
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
}
/////////////////////////////////////
