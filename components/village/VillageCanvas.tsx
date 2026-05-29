"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { VillageWorld } from "@/components/village/VillageWorld";
import { getVillageVisualState } from "@/lib/villageVisual";
import type { TeamWithMax } from "@/lib/types";

interface VillageCanvasProps {
  team: TeamWithMax;
  primary: string;
  secondary: string;
  accent: string;
  animate: boolean;
}

function SceneLoader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#e8dcc4" wireframe />
    </mesh>
  );
}

export default function VillageCanvas({
  team,
  primary,
  secondary,
  accent,
  animate,
}: VillageCanvasProps) {
  const visual = getVillageVisualState(team);

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [11, 9, 11], fov: 42, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={<SceneLoader />}>
        <VillageWorld
          visual={visual}
          primary={primary}
          secondary={secondary}
          accent={accent}
          satisfaction={team.satisfaction}
          animate={animate}
        />
      </Suspense>
    </Canvas>
  );
}
