import * as THREE from './js/three.module.js';

import shaders from './src/shadersPlane.js';
import planeMeshParameters from './src/planeMeshParam.js';

export const planeGroup = new THREE.Group();

export const planeVisualizer = function (scene, camera, renderer, dataArray, analyser){
     const uniforms = {
          u_time: {
               type: 'f',
               value: 2.0,
          },
          u_amplitude: {
               type: 'f',
               value: 4.0,
          },
          u_data_arr: {
               type: 'float[64]',
               value: new Uint8Array(),
          },
     };

     // icosahedron
     const texture = new THREE.TextureLoader().load('./assets/textures/2k_sun.jpg');
     const geo = new THREE.IcosahedronGeometry(10,0);
     const mat = new THREE.MeshPhongMaterial({
          wireframe: false,
          map: texture,
     })
     const icosahedron = new THREE.Mesh(geo, mat);
     icosahedron.position.set(0, 0, 0);
     //scene.add(icosahedron);

     ///// plane /////
     
     const planeGeo = new THREE.PlaneGeometry(64, 64, 32, 32);
     const planeMat = new THREE.ShaderMaterial({
          vertexShader: shaders.vertexShader,
          fragmentShader: shaders.fragmentShader,
          uniforms: uniforms,
          wireframe: true,
     })

     let planeMesh;
     let planeMeshArray = [];
     planeMeshParameters.forEach(item => {
          planeMesh = new THREE.Mesh(planeGeo, planeMat);
          if(item.rotation.x == undefined){
               planeMesh.rotation.y = item.rotation.y;
          } else {
               planeMesh.rotation.x = item.rotation.x;
          }
          planeMesh.scale.x = item.scale;
          planeMesh.scale.y = item.scale;
          planeMesh.scale.z = item.scale;
          planeMesh.position.x = item.position.x;
          planeMesh.position.y = item.position.y;
          planeMesh.position.z = item.position.z;

          planeMeshArray.push(planeMesh);
          planeGroup.add(planeMesh);
          scene.add(planeGroup);
     })
    
    
     ///////////////////////

     function animate(){
          analyser.getByteFrequencyData(dataArray);
          uniforms.u_data_arr.value = dataArray;
          planeGroup.rotation.z += 0.002;
          icosahedron.rotation.x += 0.025;
          icosahedron.rotation.y += 0.035;
          
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
     }
     animate();
};