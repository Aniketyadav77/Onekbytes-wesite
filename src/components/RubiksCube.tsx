'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Individual cube piece component - pixel perfect black cube
function CubePiece({ 
  position, 
  rotation = [0, 0, 0],
  animationPhase = 0,
  isCorner = false,
  isEdge = false,
  isSolving = false
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  animationPhase?: number;
  isCorner?: boolean;
  isEdge?: boolean;
  isSolving?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Premium black material with enhanced visibility
  const blackMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#0d0d0d',
    metalness: 0.95,
    roughness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    reflectivity: 0.95,
    envMapIntensity: 2.0,
    transparent: false,
    emissive: '#111111',
    emissiveIntensity: 0.05
  }), []);

  // Glowing edge material for definition
  const edgeMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#444444',
    metalness: 0.8,
    roughness: 0.2,
    clearcoat: 0.8,
    emissive: '#222222',
    emissiveIntensity: 0.1,
    transparent: true,
    opacity: 0.9
  }), []);

  // Animate piece during solving phase - more precise movements
  useFrame((state) => {
    if (meshRef.current && isSolving) {
      const time = state.clock.getElapsedTime();
      const solvingOffset = Math.sin(time * 2.5 + animationPhase) * 0.08; // Smaller, more precise movements
      const rotationSpeed = 0.02;
      
      meshRef.current.position.x = position[0] + solvingOffset * (isCorner ? 0.8 : isEdge ? 0.6 : 0.4);
      meshRef.current.position.y = position[1] + solvingOffset * (isCorner ? 0.6 : isEdge ? 0.8 : 0.5);
      meshRef.current.position.z = position[2] + solvingOffset * (isCorner ? 0.7 : isEdge ? 0.5 : 0.6);
      
      // Precise rotation during solving
      meshRef.current.rotation.x += rotationSpeed * (isCorner ? 1.5 : 1.2);
      meshRef.current.rotation.y += rotationSpeed * (isEdge ? 1.5 : 1.2);
      meshRef.current.rotation.z += rotationSpeed * 1.0;
    } else if (meshRef.current) {
      // Smooth return to exact position
      const returnSpeed = 0.08;
      meshRef.current.position.x += (position[0] - meshRef.current.position.x) * returnSpeed;
      meshRef.current.position.y += (position[1] - meshRef.current.position.y) * returnSpeed;
      meshRef.current.position.z += (position[2] - meshRef.current.position.z) * returnSpeed;
    }

    // Subtle hover effect
    if (meshRef.current && hovered) {
      meshRef.current.scale.setScalar(1.02);
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1.0);
    }
  });

  return (
    <group>
      {/* Main cube piece - pixel perfect with glow effect */}
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.99, 0.99, 0.99]} />
        <primitive object={blackMaterial} attach="material" />
      </mesh>
      
      {/* Glowing edges for definition and visibility */}
      <mesh
        position={position}
        rotation={rotation}
      >
        <boxGeometry args={[1.01, 1.01, 1.01]} />
        <primitive object={edgeMaterial} attach="material" />
      </mesh>

      {/* Corner accent lights for extra visibility */}
      {isCorner && (
        <pointLight 
          position={[position[0] * 1.2, position[1] * 1.2, position[2] * 1.2]}
          intensity={0.3}
          color="#4488ff"
          distance={2}
          decay={2}
        />
      )}
    </group>
  );
}

