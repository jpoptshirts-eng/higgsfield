export function ScrollIndicator({ visible = true }: { visible?: boolean }) {
  if (!visible) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 md:block"
    >
      <div className="h-16 w-px border-l border-dashed border-white/30" />
    </div>
  );
}
