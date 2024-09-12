const fragment = /* glsl */ `

uniform vec3 uTopColor;
uniform vec3 uBottomColor;

uniform float uColorOffset;
uniform float uColorMult;

varying float vHeight;

void main()
{
    vec3 mixedColor = mix(uBottomColor, uTopColor, vHeight) + uColorOffset * uColorMult;
    if(vHeight >= 0.1){
        mixedColor = vec3(1.0, 1.0, 1.0);
    }
    gl_FragColor = vec4(mixedColor.xyz, 1.0);
}
`;

export default fragment;
