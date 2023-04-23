import * as THREE from './js/three.module.js';
//import Stats from './js/stats.module.js';
//import {OrbitControls} from './js/OrbitControls.js';
import * as BufferGeometryUtils from './js/BufferGeometryUtils.js';


let orbitControls;
let sphere, length1;
const clock = new THREE.Clock();

const texture = new THREE.TextureLoader().load( './assets/textures/compact-cd.png' );

const  uniforms = {
     u_time: { value: 0.0},
     color: { value: new THREE.Color( 0xffffff ) },
     pointTexture: { value: texture }
}

 export const discVisualizer = function(scene, camera, renderer, dataArray, analyser){
   
     //orbitControls = new OrbitControls(camera, renderer.domElement);
    // orbitControls.update();
     
     const radius = 10;
     const segments = 32;
     const rings = 32;

     let sphereGeometry = new THREE.SphereGeometry( radius, segments, rings );
     let boxGeometry = new THREE.BoxGeometry( 0.8 * radius, 0.8 * radius, 0.8 * radius, 20, 20, 20 );

     // if normal and uv attributes are not removed, mergeVertices() can't consolidate identical vertices with different normal/uv data

     sphereGeometry.deleteAttribute( 'normal' );
     sphereGeometry.deleteAttribute( 'uv' );

     boxGeometry.deleteAttribute( 'normal' );
     boxGeometry.deleteAttribute( 'uv' );

     sphereGeometry = BufferGeometryUtils.mergeVertices( sphereGeometry );
     boxGeometry = BufferGeometryUtils.mergeVertices( boxGeometry );

     const combinedGeometry = BufferGeometryUtils.mergeBufferGeometries( [ sphereGeometry, boxGeometry ] );
     const positionAttribute = combinedGeometry.getAttribute( 'position' );

     const colors = [];
     const sizes = [];

     const color = new THREE.Color();
     const vertex = new THREE.Vector3();

     length1 = sphereGeometry.getAttribute( 'position' ).count;

     for ( let i = 0, l = positionAttribute.count; i < l; i ++ ) {

          vertex.fromBufferAttribute( positionAttribute, i );

          if ( i < length1 ) {

               color.setHSL( 0.01 + 0.1 * ( i / length1 ), 0.95, ( vertex.y + radius ) / ( 3 * radius ) );

          } else {

               color.setHSL( 0.6*(i/length1), 0.85, 0.25 + vertex.y / ( 2 * radius ) );

          }

          color.toArray( colors, i * 3 );

          sizes[ i ] = i < length1 ? 10 : 40;

     }

     const geometry = new THREE.BufferGeometry();
     geometry.setAttribute( 'position', positionAttribute );
     geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ) );
     geometry.setAttribute( 'ca', new THREE.Float32BufferAttribute( colors, 3 ) );

     
    
     texture.wrapS = THREE.RepeatWrapping;
     texture.wrapT = THREE.RepeatWrapping;

     const material = new THREE.ShaderMaterial( {
          
         uniforms: uniforms,
          vertexShader: `
          uniform float u_time;
			attribute float size;
			attribute vec3 ca;

			varying vec3 vColor;

			void main() {

				vColor = ca;

				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

				gl_PointSize = size * ( 10.0 / -mvPosition.z ) ;

				gl_Position = projectionMatrix * mvPosition;

			}
          `,
          fragmentShader:`
          uniform float u_time;
          uniform vec3 color;
          uniform sampler2D pointTexture;

          varying vec3 vColor;

          void main() {

               vec4 color = vec4( color * vColor * u_time, 0.90 ) * texture2D( pointTexture, gl_PointCoord );

               gl_FragColor = color;

          }
          `,
          transparent: true

     });

     
     sphere = new THREE.Points( geometry, material );
     //sphere.scale.set(0.1, 0.1, 0.1);
     scene.add( sphere );

     function sortPoints() {
          const vector = new THREE.Vector3();
          // Model View Projection matrix
          const matrix = new THREE.Matrix4();
          matrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
          matrix.multiply( sphere.matrixWorld );
          //
          const geometry = sphere.geometry;
          let index = geometry.getIndex();
          const positions = geometry.getAttribute( 'position' ).array;
          const length = positions.length / 3;

          if ( index === null ) {
               const array = new Uint16Array( length );
               for ( let i = 0; i < length; i ++ ) {
                    array[ i ] = i;
               }
               index = new THREE.BufferAttribute( array, 1 );
               geometry.setIndex( index );
          }
          const sortArray = [];
          for ( let i = 0; i < length; i ++ ) {
               vector.fromArray( positions, i * 3 );
               vector.applyMatrix4( matrix );
               sortArray.push( [ vector.z, i ] );
          }
          function numericalSort( a, b ) {
               return b[ 0 ] - a[ 0 ];
          }
          sortArray.sort( numericalSort );
          const indices = index.array;
          for ( let i = 0; i < length; i ++ ) {
               indices[ i ] = sortArray[ i ][ 1 ];
          }
          geometry.index.needsUpdate = true;
     }
     ///////////
    

     function animate() {
          requestAnimationFrame( animate );
          render();
          //stats.update();
     }
     animate();
     function render() {
          analyser.getByteFrequencyData(dataArray);
          //boxGeometry.position.y = dataArray;
         // sphere.position.y = dataArray;
          const time = Date.now() * 0.001;
          uniforms.u_time.value = clock.getElapsedTime() * 0.2;
          //uniforms.u_time.value = time * 0.0005;
          sphere.rotation.y = 0.2 * time;
          sphere.rotation.z = 0.3 * time;
          const geometry = sphere.geometry;
          const attributes = geometry.attributes;
          for ( let i = 0; i < attributes.size.array.length; i ++ ) {
               if(i < length1){
                   // attributes.size.array[i] = 14 + dataArray[i];
                    attributes.size.array[ i ] = 14 + 13 * Math.sin( 0.1 * i + time) * dataArray[144] * 0.05;
               }
          }
          attributes.size.needsUpdate = true;
          //sortPoints();
          renderer.render( scene, camera );
     }
}