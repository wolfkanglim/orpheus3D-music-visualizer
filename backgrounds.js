import * as THREE from './js/three.module.js';
import { RGBELoader } from './js/RGBELoader.js'; 


// black blue red green spaces
// night city, mountain lake, desert, ocean
const loader = new THREE.CubeTextureLoader();
export function setBackgroundBlue(scene){
     
     loader.setPath('./assets/textures/blue/');
     const cubeSpaceBlue = loader.load([
          'bkg1_back.png', 'bkg1_bot.png', 'bkg1_front.png', 'bkg1_left.png', 'bkg1_right.png', 'bkg1_top.png'
     ]);
     
     scene.background = cubeSpaceBlue;
    
}

export const setBackgroundRed = function(scene){
     loader.setPath('./assets/textures/red/');
     const cubeSpaceRed = loader.load([
          'bkg1_back6.png', 'bkg1_bottom4.png', 'bkg1_front5.png', 'bkg1_left2.png', 'bkg1_right1.png', 'bkg1_top3.png'
     ]);
     scene.background = cubeSpaceRed;
}

export const setBackgroundRed2 = function(scene){
     loader.setPath('./assets/textures/red/');
     const cubeSpaceRed2 = loader.load([
          'bkg2_right1.png', 'bkg2_left2.png', 'bkg2_top3.png', 'bkg2_bottom4.png', 'bkg2_front5.png', 'bkg2_back6.png'
     ]);
     scene.background = cubeSpaceRed2;
}

export const setBackgroundGloomy = function(scene){
     loader.setPath('./assets/textures/gloomy_skybox/');
     const cubeGloomy = loader.load([
          'gloomy_up.png', 
          'gloomy_dn.png', 
          'gloomy_rt.png', 
          'gloomy_lf.png', 
          'gloomy_ft.png', 
          'gloomy_bk.png', 
     ]);
     scene.background = cubeGloomy;
}

export const setBackgroundPerea = function(scene){
     loader.setPath('./assets/textures/PereaBeach1/');
     const cubePerea = loader.load([
          'posx.jpg', 
          'negx.jpg', 
          'posy.jpg', 
          'negy.jpg', 
          'posz.jpg', 
          'negz.jpg', 
     ]);
     scene.background = cubePerea;
}

///// hdr backgrounds

export const setBackgroundStorm = function(scene){
     new RGBELoader().load('./assets/textures/approaching_storm_4k.hdr', (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          scene.background = texture;
          scene.environment = texture;
     })
     
};

 export const setBackgroundBrownStudio = function(scene){
     new RGBELoader().load('./assets/textures/brown_photostudio_02_4k.hdr', (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          scene.background = texture;
          scene.environment = texture;
     })
     
}; 