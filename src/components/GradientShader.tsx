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

  void main() {
    vec2 uv = vUv;
    
    vec3 color1 = vec3(0.98, 0.85, 0.7); // Warm peach
    vec3 color2 = vec3(0.85, 0.95, 1.0); // Light blue
    vec3 color3 = vec3(1.0, 0.85, 0.95); // Light pink
    
    float noise = sin(uv.x * 10.0 + uTime) * sin(uv.y * 10.0 + uTime) * 0.5 + 0.5;
    
    vec3 color = mix(
      mix(color1, color2, sin(uTime * 0.5) * 0.5 + 0.5),
      color3,
      sin(noise + uTime) * 0.5 + 0.5
    );
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function GradientShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
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
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = () => {
      if (!renderer) return;
      
      timeRef.current += 0.005;
      material.uniforms.uTime.value = timeRef.current;
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (!canvas || !renderer) return;
      
      const { clientWidth, clientHeight } = canvas;
      renderer.setSize(clientWidth, clientHeight, false);
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
      style={{ mixBlendMode: 'screen' }}
    />
  );
}