import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  // Noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m * m * m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Curl noise for fluid-like motion
  vec2 curl(float x, float y) {
    float eps = 0.01;
    float n1 = snoise(vec2(x + eps, y));
    float n2 = snoise(vec2(x - eps, y));
    float n3 = snoise(vec2(x, y + eps));
    float n4 = snoise(vec2(x, y - eps));
    float dx = (n1 - n2) / (2.0 * eps);
    float dy = (n3 - n4) / (2.0 * eps);
    return vec2(dy, -dx);
  }

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec2 uv = vUv;
    float time = uTime * 0.5;
    
    // Create fluid-like motion using curl noise
    vec2 flow = curl(uv.x * 3.0 + time * 0.3, uv.y * 3.0 + time * 0.3);
    uv += flow * 0.1;

    // Dynamic color palette with fluid motion
    vec3 color1 = hsv2rgb(vec3(0.6 + sin(time + flow.x) * 0.1, 0.7, 0.95));
    vec3 color2 = hsv2rgb(vec3(0.9 + cos(time + flow.y) * 0.1, 0.8, 0.95));
    vec3 color3 = hsv2rgb(vec3(0.3 + sin(time * 1.5 + length(flow)) * 0.1, 0.7, 0.95));
    vec3 color4 = hsv2rgb(vec3(0.1 + cos(time * 1.2 + flow.x * flow.y) * 0.1, 0.8, 0.95));

    // Create complex flowing patterns with multiple noise layers
    float noise1 = snoise(uv * 2.0 + time * 0.2 + flow);
    float noise2 = snoise(uv * 3.0 - time * 0.3 - flow * 1.5);
    float noise3 = snoise(uv * 4.0 + time * 0.1 + flow * 0.8);
    float noise4 = snoise(uv * 1.5 - time * 0.15 + flow * 1.2);

    // Smooth color transitions with multiple layers and fluid motion
    vec3 baseColor = mix(
      mix(color1, color2, sin(noise1 * 3.0 + time * 0.2 + flow.x) * 0.5 + 0.5),
      mix(color3, color4, cos(noise2 * 2.0 - time * 0.3 + flow.y) * 0.5 + 0.5),
      sin(noise3 + noise4 + time * 0.1) * 0.5 + 0.5
    );

    // Add dynamic glow and vignette effects
    float glow = smoothstep(0.2, 0.8, noise1 * noise2 * noise3);
    float vignette = smoothstep(0.0, 0.7, length(uv - 0.5));
    baseColor += glow * 0.3 * (1.0 - vignette);
    
    // Add fluid-reactive sparkles
    float sparkle = pow(max(sin(noise1 * 20.0 + time + dot(flow, flow)), 0.0), 20.0);
    baseColor += sparkle * 0.2;

    // Add subtle wave interference patterns
    float waves = sin(dot(uv + flow * 0.5, vec2(cos(time * 0.5), sin(time * 0.5))) * 10.0) * 0.02;
    baseColor += waves;

    gl_FragColor = vec4(baseColor, 1.0);
  }
`;

export function GradientShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
      },
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = () => {
      if (!renderer) return;
      
      timeRef.current += 0.002;
      material.uniforms.uTime.value = timeRef.current;
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (!canvas || !renderer) return;
      
      const { clientWidth, clientHeight } = canvas;
      renderer.setSize(clientWidth, clientHeight, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ mixBlendMode: 'plus-lighter' }}
    />
  );
}