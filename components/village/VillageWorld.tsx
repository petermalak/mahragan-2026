"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sky } from "@react-three/drei";
import type { Group } from "three";
import type { VillageVisualState } from "@/lib/villageVisual";

interface VillageWorldProps {
  visual: VillageVisualState;
  primary: string;
  secondary: string;
  accent: string;
  satisfaction: number;
  animate: boolean;
}

function House({
  built,
  position,
  primary,
  secondary,
}: {
  built: boolean;
  position: [number, number, number];
  primary: string;
  secondary: string;
}) {
  if (!built) {
    return (
      <group position={position}>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[1.1, 0.7, 1.1]} />
          <meshStandardMaterial color="#d4c4a8" transparent opacity={0.35} wireframe />
        </mesh>
      </group>
    );
  }

  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
        <boxGeometry args={[1.15, 1.1, 1.15]} />
        <meshStandardMaterial color="#fffdf8" roughness={0.85} />
      </mesh>
      <mesh castShadow position={[0, 1.35, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.92, 0.75, 4]} />
        <meshStandardMaterial color={secondary} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.35, 0.58]}>
        <boxGeometry args={[0.28, 0.45, 0.08]} />
        <meshStandardMaterial color={primary} />
      </mesh>
      <mesh position={[0.35, 0.75, 0.58]}>
        <boxGeometry args={[0.22, 0.22, 0.06]} />
        <meshStandardMaterial color="#e8f2fa" emissive="#a8c5e8" emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[-0.35, 0.75, 0.58]}>
        <boxGeometry args={[0.22, 0.22, 0.06]} />
        <meshStandardMaterial color="#e8f2fa" emissive="#a8c5e8" emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

function Market({
  visible,
  position,
  primary,
  secondary,
}: {
  visible: boolean;
  position: [number, number, number];
  primary: string;
  secondary: string;
}) {
  if (!visible) {
    return (
      <group position={position}>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1.6, 0.8, 1.2]} />
          <meshStandardMaterial color="#d4c4a8" transparent opacity={0.3} wireframe />
        </mesh>
      </group>
    );
  }

  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 0.65, 0]}>
        <boxGeometry args={[1.7, 1.3, 1.35]} />
        <meshStandardMaterial color="#fff8ee" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 1.55, 0]}>
        <boxGeometry args={[2.1, 0.18, 1.6]} />
        <meshStandardMaterial color={secondary} />
      </mesh>
      <mesh position={[0, 0.35, 0.68]}>
        <boxGeometry args={[0.45, 0.55, 0.1]} />
        <meshStandardMaterial color={primary} />
      </mesh>
    </group>
  );
}

function FieldPlot({
  reclaimed,
  hasCrop,
  position,
}: {
  reclaimed: boolean;
  hasCrop: boolean;
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[1.15, 1.15]} />
        <meshStandardMaterial
          color={reclaimed ? "#a8c988" : "#e8dcc4"}
          roughness={0.95}
        />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[1.15, 0.08, 1.15]} />
        <meshStandardMaterial color={reclaimed ? "#6b8f5a" : "#c4b8a4"} />
      </mesh>
      {hasCrop ? (
        <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.25}>
          <group position={[0, 0.2, 0]}>
            <mesh castShadow position={[0, 0.18, 0]}>
              <coneGeometry args={[0.12, 0.35, 6]} />
              <meshStandardMaterial color="#4a8f3a" />
            </mesh>
            <mesh castShadow position={[0.22, 0.12, 0.12]}>
              <coneGeometry args={[0.1, 0.28, 6]} />
              <meshStandardMaterial color="#5ea848" />
            </mesh>
            <mesh castShadow position={[-0.18, 0.14, -0.1]}>
              <coneGeometry args={[0.09, 0.25, 6]} />
              <meshStandardMaterial color="#3d7a30" />
            </mesh>
          </group>
        </Float>
      ) : null}
    </group>
  );
}

