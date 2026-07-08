export function ExternalArrow({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`inline-block text-accent ${className}`}>
      ↗
    </span>
  );
}
