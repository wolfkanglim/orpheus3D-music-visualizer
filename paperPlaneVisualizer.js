
import * as THREE from './js/three.module.js';

export const paperPlanes = new THREE.Object3D();
		
export const paperPlaneVisualizer = function(scene, camera, renderer, dataArray, analyser){
     const vector = new THREE.Vector4();
     const instances = 50000;
     const positions = [];
     const offsets = [];
     const colors = [];
     const orientationsStart = [];
     const orientationsEnd = [];

     positions.push( 1, - 1, 0 );
     positions.push( - 1, 1, 0 );
     positions.push( 0, 0, 1 );

     // instanced attributes

     for ( let i = 0; i < instances; i ++ ) {

          // offsets

          offsets.push( Math.random() * 200 - 100, Math.random() * 200 - 100, Math.random() * 200 - 100 );

          // colors

          colors.push( Math.random(), Math.random(), Math.random(), Math.random() );

          // orientation start

          vector.set( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
          vector.normalize();

          orientationsStart.push( vector.x, vector.y, vector.z, vector.w );

          // orientation end

          vector.set( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
          vector.normalize();

          orientationsEnd.push( vector.x, vector.y, vector.z, vector.w );

     }

     const geometry = new THREE.InstancedBufferGeometry();
     geometry.instanceCount = instances; 

     geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );

     geometry.setAttribute( 'offset', new THREE.InstancedBufferAttribute( new Float32Array( offsets ), 3 ) );
     geometry.setAttribute( 'color', new THREE.InstancedBufferAttribute( new Float32Array( colors ), 4 ) );
     geometry.setAttribute( 'orientationStart', new THREE.InstancedBufferAttribute( new Float32Array( orientationsStart ), 4 ) );
     geometry.setAttribute( 'orientationEnd', new THREE.InstancedBufferAttribute( new Float32Array( orientationsEnd ), 4 ) );

     // material
     const uniforms = {
          'time': { value: 1.0 },
          'sineTime': { value: 1.0 }
     }
     const material = new THREE.RawShaderMaterial( {

          uniforms: uniforms,
          vertexShader: `
          precision highp float;

		uniform float sineTime;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec3 offset;
		attribute vec4 color;
		attribute vec4 orientationStart;
		attribute vec4 orientationEnd;

		varying vec3 vPosition;
		varying vec4 vColor;

		void main(){

			vPosition = offset * max( abs( sineTime * 2.0 + 1.0 ), 0.5 ) + position;
			vec4 orientation = normalize( mix( orientationStart, orientationEnd, sineTime ) );
			vec3 vcV = cross( orientation.xyz, vPosition );
			vPosition = vcV * ( 2.0 * orientation.w ) + ( cross( orientation.xyz, vcV ) * 2.0 + vPosition );

			vColor = color;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );
		}
          `                         
          ,
          fragmentShader: 
          `
          precision highp float;

		uniform float time;

		varying vec3 vPosition;
		varying vec4 vColor;

		void main() {

			vec4 color = vec4( vColor );
			color.r += sin( vPosition.x * 10.0 + time ) * 0.5;

			gl_FragColor = color;

		}
          `
          ,
          side: THREE.DoubleSide,
          forceSinglePass: true,
          transparent: true

     } );

     const mesh = new THREE.Mesh( geometry, material );
     paperPlanes.add( mesh );
     scene.add(paperPlanes);
     function animate() {
          requestAnimationFrame( animate );
          render();
          //stats.update();
     }

     function render() {
          analyser.getByteFrequencyData(dataArray);
          const time = performance.now();
          const object = scene.children[ 0 ];
          object.rotation.y = time * 0.0051;
         object.rotation.z = time * 0.005;
         
         material.uniforms[ 'time' ].value = time * 0.0051;
         material.uniforms[ 'sineTime' ].value = Math.sin(material.uniforms[ 'time' ].value * 0.025 );

          renderer.render( scene, camera );
     }
     animate();
}               
			
	

		
		
		
