"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  IsoBarn,
  IsoFarmPlot,
  IsoGrassTile,
  IsoHouse,
  IsoMarketStall,
  IsoPathTile,
  IsoTree,
  IsoWell,
  IsoWindmill,
  TOWNSHIP,
  isoDepth,
  isoToScreen,
} from "@/components/township/graphics";

interface VillageSceneProps {
  houses: number;
  markets: number;
  landFixed: number;
  crops: number;
  tradeVolume: number;
  primary: string;
  secondary: string;
  accent: string;
}

function clampVisual(count: number, max: number): number {
  return Math.min(max, Math.max(0, count));
}

const ORIGIN = { x: 260, y: 118 };
const TILE_W = 42;
const TILE_H = 21;

type PlacedItem = {
  id: string;
  col: number;
  row: number;
  kind: "house" | "farm" | "market" | "tree" | "barn" | "well" | "windmill";
  cropLevel?: number;
  marketActive?: boolean;
};

function buildSceneItems(
  houseCount: number,
  marketCount: number,
  landCount: number,
  cropCount: number,
  marketActive: boolean,
): PlacedItem[] {
  const items: PlacedItem[] = [];

  const houseSlots: [number, number][] = [
    [1, 1],
    [2, 1],
    [3, 1],
    [1, 2],
    [2, 2],
    [3, 2],
    [4, 1],
    [4, 2],
  ];
  houseSlots.slice(0, houseCount).forEach(([col, row], i) => {
    items.push({ id: `house-${i}`, col, row, kind: "house" });
  });

  const farmSlots: [number, number][] = [
    [-2, 2],
    [-2, 3],
    [-1, 3],
    [-2, 4],
    [-1, 4],
    [-3, 3],
  ];
  farmSlots.slice(0, landCount).forEach(([col, row], i) => {
    items.push({
      id: `farm-${i}`,
      col,
      row,
      kind: "farm",
      cropLevel: Math.max(1, Math.ceil(cropCount / Math.max(landCount, 1))),
    });
  });

  if (landCount >= 3) {
    items.push({ id: "barn", col: -3, row: 4, kind: "barn" });
  }

  const marketSlots: [number, number][] = [
    [5, 2],
    [5, 3],
    [6, 2],
    [6, 3],
    [5, 4],
  ];
  marketSlots.slice(0, marketCount).forEach(([col, row], i) => {
    items.push({
      id: `market-${i}`,
      col,
      row,
      kind: "market",
      marketActive,
    });
  });

  items.push({ id: "well", col: 4, row: 3, kind: "well" });
  items.push({ id: "tree-1", col: 0, row: 0, kind: "tree" });
  items.push({ id: "tree-2", col: 4, row: 0, kind: "tree" });
  items.push({ id: "tree-3", col: -1, row: 1, kind: "tree" });

  if (cropCount >= 12) {
    items.push({ id: "windmill", col: -3, row: 2, kind: "windmill" });
  }

  return items.sort((a, b) => isoDepth(a.col, a.row) - isoDepth(b.col, b.row));
}

