import * as THREE from './js/three.module.js';


export let rafId;
export const lineGroup = new THREE.Group();

export const lineSphereVisualizer = function(scene, camera, renderer, dataArray, analyser){

     const r = 48;
     let line;
     let lines = [];

     initThree();
     animate();
     function initThree() {
     
          const cube = new THREE.Mesh(new THREE.BoxGeometry(10), new THREE.MeshBasicMaterial(0xff00ff));
          lineGroup.add(cube);

             
          const parameters = [
               [ 0.5, 0xffffff, 1 ], 
               [ 1.1, 0xff99ff, 1 ], 
               [ 1.8, 0x00ffaa, 0.75 ], 
               [ 2.6, 0xffaa00, 0.5 ], 
               [ 3.5, 0xff0833, 0.8 ],
               [ 4.5, 0xaa66aa, 1 ], 
               [ 5.75, 0x00ff77, 0.5 ], 
               [ 7.5, 0xffff00, 1 ], 
               [ 9.0, 0xf77fd5, 0.7]
          ];

          const geometry = createGeometry();

          for(let i = 0; i < parameters.length; i++){
               const p = parameters[i];
               const material = new THREE.LineBasicMaterial({
                    color: p[1],
                    opacity: p[2],
               })

               line = new THREE.LineSegments(geometry, material);
               line.scale.x = line.scale.y = line.scale.z = p[0];
               line.userData.originalScale = p[0];
               line.rotation.y = Math.random() * Math.PI;
               line.updateMatrix();
               lines.push(line);
               //scene.add(line);
               lineGroup.add(line);
               //console.log(line);
          }
          scene.add(lineGroup);

     
          setInterval(function() {
               const geometry = createGeometry();
               scene.traverse(function(object){
                    if(object.isLine){
                         object.geometry.dispose();
                         object.geometry = geometry;
                    }
               })
          }, 8000);
     
     }

     function createGeometry(){
          const geometry = new THREE.BufferGeometry();
          const vertices = [];
          const vertex = new THREE.Vector3();
          for(let i = 0; i < 2000; i++){
               vertex.x = Math.random() * 2 - 1;
               vertex.y = Math.random() * 2 - 1;
               vertex.z = Math.random() * 2 - 1;
               vertex.normalize();

               vertex.multiplyScalar(r);
               vertices.push(vertex.x, vertex.y, vertex.z);

               vertex.multiplyScalar(Math.random() * 0.09 + 1);
               vertices.push(vertex.x, vertex.y, vertex.z);
          }
          geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
          return geometry;
     }
     
     
     function animate() {
          rafId = requestAnimationFrame( animate );
          render();     
     } 

     function render() {
          analyser.getByteFrequencyData(dataArray);
    
          for(let i = 0; i < dataArray.length; i++){
               line.position.y = dataArray[i];
          }

     const time = Date.now() * 0.000025; 
          for ( let i = 0; i < lines.length; i ++ ) {
               const object = lines[ i ];
               if(object.isLine){
                    let freq = dataArray[i] * 0.0025;
                    object.rotation.z = time * (i < 14 ? (i + 1): -(i + 1));
                    object.rotation.y = freq + time * (i < 14 ? (i + 1): -(i + 1));
                    if(i > 15){
                         const scale = object.userData.originalScale * ( i / 5 + 1 ) * ( 1 + 0.5 * Math.sin( 7 * time ) );
                         object.scale.x = object.scale.y = object.scale.z = scale + freq * 5;
                    }
               }
          }
     
          renderer.render( scene, camera );
     }


}




