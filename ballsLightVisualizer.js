import * as THREE from './js/three.module.js';

export let ballLightGroup = new THREE.Group(); 

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
     const gap = 5;
     let flag = true;
     for(let x = rangeMin ; x <= rangeMax; x += gap){
          for(let y = rangeMin; y <= rangeMax; y += gap){
               for(let z = rangeMin * 6; z <= rangeMax * 1.2; z += gap){
                    flag = !flag;
                    const mesh = new THREE.Mesh(geometry, flag ? material1 : material2);
                    
                    mesh.position.set(x, y, z);
                    ballLightGroup.add(mesh);
                    balls.push(mesh);
                    //scene.add(ballGroup);
                    //console.log(balls);
               }
          }
          
     }
     scene.add(ballLightGroup);

   
     function animate(){ 
          //ballLightGroup.rotation.z += 0.01;     
          analyser.getByteFrequencyData(dataArray);
        
          
               for(let i = 0; i < balls.length; i++){
                    let num = Math.floor(i % 256);
                    const pitch = dataArray[num];

                if(pitch){
                  
                    gsap.to(balls[i].scale, {y: pitch/12, duration: 1, ease: 'elastic'});
               gsap.to(balls[i].scale, {x: pitch/120, duration: 0.25, ease: 'elastic'});
               gsap.to(balls[i].scale, {z: pitch/60, duration: 0.25, ease: 'elastic'});     
                }   
               
              
               ////////////////////////////
                             
               }
          

          renderer.render(scene, camera);            
          requestAnimationFrame(animate);
     };  
     animate();
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

 