// Main Rubik's Cube component
export default function RubiksCube() {
  const groupRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [solvingPhase, setSolvingPhase] = useState(0);
  const [rotationSpeed, setRotationSpeed] = useState(0.3);

  // Auto rotation with precise timing
  useFrame((state, delta) => {
    if (groupRef.current && !isDragging) {
      groupRef.current.rotation.x += delta * rotationSpeed * 0.6;
      groupRef.current.rotation.y += delta * rotationSpeed * 0.8;
      groupRef.current.rotation.z += delta * rotationSpeed * 0.3;
    }

    // Solving phases with precise timing
    const time = state.clock.getElapsedTime();
    const newPhase = Math.floor(time / 3.5) % 4; // 4 phases, 3.5 seconds each
    setSolvingPhase(newPhase);

    // Vary rotation speed during solving for dramatic effect
    const targetSpeed = newPhase === 1 || newPhase === 3 ? 0.15 : 0.25;
    setRotationSpeed(prev => prev + (targetSpeed - prev) * 0.03);
  });

  // Create perfect 3x3x3 cube structure with exact positioning
  const cubes = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        // Skip the center piece to create hollow effect
        if (x === 0 && y === 0 && z === 0) continue;

        // Determine piece type for animation
        const isCorner = Math.abs(x) + Math.abs(y) + Math.abs(z) === 3;
        const isEdge = Math.abs(x) + Math.abs(y) + Math.abs(z) === 2;
        
        // Create animation phase based on position
        const animationPhase = (x + 1) * 9 + (y + 1) * 3 + (z + 1);
        
        // Determine if this piece is currently "solving"
        const isSolving = (animationPhase + solvingPhase * 2) % 6 < 2;

        cubes.push(
          <CubePiece
            key={`${x}-${y}-${z}`}
            position={[x * 1.0, y * 1.0, z * 1.0]} // Exact 1 unit spacing for pixel perfect alignment
            animationPhase={animationPhase}
            isCorner={isCorner}
            isEdge={isEdge}
            isSolving={isSolving}
          />
        );
      }
    }
  }

  return (
    <>
      {/* Enhanced lighting setup for dark blue background */}
      <ambientLight intensity={0.4} color="#4488cc" />
      
      {/* Primary directional lights for cube definition */}
      <directionalLight 
        position={[15, 15, 10]} 
        intensity={2.2} 
        color="#ffffff"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={40}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0003}
      />
      
      {/* Secondary directional light for fill */}
      <directionalLight 
        position={[-12, 8, -6]} 
        intensity={1.2} 
        color="#88ccff"
      />
      <directionalLight 
        position={[6, -12, 15]} 
        intensity={0.8} 
        color="#ffcc88"
      />
      
      {/* Strategic point lights for reflections */}
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-8, -8, -8]} intensity={1.0} color="#6699ff" />
      <pointLight position={[0, 15, 0]} intensity={0.8} color="#ffdd99" />
      <pointLight position={[12, 0, 12]} intensity={0.6} color="#cc88ff" />
      
      {/* Rim lighting for cube edges */}
      <pointLight position={[20, 0, 0]} intensity={0.5} color="#ffffff" />
      <pointLight position={[-20, 0, 0]} intensity={0.5} color="#ffffff" />
      <pointLight position={[0, 20, 0]} intensity={0.5} color="#ffffff" />
      <pointLight position={[0, -20, 0]} intensity={0.5} color="#ffffff" />

      <group
        ref={groupRef}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
        onPointerLeave={() => setIsDragging(false)}
        scale={1.4} // Larger for better visibility
      >
        {cubes}
        
        {/* Enhanced wireframe outline with glow */}
        <mesh>
          <boxGeometry args={[3.05, 3.05, 3.05]} />
          <meshBasicMaterial 
            color="#4488ff" 
            wireframe 
            transparent 
            opacity={0.2} 
          />
        </mesh>

        {/* Inner structure wireframe */}
        <mesh>
          <boxGeometry args={[2.98, 2.98, 2.98]} />
          <meshBasicMaterial 
            color="#888888" 
            wireframe 
            transparent 
            opacity={0.1} 
          />
        </mesh>

        {/* Atmospheric particles during solving */}
        {solvingPhase === 1 && Array.from({ length: 32 }).map((_, i) => {
          const angle = (i / 32) * Math.PI * 2;
          const radius = 4.2 + Math.sin(Date.now() * 0.001 + i) * 0.4;
          
          return (
            <mesh
              key={`particle-${i}`}
              position={[
                Math.cos(angle) * radius,
                Math.sin(Date.now() * 0.002 + i) * 2,
                Math.sin(angle) * radius
              ]}
            >
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial 
                color="#66aaff" 
                transparent 
                opacity={0.8} 
                emissive="#2244aa"
                emissiveIntensity={0.3}
              />
            </mesh>
          );
        })}

        {/* Energy field during solving */}
        {(solvingPhase === 1 || solvingPhase === 3) && (
          <mesh>
            <sphereGeometry args={[5.2, 20, 20]} />
            <meshBasicMaterial 
              color="#4488ff" 
              transparent 
              opacity={0.06}
              side={THREE.BackSide}
            />
          </mesh>
        )}

        {/* Success flash effect */}
        {solvingPhase === 3 && (
          <>
            <mesh>
              <sphereGeometry args={[4.8, 16, 16]} />
              <meshBasicMaterial 
                color="#ffffff" 
                transparent 
                opacity={0.12} 
              />
            </mesh>
            <pointLight 
              position={[0, 0, 0]}
              intensity={2.0}
              color="#ffffff"
              distance={8}
              decay={2}
            />
          </>
        )}
      </group>
    </>
  );
}
