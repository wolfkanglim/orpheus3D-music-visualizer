import * as THREE from './js/three.module.js';

export function ballsLightVisualizer(scene, camera, renderer, dataArray, analyser){
   
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
     let ballGroup = new THREE.Group(); 
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

     let tl = gsap.timeline({repeat: 3, repeatDelay: 4});
     tl.to(camera.position, {z: 80, duration:12});
     tl.to(camera.position, {z: -80, duration:16});
     tl.to(camera.rotation, {z: Math.PI, duration: 12});
     tl.to(camera.position, {x: 40, duration:18});
     tl.to(camera.position, {z: -50, duration:16});
     tl.to(camera.rotation, {y: Math.PI * 2, duration: 18});
     tl.to(camera.position, {x: 10, duration:8}); 
     tl.to(camera.position, {y: 10, duration:8}); 
     tl.to(camera.rotation, {z: Math.PI, duration:16}); 
     tl.to(camera.position, {z: -225, duration:16});  

     console.log(balls);
     console.log(ballGroup);
     function renderFrame(){ 
          //ballGroup.rotation.z += 0.01;     
          analyser.getByteFrequencyData(dataArray);
         
          for(let i = 0; i < balls.length; i++){
               let num = Math.floor(i % 256);
               const pitch = dataArray[num];

               const pos = balls[i].position;
               
               //effect 0 just flycamera move effect //

               // effect 1 //
              // gsap.to(ballGroup.scale, {z: pitch/24, duration: 0.5, ease: 'Power2.easeIn'});
               
               // effect 2
              // gsap.to(ballGroup.scale, {y: pitch/12, duration: 0.5, ease: 'Power2.easeIn'});     
               
               // effect 3
              // gsap.to(ballGroup.scale, {x: pitch/6, duration: 0.5, ease: 'elastic'});               
             
             // effect 4 //
              //gsap.to(balls[i].position, {y: pitch/6, duration: 0.3, ease: 'Power2.easeOut'}); 
             
             // effect5  good like vertical light show  
                gsap.to(balls[i].scale, {y: pitch/12, duration: 0.5, ease: 'elastic'});
              gsap.to(balls[i].scale, {x: pitch/120, duration: 0.2, ease: 'elastic'});
              gsap.to(balls[i].scale, {z: pitch/120, duration: 0.8, ease: 'elastic'});   
             ////////////////////////////
             //effect 6 even better center warp light show
             /*  gsap.to(balls[i].scale, {y: pitch/120, duration: 0.5, ease: 'elastic'});
             gsap.to(balls[i].scale, {x: pitch/120, duration: 0.2, ease: 'elastic'});
             gsap.to(balls[i].scale, {z: pitch/12, duration: 0.8, ease: 'elastic'});  */

             //effect 7
             // gsap.to(ballGroup.position, {z: pitch * 20, duration: 0.8, ease: 'Power2.easeOut'});
              
          }

          renderer.render(scene, camera);            
          requestAnimationFrame(renderFrame);
     };  
     renderFrame();
};
      
/*           const flyControls = new FlyControls(camera, renderer.domElement);
flyControls.movementSpeed = 16;
flyControls.rollSpeed = Math.PI / 16;
flyControls.autoForward = false;
flyControls.dragToLook = true;
flyControls = flyControls;

let tl = gsap.timeline({repeat: 3, repeatDelay: 5});
tl.to(camera.position, {y: 40, duration:16});
tl.to(camera.rotation, {z: Math.PI, duration: 12});
tl.to(camera.position, {x: -40, duration:18});
tl.to(camera.position, {z: -50, duration:16});
tl.to(camera.rotation, {y: Math.PI * 2, duration: 12});
tl.to(camera.position, {x: 50, duration:16}); 
} */

 