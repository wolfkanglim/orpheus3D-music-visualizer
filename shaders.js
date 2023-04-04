const shaders = {

     vertexShader: `
          uniform float u_time;
          uniform float[64] u_data_array;
          void main(){
          float x = abs(position.x);
          float floor_x = round(x);
          float multiplier_x = (25.0 - x) / 8.0;
          float y = abs(position.y);
          float floor_y = round(y);
          float multiplier_y = (25.0 - y) / 8.0;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, sin(u_data_array[int(floor_x)] / 20.0 + u_data_array[int(floor_y)] / 10.0) * 0.9, 1.0 ); 
     }`
     ,
     fragmentShader: `
     varying float x;
     varying float y;
     varying float z;
     varying vec3 vUv;
     uniform float u_time;
     void main(){
          gl_FragColor = vec4(sin(u_time), cos(u_time) + 0.5, 1.0, 1.0);
     }
     `   
}

export default shaders;