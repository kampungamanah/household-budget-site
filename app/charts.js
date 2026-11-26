/* Charts for HomeLedger: hand-rolled SVG, no library.
   A donut for spending by category and paired income/spending bars. */

import { moneyShort } from './format.js';

export function donutChart(slices, size = 200) {
  const total = slices.reduce((s, x) => s + x.amount, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const inner = r - 30;
  if (total <= 0) {
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="No spending this month"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#ece7d8" stroke-width="30"/><text x="${cx}" y="${cy}" text-anchor="middle" fill="#6b7a72" font-size="14">No spending yet</text></svg>`;
  }
  let angle = -Math.PI / 2;
  const paths = slices.map((s) => {
    const frac = s.amount / total;
    const a0 = angle;
    const a1 = angle + frac * Math.PI * 2;
    angle = a1;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1);
    const yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0);
    const yi0 = cy + inner * Math.sin(a0);
    return `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${s.color}"><title>${s.category}: ${moneyShort(s.amount)}</title></path>`;
  });
  const pct = Math.round((slices[0].amount / total) * 100);
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Spending by category donut chart">
    ${paths.join('')}
    <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="22" font-weight="800" fill="#143f31">${moneyShort(total)}</text>
    <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="12" fill="#6b7a72">spent</text>
  </svg>`;
}

export function monthBars(months) {
  const max = Math.max(1, ...months.flatMap((m) => [m.income, m.spending]));
  const cols = months
    .map((m) => {
      const inH = Math.max(3, Math.round((m.income / max) * 120));
      const outH = Math.max(3, Math.round((m.spending / max) * 120));
      return `<div class="bar-col">
        <div class="pair">
          <i class="in" style="height:${inH}px" title="Income ${moneyShort(m.income)}"></i>
          <i class="out" style="height:${outH}px" title="Spending ${moneyShort(m.spending)}"></i>
        </div>
        <span class="m-label">${m.label}</span>
      </div>`;
    })
    .join('');
  return `<div class="bars">${cols}</div>
    <div class="chart-key"><span><i style="background:#1d5c46"></i>Income</span><span><i style="background:#e8a33d"></i>Spending</span></div>`;
}
