import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { NEON_GREEN } from '../constants';

// Augment JSX namespace to include Three.js elements for R3F
declare global {
  namespace JSX {
    interface IntrinsicElements {
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      pointsMaterial: any;
      ambientLight: any;
    }
  }
}

const ParticleSystem = () => {
  const count = 5000;
  const mesh = useRef<THREE.Points>(null);
  const { pointer, viewport } = useThree();

  // Initialize particles with original positions (ox, oy, oz) and velocities
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Uniform spherical distribution approximation
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      // Cubic root for uniform volume density
      const r = 2.8 * Math.cbrt(Math.random()); 

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      temp.push({ 
        x, y, z, 
        ox: x, oy: y, oz: z, 
        vx: 0, vy: 0, vz: 0 
      });
    }
    return temp;
  }, []);

  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  const colors = useMemo(() => new Float32Array(count * 3), [count]);

  // Color initialization
  useMemo(() => {
    const c1 = new THREE.Color(NEON_GREEN);
    const c2 = new THREE.Color('#4B5563'); // Grey
    const c3 = new THREE.Color('#FFFFFF'); // White
    
    for (let i = 0; i < count; i++) {
      const r = Math.random();
      let c;
      if (r > 0.85) c = c1; // Neon accents
      else if (r > 0.6) c = c3; // White highlights
      else c = c2; // Base structure

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      
      positions[i * 3] = particles[i].x;
      positions[i * 3 + 1] = particles[i].y;
      positions[i * 3 + 2] = particles[i].z;
    }
  }, [particles, positions, colors]);

  useFrame((state) => {
    if (!mesh.current) return;

    // 1. Subtle, slow rotation of the entire system
    mesh.current.rotation.y += 0.001; 
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;

    // 2. Interaction Logic
    // Convert normalized pointer to world space approximate scaling
    const mouseX = (pointer.x * viewport.width) / 2;
    const mouseY = (pointer.y * viewport.height) / 2;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const p = particles[i];

      // Distance calculation in 2D projection (ignoring Z for "screen space" feel)
      // Note: We are comparing world-space particle coords with world-space mouse coords
      // Since the mesh rotates, p.x/p.y are rotating local coords if we accessed geometry directly,
      // but here we are modifying the buffer data which is in local space.
      // To effectively interact with the rotating mesh, we treat the interaction as a 
      // "volumetric field" that the mouse passes through.
      
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);
      
      const forceRadius = 2.5;

      if (dist < forceRadius) {
        const forceFactor = (1 - dist / forceRadius); 
        // Exponential falloff for "crisp" boundary
        const repulsion = Math.pow(forceFactor, 2) * 0.8;

        const angle = Math.atan2(dy, dx);
        
        // Dynamic Push (Dispersion)
        p.vx -= Math.cos(angle) * repulsion;
        p.vy -= Math.sin(angle) * repulsion;
        
        // Z-axis ripple (push back/forward)
        p.vz += repulsion * 0.5;

        // Add some chaotic noise for "electric" feel
        p.vx += (Math.random() - 0.5) * 0.05 * forceFactor;
        p.vy += (Math.random() - 0.5) * 0.05 * forceFactor;
      }

      // 3. Physics Update (Spring back to origin)
      const returnStrength = 0.015; // Lower value = slower, more floaty return
      const damping = 0.95; // Higher value = more drift/slide (fluidity)

      p.vx += (p.ox - p.x) * returnStrength;
      p.vy += (p.oy - p.y) * returnStrength;
      p.vz += (p.oz - p.z) * returnStrength;

      p.vx *= damping;
      p.vy *= damping;
      p.vz *= damping;

      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;

      positions[i3] = p.x;
      positions[i3 + 1] = p.y;
      positions[i3 + 2] = p.z;
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const NeuralCortex: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <ParticleSystem />
      </Canvas>
    </div>
  );
};

export default NeuralCortex;