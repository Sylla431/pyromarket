import { resine } from "@/lib/resines";

// Signature visuelle : le triangle d'identification des résines.
export function ResinBadge({
  code,
  size = "md",
  className = "text-accent",
}: {
  code: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const r = resine(code);
  const dims = { sm: 32, md: 44, lg: 64 }[size];
  const label = { sm: "text-[9px]", md: "text-[10px]", lg: "text-xs" }[size];

  return (
    <span
      className={`inline-flex shrink-0 flex-col items-center gap-0.5 ${className}`}
      title={`${r.sigle} — ${r.nom}`}
    >
      <svg width={dims} height={dims * 0.88} viewBox="0 0 50 44" aria-hidden="true">
        <path
          d="M25 3 L47 41 L3 41 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeDasharray="30 6"
        />
        <text
          x="25"
          y="34"
          textAnchor="middle"
          fill="currentColor"
          fontSize="17"
          fontWeight="700"
          fontFamily="var(--font-geist-mono)"
        >
          {r.code}
        </text>
      </svg>
      <span className={`font-mono font-semibold uppercase tracking-wide ${label}`}>
        {r.sigle}
      </span>
    </span>
  );
}
