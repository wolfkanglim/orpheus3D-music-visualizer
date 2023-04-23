import * as THREE from './js/three.module.js';

let instancedMesh;
let instancedMeshCount = 20000;
export const instancesVisualizer = function (scene, camera, renderer){     
     const geometry = new THREE.IcosahedronGeometry();
     const material  = new THREE.MeshPhongMaterial({
          color: 0xffea00,          
     })

     instancedMesh = new THREE.InstancedMesh(geometry, material, instancedMeshCount);
     instancedMesh.castShadow = true;
     instancedMesh.receiveShadow = true;
     scene.add(instancedMesh);

     const spaceObj = new THREE.Object3D();
     for(let i = 0; i < instancedMeshCount; i++){
          spaceObj.position.x = (Math.random() * 300 - 150) ;
          spaceObj.position.y = (Math.random() * 100 - 50) + 50;
          spaceObj.position.z = (Math.random() * 300 - 150) - 100 ;

          spaceObj.rotation.x = Math.random() * Math.PI * 2;
          spaceObj.rotation.y = Math.random() * Math.PI * 2;
          spaceObj.rotation.z = Math.random() * Math.PI * 2;

          spaceObj.scale.x = spaceObj.scale.y = spaceObj.scale.z = Math.random();
          
          spaceObj.updateMatrix();
          instancedMesh.setMatrixAt(i, spaceObj.matrix);
          instancedMesh.setColorAt(i, new THREE.Color(Math.random() * 0xffffff));
     }

     function animate(time){     
         
          for(let i = 0; i < instancedMeshCount; i++){
               instancedMesh.getMatrixAt(i, spaceObj.matrix);
               spaceObj.matrix.decompose(spaceObj.position, spaceObj.rotation, spaceObj.scale);
               spaceObj.rotation.x = i/instancedMeshCount * time/1000;
               spaceObj.rotation.y = i/instancedMeshCount * time/500;
               spaceObj.rotation.z = i/instancedMeshCount * time/1200;

               spaceObj.updateMatrix();
               instancedMesh.setMatrixAt(i, spaceObj.matrix);
          } 
          instancedMesh.instanceMatrix.needsUpdate = true;
          instancedMesh.rotation.y  = time/50000;
          instancedMesh.rotation.z  = time/30000;
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
     };
     animate(0);
};