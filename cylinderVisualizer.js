import * as THREE from './js/three.module.js';

export let groupCylinders = new THREE.Group();


export function cylinderVisualizer(scene, camera, renderer, dataArray, analyser){
     let positions = [];
     const gutter = 2;
     const cols = 12;
     const rows = 96;
     const uniforms = {
          u_time: {type: 'f', value: 0.0},
          //u_data_array: {type: 'f', value: dataArray}
     }
     //const clock = new THREE.Clock();

     const geometry = new THREE.CylinderGeometry(0.25, 0.75, 12, 36);
     const material = new THREE.ShaderMaterial({
          wireframe: false,
          //side: THREE.DoubleSide,
          uniforms: uniforms,
          /* vertexShader: 
           `         
             uniform float u_time;
             uniform float[64] u_data_arr;
             void main(){
                float x = abs(position.x);
             float floor_x = round(x);
             float multiplier_x = (25.0 - x) / 8.0;
             float y = abs(position.y);
             float floor_y = round(y);
             float multiplier_y = (25.0 - y) / 8.0;
               gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, sin(u_data_arr[int(floor_x)] / 20.0 + u_data_arr[int(floor_y)] / 20.0) * 0.5, 1.0 ); 
             }`
             ,  */
          fragmentShader: `
          varying float x;
           varying float y;
           varying float z;
           varying vec3 vUv;
          uniform float u_time;
          void main(){
             gl_FragColor = vec4(sin(u_time), cos(u_time) + 0.5, 1.0, 1.0);
          }
          `   
     })

     // tiles cylinder//

     let tiles = [];
     let groupTiles = new THREE.Group(); 
     groupTiles.position.set(96, -25, 48);
     groupTiles.rotation.y = -Math.PI / 2; 

     for(let col = 0; col < cols; col++){
          positions[col] = [];
          for(let row = 0; row < rows; row++){
               const pos = {
                    x: col,
                    y: 0,
                    z: row * 2,
               }
               positions[col][row] = pos;

               const plane = create3DObj(geometry, material);
               plane.scale.set(1, 0.05, 1);

               if(col > 0){
                    pos.x = (positions[col - 1][row].x * 1) + gutter;
               }
               if(row > 0){
                    pos.z = (positions[col][row - 1].z * 1) + gutter;
               }

               plane.position.set(pos.x, pos.y, pos.z);
               groupTiles.add(plane);
               tiles.push(plane);
          }
     }
     positions = null;
     groupCylinders.add(groupTiles);

     //pivot cylinders//
     let cylinder;
     let cylinders = [];
     const cylinderPivot = new THREE.Object3D();
     const cylinderPivot1 = new THREE.Object3D();
     const cylinderPivot2 = new THREE.Object3D();
     const cylinderPivot3 = new THREE.Object3D();
     const cylinderPivot4 = new THREE.Object3D();

     for(let degree = 0; degree < Math.PI * 2; degree += Math.PI / 12){
           cylinder = new THREE.Mesh(geometry, material);
          //const rad = THREE.Math.degToRad(degree);
          cylinder.position.set(Math.sin(degree) * 10, 0, Math.cos(degree) * 10);
          cylinderPivot.add(cylinder);
          cylinders.push(cylinder);     
     }
     for(let degree = 0; degree < Math.PI * 2; degree += Math.PI / 24){
           cylinder = new THREE.Mesh(geometry, material);
          //const rad = THREE.Math.degToRad(degree);
          cylinder.position.set(Math.sin(degree) * 30, 0, Math.cos(degree) * 30);
          cylinderPivot1.add(cylinder);
          cylinders.push(cylinder);     
     }
     for(let degree = 0; degree < Math.PI * 2; degree += Math.PI / 36){
           cylinder = new THREE.Mesh(geometry, material);
          //const rad = THREE.Math.degToRad(degree);
          cylinder.position.set(Math.sin(degree) * 50, 0, Math.cos(degree) * 50);
          cylinderPivot2.add(cylinder);
          cylinders.push(cylinder);     
     }

     for(let degree = 0; degree < Math.PI * 2; degree += Math.PI / 48){
           cylinder = new THREE.Mesh(geometry, material);
          //const rad = THREE.Math.degToRad(degree);
          cylinder.position.set(Math.sin(degree) * 70, 0, Math.cos(degree) * 70);
          cylinderPivot3.add(cylinder);
          cylinders.push(cylinder);     
     }

     for(let degree = 0; degree < Math.PI * 2; degree += Math.PI / 64){
           cylinder = new THREE.Mesh(geometry, material);
          //const rad = THREE.Math.degToRad(degree);
          cylinder.position.set(Math.sin(degree) * 90, 0, Math.cos(degree) * 90);
          cylinderPivot4.add(cylinder);
          cylinders.push(cylinder);     
     }
     cylinderPivot.position.y = 12;
     cylinderPivot1.position.y = 0;
     cylinderPivot2.position.y = -12;
     cylinderPivot3.position.y = -24;
     cylinderPivot4.position.y = -36;
     groupCylinders.add(cylinderPivot, cylinderPivot1,cylinderPivot2, cylinderPivot3, cylinderPivot4);
     scene.add(groupCylinders);


     let scale = 0;
     let frequency = 0;
     
     const clock = new THREE.Clock();

     function animate() {   
          cylinderPivot.rotation.y += 0.01;
          cylinderPivot1.rotation.y += 0.006;
          cylinderPivot2.rotation.y -= 0.002;
          cylinderPivot3.rotation.y += 0.0008;
          cylinderPivot4.rotation.y -= 0.0005;
          uniforms.u_time.value = clock.getElapsedTime() * 0.2;   
       
          analyser.getByteFrequencyData(dataArray);
          for(let i = 0; i < dataArray.length; i++){
               frequency = dataArray[i];
               scale = map(frequency, 0, 255, 0.001, 1) * 3;
               if(tiles[i]){
                    TweenMax.to(tiles[i].scale, 0.25, {
                         y: scale ,
                    })
               }

               if(cylinders[i]){
                    TweenMax.to(cylinders[i].position, 0.25, {
                         y: scale * 20 ,
                    })
               }
          }
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
        
     }

     
     animate();

     function map(value, start1, stop1, start2, stop2) {
          return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2
        }



     function create3DObj(geometry, material){
          const obj = new THREE.Mesh(geometry, material);
          obj.castShadow = true;
          obj.receiveShadow = true;
          const pivot = new THREE.Object3D();
          pivot.add(obj);
          pivot.size = 2;
          return pivot;
     }

     
}