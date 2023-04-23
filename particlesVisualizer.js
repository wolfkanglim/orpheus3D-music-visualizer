import * as THREE from './js/three.module.js';

let particles = [];
let particlesCount = 1400;
export const particlesVisualizer = function (scene, camera, renderer){
     const particleGeometry = new THREE.BufferGeometry();
     const positions = new Float32Array(particlesCount * 3);
     for(let i = 0; i < particlesCount * 3; i++){
          positions[i] = (Math.random() - 0.5) * 1000;
     }
     particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
     const particleMaterial = new THREE.PointsMaterial();
     particleMaterial.size = 1;
     particleMaterial.sizeAttenuation = true;
     particles = new THREE.Points(particleGeometry, particleMaterial);
     scene.add(particles);

     const clock = new THREE.Clock();
     function animate(){
          const elapsedTime = clock.getElapsedTime();
          particles.rotation.z = elapsedTime * 0.04;
          renderer.render(scene, camera);
          requestAnimationFrame(animate);

     }
     animate();
};
