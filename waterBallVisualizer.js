import * as THREE from './js/three.module.js';
import Stats from './js/stats.module.js';

export const groupWaterBall = new THREE.Group(); ;

let  stats;
let sphere, uniforms;
let displacement, noise;

export const waterBallVisualizer = function(scene, camera, renderer, dataArray, analyser) {
     
     stats = new Stats();
     //container.appendChild( stats.dom );

               
     uniforms = {
          
          'amplitude': { value: 1.0 },
          'color': { value: new THREE.Color( 0xff2200 ) },
          'colorTexture': { value: new THREE.TextureLoader().load( './assets/textures/water-surface.jpg' ) }
     };

     uniforms[ 'colorTexture' ].value.wrapS = uniforms[ 'colorTexture' ].value.wrapT = THREE.RepeatWrapping;

     const shaderMaterial = new THREE.ShaderMaterial( {
          uniforms: uniforms,
          vertexShader: `
          uniform float amplitude;
          
          attribute float displacement;

          varying vec3 vNormal;
          varying vec2 vUv;
          
          void main() {

               vNormal = normal;
               vUv = ( 0.5 + amplitude ) * uv + vec2( amplitude );

               vec3 newPosition = position + amplitude * normal * vec3( displacement );
               gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

          }
          `,
          fragmentShader: `
          varying vec3 vNormal;
          varying vec2 vUv;

          uniform vec3 color;
          uniform sampler2D colorTexture;

          void main() {

               vec3 light = vec3( 0.5, 0.2, 1.0 );
               light = normalize( light );

               float dProd = dot( vNormal, light ) * 0.5 + 0.5;

               vec4 tcolor = texture2D( colorTexture, vUv );
               vec4 gray = vec4( vec3( tcolor.r * 0.3 + tcolor.g * 0.59 + tcolor.b * 0.11 ), 1.0 );

               gl_FragColor = gray * vec4( vec3( dProd ) * vec3( color ), 1.0 );

          }
          `
     } );

     const radius = 10;
     const segments = 64;
     const rings = 32;

     const geometry = new THREE.SphereGeometry( radius, segments, rings );

     displacement = new Float32Array( geometry.attributes.position.count );
     noise = new Float32Array( geometry.attributes.position.count );

     for ( let i = 0; i < displacement.length; i ++ ) {
          noise[ i ] = Math.random() * 5;
     }

     geometry.setAttribute( 'displacement', new THREE.BufferAttribute( displacement, 1 ) );

     sphere = new THREE.Mesh( geometry, shaderMaterial );
     groupWaterBall.add( sphere );
     scene.add( groupWaterBall );

    function animate() {         
         requestAnimationFrame( animate );
         render();
         //stats.update();
     }
     animate();
     
     function render() {
          analyser.getByteFrequencyData(dataArray);
          const time = Date.now() * 0.01;
          sphere.rotation.y = 0.009 * time;
          sphere.rotation.z = 0.02 * time;
          sphere.rotation.x = 0.01 * time;
          sphere.position.z = dataArray[215] * 0.125;
          sphere.position.x = dataArray[15] * 0.02;
          sphere.position.y = dataArray[115] * 0.014;

          uniforms[ 'amplitude' ].value = 3 * Math.sin( sphere.rotation.y * 0.125 );
          uniforms[ 'color' ].value.offsetHSL( 0.0005, 0, 0 );

          for ( let i = 0; i < displacement.length; i ++ ) {

               displacement[ i ] = Math.sin( 0.1 * i + time );

               noise[ i ] += 0.5 * ( 0.5 - Math.random() );
               noise[ i ] = THREE.MathUtils.clamp( noise[ i ], - 5, 5 );
               displacement[ i ] += noise[ i ];
          }

          sphere.geometry.attributes.displacement.needsUpdate = true;

          renderer.render( scene, camera );
     }
}