import * as THREE from './js/three.module.js';




export const sphereVisualizer = function (scene, camera, renderer, dataArray, analyser){
    /*  const uniforms = {
          u_time: {type: 'f', value: 0.0},
          u_data_array: {type: 'f', value: dataArray}
     } */
     const textureLoader = new THREE.TextureLoader();

     const materials = [
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/textures/2k_saturn.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/textures/2k_earth_daymap.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/textures/2k_jupiter.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/textures/2k_venus_surface.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/textures/2k_neptune.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/textures/2k_mars.jpg')}),
     new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/textures/2k_sun.jpg')}),
      new THREE.MeshPhongMaterial({map:textureLoader.load('./assets/textures//2k_moon.jpg')}),
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
          const sphereGeometry = new THREE.SphereGeometry(2);
         
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
     createRing(20, 20, ringOne);
     createRing(30, 30, ringTwo);
     createRing(40, 40, ringThree);
     createRing(50, 50, ringFour);
     createRing(60, 60, ringFive);
     createRing(70, 70, ringSix);
     createRing(80, 80, ringSeven);
     createRing(90, 90, ringEight);
     createRing(100, 100, ringNine);
     createRing(110, 110, ringTen);

     //icosahedron

     const icosaGeo = new THREE.IcosahedronGeometry(5, 0);
     const icosaMat = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          map:textureLoader.load('./assets/textures/2k_sun.jpg'),
     })
     const icosahedron = new THREE.Mesh(icosaGeo, icosaMat);
     //scene.add(icosahedron);

     const clock = new THREE.Clock();

     function animate(){
          //uniforms.u_time.value = clock.getElapsedTime();
          //uniforms.u_data_array.value = dataArray; 
          
         
          ringOne.rotation.x += Math.PI * 0.001;
          ringOne.rotation.y += Math.PI * 0.01;
          ringOne.rotation.z += Math.PI * 0.001;
          ringTwo.rotation.x -= Math.PI * 0.009;
          ringTwo.rotation.y -= Math.PI * 0.002;
          ringTwo.rotation.z -= Math.PI * 0.002;
          ringThree.rotation.x += Math.PI * 0.008;
          ringThree.rotation.y += Math.PI * 0.003;
          ringThree.rotation.z += Math.PI * 0.003;
          ringFour.rotation.x -= Math.PI * 0.004 * 0.5;
          ringFour.rotation.y -= Math.PI * 0.007 * 0.5;
          ringFour.rotation.z -= Math.PI * 0.004 * 0.5;
          ringFive.rotation.x += Math.PI * 0.006 * 0.5;
          ringFive.rotation.y += Math.PI * 0.005 * 0.5;
          ringFive.rotation.z += Math.PI * 0.005 * 0.5;
          ringSix.rotation.x -= Math.PI * 0.005 * 0.5;
          ringSix.rotation.y -= Math.PI * 0.006 * 0.5;
          ringSix.rotation.z -= Math.PI * 0.006 * 0.5;
          ringSeven.rotation.x += Math.PI * 0.004 * 0.5;
          ringSeven.rotation.y += Math.PI * 0.007 * 0.5;
          ringSeven.rotation.z += Math.PI * 0.007 * 0.5;
          ringEight.rotation.x += Math.PI * 0.008 * 0.5;
          ringEight.rotation.y += Math.PI * 0.008 * 0.5;
          ringEight.rotation.z += Math.PI * 0.008 * 0.5;
          ringNine.rotation.x += Math.PI * 0.003 * 0.5;
          ringNine.rotation.y += Math.PI * 0.009 * 0.5;
          ringNine.rotation.z += Math.PI * 0.002 * 0.5;
          ringTen.rotation.x += Math.PI * 0.010 * 0.5;
          ringTen.rotation.y += Math.PI * 0.0010 * 0.5;
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
                    z: pitch/2, 
                    ease:Power2.easeOut
               })
          }
          const delta = clock.getDelta();
         
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
     }
     animate();
}
