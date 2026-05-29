import { FESTIVAL } from "@/lib/festival";

interface ScriptureTaglineProps {
  className?: string;
  verseClassName?: string;
  refClassName?: string;
}

export function ScriptureTagline({
  className = "",
  verseClassName = "text-scripture font-semibold",
  refClassName = "text-[var(--festival-ink-muted)]",
}: ScriptureTaglineProps) {
  return (
    <p className={className}>
      <span className={verseClassName}>{FESTIVAL.tagline}</span>
      <span className={`mr-1.5 ${refClassName}`}> — {FESTIVAL.taglineRef}</span>
    </p>
  );
}
