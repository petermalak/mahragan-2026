import type { ReactNode } from "react";

export const TOWNSHIP = {
  skyTop: "#7EC8E3",
  skyBottom: "#B8E6F5",
  grassLight: "#72C954",
  grassDark: "#4FA838",
  path: "#D4A574",
  pathDark: "#B8894F",
  soil: "#9B7335",
  soilDark: "#7A5928",
  wheat: "#F5D547",
  wheatDark: "#E8B923",
  corn: "#84CC16",
  tree: "#3D9B40",
  treeDark: "#2D7A30",
  cloud: "#FFFFFF",
  water: "#5BC0EB",
} as const;

export function isoToScreen(
  col: number,
  row: number,
  originX: number,
  originY: number,
  tileW = 42,
  tileH = 21,
) {
  return {
    x: originX + (col - row) * (tileW / 2),
    y: originY + (col + row) * (tileH / 2),
  };
}

export function isoDepth(col: number, row: number) {
  return col + row;
}

interface IsoTileProps {
  x: number;
  y: number;
  w?: number;
  h?: number;
  fill?: string;
  stroke?: string;
}

export function IsoGrassTile({
  x,
  y,
  w = 44,
  h = 24,
  fill = TOWNSHIP.grassLight,
  stroke = TOWNSHIP.grassDark,
}: IsoTileProps) {
  const hw = w / 2;
  const hh = h / 2;
  return (
    <polygon
      points={`${x},${y - hh} ${x + hw},${y} ${x},${y + hh} ${x - hw},${y}`}
      fill={fill}
      stroke={stroke}
      strokeWidth="1"
    />
  );
}

export function IsoPathTile({ x, y }: { x: number; y: number }) {
  return <IsoGrassTile x={x} y={y} fill={TOWNSHIP.path} stroke={TOWNSHIP.pathDark} />;
}

interface IsoHouseProps {
  x: number;
  y: number;
  roof: string;
  wall?: string;
}

export function IsoHouse({
  x,
  y,
  roof,
  wall = "#FFF6E8",
}: IsoHouseProps) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* shadow */}
      <ellipse cx="0" cy="18" rx="22" ry="7" fill="#00000022" />
      {/* left wall */}
      <polygon points="-18,0 -18,22 0,32 0,10" fill="#E8DCC8" />
      {/* right wall */}
      <polygon points="0,10 0,32 18,22 18,0" fill={wall} />
      {/* roof left */}
      <polygon points="-20,2 0,10 0,-6 -12,-14" fill={roof} />
      {/* roof right */}
      <polygon points="0,10 20,2 12,-14 0,-6" fill={roof} style={{ filter: "brightness(1.08)" }} />
      {/* door */}
      <rect x="-5" y="14" width="10" height="14" rx="1" fill="#8B5E3C" />
      {/* window */}
      <rect x="8" y="14" width="7" height="7" rx="1" fill="#87CEEB" stroke="#5BA3C6" strokeWidth="0.8" />
      {/* chimney */}
      <rect x="10" y="-10" width="5" height="10" fill="#C45C4A" />
      <rect x="9" y="-12" width="7" height="3" fill="#A04838" />
    </g>
  );
}

interface IsoBarnProps {
  x: number;
  y: number;
  roof: string;
}

export function IsoBarn({ x, y, roof }: IsoBarnProps) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="22" rx="28" ry="8" fill="#00000022" />
      <polygon points="-24,4 -24,28 0,40 0,16" fill="#C0392B" />
      <polygon points="0,16 0,40 24,28 24,4" fill="#E74C3C" />
      <polygon points="-26,6 0,16 0,-2 -16,-12" fill={roof} />
      <polygon points="0,16 26,6 16,-12 0,-2" fill={roof} style={{ filter: "brightness(1.1)" }} />
      <polygon points="-8,28 0,34 8,28 0,22" fill="#FFF" opacity="0.9" />
    </g>
  );
}

interface IsoFarmPlotProps {
  x: number;
  y: number;
  cropLevel: number;
  uid: string;
}

