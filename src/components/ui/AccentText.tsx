type AccentPart = { text: string; accent: boolean };

export function AccentText({
  parts,
  className = "",
}: {
  parts: readonly AccentPart[];
  className?: string;
}) {
  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.accent ? (
          <span key={index} className="text-accent">
            {part.text}
          </span>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </span>
  );
}
