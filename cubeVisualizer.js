import * as THREE from './js/three.module.js';

const gui = new dat.GUI();
gui.domElement.id = 'gui';
document.body.appendChild(gui.domElement);

export const cubeVisualizer = function (scene, camera, renderer, dataArray, analyser, flyCamera){
     const uniforms = {
          u_time: {type: 'f', value: 0.0},
          u_data_array: {type: 'f', value: dataArray}
     }
     const textureLoader = new THREE.TextureLoader();
     const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

     const materials = [
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/2k_saturn.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/2k_earth_daymap.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/2k_jupiter.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/2k_venus_surface.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/2k_neptune.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/2k_mars.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/2k_sun.jpg')}),
     ]

     ///// cubes /////
     let cube;
     let cubes = [];
     let count = 16;
     const cubeGroup = new THREE.Object3D();

     
     for(let i = 0; i < count / 4; i++){
          for(let j = 0; j < count * 4; j++){
               cube = new THREE.Mesh(cubeGeometry, materials[i % 8]);
               cube.position.x = i * 2;
               cube.position.z = j * 2;
               cube.shininess = 100;
               cubes.push(cube);
               cubeGroup.add(cube);        
          }
     }
     cubeGroup.position.set(64, -24, 64);
     cubeGroup.rotation.y = -Math.PI/2;
     scene.add(cubeGroup);

     
     //icosahedron

     const icosaGeo = new THREE.IcosahedronGeometry(5, 0);
     const icosaMat = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          map:textureLoader.load('./assets/2k_sun.jpg'),
     })
     const icosahedron = new THREE.Mesh(icosaGeo, icosaMat);
     scene.add(icosahedron);

     ///// dat GUI/////
     const cameraFolder = gui.addFolder('Camera Movement');
     cameraFolder.add(camera.position, "z", 0, 1000, 0.1).name('ZOOM');
     //cameraFolder.open();
     const cubeFolder = gui.addFolder('Cube');
     var conf = { color : '#ffae23' };    
     cubeFolder.addColor(conf, 'color').onChange( function(colorValue) {
     cube.material.color.set(colorValue);
     });

     const icosahedronData = {
     radius: 1,
     detail: 0,
     }
     const icosahedronFolder = gui.addFolder('Icosahedron')
     const icosahedronPropertiesFolder = icosahedronFolder.addFolder('Properties')
     icosahedronPropertiesFolder
     .add(icosahedronData, 'radius', 0.1, 20)
     .step(0.1)
     .onChange(regenerateIcosahedronGeometry)
     icosahedronPropertiesFolder
     .add(icosahedronData, 'detail', 0, 5)
     .step(1)
     .onChange(regenerateIcosahedronGeometry)

     function regenerateIcosahedronGeometry() {
     const newGeometry = new THREE.IcosahedronGeometry(
          icosahedronData.radius,
          icosahedronData.detail
     )
     icosahedron.geometry.dispose()
     icosahedron.geometry = newGeometry
     };
     gui.close();
     ///// animation /////

     const clock = new THREE.Clock();

     function animate(){
          uniforms.u_time.value = clock.getElapsedTime();
          uniforms.u_data_array.value = dataArray; 
          
          cubes.forEach(cube => {
               cube.rotation.x += 0.004;
          cube.rotation.y += 0.001;
          })
          

          icosahedron.rotation.x -= 0.008;
          icosahedron.rotation.z += 0.006;
          icosahedron.rotation.y += 0.009;


          /// visualizer 
          analyser.getByteFrequencyData(dataArray);
          for(let i = 0; i < 256; i++){
               const pitch = dataArray[i];
               const s = cubes[i];
               const z = s.position;
               TweenMax.to(z, 0.2, {
                    y: pitch/24, 
                    ease:Power2.easeOut
               })
          }
         let delta = clock.getDelta();
         flyCamera.movementSpeed = 500;
         flyCamera.rollSpeed = Math.PI/2;
         flyCamera.update(delta);
          //orbitCamera.update();
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
     }
     animate();
}