function SceneItem({
  item,
  roof,
  accent,
  reduceMotion,
  index,
}: {
  item: PlacedItem;
  roof: string;
  accent: string;
  reduceMotion: boolean | null;
  index: number;
}) {
  const { x, y } = isoToScreen(
    item.col,
    item.row,
    ORIGIN.x,
    ORIGIN.y,
    TILE_W,
    TILE_H,
  );

  const content = (() => {
    switch (item.kind) {
      case "house":
        return <IsoHouse x={0} y={0} roof={roof} />;
      case "farm":
        return (
          <IsoFarmPlot
            x={0}
            y={0}
            cropLevel={item.cropLevel ?? 1}
            uid={item.id}
          />
        );
      case "market":
        return (
          <IsoMarketStall
            x={0}
            y={0}
            active={item.marketActive ?? false}
            accent={accent}
            uid={item.id}
          />
        );
      case "tree":
        return <IsoTree x={0} y={0} />;
      case "barn":
        return <IsoBarn x={0} y={0} roof={roof} />;
      case "well":
        return <IsoWell x={0} y={0} />;
      case "windmill":
        return (
          <IsoWindmill x={0} y={0}>
            {!reduceMotion ? (
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "0px -8px" }}
              >
                <line x1="0" y1="-8" x2="0" y2="-22" stroke="#FFF" strokeWidth="2.5" />
                <line x1="0" y1="-8" x2="14" y2="-2" stroke="#FFF" strokeWidth="2.5" />
                <line x1="0" y1="-8" x2="-14" y2="-2" stroke="#FFF" strokeWidth="2.5" />
                <line x1="0" y1="-8" x2="0" y2="6" stroke="#FFF" strokeWidth="2.5" />
              </motion.g>
            ) : (
              <g>
                <line x1="0" y1="-8" x2="0" y2="-22" stroke="#FFF" strokeWidth="2.5" />
                <line x1="0" y1="-8" x2="14" y2="-2" stroke="#FFF" strokeWidth="2.5" />
                <line x1="0" y1="-8" x2="-14" y2="-2" stroke="#FFF" strokeWidth="2.5" />
                <line x1="0" y1="-8" x2="0" y2="6" stroke="#FFF" strokeWidth="2.5" />
              </g>
            )}
          </IsoWindmill>
        );
      default:
        return null;
    }
  })();

  return (
    <motion.g
      initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.06,
        type: "spring",
        stiffness: 260,
        damping: 22,
      }}
      transform={`translate(${x}, ${y})`}
    >
      {content}
    </motion.g>
  );
}

