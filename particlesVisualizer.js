import * as THREE from './js/three.module.js';

export const particleGroup = new THREE.Object3D();

export const particlesVisualizer = function (scene, camera, renderer, dataArray, analyser){
     let particlesSystem, particleGeometry;
     let particlesCount = 50000;
     let particles = [];
     let uniforms;
     const radius = 2000;
     //stats = new Stats();
     uniforms = {
          pointTexture: { value: new THREE.TextureLoader().load( './assets/textures/spark1.png' ) }
     }
     particleGeometry = new THREE.BufferGeometry();
     const positions = [];
     const colors = [];
     const sizes = [];
     const color = new THREE.Color();

     for(let i = 0; i < particlesCount; i++){
          positions.push( (Math.random() * 2 -1) * radius);
          positions.push( (Math.random() * 2 -1) * radius);
          positions.push( (-Math.random() * 2) * radius);

          color.setHSL(i / particlesCount, 0.75, 0.4);
          colors.push(color.r, color.g, color.b);
          sizes.push(5);
     }
     particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
     particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
     particleGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1).setUsage(THREE.DynamicDrawUsage));

     const particleMaterial = new THREE.ShaderMaterial({
          uniforms: uniforms,
          vertexShader:`
               attribute float size;
               varying vec3 vColor;
               void main() {
               vColor = color;
               vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
               gl_PointSize = size * ( 300.0 / -mvPosition.z );
               gl_Position = projectionMatrix * mvPosition;
               }
          
          
          `,
          fragmentShader: `
               uniform sampler2D pointTexture;
               varying vec3 vColor;
               void main() {
               gl_FragColor = vec4( vColor, 1.0 );
               gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
          }
     `
           ,

          blending: THREE.AdditiveBlending,
          depthTest: false,
          transparent: true,
          vertexColors: true
     });
     

     particlesSystem = new THREE.Points(particleGeometry, particleMaterial);
     particleMaterial.sizeAttenuation = true;
     particles.push(particlesSystem);
     particlesSystem.position.z = -100;
     //scene.add(particlesSystem);
     particleGroup.add(particlesSystem);
     scene.add(particleGroup);

     
     
     
     function animate(){
          render();
          requestAnimationFrame(animate);
          //stats.update();
     }
     animate();
     
     //const clock = new THREE.Clock();
     function render(){
          //const elapsedTime = clock.getElapsedTime();
          const time = Date.now() * 0.005;
          particlesSystem.rotation.z = time * 0.01;
          analyser.getByteFrequencyData(dataArray);
         // uniforms.u_data_arr.value = dataArray;
          const sizes = particleGeometry.attributes.size.array;
          for(let i = 0; i < dataArray.length; i++){
               let frequency = dataArray[i];
               let scale = map(frequency, 0, 255, 0.001, 1) * 0.5;
               if(particles[i]){
                    TweenMax.to(particles[i].scale, 0.5, {
                         y: scale,
                    })
               }

               if(particles[i]){
                    TweenMax.to(particles[i].scale, 1, {
                         x: scale,
                    })
               }
               if(particles[i]){
                    TweenMax.to(particles[i].scale, 1, {
                         z: scale,
                    })
               }
          }

          for(let i = 0; i < particlesCount; i++){
               sizes[i] = 10 * (1 + Math.sin(0.1 * i + dataArray[i % 256] * 0.1))
          }
          particleGeometry.attributes.size.needsUpdate = true;
          renderer.render(scene, camera);
     };
     function map(value, start1, stop1, start2, stop2) {
          return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2
        }
};
