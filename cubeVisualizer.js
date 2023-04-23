import * as THREE from './js/three.module.js';


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

     ///// cubes /////
     let cube;
     let cubes = [];
     let count = 32;
     const cubeGroup = new THREE.Object3D();

     
     for(let i = 0; i < count / 4; i++){
          for(let j = 0; j < count * 4; j++){
               cube = new THREE.Mesh(cubeGeometry, materials[i % 8]);
               cube.position.x = i * 3;
               cube.position.z = j * 3;
               cube.shininess = 100;
               cubes.push(cube);
               cubeGroup.add(cube);        
          }
     }
     cubeGroup.position.set(128, -12, -24);
     cubeGroup.rotation.y = -Math.PI/2;
     scene.add(cubeGroup);

     
     //icosahedron

     const icosaGeo = new THREE.IcosahedronGeometry(5, 0);
     const icosaMat = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          map:textureLoader.load('./assets/textures/2k_sun.jpg'),
     })
     const icosahedron = new THREE.Mesh(icosaGeo, icosaMat);
     //scene.add(icosahedron);

     
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
          

          icosahedron.rotation.x -= 0.008;
          icosahedron.rotation.z += 0.006;
          icosahedron.rotation.y += 0.009;


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
         
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
     }
     animate();
}
