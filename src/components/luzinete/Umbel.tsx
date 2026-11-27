/**
 * Ramo de erva-doce em traço: a flor é uma umbela, hastes que se abrem de um mesmo ponto.
 * Desenho gerado por cálculo, com valores arredondados para servidor e navegador baterem.
 */
const round = (value: number) => Math.round(value * 10) / 10;

/** Ângulo (graus, 0 = para cima) e comprimento de cada raio da umbela. */
const RAYS: [number, number][] = [
  [-68, 92], [-48, 112], [-30, 98], [-13, 122], [4, 104], [21, 126], [39, 100], [57, 110], [74, 84],
];

const tip = (x: number, y: number, angle: number, length: number) => {
  const rad = (angle * Math.PI) / 180;
  return [round(x + Math.sin(rad) * length), round(y - Math.cos(rad) * length)];
};

export function Umbel({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 280 360" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path pathLength={1} d="M122 356C138 300 148 232 140 152" />
        {RAYS.map(([angle, length]) => {
          const [x, y] = tip(140, 152, angle, length);
          const [cx, cy] = tip(140, 152, angle * 0.45, length * 0.55);
          return <path key={angle} pathLength={1} d={`M140 152Q${cx} ${cy} ${x} ${y}`} />;
        })}
        {/* Folhas finas na haste. */}
        <path pathLength={1} d="M138 268C108 252 86 224 76 190M116 242c-20 2-36-4-48-16M99 220c0-18-6-32-16-42" />
        <path pathLength={1} d="M142 306c26-12 52-36 66-66M174 284c20 0 38-6 52-18M192 262c2-18 10-32 22-42" />
      </g>
      <g fill="currentColor">
        {RAYS.map(([angle, length]) => {
          const [x, y] = tip(140, 152, angle, length);
          return [-52, -18, 18, 52].map((spread, index) => {
            const [dx, dy] = tip(x, y, angle + spread, index % 2 ? 17 : 12);
            return (
              <g key={`${angle}${spread}`}>
                <path d={`M${x} ${y}L${dx} ${dy}`} stroke="currentColor" strokeWidth="1" />
                <circle cx={dx} cy={dy} r="2.6" />
              </g>
            );
          });
        })}
      </g>
    </svg>
  );
}
