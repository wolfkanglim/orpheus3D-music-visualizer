
import * as THREE from './js//three.module.js';
import shaders from './src/shaders.js';
import shadersPlane from './src/shadersPlane.js';

export const glslVisualizer = function(scene, camera, renderer, dataArray, analyser){

     const uniforms = {
          u_time: {type: 'f', value: 0.0},
          u_data_arr: {type: 'f', value: dataArray}
     }

     const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
      const planeMaterial = new THREE.ShaderMaterial({
     color: 0x00ff00,
     uniforms,
     wireframe: false,
     wireframeLinewidth: 0.003,
     //wireframeLinejoin: miter,
     }) 
     const planeShaderMaterial = new THREE.ShaderMaterial({
     wireframe: true,
     side: THREE.DoubleSide,
     uniforms,
     
     vertexShader: `
          
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
     void main(){
          gl_FragColor = vec4(sin(u_time), cos(u_time) + 0.5, 1.0, 0);
     }
     `    
     })
     //gl_FragColor = vec4((25.0 - abs(position.x)) / 25.0, (25.0 -  abs(position.y)) / 25.0, (abs(position.x + position.y) / 2.0) / 25.0, 1.0);
     //
     const texture = new THREE.TextureLoader().load('./assets/textures/2k_mars.jpg');

     const planeBottom = new THREE.Mesh(planeGeometry, planeShaderMaterial);
     const planeTop = new THREE.Mesh(planeGeometry, planeShaderMaterial);

     // tried to get shadows on shader  material spotLight//
    /* const depthMaterial = new THREE.MeshDepthMaterial( {
     depthPacking: THREE.RGBADepthPacking,
     map: texture,
     alphaTest: 0.5
     } );
     planeBottom.customDepthMaterial = depthMaterial; */
     //but it does not working

     planeBottom.position.set(0, -58, -100);
     planeBottom.rotation.x = -Math.PI / 2;
     planeBottom.castShadow = true;
     planeBottom.receiveShadow = true;
     scene.add(planeBottom);

     // planeTop.customDepthMaterial = depthMaterial;
     //but it does not working
     planeTop.position.set(0, 58, -100);
     planeTop.rotation.x = -Math.PI / 2;
     planeTop.castShadow = true;
     planeTop.receiveShadow = true;
     scene.add(planeTop);


     /////// Icosahedron  /////////// z????
     //const icosaGeometry = new THREE.SphereGeometry(30, 40, 30);
     const icosaGeometry = new THREE.IcosahedronGeometry( 10, 0);
     const icosaMaterial = new THREE.ShaderMaterial({
     wireframe: false,
     uniforms,
     vertexShader: shaders.vertexShader,
    
     vertexShader: `      
          uniform float u_time;
          uniform float[64] u_data_arr;

          void main(){
          float x = abs(position.x);
          float floor_x = round(x);
          float multiplier_x = (25.0 - x) / 8.0;
          float y = abs(position.y);
          float floor_y = round(y);
          float multiplier_y = (25.0 - y) / 8.0;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, sin(u_data_arr[int(floor_x)] / 50.0 + u_data_arr[int(floor_y)] / 50.0) * 0.5, 1.0 ); 
          }`
          ,
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
     });

     const Icosahedron = new THREE.Mesh(icosaGeometry, icosaMaterial);
     Icosahedron.position.set(0, 0, 0);
     //scene.add(Icosahedron);

     const clock = new THREE.Clock();

     function animate(){
          planeBottom.rotation.z += 0.001;
          planeTop.rotation.z -= 0.004;
          Icosahedron.rotation.x += 0.004;
          Icosahedron.rotation.z -= 0.006; 
     analyser.getByteFrequencyData(dataArray);
     uniforms.u_data_arr.value = dataArray;
     uniforms.u_time.value = clock.getElapsedTime() * 0.5;
     
     
     renderer.render(scene, camera);
     requestAnimationFrame(animate);
     }
     animate();
}




///

