/** Full-viewport film grain. Sits above everything, touches nothing. */
export default function Grain() {
  return (
    <div
      aria-hidden
      className="grain pointer-events-none fixed inset-0 z-50 opacity-[0.5]"
    />
  );
}
