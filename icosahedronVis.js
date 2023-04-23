import * as THREE from './js/three.module.js';


 

export function icosahedronVisualizer(scene, camera, renderer, dataArray, analyser){    
     const groupIcosahedron = new THREE.Group();

     const icosahedronGeo = new THREE.IcosahedronGeometry(10, 0);
     const icosahedronMat = new THREE.MeshPhongMaterial({
          map: new THREE.TextureLoader().load('./assets/textures/2k_sun.jpg'),
          wireframe: false
     });
     const icosahedron = new THREE.Mesh(icosahedronGeo, icosahedronMat);
     const icosahedron1 = new THREE.Mesh(icosahedronGeo, icosahedronMat);
     const icosahedron2 = new THREE.Mesh(icosahedronGeo, icosahedronMat);
     const icosahedron3 = new THREE.Mesh(icosahedronGeo, icosahedronMat);
    groupIcosahedron.add(icosahedron1, icosahedron2, icosahedron3);
     scene.add(icosahedron, icosahedron1, icosahedron2, icosahedron3);        
     scene.add(groupIcosahedron);    
        
     function update(){          
          icosahedron.rotation.y += 0.0071;
          icosahedron1.rotation.y -= 0.0064;
          icosahedron2.rotation.y += 0.0017;
          icosahedron3.rotation.y -= 0.0021;
          icosahedron.rotation.x -= 0.005;
          icosahedron1.rotation.x += 0.007;
          icosahedron2.rotation.x -= 0.0011;
          icosahedron3.rotation.x += 0.007;
          icosahedron.rotation.z += 0.00917;
          icosahedron1.rotation.z -= 0.004;
          icosahedron2.rotation.z += 0.0057;
          icosahedron3.rotation.z -= 0.007;
          //renderer.render(scene, camera);
     };

    

     function animate(){
                        
          update();
           analyser.getByteFrequencyData(dataArray);
           for(let i = 0; i < dataArray.length; i++){
               let frequency = dataArray[144] * 2;
              let scale = map(frequency, 0, 255, 0.001, 1) * 2;
               //if(icosahedron1){
                    TweenMax.to(icosahedron1.position, 0.25, {
                         y: scale ,
                    })
                    TweenMax.to(icosahedron2.position, 0.25, {
                         x: scale ,
                    })
                    TweenMax.to(icosahedron3.position, 0.25, {
                         z: scale ,
                    })
               //}
          }
         /* let lowerHalfArray = dataArray.slice(0, (dataArray.length / 2) - 1);
          let upperHalfArray = dataArray.slice((dataArray.length/2) - 1, dataArray.length - 1);

          let overallAvg = avg(dataArray);
          let lowerMax = max(lowerHalfArray);
          let lowerAvg = avg(lowerHalfArray);
          let upperMax = max(upperHalfArray);
          let upperAvg = avg(upperHalfArray);

          let lowerMaxFrequency = lowerMax / lowerHalfArray.length;
          let lowerAvgFrequency = lowerAvg / lowerHalfArray.length;
          let upperMaxFrequency = upperMax / upperHalfArray.length;
          let upperAvgFrequency = upperAvg / upperHalfArray.length; */

     
         ////////////
         renderer.render(scene, camera);
         requestAnimationFrame(animate); 
     };   
     animate();  
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

function map(value, start1, stop1, start2, stop2) {
     return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2
}