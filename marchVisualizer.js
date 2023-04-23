import * as THREE from './js/three.module.js';
import {OrbitControls} from './js/OrbitControls.js';


let controls;
export const marchVisualizer = function(scene, camera, renderer, dataArray, analyser) {     
    let objectsColor = 0x5ff7ef;
    let rowTiles = [];
    const groupTiles = new THREE.Object3D();
    const clock = new THREE.Clock();     
 
    setTimeout(() => {
          const firstRing = new THREE.Object3D();    
          //addCameraControls();
          addFloor();
          animate();
          setInterval(() => {          
               addTilesRow(rowTiles);
               removeOldTiles(rowTiles);               
          }, 500);
     });
  
     function removeOldTiles(tiles) {
          if (tiles.length % 64 === 0) {
               const removedTiles = tiles[0];
               let index = 0;               
               for (const tile in removedTiles) {
                    if (removedTiles.hasOwnProperty(tile)) {
                         const element = removedTiles[tile];
                         TweenMax.delayedCall(0.07 * index, () => {
                              TweenMax.to(element.scale, .25, {
                                   z: 0.01,
                                   ease: Power2.easeOut,
                                   onComplete: (element) => {
                                        groupTiles.remove(element);
                                   },
                                   onCompleteParams: [element]
                              });
                         });
                         index++;
                    }
               }
               tiles = tiles.splice(0, 1);
          }
     }     
          function addTilesRow(tiles) {
               const rows = 256;
               const cols = 1;
               const gutter = 1.25;
               const hasPrev = tiles.length && tiles[tiles.length - 1][0].position;
               let positions = [];
               let index = 0;
               let prevPos = 0;

               if (tiles.length) {
                    prevPos = tiles[tiles.length - 1][0].position.x + gutter;
               }   

               const size = 0.75;
               const geometry = new THREE.BoxGeometry(size, size, 10);
               const material = new THREE.MeshPhongMaterial({
                    color: objectsColor,
                    emissive: 0x0
               });
               
               for (let col = 0; col < cols; col++) {
                         positions[col] = [];
                         tiles.push([]);
                         for (let row = 0; row < rows; row++) {
                              const pos = {
                                   z: row,
                                   y: -30,
                                   x: hasPrev ? prevPos : col
                              }

                              positions[col][row] = pos;
                              const plane = createObj(objectsColor, geometry, material);
                              plane.scale.set(1, 1, 0.2);
                              if (col > 0) {
                                   pos.x = (positions[col - 1][row].x * plane.size) + gutter;
                              }

                              if (row > 0) {
                                   pos.z = (positions[col][row - 1].z * plane.size) + gutter;
                              }

                              plane.position.set(pos.x, pos.y, pos.z);
                              plane.rotateX(Math.PI/2);
                              groupTiles.add(plane);

                              TweenMax.delayedCall(0.1 * index, () => {
                                   TweenMax.to(plane.children[0].material, .3, {
                                   opacity: 1,
                                   ease: Power2.easeOut
                                   });
                              });

                              tiles[tiles.length - 1].push(plane);
                              index++;
                         }
                         index++;
                    }
               positions = null;
          }
     
     function drawWave() {     
               analyser.getByteFrequencyData(dataArray);
               let index = 0;               
               for (var i = 0; i < rowTiles.length; i++) {
                    for (var j = 0; j < rowTiles[i].length; j++) {
                         const freq = dataArray[index];
                         let scale = freq / 40 <= 0 ? 0.01 : freq / 40;
                                             
                         TweenMax.to(rowTiles[i][j].scale, .2, {
                         z: scale - 3 < 0 ? 0.01 : scale - 3
                         });
                         index++;
                    }
                    index++;
               }   

          groupTiles.position.set(150, -30, -250);
          scene.add(groupTiles); 
     }

     /* function addCameraControls() {
         controls = new OrbitControls(camera, renderer.domElement);
          controls.enableDamping = true;
          controls.dampingFactor = 0.1;  
     } */

     function createObj(color, geometry, material) {
          const obj = new THREE.Mesh(geometry, material);    
          obj.castShadow = true;
          obj.receiveShadow = true;
          obj.position.z = -2.5;
          obj.size = 1;
          obj.material.opacity = 0;
          obj.material.transparent = true;
          const pivot = new THREE.Object3D();    
          pivot.add(obj);
          pivot.size = 1;    
          return pivot;
     }

     function addFloor() {
          const planeGeometry = new THREE.PlaneGeometry(250, 250);
          const planeMaterial = new THREE.ShadowMaterial({
               color: 0x0606ff,
               side: THREE.DoubleSide, 
               opacity: .05, 
          });
          const floor = new THREE.Mesh(planeGeometry, planeMaterial);
          planeGeometry.rotateX( Math.PI / 2);
          floor.position.set(0, -30, -250);
          floor.receiveShadow = true;
          scene.add(floor);
     }
 
     function animate() {
          //let delta = clock.getDelta();    
          //controls.update();    
          
          if (rowTiles[rowTiles.length - 1]) {
               const x = -rowTiles[rowTiles.length - 1][0].position.x + 15;

               //color change works not good
               let h = Math.floor(Math.sin(x) * 255);      
               objectsColor = 'hsl('+ h +' , 90%, 50%)';
               //
               
               TweenMax.to(groupTiles.position, 1, {
               x: x,
               ease: Power2.easeOut
               });
          }

          renderer.render(scene, camera);
          drawWave();
          requestAnimationFrame(animate);
     }
  
}
