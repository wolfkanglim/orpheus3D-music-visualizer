import * as THREE from './js/three.module.js';
import { TeapotGeometry } from './js/TeapotGeometry.js';

export const groupGlass = new THREE.Object3D(); 


export function glassVisualizer(scene, camera, renderer, dataArray, analyser){
     /* new THREE.TextureLoader().load('./assets/textures/space-background.jpg', texture => {
          const renderTarget = new THREE.WebGLCubeRenderTarget(texture.image.height);
          renderTarget.fromEquirectangularTexture(renderer, texture);
          scene.background = renderTarget.texture;
     }); */
     const renderTargetOptions = {
          format: THREE.RGBAFormat,
          generateMipmaps: true,
          minFilter: THREE.LinearMipMapLinearFilter
     } 
     const geometry = new THREE.BoxGeometry(10, 10, 10);
     const material = new THREE.MeshStandardMaterial({color: 0x5f5fff});
     const cube = new THREE.Mesh(geometry, material);
     cube.position.set(2, 55, 0);
     groupGlass.add(cube);

     const teapotRenderTarget = new THREE.WebGLCubeRenderTarget(1024, renderTargetOptions);
     const teapotCamera = new THREE.CubeCamera(0.1, 1000, teapotRenderTarget);
     const teapotGeo = new TeapotGeometry(20, 24);
     const teapotMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          envMap: teapotRenderTarget.texture,
          metalness: 0.1,
          roughness : 0.05,
          ior: 2.5,
          thickness: 0.3,
          transmission: 0.9,
          side: THREE.DoubleSide
     })
     const teapot = new THREE.Mesh(teapotGeo, teapotMat);
     teapot.add(teapotCamera);
     groupGlass.add(teapot);

     const cylinderGeo = new THREE.CylinderGeometry(2, 3.5, 45, 20);
     const cylinderMat = new THREE.MeshPhongMaterial({
          color: 0x678fe7,
     })
     let cylinder;
     let cylinders = [];
     const cylinderPivot = new THREE.Object3D();
     for(let degree = 0; degree < Math.PI * 2; degree += Math.PI / 6){
           cylinder = new THREE.Mesh(cylinderGeo, cylinderMat);
          //const rad = THREE.Math.degToRad(degree);
          cylinder.position.set(Math.sin(degree) * 50, 0, Math.cos(degree) * 50);
          cylinderPivot.add(cylinder);
          cylinders.push(cylinder);
     
     }
     groupGlass.add(cylinderPivot);

     const planeGeo = new THREE.CylinderGeometry(60, 60, 0.5, 50, 50);
     const planeMat = new THREE.MeshPhongMaterial({
          map: new THREE.TextureLoader().load('./assets/textures/2k_neptune.jpg'),
          color: 0xeeeeee,
          side: THREE.DoubleSide,
     })
     const table = new THREE.Mesh(planeGeo, planeMat);
     //table.rotation.x = -Math.PI / 2;
     table.position.set(0, -20, 0);
     groupGlass.add(table);
     // console.log(table);
     // console.log(cylinder);
     // console.log(teapot);
     scene.add(groupGlass);
     
     const clock = new THREE.Clock();

     function update(time){
          time *= 0.001;
          const delta = clock.getDelta();
         
          if(cylinderPivot){
               cylinderPivot.rotation.y = Math.sin(time * 0.5); 
          }
          if(teapot){
               teapot.visible = false;
               const teapotCamera = teapot.children[0];
               teapotCamera.update(renderer, scene);
               teapot.visible = true;
          }
     }

     function animate(time){
          analyser.getByteFrequencyData(dataArray);
         //console.log(dataArray.length);
          for(let i = 0; i < 12; i++){
               cylinders[i].position.y = map(dataArray[i * 20], 0, 255, 0.001, 1) * 20;
          }

          renderer.render(scene, camera);
          update(time);
          requestAnimationFrame(animate);
     };  
     animate(0);
}    
     
function map(value, start1, stop1, start2, stop2) {
     return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2
}
