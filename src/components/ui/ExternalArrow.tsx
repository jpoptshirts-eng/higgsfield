export function ExternalArrow({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`external-arrow inline-block ${className}`}>
      ↗
    </span>
  );
}
