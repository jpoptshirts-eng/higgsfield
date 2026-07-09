const SECTIONS = ["hero", "work", "approach", "results", "contact"] as const;

type SectionIndicatorProps = {
  activeSectionIndex: number;
  visible?: boolean;
};

export function SectionIndicator({
  activeSectionIndex,
  visible = true,
}: SectionIndicatorProps) {
  if (!visible) return null;

  const activeIndex = Math.max(
    0,
    Math.min(SECTIONS.length - 1, activeSectionIndex),
  );

  return (
    <div className="sectionProgressIndicator" aria-hidden="true">
      {SECTIONS.map((section, index) => (
        <span
          key={section}
          className={
            index === activeIndex
              ? "sectionProgressDash active"
              : "sectionProgressDash"
          }
        />
      ))}
    </div>
  );
}
