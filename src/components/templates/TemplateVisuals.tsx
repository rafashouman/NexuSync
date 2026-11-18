import styles from "./TemplateVisuals.module.css";

export { styles as templateStyles };

/** Brand-colored line art: static markup, animated only with CSS. */
export function TemplateField({ variant = "orbit" }: { variant?: "orbit" | "rays" | "voxel" }) {
  return (
    <div className={styles.field} data-variant={variant} aria-hidden="true">
      <svg viewBox="0 0 600 600" fill="none">
        <g className={styles.fieldLines}>
          {Array.from({ length: 14 }, (_, i) => (
            variant === "voxel" ?
              <rect key={i} x={90 + i * 9} y={90 + i * 9} width={420 - i * 18} height={420 - i * 18} transform={`rotate(${i * 6} 300 300)`} /> :
            variant === "rays" ?
              <ellipse key={i} cx="300" cy="300" rx="245" ry={35 + i * 14} transform={`rotate(${i * 13} 300 300)`} /> :
              <ellipse key={i} cx="300" cy="300" rx="245" ry="100" transform={`rotate(${i * 13} 300 300)`} />
          ))}
        </g>
        <path d="M285 300h30m-15-15v30M65 65h22m-11-11v22M513 535h22m-11-11v22" />
      </svg>
    </div>
  );
}

export function TemplateTicker({ items }: { items: string[] }) {
  return (
    <div className={styles.ticker}>
      <div className={styles.tickerTrack}>
        {[0, 1].map(copy => (
          <div key={copy} aria-hidden={copy === 1 ? true : undefined}>
            {items.map(item => <span key={item}>{item}<b aria-hidden="true">✳</b></span>)}
          </div>
        ))}
      </div>
    </div>
  );
}
