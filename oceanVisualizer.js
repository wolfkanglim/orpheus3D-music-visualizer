import * as THREE from './js/three.module.js';
//import {} from '../examples/jsm/objects/Reflector.js';

export const objGroup = new THREE.Object3D();
   
export const oceanVisualizer = function(scene, camera, renderer, dataArray, analyser){
     const uniforms = {
          u_time: {type: 'f', value: 0.0},
          u_data_arr: {type: 'f', value: dataArray}
     }
     let tiles = [];
     const objectsColor = 0xfff700;
     const clock = new THREE.Clock();
     
     const groupTiles = new THREE.Object3D();
     const groupTiles1 = new THREE.Object3D();
     const groupTiles2 = new THREE.Object3D();
     const groupTiles3 = new THREE.Object3D();
     const groupTiles4 = new THREE.Object3D();

     addGroupTiles(groupTiles);
     addGroupTiles(groupTiles1);
    addGroupTiles(groupTiles2);
    addGroupTiles(groupTiles3);
    addGroupTiles(groupTiles4);

    groupTiles.position.set(-12, -30, -60);
    groupTiles1.position.set(-12, -30, -12);
    groupTiles2.position.set(-60, -30, -12);
    groupTiles3.position.set(36, -30, -12);
    groupTiles4.position.set(-12, -30, 36);       

     const spotLight = new THREE.SpotLight(0xffffff, 1);
     spotLight.position.set(50, 100, 50);
     objGroup.add(spotLight);

     addGrid();
     
     const geometry = new THREE.OctahedronGeometry(2, 0);
     const sphereMaterial = new THREE.MeshStandardMaterial({
          color: 0xffff00, 
          emissive: 0x0,
          roughness: 0.4,
          metalness: 0.6,
     });

    const reflectingObject = new THREE.Mesh(geometry, sphereMaterial);
    reflectingObject.position.y = 8;
    reflectingObject.castShadow = true;
    reflectingObject.receiveShadow = true;
     reflectingObject.position.set(0, 20, 0);
    objGroup.add(reflectingObject);

    function addGroupTiles(group) {
          let positions = [];
          const gutter = 4;
          const cols = 12;
          const rows = 12;

          const geometry = new THREE.CylinderGeometry(.5, .75, 12, 59);
          const material = new THREE.ShaderMaterial({
               //color: objectsColor,
               emissive: 0x586300,
               roughness: 0.15,
               metalness: 0.64,
               uniforms: uniforms,
               vertexShader: 
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
               ,  
               fragmentShader: `
                    varying float x;
                    varying float y;
                    varying float z;
                    varying vec3 vUv;
                    uniform float u_time;
                    uniform float[64] u_data_arr;
                    void main(){
                    gl_FragColor = vec4(sin(u_time), cos(u_time) + 0.25, 1.0, 1.0);
                    }
                    `   
          });
          
          for (let col = 0; col < cols; col++) {
               positions[col] = [];
               for (let row = 0; row < rows; row++) {
                    const pos = {
                         z: row,
                         y: 0,
                         x: col
                    };

                    positions[col][row] = pos;

                    const plane = create3DObj(objectsColor, geometry, material);

                    plane.scale.set(1, 0.01, 1);

                    if (col > 0) {
                         pos.x = (positions[col - 1][row].x * 1) + gutter;
                    }

                    if (row > 0) {
                         pos.z = (positions[col][row - 1].z * 1) + gutter;
                    }

                    plane.position.set(pos.x, pos.y, pos.z);
                    group.add(plane);
                    tiles.push(plane);
               }
          }

          positions = null;
          objGroup.add(group);
     }

     scene.add(objGroup);

     function addGrid() {
     const size = 25;
     const divisions = size;
     const gridHelper = new THREE.GridHelper(size, divisions);     
     gridHelper.position.set(0, 0, 0);
     gridHelper.material.opacity = 0;
     gridHelper.material.transparent = true;     
     //scene.add(gridHelper);
     }

     function map(value, start1, stop1, start2, stop2) {
     return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2
     }

     function drawWave() {
          let scale = 0;
          let freq = 0;

     
          analyser.getByteFrequencyData(dataArray);
          
          for (let i = 0; i <tiles.length; i++) {
               freq = dataArray[i%512];
               //uniforms.u_time.value = clock.getElapsedTime() * 0.2 + freq; 
               //scale = map(freq, 0, 255, 0.001, 1);
               scale = map(freq, 0, 512, 0.001, 1);

               if(tiles[i]) {
                    TweenMax.to(tiles[i].scale, .6, { y: scale * 4 });  
                    uniforms.u_time.value = clock.getElapsedTime() * 0.12;
               }
          }
          
     }

     function create3DObj(color, geometry, material) {
          const obj = new THREE.Mesh(geometry, material);          
          obj.castShadow = true;
          obj.receiveShadow = true;
          obj.position.y = 5;

          const pivot = new THREE.Object3D();          
          pivot.add(obj);
          pivot.size = 2;
          
          return pivot;
     }


        
     function animate() {
          
          renderer.render(scene, camera);
          drawWave();
         // uniforms.u_time.value = clock.getElapsedTime() * 0.2;   

          reflectingObject.rotation.y += .005;
          requestAnimationFrame(animate);
     }
     animate();
    
}
    
