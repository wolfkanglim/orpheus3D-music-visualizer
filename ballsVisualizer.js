import * as THREE from './js/three.module.js';

export let ballGroup = new THREE.Group(); 

export function ballsVisualizer(scene, camera, renderer, dataArray, analyser){
   
     const geometry = new THREE.SphereGeometry(1, 10, 10);
     const material1 = new THREE.MeshStandardMaterial({
          //color: 0x05f0c1, 
          //color: 0xff9472, 
          color: 0xff1818, 
          roughness: 0.21, 
          metalness: 0.9,
          //envMap: renderTarget.texture
     });
     const material2 = new THREE.MeshStandardMaterial({
          //color: 0xff1a55, 
          //color: 0xfdd400, 
          color: 0x4d4dff, 
          roughness: 0.21, 
          metalness: 1, 
          //envMap: renderTarget.texture
     });

     let balls = [];
     const rangeMax = 32;
     const rangeMin = -32;
     const gap = 6;
     let flag = true;
     for(let x = rangeMin; x <= rangeMax; x += gap){
          for(let y = rangeMin; y <= rangeMax; y += gap){
               for(let z = rangeMin * 10; z <= rangeMax; z += gap){
                    flag = !flag;
                    const mesh = new THREE.Mesh(geometry, flag ? material1 : material2);
                    
                    mesh.position.set(x, y, z);
                    ballGroup.add(mesh);
                    balls.push(mesh);
                    //scene.add(ballGroup);
                    //console.log(balls);
               }
          }
          
     }
     scene.add(ballGroup);

     //console.log(balls);
     //console.log(ballGroup);
     function renderFrame(){ 
          ballGroup.rotation.z += 0.01;     
          analyser.getByteFrequencyData(dataArray);
          for(let i = 0; i < balls.length; i++){
               let num = Math.floor(i % 256);
               const pitch = dataArray[num];
                              
               if(pitch){

               // effect 1 //
               gsap.to(ballGroup.scale, {z: pitch/24, duration: 0.2, ease: 'Power2.easeIn'});
               
              
               }
              
          }
         
         

          renderer.render(scene, camera);            
          requestAnimationFrame(renderFrame);
     };  
     renderFrame();
};
      

 