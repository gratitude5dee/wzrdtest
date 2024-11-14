import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/hooks/useTheme';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform bool uDarkMode;
  varying vec2 vUv;

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

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec2 uv = vUv;
    
    vec3 color1, color2, color3, color4;
    
    if (uDarkMode) {
      // Dark mode colors - deep purples with subtle transitions
      color1 = vec3(0.10, 0.09, 0.15); // Dark purple
      color2 = vec3(0.18, 0.16, 0.34); // Medium purple
      color3 = vec3(0.15, 0.13, 0.25); // Deep purple
      color4 = vec3(0.20, 0.17, 0.33); // Rich purple
    } else {
      // Light mode colors - soft whites and creams
      color1 = vec3(1.0, 0.98, 0.96); // Warm white
      color2 = vec3(0.98, 0.96, 0.94); // Soft cream
      color3 = vec3(0.96, 0.94, 0.92); // Light cream
      color4 = vec3(0.99, 0.97, 0.95); // Pure white
    }

    float noise1 = snoise(uv * 2.0 + uTime * 0.2);
    float noise2 = snoise(uv * 3.0 - uTime * 0.3);
    float noise3 = snoise(uv * 4.0 + uTime * 0.1);

    vec3 baseColor = mix(
      mix(color1, color2, sin(noise1 * 3.0 + uTime * 0.2) * 0.5 + 0.5),
      mix(color3, color4, cos(noise2 * 2.0 - uTime * 0.3) * 0.5 + 0.5),
      sin(noise3 + uTime * 0.1) * 0.5 + 0.5
    );

    float glow = smoothstep(0.2, 0.8, noise1 * noise2 * noise3);
    float vignette = smoothstep(0.0, 0.7, length(uv - 0.5));
    baseColor += glow * 0.3 * (1.0 - vignette);
    
    float sparkle = pow(max(sin(noise1 * 20.0 + uTime), 0.0), 20.0);
    baseColor += sparkle * 0.2;

    gl_FragColor = vec4(baseColor, 1.0);
  }
`;

export function GradientShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const timeRef = useRef(0);
  const { theme } = useTheme();

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
        uDarkMode: { value: theme === 'dark' }
      },
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = () => {
      if (!renderer) return;
      
      timeRef.current += 0.002;
      material.uniforms.uTime.value = timeRef.current;
      material.uniforms.uDarkMode.value = theme === 'dark';
      
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
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ mixBlendMode: 'plus-lighter' }}
    />
  );
}

