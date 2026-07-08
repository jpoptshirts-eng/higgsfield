export function Logo({ className = "h-8 w-8 md:h-10 md:w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <rect x="9" y="6" width="3.5" height="28" fill="currentColor" />
      <rect x="27.5" y="6" width="3.5" height="28" fill="currentColor" />
      <rect x="9" y="6" width="22" height="3.5" fill="currentColor" />
    </svg>
  );
}
