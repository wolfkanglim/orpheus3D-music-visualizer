import * as THREE from './js/three.module.js';
import {OrbitControls} from './js/OrbitControls.js';

let  controls, rollObject, group, rubiksCube;

const rotateConditions = {
  right: { axis: "x", value: 5 },
  left: { axis: "x", value: -5 },
  top: { axis: "y", value: 5 },
  bottom: { axis: "y", value: -5 },
  front: { axis: "z", value: 5 },
  back: { axis: "z", value: -5 }
};

const colorConditions = [
  ["x", 5, "green"],
  ["x", -5, "orange"],
  ["y", 5, "red"],
  ["y", -5, "yellow"],
  ["z", 5, "blue"],
  ["z", -5, "white"]
];

const step = Math.PI / 100;
const faces = ["front", "back", "left", "right", "top", "bottom"];
const directions = [-1, 1];
const cPositions = [-5, 0, 5];
let cubes = [];

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform vec3 faceColor;

void main() {
    vec3 border = vec3(0.033);
    float bl = smoothstep(0.0, 0.03, vUv.x);
    float br = smoothstep(1.0, 0.97, vUv.x);
    float bt = smoothstep(0.0, 0.03, vUv.y);
    float bb = smoothstep(1.0, 0.97, vUv.y);
    vec3 c = mix(border, faceColor, bt*br*bb*bl);
    gl_FragColor = vec4(c, 1.0);
}
`;

const createMaterial = (color) =>
  new THREE.ShaderMaterial({
    fragmentShader,
    vertexShader,
    uniforms: { 
       faceColor: { type: "v3", value: color } 
     }
  });

const materials = Object.entries({
  blue: new THREE.Vector4(0.011, 0.0352, 0.965),
  red: new THREE.Vector4(0.9847, 0.0203, 0.0372),
  white: new THREE.Vector4(0.956, 0.956, 0.956),
  green: new THREE.Vector4(0.054, 0.5486, 0.0117),
  yellow: new THREE.Vector4(0.9807, 0.8725, 0.107),
  orange: new THREE.Vector4(0.792, 0.317, 0.086),
  gray: new THREE.Vector4(0.0101, 0.0243, 0.0243)
}).reduce((acc, [key, val]) => ({ ...acc, [key]: createMaterial(val) }), {});
/* const materials = Object.entries({
  blue: new THREE.Vector4(0.011, 0.352, 0.65),
  red: new THREE.Vector4(0.847, 0.203, 0.372),
  white: new THREE.Vector4(0.956, 0.956, 0.956),
  green: new THREE.Vector4(0.054, 0.486, 0.117),
  yellow: new THREE.Vector4(0.807, 0.725, 0.07),
  orange: new THREE.Vector4(0.792, 0.317, 0.086),
  gray: new THREE.Vector4(0.301, 0.243, 0.243)
}).reduce((acc, [key, val]) => ({ ...acc, [key]: createMaterial(val) }), {}); */

export const rubiksCubeVisualizer = function (scene, camera, renderer, dataArray, analyser ) { 


class Roll {
     constructor(face, direction) {
          this.face = face;
          this.stepCount = 0;
          this.active = true;
          this.init();
          this.direction = direction;
          
     }

     init() {
          cubes.forEach((item) => {
               if (item.position[this.face.axis] == this.face.value) {
                    scene.remove(item);
                    group.add(item);
                    rubiksCube.add(group);
               }
          });
     }
     rollFace() {
          if (this.stepCount != 50) {
               group.rotation[this.face.axis] += this.direction * step;
               this.stepCount += 1;
          } else {
               if (this.active) {
               this.active = false;
               this.clearGroup();
               }
          }
     }

     clearGroup() {
          for (var i = group.children.length - 1; i >= 0; i--) {
               let item = group.children[i];
               item.getWorldPosition(item.position);
               item.getWorldQuaternion(item.rotation);
               item.position.x = Math.round(item.position.x);
               item.position.y = Math.round(item.position.y);
               item.position.z = Math.round(item.position.z);
               group.remove(item);
               scene.add(item);
          }
          group.rotation[this.face.axis] = 0;
     }
}


          controls = new OrbitControls(camera, renderer.domElement);          
          createObjects();   

     function createObjects() {
          const geometry = new THREE.BoxGeometry(5, 5, 5);
          let createCube = (position) => {
               let mat = [];
               for (let i = 0; i < 6; i++) {
                    let cnd = colorConditions[i];
                    if (position[cnd[0]] == cnd[1]) {
                    mat.push(materials[cnd[2]]);
                    } else {
                    mat.push(materials.gray);
                    }
               }
               const cube = new THREE.Mesh(geometry, mat);
               cube.position.set(position.x, position.y, position.z);
               cubes.push(cube);
               scene.add(cube);
          };

          cPositions.forEach((x) => {
               cPositions.forEach((y) => {
                    cPositions.forEach((z) => {
                         createCube({ x, y, z });
                    });
               });
          });

          group = new THREE.Group();
          //scene.add(group);
         rubiksCube = new THREE.Object3D();
          //rubiksCube.rotation.x = Math.PI/ 20;          
          scene.add(rubiksCube); 

          rollObject = new Roll(rotateConditions["top"], -1);
     }

     function update() {
          controls.update();
          analyser.getByteFrequencyData(dataArray);
          let frequency = dataArray[55] * 0.005;
          
          if (rollObject) {
               if (rollObject.active) {
                    rollObject.rollFace();
               } else {
                    rollObject = new Roll(
                    rotateConditions[faces[Math.floor(Math.random() * faces.length)]],
                    directions[Math.floor(Math.random() * directions.length)]
                    );
               }
          }
     }

     function animate() {
          requestAnimationFrame(animate);
          update();
          renderer.render(scene, camera);
     }

     animate();
}