function TradeCart({
  progress,
  primary,
  animate,
}: {
  progress: number;
  primary: string;
  animate: boolean;
}) {
  const group = useRef<Group>(null);
  const startX = -7.5;
  const endX = 7.5;

  useFrame((state) => {
    if (!group.current) return;
    const baseX = startX + (progress / 100) * (endX - startX);
    const bounce = animate ? Math.sin(state.clock.elapsedTime * 3) * 0.03 : 0;
    group.current.position.x = baseX;
    group.current.position.y = 0.28 + bounce;
  });

  return (
    <group ref={group} position={[startX, 0.28, 4.2]}>
      <mesh castShadow position={[0, 0.22, 0]}>
        <boxGeometry args={[0.9, 0.45, 0.65]} />
        <meshStandardMaterial color={primary} roughness={0.6} />
      </mesh>
      <mesh castShadow position={[0, 0.52, 0]}>
        <boxGeometry args={[0.55, 0.35, 0.55]} />
        <meshStandardMaterial color="#d4af37" metalness={0.2} roughness={0.5} />
      </mesh>
      <mesh castShadow position={[-0.38, 0.08, 0.28]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 12]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh castShadow position={[0.38, 0.08, 0.28]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 12]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh castShadow position={[-0.38, 0.08, -0.28]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 12]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh castShadow position={[0.38, 0.08, -0.28]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 12]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
}

function DecorTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.12, 0.16, 0.7, 8]} />
        <meshStandardMaterial color="#6b4f3a" />
      </mesh>
      <mesh castShadow position={[0, 0.95, 0]}>
        <coneGeometry args={[0.55, 1.1, 8]} />
        <meshStandardMaterial color="#3d6b42" />
      </mesh>
    </group>
  );
}

export function VillageWorld({
  visual,
  primary,
  secondary,
  accent,
  satisfaction,
  animate,
}: VillageWorldProps) {
  const sunIntensity = 0.55 + (satisfaction / 100) * 0.65;
  const housePositions: [number, number, number][] = [
    [-2.8, 0, -1.2],
    [-0.9, 0, -1.5],
    [0.9, 0, -1.2],
    [2.8, 0, -1.5],
  ];

  const fieldPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 4; col++) {
        positions.push([-7 + col * 1.35, 0, 0.8 + row * 1.35]);
      }
    }
    return positions;
  }, []);

  return (
    <>
      <color attach="background" args={["#e8f2fa"]} />
      <fog attach="fog" args={["#e8f2fa", 18, 42]} />
      <Sky sunPosition={[8, 12, 4]} turbidity={6} rayleigh={1.2} mieCoefficient={0.005} />
      <ambientLight intensity={0.45 + satisfaction / 400} />
      <directionalLight
        castShadow
        position={[8, 14, 6]}
        intensity={sunIntensity}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      <hemisphereLight args={["#e8f2fa", "#8fbc8f", 0.35]} />

      <OrbitControls
        enablePan={false}
        minDistance={8}
        maxDistance={22}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 2.15}
        autoRotate={animate}
        autoRotateSpeed={0.35}
        target={[0, 0.5, 0]}
      />

      {/* Ground */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[16, 64]} />
        <meshStandardMaterial color="#9bc98a" roughness={1} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[5.5, 16, 64]} />
        <meshStandardMaterial color="#b8d9a0" roughness={1} />
      </mesh>

      {/* Village platform */}
      <mesh receiveShadow position={[0, 0.05, -1.2]}>
        <boxGeometry args={[8.5, 0.1, 3.2]} />
        <meshStandardMaterial color="#e8dcc4" roughness={0.95} />
      </mesh>

      {/* Farm platform */}
      <mesh receiveShadow position={[-5.2, 0.04, 1.5]}>
        <boxGeometry args={[6.2, 0.08, 3.4]} />
        <meshStandardMaterial color="#d4c4a8" roughness={0.95} />
      </mesh>

      {/* Road */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 4]}>
        <planeGeometry args={[18, 1.4]} />
        <meshStandardMaterial color="#c9b896" roughness={0.9} />
      </mesh>

      {fieldPositions.map((pos, i) => (
        <FieldPlot
          key={i}
          position={pos}
          reclaimed={i < visual.fieldPlotsReclaimed}
          hasCrop={i < visual.fieldPlotsWithCrops && i < visual.fieldPlotsReclaimed}
        />
      ))}

      {housePositions.map((pos, i) => (
        <House
          key={i}
          built={i < visual.housesBuilt}
          position={pos}
          primary={primary}
          secondary={secondary}
        />
      ))}

      <Market
        visible={visual.hasMarket}
        position={[4.8, 0, -1.3]}
        primary={primary}
        secondary={secondary}
      />

      <TradeCart progress={visual.tradeProgress} primary={primary} animate={animate} />

      <DecorTree position={[-9, 0, -3]} />
      <DecorTree position={[9, 0, -2.5]} />
      <DecorTree position={[7, 0, 2]} />
      <DecorTree position={[-8, 0, 3.5]} />

      {/* Satisfaction beacon */}
      <mesh position={[0, 2.8 + satisfaction / 80, -1.2]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.35 + satisfaction / 200}
        />
      </mesh>
    </>
  );
}
