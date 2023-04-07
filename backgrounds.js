import * as THREE from './js/three.module.js';

// black blue red green spaces
// night city, mountain lake, desert, ocean

export function setBackgroundBlue(scene){
     const loader = new THREE.CubeTextureLoader();
     loader.setPath('./assets/textures/blue/');
     const cubeSpaceBlue = loader.load([
          'bkg1_back.png', 'bkg1_bot.png', 'bkg1_front.png', 'bkg1_left.png', 'bkg1_right.png', 'bkg1_top.png'
     ]);
     
          scene.background = cubeSpaceBlue;
    
}

export const setBackgroundRed = function(scene){
     const loader = new THREE.CubeTextureLoader();
     loader.setPath('./assets/textures/red/');
     const cubeSpaceRed = loader.load([
          'bkg1_back6.png', 'bkg1_bottom4.png', 'bkg1_front5.png', 'bkg1_left2.png', 'bkg1_right1.png', 'bkg1_top3.png'
     ]);
     scene.background = cubeSpaceRed;
}