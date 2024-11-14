export const vertexShader = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

export const fragmentShader = `
  precision mediump float;
  uniform float time;
  uniform vec2 resolution;

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    
    float t = time * 0.2;
    
    vec3 color1 = vec3(1.0, 0.8, 0.3); // Yellow
    vec3 color2 = vec3(0.9, 0.4, 0.4); // Pink
    vec3 color3 = vec3(0.4, 0.7, 0.9); // Blue
    
    float noise = sin(uv.x * 3.0 + t) * sin(uv.y * 2.0 - t) * 0.5 + 0.5;
    
    vec3 color = mix(
      mix(color1, color2, sin(t + uv.x) * 0.5 + 0.5),
      color3,
      sin(t + uv.y + noise) * 0.5 + 0.5
    );
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export class ShaderCanvas {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private timeLocation: WebGLUniformLocation | null;
  private resolutionLocation: WebGLUniformLocation | null;
  private startTime: number;
  private animationFrame: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext('webgl');
    if (!gl) throw new Error('WebGL not supported');
    this.gl = gl;
    this.program = this.createProgram();
    this.timeLocation = gl.getUniformLocation(this.program, 'time');
    this.resolutionLocation = gl.getUniformLocation(this.program, 'resolution');
    this.startTime = Date.now();
    this.animationFrame = 0;
    this.setupGeometry();
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private createShader(type: number, source: string): WebGLShader {
    const shader = this.gl.createShader(type);
    if (!shader) throw new Error('Failed to create shader');
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Error(this.gl.getShaderInfoLog(shader) || 'Shader compilation failed');
    }
    return shader;
  }

  private createProgram(): WebGLProgram {
    const program = this.gl.createProgram();
    if (!program) throw new Error('Failed to create program');
    
    const vertShader = this.createShader(this.gl.VERTEX_SHADER, vertexShader);
    const fragShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShader);
    
    this.gl.attachShader(program, vertShader);
    this.gl.attachShader(program, fragShader);
    this.gl.linkProgram(program);
    
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw new Error('Program link failed');
    }
    
    return program;
  }

  private setupGeometry() {
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
    
    const position = this.gl.getAttribLocation(this.program, 'position');
    this.gl.enableVertexAttribArray(position);
    this.gl.vertexAttribPointer(position, 2, this.gl.FLOAT, false, 0, 0);
  }

  private resize() {
    const dpr = window.devicePixelRatio || 1;
    const width = this.canvas.clientWidth * dpr;
    const height = this.canvas.clientHeight * dpr;
    
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.gl.viewport(0, 0, width, height);
    }
  }

  public start() {
    const render = () => {
      const time = (Date.now() - this.startTime) / 1000;
      
      this.gl.useProgram(this.program);
      if (this.timeLocation) this.gl.uniform1f(this.timeLocation, time);
      if (this.resolutionLocation) {
        this.gl.uniform2f(this.resolutionLocation, this.canvas.width, this.canvas.height);
      }
      
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
      this.animationFrame = requestAnimationFrame(render);
    };
    
    render();
  }

  public stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}