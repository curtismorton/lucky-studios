type RecBadgeProps = {
  label?: string;
  className?: string;
};

/** Blinking tally light. The brand reduced to one pixel. */
export default function RecBadge({ label = "REC", className = "" }: RecBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className="h-2.5 w-2.5 rounded-full bg-tally animate-rec-blink motion-reduce:animate-none"
        aria-hidden
      />
      <span className="tc-label text-bone/70">{label}</span>
    </span>
  );
}
