import * as THREE from './js/three.module.js';
import {OrbitControls} from './js/OrbitControls.js';
import Stats from './js/stats.module.js';

import { GUI } from './js/lil-gui.module.min.js';
import { MarchingCubes } from './js/MarchingCubes.js';

let stats;
let materials, current_material;
let light, pointLight, ambientLight,  spotLight;
let effect, resolution;
let effectController;
let time = 0;
const clock = new THREE.Clock();

export const liquidCubeVisualizer = function (scene, camera, renderer, dataArray, analyser){

  init();
  animate();

  function init() {
    
    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0.5, 0.5, 1 );
    scene.add( light );

    pointLight = new THREE.PointLight( 0xff3300 );
    pointLight.position.set( 0, 0, 100 );
    scene.add( pointLight );

    ambientLight = new THREE.AmbientLight( 0x080808 );
    scene.add( ambientLight );

    spotLight = new THREE.SpotLight(0xff0000, 10);
    scene.add(spotLight);

    // MATERIALS
    materials = generateMaterials();
    current_material = 'liquid';

    // MARCHING CUBES
    resolution = 280;
    effect = new MarchingCubes( resolution, materials[ current_material ], true, true, 10000 );
    effect.position.set( 0, 0, 0 );
    effect.scale.set( 200, 200, 200 );
    effect.enableUvs = false;
    effect.enableColors = false;
    scene.add( effect );

    // RENDERER
    
    renderer.outputEncoding = THREE.sRGBEncoding;
    

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 1;
    controls.maxDistance = 1000;

    // STATS
    stats = new Stats();
    //container.appendChild( stats.dom );

    // GUI
    setupGui();
  }
  

  function generateMaterials() {
    // environment map
    
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const blue = cubeTextureLoader.load(
      [
        './assets/textures/blue/bkg1_left.png',
        './assets/textures/blue/bkg1_right.png',
        './assets/textures/blue/bkg1_top.png',
        './assets/textures/blue/bkg1_bot.png',
        './assets/textures/blue/bkg1_front.png',
        './assets/textures/blue/bkg1_back.png',
      ]
    )
    const red = cubeTextureLoader.load(
      [
        './assets/textures/red/bkg2_right1.png',
        './assets/textures/red/bkg2_left2.png',
        './assets/textures/red/bkg2_top3.png',
        './assets/textures/red/bkg2_bottom4.png',
        './assets/textures/red/bkg2_front5.png',
        './assets/textures/red/bkg2_back6.png',

      ]
    )
      
    const reflectionCube = red;
    const refractionCube = red;
    refractionCube.mapping = THREE.CubeRefractionMapping; 

      const materials = {
      'shiny': new THREE.MeshStandardMaterial( { color: 0x550000, envMap: reflectionCube, roughness: 0.1, metalness: 1.0 } ),
      'liquid': new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: refractionCube, refractionRatio: 0.85 } ),
      
    };

    return materials;
  }

  function createShaderMaterial( shader, light, ambientLight ) {
    const u = THREE.UniformsUtils.clone( shader.uniforms );
    const vs = shader.vertexShader;
    const fs = shader.fragmentShader;

    const material = new THREE.ShaderMaterial( { uniforms: u, vertexShader: vs, fragmentShader: fs } );

    material.uniforms[ 'uDirLightPos' ].value = light.position;
    material.uniforms[ 'uDirLightColor' ].value = light.color;

    material.uniforms[ 'uAmbientLightColor' ].value = ambientLight.color;

    return material;
  } 
  createShaderMaterial();


  function setupGui() {
    const createHandler = function ( id ) {
      return function () {
        current_material = id;
        effect.material = materials[ id ];
        effect.enableUvs = ( current_material === 'textured' ) ? true : false;
        effect.enableColors = ( current_material === 'colors' || current_material === 'multiColors' ) ? true : false;
      };
    };

    effectController = {
      material: 'liquid',
      speed: 0.125,
      numBlobs: 180,
      resolution: 28,
      isolation: 180,
      floor: false,
      wallx: false,
      wallz: false,
      dummy: function () {}
    };

    let h;
    const gui = new GUI();

    // material (type)
    h = gui.addFolder( 'Materials' );
    for ( const m in materials ) {
      effectController[ m ] = createHandler( m );
      h.add( effectController, m ).name( m );
    }

    // simulation
    h = gui.addFolder( 'Simulation' );

    h.add( effectController, 'speed', 0.1, 8.0, 0.05 );
    h.add( effectController, 'numBlobs', 1, 50, 1 );
    h.add( effectController, 'resolution', 14, 100, 1 );
    h.add( effectController, 'isolation', 10, 300, 1 );

    h.add( effectController, 'floor' );
    h.add( effectController, 'wallx' );
    h.add( effectController, 'wallz' );
    gui.close();
  }

  // this controls content of marching cubes voxel field
  function updateCubes( object, time, numblobs, floor, wallx, wallz ) {

    object.reset();

    // fill the field with some metaballs
    const rainbow = [
      new THREE.Color( 0xff0000 ),
      new THREE.Color( 0xff7f00 ),
      new THREE.Color( 0xffff00 ),
      new THREE.Color( 0x00ff00 ),
      new THREE.Color( 0x0000ff ),
      new THREE.Color( 0x4b0082 ),
      new THREE.Color( 0x9400d3 )
    ];
    const subtract = 12;
    const strength = 1.2 / ( ( Math.sqrt( numblobs ) - 1 ) / 4 + 1 );

    for ( let i = 0; i < numblobs; i ++ ) {
      const ballx = Math.sin( i + 1.26 * time * ( 1.03 + 0.5 * Math.cos( 0.21 * i ) ) ) * 0.27 + 0.5;
      const bally = Math.abs( Math.cos( i + 1.12 * time * Math.cos( 1.22 + 0.1424 * i ) ) ) * 0.77; // dip into the floor
      const ballz = Math.cos( i + 1.32 * time * 0.1 * Math.sin( ( 0.92 + 0.53 * i ) ) ) * 0.27 + 0.5;

      if ( current_material === 'multiColors' ) {
        object.addBall( ballx, bally, ballz, strength, subtract, rainbow[ i % 7 ] );
      } else {
        object.addBall( ballx, bally, ballz, strength, subtract );
      }
    }

    if ( floor ) object.addPlaneY( 12, 12 );
    if ( wallz ) object.addPlaneZ( 12, 12 );
    //if ( wallx ) object.addPlaneX( 2, 12 );

    object.update();
  }

  function animate() {
    requestAnimationFrame( animate );
    render();
    stats.update();
  }

  function render() {
    const delta = clock.getDelta();
    analyser.getByteFrequencyData(dataArray);
    let frequency = dataArray[13] * 0.002 ;
    let frequency2 = dataArray[123] * 0.002 ;
    let frequency3 = dataArray[223] * 0.002 ;
    time += delta * effectController.speed * 0.5;
    if(frequency > 0) effectController.speed = frequency;
    
    if ( effectController.resolution !== resolution ) {
      resolution = effectController.resolution;
      effect.init( Math.floor( resolution ) );
    }

    if ( effectController.isolation !== effect.isolation ) {
      effect.isolation = effectController.isolation;
    }

    updateCubes( effect, time, effectController.numBlobs, effectController.floor, effectController.wallx, effectController.wallz );

    renderer.render( scene, camera );
  }
}