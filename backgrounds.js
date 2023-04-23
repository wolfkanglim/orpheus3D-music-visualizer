import * as THREE from './js/three.module.js';
import { RGBELoader } from './js/RGBELoader.js'; 

// black blue red green spaces
// night city, mountain lake, desert, ocean
const loader = new THREE.CubeTextureLoader();     
loader.setPath('./assets/textures/');

export const spaceBlue = loader.load([
     'blue/bkg1_right.png', 
     'blue/bkg1_left.png', 
     'blue/bkg1_top.png',
     'blue/bkg1_bot.png', 
     'blue/bkg1_front.png', 
     'blue/bkg1_back.png', 
]);

export const spaceRed = loader.load([
     'red/bkg1_right1.png', 
     'red/bkg1_left2.png', 
     'red/bkg1_top3.png',
     'red/bkg1_bottom4.png', 
     'red/bkg1_front5.png', 
     'red/bkg1_back6.png', 
]);


export const gloomy = loader.load([
     'gloomy_skybox/gloomy_ft.png', 
     'gloomy_skybox/gloomy_bk.png', 
     'gloomy_skybox/gloomy_up.png', 
     'gloomy_skybox/gloomy_dn.png', 
     'gloomy_skybox/gloomy_rt.png', 
     'gloomy_skybox/gloomy_lf.png', 
]);

export const pereaBeach = loader.load([
     'PereaBeach1/posx.jpg', 
     'PereaBeach1/negx.jpg', 
     'PereaBeach1/posy.jpg', 
     'PereaBeach1/negy.jpg', 
     'PereaBeach1/posz.jpg', 
     'PereaBeach1/negz.jpg', 
]);

///// hdr backgrounds
export const storm = new RGBELoader().load('./assets/textures/approaching_storm_4k.hdr', (texture) => {
     texture.mapping = THREE.EquirectangularReflectionMapping;
})

export const photoStudio = new RGBELoader().load('./assets/textures/brown_photostudio_02_4k.hdr', (texture) => {
     texture.mapping = THREE.EquirectangularReflectionMapping;
})