import * as THREE from './js/three.module.js';

export const sphereObj = new THREE.Object3D();

var uniforms;
var startTime;

export const waterPaintVisualizer = function(scene, camera, renderer,dataArray, analyser ) {
  startTime = Date.now();

  //var geometry = new THREE.PlaneGeometry(10000, 10000 );
  const geometry = new THREE.SphereGeometry(1100);
  
  uniforms = {
    u_data_arr: {type: 'f', value: dataArray},
    iGlobalTime: {type: 'vec3', value: new THREE.Color(0x000000)},
    iResolution: {type: 'vec3', value: new THREE.Color(0x74ebd5)}
  }

  var material = new THREE.ShaderMaterial( {
    side: THREE.DoubleSide,
    uniforms: uniforms,
    vertexShader: `
    uniform float[64] u_data_arr;
    varying vec2 vUv; 
    void main() {
      vUv = uv;
  
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );
      gl_Position = projectionMatrix * mvPosition;
    }  
  `,
  fragmentShader: `
    uniform float[64] u_data_arr;
    uniform vec2 iResolution;
    uniform float iGlobalTime;

    varying vec2 vUv; 

    void main(void) {
     float time=iGlobalTime*0.6;
     vec2 uv = (-1.0 + 2.0 *vUv)* 2.0;

     vec2 uv0=uv;
     float i0=1.4;
     float i1=1.9;
     float i2=1.4;
     float i4=0.6;
     for(int s=0;s<20;s++) {
        vec2 r;
        r=vec2(cos(uv.y*i0-i4+time/i1),sin(uv.x*i0-i4+time/i1))/i2;
        r+=vec2(-r.y,r.x)*0.3;
        uv.xy+=r-0.5;
        i0*=1.93;
        i1*=1.15;
        i2*=1.7;
        i4+=0.65+0.1*time*i1;
      }
      float r=sin(uv.x-time)*0.4 +0.6;
      float b=sin(uv.y+time)*0.4+0.6;
      float g=sin(uv.y+time)*0.4+0.6;

     gl_FragColor = vec4(r,g,b,0.75);
    }
    `,
  });

  var mesh = new THREE.Mesh( geometry, material );
  mesh.position.z = 0;
  sphereObj.add( mesh );  
  scene.add( sphereObj );  

  function animate() {   
    requestAnimationFrame( animate );
    render();
  }
  animate();

  function render() {
    mesh.rotation.x += 0.001;
    mesh.rotation.y -= 0.00015;
    mesh.rotation.z += 0.0005;
    analyser.getByteFrequencyData(dataArray);
    uniforms.u_data_arr.value = dataArray;
    let frequency = dataArray[24];
    var currentTime = Date.now();
    uniforms.iGlobalTime.value = (currentTime - startTime) * 0.0005 * frequency * 0.0051;
    renderer.render( scene, camera );
  }
}