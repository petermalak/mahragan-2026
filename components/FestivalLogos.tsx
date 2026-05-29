import Image from "next/image";
import { LOGOS } from "@/lib/festival";

const SIZES = {
  sm: { box: 44, image: 40 },
  md: { box: 64, image: 58 },
  lg: { box: 96, image: 88 },
  xl: { box: 120, image: 112 },
} as const;

type LogoSize = keyof typeof SIZES;

interface FestivalLogosProps {
  size?: LogoSize;
  className?: string;
  showLabels?: boolean;
}

export function FestivalLogos({
  size = "md",
  className = "",
  showLabels = false,
}: FestivalLogosProps) {
  const { box, image } = SIZES[size];

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-4 ${className}`}
    >
      <figure className="flex flex-col items-center gap-1.5">
        <div
          className="logo-frame"
          style={{ width: box, height: box }}
        >
          <Image
            src={LOGOS.mahragan}
            alt={LOGOS.mahraganAlt}
            width={image}
            height={image}
            className="h-auto w-auto object-contain"
            priority
          />
        </div>
        {showLabels ? (
          <figcaption className="max-w-[9rem] text-center text-[10px] leading-tight text-[var(--festival-royal-blue)]">
            {LOGOS.mahraganAlt}
          </figcaption>
        ) : null}
      </figure>

      <figure className="flex flex-col items-center gap-1.5">
        <div
          className="logo-frame"
          style={{ width: box, height: box }}
        >
          <Image
            src={LOGOS.church}
            alt={LOGOS.churchAlt}
            width={image}
            height={image}
            className="h-auto w-auto object-contain"
            priority
          />
        </div>
        {showLabels ? (
          <figcaption className="max-w-[9rem] text-center text-[10px] leading-tight text-[var(--festival-maroon)]">
            {LOGOS.churchAlt}
          </figcaption>
        ) : null}
      </figure>
    </div>
  );
}