export function IsoFarmPlot({ x, y, cropLevel, uid }: IsoFarmPlotProps) {
  const rows = Math.min(4, Math.max(1, Math.ceil(cropLevel / 3)));
  return (
    <g transform={`translate(${x}, ${y})`}>
      <polygon points="-22,-4 0,8 22,-4 0,-16" fill={TOWNSHIP.soil} stroke={TOWNSHIP.soilDark} strokeWidth="1" />
      <polygon points="-20,-2 0,6 20,-2 0,-14" fill={TOWNSHIP.soilDark} opacity="0.35" />
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: 5 }).map((__, c) => {
          const px = -16 + c * 8;
          const py = -6 + r * 4;
          const tall = cropLevel > 5;
          return (
            <g key={`${uid}-c-${r}-${c}`}>
              <line
                x1={px}
                y1={py + 6}
                x2={px}
                y2={py + (tall ? 0 : 2)}
                stroke={TOWNSHIP.corn}
                strokeWidth="1.5"
              />
              <circle
                cx={px}
                cy={py + (tall ? -1 : 1)}
                r={tall ? 2.5 : 1.8}
                fill={tall ? TOWNSHIP.wheat : TOWNSHIP.corn}
              />
            </g>
          );
        }),
      )}
      {/* fence posts */}
      <line x1="-22" y1="-4" x2="-22" y2="6" stroke="#D4A574" strokeWidth="2" />
      <line x1="22" y1="-4" x2="22" y2="6" stroke="#D4A574" strokeWidth="2" />
    </g>
  );
}

interface IsoMarketStallProps {
  x: number;
  y: number;
  active: boolean;
  accent: string;
  uid: string;
}

export function IsoMarketStall({ x, y, active, accent, uid }: IsoMarketStallProps) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="16" rx="20" ry="6" fill="#00000022" />
      {/* counter */}
      <polygon points="-18,4 -18,16 0,24 0,12" fill="#A67C52" />
      <polygon points="0,12 0,24 18,16 18,4" fill="#C49A6C" />
      {/* awning */}
      <polygon points="-20,2 0,10 20,2 0,-8" fill={accent} />
      <polygon points="-20,2 0,10 0,-8 -10,-12" fill={accent} style={{ filter: "brightness(0.9)" }} />
      {/* stripes */}
      {[-12, -4, 4, 12].map((sx) => (
        <line
          key={`${uid}-s-${sx}`}
          x1={sx - 3}
          y1={-6}
          x2={sx + 3}
          y2={2}
          stroke="#fff"
          strokeWidth="2"
          opacity="0.35"
        />
      ))}
      {/* crates */}
      <rect x="-14" y="8" width="8" height="6" rx="1" fill="#8B6914" />
      <rect x="-4" y="10" width="8" height="6" rx="1" fill="#A67C52" />
      {active && (
        <>
          <circle cx="14" cy="6" r="3" fill="#FFD700" />
          <text x="14" y="7.5" textAnchor="middle" fontSize="4" fill="#8B6914">
            $
          </text>
        </>
      )}
    </g>
  );
}

export function IsoTree({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-2" y="0" width="4" height="10" fill="#8B5E3C" />
      <circle cx="0" cy="-4" r="10" fill={TOWNSHIP.tree} />
      <circle cx="-4" cy="-6" r="7" fill={TOWNSHIP.treeDark} opacity="0.5" />
      <circle cx="4" cy="-2" r="6" fill={TOWNSHIP.tree} style={{ filter: "brightness(1.15)" }} />
    </g>
  );
}

export function IsoWindmill({
  x,
  y,
  children,
}: {
  x: number;
  y: number;
  children?: ReactNode;
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <polygon points="-8,8 -8,24 0,30 0,14" fill="#E8DCC8" />
      <polygon points="0,14 0,30 8,24 8,8" fill="#FFF6E8" />
      <rect x="-2" y="-2" width="4" height="16" fill="#8B5E3C" />
      {children}
    </g>
  );
}

export function IsoWell({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="8" rx="12" ry="5" fill={TOWNSHIP.water} />
      <ellipse cx="0" cy="6" rx="10" ry="4" fill="#4AB8E8" />
      <rect x="-10" y="-8" width="3" height="16" fill="#8B5E3C" />
      <rect x="7" y="-8" width="3" height="16" fill="#A67C52" />
      <rect x="-10" y="-10" width="20" height="3" rx="1" fill="#8B5E3C" />
    </g>
  );
}

export function IsoGroundPlate({ children }: { children: ReactNode }) {
  return <g>{children}</g>;
}
