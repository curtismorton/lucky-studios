type SlateProps = {
  scene: string;
  title: string;
  className?: string;
};

/**
 * Section slate — the clapperboard line that opens every scene.
 * "SCENE 03 — THE SYSTEM" with a tally tick and a hairline rule.
 */
export default function Slate({ scene, title, className = "" }: SlateProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="h-2 w-2 shrink-0 bg-tally" aria-hidden />
      <span className="tc-label whitespace-nowrap text-bone/60">
        {scene}
        <span className="mx-2 text-bone/30">—</span>
        <span className="text-bone">{title}</span>
      </span>
      <span className="h-px grow bg-bone/15" aria-hidden />
    </div>
  );
}
