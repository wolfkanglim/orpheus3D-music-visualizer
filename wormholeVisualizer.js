import * as THREE from './js/three.module.js';
import { ImprovedNoise } from "./js/ImprovedNoise.js";

///// define variables /////
export let tubes = [];
let tubeVertices;
let speed = 0.04;


export  function wormholeVisualizer(scene, camera, renderer, dataArray, analyser){
     const radius = 10;
     const tubeLength = 200;
     const tubeGeo = new THREE.CylinderGeometry(radius, radius, tubeLength, 256, 4096, true);
     tubeVertices = tubeGeo.attributes.position;
     const colors = [];
     const noise = new ImprovedNoise();
     let pos = new THREE.Vector3();
     let vec3 = new THREE.Vector3();
     const noiseFreq = 0.4;
     const noiseAmp = 0.15;
     const color = new THREE.Color();
     const hueNoiseFreq = 0.015;

     for (let i = 0; i < tubeVertices.count; i += 1) {
          pos.fromBufferAttribute(tubeVertices, i);
          vec3.copy(pos);
          let vertexNoise = noise.noise(
            vec3.x * noiseFreq,
            vec3.y * noiseFreq,
            vec3.z
          );
      
          vec3.addScaledVector(pos, vertexNoise * noiseAmp);
          tubeVertices.setXYZ(i, vec3.x, pos.y, vec3.z);
          
          let colorNoise = noise.noise(vec3.x * hueNoiseFreq, vec3.y * hueNoiseFreq, i * 0.001 * hueNoiseFreq);
          color.setHSL(0.5 - colorNoise, 1, 0.5);
          colors.push(color.r, color.g, color.b);
        }

        const mat = new THREE.PointsMaterial({ size: 0.06, vertexColors: true });

        function getTube(index) {
          const startPosZ =  -tubeLength * index;
          const endPosZ = tubeLength;
          const resetPosZ =  -tubeLength;
          const geo = new THREE.BufferGeometry();
          geo.setAttribute("position", tubeVertices);
          geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
          const points = new THREE.Points(geo, mat);
          points.rotation.x = Math.PI * 0.5;
          points.position.z = startPosZ;
      
          function update() {
            points.rotation.y += 0.008;
            points.position.z += speed;
            
            if (points.position.z > endPosZ) {
              points.position.z = resetPosZ;
            }
          }
          return { points, update };
     }

  const tubeA = getTube(0);
  const tubeB = getTube(1);
  tubes = [tubeA, tubeB]; 
  scene.add(tubeA.points, tubeB.points);
  
  function animate(time) {
     requestAnimationFrame(animate);
     analyser.getByteFrequencyData(dataArray);
    
     speed = dataArray[24] * 0.01 + 0.001; 
        
     tubes.forEach((tube) => tube.update());
     camera.position.x = Math.cos(time * 0.001) * 4.5;
     camera.position.y = Math.sin(time * 0.0005) * 3;
     renderer.render(scene, camera);
   } 
   
   animate(0);

}



