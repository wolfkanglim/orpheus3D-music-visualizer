import * as THREE from './js/three.module.js';


let noise = new SimplexNoise();
let clock = new THREE.Clock();
let  group;
let  icosahedron, planeBottom, planeTop;

export const doubleVisualizer = function(scene, camera, renderer,dataArray, analyser){
          
     const planeGeometry = new THREE.PlaneGeometry(2000, 2000, 50, 50);
     const planeMaterial = new THREE.MeshPhongMaterial({
          color: 0x05d9ff,
          side: THREE.DoubleSide,
          wireframe: false
     })
          
     group = new THREE.Group();

     planeTop = new THREE.Mesh(planeGeometry, planeMaterial);
     planeTop.position.set(0, 70, 0);
     planeTop.rotation.x = -Math.PI * 0.5;
     planeTop.castShadow = true;
     planeTop.receiveShadow = true;
     group.add(planeTop);

     planeBottom = new THREE.Mesh(planeGeometry, planeMaterial);
     planeBottom.position.set(0, -70, 0);
     planeBottom.rotation.x = -Math.PI * 0.5;
     planeBottom.castShadow = true;
     planeBottom.receiveShadow = true;
     group.add(planeBottom);


     let icosahedronGeo = new THREE.IcosahedronGeometry(10, 0);
     let icosahedronMat = new THREE.MeshPhongMaterial({
          //color: 0xff00ee,
          map: new THREE.TextureLoader().load('./images/exoplanets_img1.jpg'),
          wireframe: false
     });
     icosahedron = new THREE.Mesh(icosahedronGeo, icosahedronMat);
     icosahedron.position.set(0, 0, 0);
     scene.add(icosahedron);
     scene.add(group); 
   
     function update(){         
          const delta = clock.getDelta();
          group.rotation.y += 0.001;
          icosahedron.rotation.x += 0.002;
          icosahedron.rotation.y += 0.004;
         
     };

     function animate(){               
          update();
          analyser.getByteFrequencyData(dataArray);
          let lowerHalfArray = dataArray.slice(0, (dataArray.length / 2) - 1);
          let upperHalfArray = dataArray.slice((dataArray.length/2) - 1, dataArray.length - 1);

          let overallAvg = avg(dataArray);
          let lowerMax = max(lowerHalfArray);
          let lowerAvg = avg(lowerHalfArray);
          let upperMax = max(upperHalfArray);
          let upperAvg = avg(upperHalfArray);

          let lowerMaxFrequency = lowerMax / lowerHalfArray.length;
          let lowerAvgFrequency = lowerAvg / lowerHalfArray.length;
          let upperMaxFrequency = upperMax / upperHalfArray.length;
          let upperAvgFrequency = upperAvg / upperHalfArray.length;

          visualizeGround(planeBottom, modulate(lowerAvgFrequency, 0, 1, 0.5, 4));
          visualizeGround(planeTop, modulate(upperAvgFrequency, 0, 1, 0.5, 4));
          visualizeIcosahedron(icosahedron, modulate(Math.pow(lowerMaxFrequency, 0.8), 0, 1, 0, 8), modulate(upperMaxFrequency, 0, 1, 0, 4));
          flyCamera.movementSpeed = 10;
          flyCamera.rollSpeed = Math.PI/24;
          flyCamera.update(delta);
          renderer.render(scene, camera);
          requestAnimationFrame(animate); 
     };

     animate();
};



function visualizeGround(mesh, distortionFr){
     mesh.geometry.vertices.forEach(function(vertex, i) {
          let amp = 4;
          let time = Date.now();
          let distance = (noise.noise2D(vertex.x + time * 0.0003, vertex.y + time * 0.0002) + 0) * amp * distortionFr;
          vertex.z = distance * 3.5;
     });

     mesh.geometry.verticesNeedUpdate = true;
     mesh.geometry.normalsNeedUpdate = true;
     mesh.geometry.computeVertexNormals();
     mesh.geometry.computeFaceNormals();
};

function visualizeIcosahedron(mesh, bassFr, treFr){
     mesh.geometry.vertices.forEach(function(vertex, i){
          let offset = mesh.geometry.parameters.radius;
          let amp = 5;
          let time = window.performance.now();
          vertex.normalize();
          let rf = 0.00001;
          let distance = (offset + bassFr) + noise.noise3D(vertex.x + time * rf * 7, vertex.y + time * rf * 8, vertex.z + time * rf * 9) * amp * treFr;
          vertex.multiplyScalar(distance);
     });
     mesh.geometry.verticesNeedUpdate = true;
     mesh.geometry.normalsNeedUPdate = true;
     mesh.geometry.computeVertexNormals();
     mesh.geometry.computeFaceNormals();
};

////more functions /////
function fractionate(val, minVal, maxVal) {
return (val - minVal)/(maxVal - minVal);
}

function modulate(val, minVal, maxVal, outMin, outMax) {
var fr = fractionate(val, minVal, maxVal);
var delta = outMax - outMin;
return outMin + (fr * delta);
}

function avg(arr){
var total = arr.reduce(function(sum, b) { return sum + b; });
return (total / arr.length);
}

function max(arr){
return arr.reduce(function(a, b){ return Math.max(a, b); })
};
