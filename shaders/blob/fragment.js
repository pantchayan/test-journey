const fragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float time;
  varying vec2 vUv;
  varying vec3 vNormal;
  
  void main() {
    // Create a pulsating effect
    float pulse = sin(time * 2.0) * 0.5 + 0.5;
    
    // Create a color gradient based on UV coordinates
    vec3 color1 = uColorA;  // Light blue
    vec3 color2 = uColorB;  // Darker blue
    vec3 finalColor = mix(color1, color2, vUv.y);
    
    // Add some shading based on normals
    // float lighting1 = dot(vNormal, vec3(1.0, 1.0, 1.0));
    float lighting2 = dot(vec3(vNormal.x*-1.0,vNormal.yz) , vec3(1.0, 1.0, 1.0));
    // finalColor *= lighting1 * 1.2 + 0.8;
    finalColor *= lighting2 * 0.5 + 1.5;
    
    // Apply the pulsating effect
    finalColor *= pulse * 0.3 + 0.7;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export default fragment;