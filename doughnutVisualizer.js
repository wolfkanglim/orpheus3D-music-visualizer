
import * as THREE from './js/three.module.js';

export const doughnuts = new THREE.Object3D();

let uniforms, mesh;
const size = 24;

export const doughnutVisualizer = function(scene, camera, renderer, dataArray, analyser) {
   
     const clock = new THREE.Clock();

     const textureLoader = new THREE.TextureLoader();

     uniforms = {
          'fogDensity': { value: 0.0025 },
          'fogColor': { value: new THREE.Vector3( 0, 0, 0 ) },
          'time': { value: 1.0 },
          'uvScale': { value: new THREE.Vector2( 3.0, 1.0 ) },
          'texture1': { value: textureLoader.load( './assets/textures/spark1.png' ) },
          'texture2': { value: textureLoader.load( './assets/textures/2k_sun.jpg' ) }
     };

     uniforms[ 'texture1' ].value.wrapS = uniforms[ 'texture1' ].value.wrapT = THREE.RepeatWrapping;
     uniforms[ 'texture2' ].value.wrapS = uniforms[ 'texture2' ].value.wrapT = THREE.RepeatWrapping;    

     const material = new THREE.ShaderMaterial( {
          uniforms: uniforms,
          vertexShader: `
          uniform vec2 uvScale;
			varying vec2 vUv;

			void main()
			{

				vUv = uvScale * uv;
				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
				gl_Position = projectionMatrix * mvPosition;

			}
          `,
          fragmentShader: `
          uniform float time;

			uniform float fogDensity;
			uniform vec3 fogColor;

			uniform sampler2D texture1;
			uniform sampler2D texture2;

			varying vec2 vUv;

			void main( void ) {

				vec2 position = - 1.0 + 2.0 * vUv;

				vec4 noise = texture2D( texture1, vUv );
				vec2 T1 = vUv + vec2( 1.5, - 1.5 ) * time * 0.02;
				vec2 T2 = vUv + vec2( - 0.5, 2.0 ) * time * 0.01;

				T1.x += noise.x * 2.0;
				T1.y += noise.y * 2.0;
				T2.x -= noise.y * 0.2;
				T2.y += noise.z * 0.2;

				float p = texture2D( texture1, T1 * 2.0 ).a;

				vec4 color = texture2D( texture2, T2 * 2.0 );
				vec4 temp = color * ( vec4( p, p, p, p ) * 2.0 ) + ( color * color - 0.1 );

				if( temp.r > 1.0 ) { temp.bg += clamp( temp.r - 2.0, 0.0, 100.0 ); }
				if( temp.g > 1.0 ) { temp.rb += temp.g - 1.0; }
				if( temp.b > 1.0 ) { temp.rg += temp.b - 1.0; }

				gl_FragColor = temp;

				float depth = gl_FragCoord.z / gl_FragCoord.w;
				const float LOG2 = 1.442695;
				float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );
				fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );

				gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );

			}
          `,
         
     } );

     mesh = new THREE.Mesh( new THREE.TorusGeometry( size, 12, 30, 30 ), material );     
     doughnuts.add( mesh );
     scene.add(doughnuts);
     
     function animate() {
          requestAnimationFrame( animate );
          render();
     }
     animate();

     function render() {
          const delta = clock.getDelta();
          analyser.getByteFrequencyData(dataArray);
          let frequency = dataArray[100];               
          let frequency2 = dataArray[20];               
          let frequency3 = dataArray[230];               
          let frequency4 = dataArray[180];               
               
          uniforms[ 'time' ].value += 0.6 * delta + 0.0052 * frequency;
          mesh.rotation.y -= 0.025 * delta * frequency2 * 0.0125;
          mesh.rotation.x += 0.05 * delta * frequency4 * 0.02;
          mesh.rotation.z -= 0.025 * delta * frequency3 * 0.125; 
         renderer.render(scene, camera);      
     }
}