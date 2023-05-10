import * as THREE from './js/three.module.js';

export const cubeGroup = new THREE.Object3D();

let cubeGroup1, cubeGroup2;
export const cubeVisualizer = function (scene, camera, renderer, dataArray, analyser){
     const uniforms = {
          u_time: {type: 'f', value: 0.0},
          u_data_array: {type: 'f', value: dataArray}
     }
     const textureLoader = new THREE.TextureLoader();
     const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);

     const materials = [
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/textures/2k_saturn.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/textures/2k_earth_daymap.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/textures/2k_jupiter.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/textures/2k_venus_surface.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/textures/2k_neptune.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/textures/2k_mars.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/textures/2k_sun.jpg')}),
     ]

     const dirLight = new THREE.DirectionalLight(0xffffff, 0.25);
     dirLight.position.set(100, 500, 100);
     cubeGroup.add(dirLight);

     ///// cubes /////
     let cube;
     let cubes = [];
     let cubes2 = [];
     let count = 32;
     cubeGroup1 = new THREE.Group();
     cubeGroup2 = new THREE.Group();

     
     for(let i = 0; i < count / 4; i++){
          for(let j = 0; j < count * 4; j++){
               cube = new THREE.Mesh(cubeGeometry, materials[i % 8]);
               cube.position.x = i * 3;
               cube.position.z = j * 3;
               cube.shininess = 100;
               cubes.push(cube);
               cubeGroup1.add(cube); 
               console.log(cubeGroup1);
          }
     }
     cubeGroup1.position.set(192, -24, -24);
     cubeGroup1.rotation.y = -Math.PI/2;
     cubeGroup.add(cubeGroup1);

     for(let i = 0; i < count / 4; i++){
          for(let j = 0; j < count * 4; j++){
               cube = new THREE.Mesh(cubeGeometry, materials[i % 8]);
               cube.position.x = i * 3;
               cube.position.z = j * 3;
               cube.shininess = 100;
               cubes2.push(cube);               
               cubeGroup2.add(cube);       
          }
     }
     cubeGroup2.position.set(-196, -24, -192);
     cubeGroup2.rotation.y = Math.PI/2;
     cubeGroup.add(cubeGroup2);
     scene.add(cubeGroup);

       console.log(cubeGroup1);
               console.log(cubeGroup2);         
     ///// animation /////

     const clock = new THREE.Clock();

     function animate(){
          uniforms.u_time.value = clock.getElapsedTime();
          uniforms.u_data_array.value = dataArray; 
          
          cubes.forEach(cube => {
               cube.rotation.x += 0.004;
          cube.rotation.y += 0.001;
          cube.rotation.z += 0.008;
          })
          cubes2.forEach(cube => {
               cube.rotation.x += 0.004;
          cube.rotation.y += 0.001;
          cube.rotation.z += 0.008;
          })
          

          /// visualizer 
          analyser.getByteFrequencyData(dataArray);
          for(let i = 0; i < 1024; i++){
               const pitch = dataArray[i % 256];
               const s = cubes[i];
               const z = s.position;
               TweenMax.to(z, 0.26, {
                    y: pitch/7, 
                    ease:Power2.easeOut
               })
          }
          for(let i = 0; i < 1024; i++){
               const pitch = dataArray[i % 256];
               const s = cubes2[i];
               const z = s.position;
               TweenMax.to(z, 0.26, {
                    y: pitch/7, 
                    ease:Power2.easeOut
               })
          }
         
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
     }
     animate();
}