export function VillageScene({
  houses,
  markets,
  landFixed,
  crops,
  tradeVolume,
  primary,
  secondary,
  accent,
}: VillageSceneProps) {
  const reduceMotion = useReducedMotion();
  const houseCount = clampVisual(houses, 8);
  const marketCount = clampVisual(markets, 5);
  const landCount = clampVisual(landFixed, 6);
  const cropCount = clampVisual(crops, 20);
  const marketActive = tradeVolume >= 300;

  const roof = primary;
  const items = buildSceneItems(
    houseCount,
    marketCount,
    landCount,
    cropCount,
    marketActive,
  );

  const groundTiles: [number, number][] = [];
  for (let c = -3; c <= 6; c++) {
    for (let r = 0; r <= 5; r++) {
      groundTiles.push([c, r]);
    }
  }
  groundTiles.sort(
    (a, b) => isoDepth(a[0], a[1]) - isoDepth(b[0], b[1]),
  );

  const pathTiles = new Set([
    "2,3",
    "3,3",
    "4,3",
    "3,2",
    "4,2",
    "5,2",
  ]);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border-2 border-amber-200/20 bg-gradient-to-b from-sky-300/30 to-green-400/20 p-3 shadow-inner backdrop-blur-sm md:p-4"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-2 flex items-center justify-between px-1">
        <p className="text-sm font-bold text-amber-100 drop-shadow">
          🏘️ قرية Township
        </p>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
          style={{
            background: marketActive ? `${accent}55` : "rgba(0,0,0,0.25)",
            color: marketActive ? "#fff" : "rgba(255,255,255,0.7)",
          }}
        >
          {marketActive ? "🛒 السوق مزدحم" : "🌱 القرية تنمو"}
        </span>
      </div>

      <svg
        viewBox="0 0 520 300"
        className="mx-auto w-full max-w-3xl"
        role="img"
        aria-label="مشهد قرية Township"
      >
        <defs>
          <linearGradient id="tsSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={TOWNSHIP.skyTop} />
            <stop offset="100%" stopColor={TOWNSHIP.skyBottom} />
          </linearGradient>
          <linearGradient id="tsHill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8BCF63" />
            <stop offset="100%" stopColor="#5FA842" />
          </linearGradient>
          <filter id="tsSoftShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
          </filter>
        </defs>

        <rect width="520" height="300" fill="url(#tsSky)" rx="14" />

        {/* distant hills */}
        <ellipse cx="120" cy="58" rx="90" ry="28" fill="url(#tsHill)" opacity="0.55" />
        <ellipse cx="400" cy="52" rx="110" ry="32" fill="url(#tsHill)" opacity="0.45" />

        {/* sun */}
        <motion.circle
          cx="440"
          cy="42"
          r="26"
          fill="#FFE066"
          stroke="#FFD043"
          strokeWidth="3"
          animate={reduceMotion ? {} : { scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        {!reduceMotion &&
          [0, 45, 90, 135].map((deg) => (
            <motion.line
              key={deg}
              x1="440"
              y1="42"
              x2={440 + Math.cos((deg * Math.PI) / 180) * 38}
              y2={42 + Math.sin((deg * Math.PI) / 180) * 38}
              stroke="#FFE066"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.5"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: deg * 0.01 }}
            />
          ))}

        {/* clouds */}
        {!reduceMotion && (
          <>
            <motion.g
              animate={{ x: [0, 18, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            >
              <ellipse cx="90" cy="38" rx="28" ry="12" fill={TOWNSHIP.cloud} opacity="0.95" />
              <ellipse cx="110" cy="34" rx="20" ry="10" fill={TOWNSHIP.cloud} />
              <ellipse cx="70" cy="36" rx="16" ry="9" fill={TOWNSHIP.cloud} />
            </motion.g>
            <motion.g
              animate={{ x: [0, -22, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            >
              <ellipse cx="300" cy="28" rx="32" ry="13" fill={TOWNSHIP.cloud} opacity="0.9" />
              <ellipse cx="325" cy="24" rx="22" ry="11" fill={TOWNSHIP.cloud} />
            </motion.g>
          </>
        )}

        {/* isometric ground tiles */}
        <g filter="url(#tsSoftShadow)">
          {groundTiles.map(([col, row]) => {
            const { x, y } = isoToScreen(
              col,
              row,
              ORIGIN.x,
              ORIGIN.y,
              TILE_W,
              TILE_H,
            );
            const isPath = pathTiles.has(`${col},${row}`);
            const altGrass =
              (col + row) % 2 === 0 ? TOWNSHIP.grassLight : TOWNSHIP.grassDark;
            return isPath ? (
              <IsoPathTile key={`t-${col}-${row}`} x={x} y={y} />
            ) : (
              <IsoGrassTile
                key={`t-${col}-${row}`}
                x={x}
                y={y}
                fill={altGrass}
                stroke={TOWNSHIP.grassDark}
              />
            );
          })}
        </g>

        {/* buildings & props (depth sorted) */}
        <g>
          {items.map((item, index) => (
            <SceneItem
              key={item.id}
              item={item}
              roof={roof}
              accent={secondary}
              reduceMotion={reduceMotion}
              index={index}
            />
          ))}
        </g>

        {/* trade coins floating at market */}
        {marketActive &&
          !reduceMotion &&
          [0, 1, 2].map((i) => (
            <motion.text
              key={`coin-${i}`}
              x={380 + i * 12}
              y={120 - i * 8}
              fontSize="12"
              animate={{ y: [120, 100, 120], opacity: [1, 0.6, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              🪙
            </motion.text>
          ))}

        {/* legend bar */}
        <rect x="16" y="268" width="488" height="24" rx="8" fill="#00000033" />
        <text x="32" y="284" fill="#FFF" fontSize="10" fontWeight="600">
          🏠 {houseCount} · 🛒 {marketCount} · 🌾 {landCount} · 🌽 {cropCount}
        </text>
        <text x="488" y="284" textAnchor="end" fill={accent} fontSize="10" fontWeight="600">
          Geldr Town ☀️
        </text>
      </svg>
    </motion.div>
  );
}
