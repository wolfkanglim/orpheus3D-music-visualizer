import * as THREE from './js/three.module.js';


const gui = new dat.GUI();
gui.domElement.id = 'gui';
document.body.appendChild(gui.domElement);

export const sphereVisualizer = function (scene, camera, renderer, dataArray, analyser, flyCamera){
     const uniforms = {
          u_time: {type: 'f', value: 0.0},
          u_data_array: {type: 'f', value: dataArray}
     }
     const textureLoader = new THREE.TextureLoader();

     const materials = [
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/textures/2k_saturn.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/textures/2k_earth_daymap.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/textures/2k_jupiter.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/textures/2k_venus_surface.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/textures/2k_neptune.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/textures/2k_mars.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/textures/2k_sun.jpg')}),
      new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/textures/2k_moon.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/textures/2k_mercury.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/textures/2k_uranus.jpg')}), 
     ]

     ///// spheres /////
     let sphere;
     let spheres = [];
     let ringOne = new THREE.Object3D();
     let ringTwo = new THREE.Object3D();
     let ringThree = new THREE.Object3D();
     let ringFour = new THREE.Object3D();
     let ringFive = new THREE.Object3D();
     let ringSix = new THREE.Object3D();
     let ringSeven = new THREE.Object3D();
     let ringEight = new THREE.Object3D();
     let ringNine = new THREE.Object3D();
     let ringTen = new THREE.Object3D();

     function createRing(count, radius, group){
          const sphereGeometry = new THREE.SphereGeometry(1.2);
         
          for(let i = 0; i < count; i++){
               let angle = Math.PI * 2 / count;
               sphere = new THREE.Mesh(sphereGeometry, materials[(i % 11)]);
               sphere.position.x = radius * Math.cos(angle * i);
               sphere.position.y = radius * Math.sin(angle * i);
               sphere.shininess = 100;
               spheres.push(sphere);
               group.add(sphere);
          }
          group.position.set(0,0,0);
          group.rotation.x = -Math.PI / 2;
          scene.add(group);
     }
     createRing(20, 12, ringOne);
     createRing(30, 18, ringTwo);
     createRing(40, 24, ringThree);
     createRing(50, 30, ringFour);
     createRing(60, 36, ringFive);
     createRing(70, 42, ringSix);
     createRing(80, 48, ringSeven);
     createRing(90, 54, ringEight);
     createRing(100, 60, ringNine);
     createRing(110, 66, ringTen);

     //icosahedron

     const icosaGeo = new THREE.IcosahedronGeometry(5, 0);
     const icosaMat = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          map:textureLoader.load('./assets/textures/2k_sun.jpg'),
     })
     const icosahedron = new THREE.Mesh(icosaGeo, icosaMat);
     scene.add(icosahedron);

     ///// dat GUI/////
     const cameraFolder = gui.addFolder('Camera Movement');
     cameraFolder.add(camera.position, "z", 0, 1000, 0.1).name('ZOOM');
     //cameraFolder.open();
     const sphereFolder = gui.addFolder('Sphere');
     var conf = { color : '#ffae23' };    
     sphereFolder.addColor(conf, 'color').onChange( function(colorValue) {
     sphere.material.color.set(colorValue);
     });
     //sphereFolder.open();

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
          
         
          ringOne.rotation.y += Math.PI * 0.001;
          ringOne.rotation.x += Math.PI * 0.001;
          ringOne.rotation.z += Math.PI * 0.001;
          ringTwo.rotation.y -= Math.PI * 0.002;
          ringTwo.rotation.x -= Math.PI * 0.002;
          ringTwo.rotation.z -= Math.PI * 0.002;
          ringThree.rotation.y += Math.PI * 0.003;
          ringThree.rotation.x += Math.PI * 0.003;
          ringThree.rotation.z += Math.PI * 0.003 * 0.5;
          ringFour.rotation.y -= Math.PI * 0.004 * 0.5;
          ringFour.rotation.x -= Math.PI * 0.004 * 0.5;
          ringFour.rotation.z -= Math.PI * 0.004 * 0.5;
          ringFive.rotation.y += Math.PI * 0.005 * 0.5;
          ringFive.rotation.x += Math.PI * 0.005 * 0.5;
          ringFive.rotation.z += Math.PI * 0.005 * 0.5;
          ringSix.rotation.y -= Math.PI * 0.006 * 0.5;
          ringSix.rotation.x -= Math.PI * 0.006 * 0.5;
          ringSix.rotation.z -= Math.PI * 0.006 * 0.5;
          ringSeven.rotation.y += Math.PI * 0.007 * 0.5;
          ringSeven.rotation.x += Math.PI * 0.007 * 0.5;
          ringSeven.rotation.z += Math.PI * 0.007 * 0.5;
          ringEight.rotation.y += Math.PI * 0.008 * 0.5;
          ringEight.rotation.x += Math.PI * 0.008 * 0.5;
          ringEight.rotation.z += Math.PI * 0.008 * 0.5;
          ringNine.rotation.y += Math.PI * 0.009 * 0.5;
          ringNine.rotation.x += Math.PI * 0.009 * 0.5;
          ringNine.rotation.z += Math.PI * 0.009 * 0.5;
          ringTen.rotation.y += Math.PI * 0.010 * 0.5;
          ringTen.rotation.x += Math.PI * 0.010 * 0.5;
          ringTen.rotation.z += Math.PI * 0.01 * 0.5;

          icosahedron.rotation.x -= 0.008;
          icosahedron.rotation.z += 0.006;
          icosahedron.rotation.y += 0.009;


          /// visualizer 
          analyser.getByteFrequencyData(dataArray);
         
          for(let i = 0; i < 420; i++){
               const pitch = dataArray[i%256];
               const s = spheres[i];
               const z = s.position;
               TweenMax.to(z, 0.2, {
                    z: pitch/12, 
                    ease:Power2.easeOut
               })
          }
          const delta = clock.getDelta();
          flyCamera.movementSpeed = 2000;
          flyCamera.rollSpeed = Math.PI * 10;
          flyCamera.update(delta);
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
     }
     animate();
}
