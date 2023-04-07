import * as THREE from './js/three.module.js';

import shaders from './src/shadersPlane.js';
import planeMeshParameters from './src/planeMeshParam.js';

const gui = new dat.GUI();
gui.domElement.id = 'gui';
document.body.appendChild(gui.domElement);

export const planeVisualizer = function (scene, camera, renderer, dataArray, analyser, flyCamera){
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
     scene.add(icosahedron);

     ///// plane /////
     
     const planeGeo = new THREE.PlaneGeometry(64, 64, 64, 64);
     const planeMat = new THREE.ShaderMaterial({
          vertexShader: shaders.vertexShader,
          fragmentShader: shaders.fragmentShader,
          uniforms: uniforms,
          wireframe: true,
     })

     let planeMesh;
     let planeMeshArray = [];
     const planeGroup = new THREE.Group();
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

     
     ///// dat GUI/////
     // const cameraFolder = gui.addFolder('Camera Movement');
     // cameraFolder.add(camera.position, "z", 0, 1000, 0.1).name('ZOOM');
     //cameraFolder.open();


     //planeMesh gui effect only first one, empty planeMeshArray??
     const planeData = {
          width: 64,
          height: 64,
          widthSegments: 64,
          heightSegments: 64,
     }
     const planeFolder = gui.addFolder('Plane');
     planeFolder
          .add(planeData, 'width', 10, 200, 1)
          .name('Plane Width')
          .onChange(regeneratePlaneGeometry)
     planeFolder
          .add(planeData, 'height', 10, 200, 1)
          .name('Plane Height')
          .onChange(regeneratePlaneGeometry)
     planeFolder
     .add(planeData, 'widthSegments', 10, 100, 1)
     .name('Width Segments')
     .onChange(regeneratePlaneGeometry);
     planeFolder
          .add(planeData, 'heightSegments', 10, 100, 1)
          .name('Height Segments')
          .onChange(regeneratePlaneGeometry);

     function regeneratePlaneGeometry(){
          const newGeometry = new THREE.PlaneGeometry(
               planeData.width,
               planeData.height,
               planeData.widthSegments,
               planeData.heightSegments
          )
          planeMesh.geometry.dispose();
          planeMesh.geometry = newGeometry;    
          
     }
     var conf = { color : '#ffae23' };    
     planeFolder.addColor(conf, 'color').onChange( function(colorValue) {
     planeMesh.material.color.set(colorValue);
     });
     ////////////////////////////////

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
     ///////////////////////

     const clock = new THREE.Clock();
     function animate(){
          const delta = clock.getDelta();
          analyser.getByteFrequencyData(dataArray);
          uniforms.u_data_arr.value = dataArray;
          planeGroup.rotation.z += 0.002;
          icosahedron.rotation.x += 0.025;
          icosahedron.rotation.y += 0.035;
          flyCamera.movementSpeed = 10;
          flyCamera.rollSpeed = Math.PI/24;
          flyCamera.update(delta);
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
     }
     animate();
};
