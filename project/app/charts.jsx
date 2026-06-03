/* ============================================================
   CHARTS — multi-line area chart, mini calendar, generic helpers
   ============================================================ */

/* ---------- Multi-line area chart (performance snapshot) ---------- */
function AreaChart({ series, height, labels, yTicks }) {
  // series: [{ name, color, data:[0..1 normalized] }]
  const W = 760, H = height || 220, padL = 40, padB = 26, padT = 12, padR = 8;
  const iw = W - padL - padR, ih = H - padT - padB;
  const n = series[0].data.length;
  const xAt = (i) => padL + (i / (n - 1)) * iw;
  const yAt = (v) => padT + (1 - v) * ih;
  const path = (data) => data.map((v, i) => `${i === 0 ? 'M' : 'L'}${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(' ');
  const ticks = yTicks || ['30K', '20K', '10K', '0'];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {ticks.map((t, i) => {
        const y = padT + (i / (ticks.length - 1)) * ih;
        return (
          <g key={t}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={padL - 8} y={y + 3.5} textAnchor="end" fill="var(--text-faint)" fontSize="10" fontFamily="JetBrains Mono">{t}</text>
          </g>
        );
      })}
      {labels && labels.map((l, i) => {
        const x = padL + (i / (labels.length - 1)) * iw;
        return <text key={l} x={x} y={H - 7} textAnchor="middle" fill="var(--text-faint)" fontSize="10" fontFamily="DM Sans">{l}</text>;
      })}
      {series.map((s) => (
        <g key={s.name}>
          <path d={path(s.data)} fill="none" stroke={s.color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }} />
          <circle cx={xAt(n - 1)} cy={yAt(s.data[n - 1])} r="3" fill={s.color} />
        </g>
      ))}
    </svg>
  );
}

// deterministic series generator
function makeSeries(seed, base, vol, n) {
  let s = seed * 7919 + 13;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const arr = []; let v = base;
  for (let i = 0; i < (n || 26); i++) {
    v += (rnd() - 0.42) * vol;
    v = Math.max(0.08, Math.min(0.95, v));
    arr.push(v);
  }
  return arr;
}

const PERF_SERIES = [
  { name: 'Impressions',     color: 'var(--c-purple)', data: makeSeries(3, 0.45, 0.10).map((v, i) => Math.min(0.95, v + i * 0.012)) },
  { name: 'Engagement Rate', color: 'var(--c-teal)',   data: makeSeries(7, 0.30, 0.07).map((v, i) => Math.min(0.8, v + i * 0.008)) },
  { name: 'Profile Visits',  color: 'var(--c-gold)',   data: makeSeries(11, 0.22, 0.06).map((v, i) => Math.min(0.7, v + i * 0.010)) },
  { name: 'Subscribers',     color: 'var(--c-green)',  data: makeSeries(15, 0.15, 0.05).map((v, i) => Math.min(0.6, v + i * 0.009)) },
];

function ChartLegend({ series, compact }) {
  return (
    <div style={{ display: 'flex', gap: compact ? 14 : 20, flexWrap: 'wrap', marginTop: 12 }}>
      {series.map((s) => (
        <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }}></span>
          <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{s.name}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Mini calendar (dashboard preview) ---------- */
// May 2025: starts Thursday (May 1 = Thu). Monday-first grid.
function buildMonthGrid(year, month) {
  // month 0-indexed. Monday-first.
  const first = new Date(year, month, 1);
  const startDow = (first.getDay() + 6) % 7; // 0=Mon
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push({ day: prevDays - startDow + 1 + i, out: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, out: false });
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - daysInMonth - startDow + 1, out: true });
  while (cells.length < 42) cells.push({ day: cells.length - daysInMonth - startDow + 1, out: true });
  return cells.slice(0, 42);
}

function MiniCalendar({ today }) {
  const cells = buildMonthGrid(2025, 4); // May 2025
  const dows = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
        <span className="serif" style={{ fontSize: 17, color: 'var(--cream)' }}>May 2025</span>
        <Icon name="arrowRight" size={15} color="var(--text-3)" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 6 }}>
        {dows.map((d) => <div key={d} style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-faint)', fontWeight: 600, letterSpacing: '0.04em' }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
        {cells.map((c, i) => {
          const t = !c.out && CAL_TOPICS[c.day];
          const isToday = !c.out && c.day === (today || 17);
          return (
            <div key={i} style={{
              aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
              borderRadius: 8, fontSize: 12.5,
              color: c.out ? 'var(--text-faint)' : (isToday ? '#1a140a' : 'var(--text-2)'),
              background: isToday ? 'var(--gold)' : 'transparent',
              fontWeight: isToday ? 700 : 400,
            }}>
              <span>{c.day}</span>
              <div style={{ display: 'flex', gap: 2, height: 4 }}>
                {t && t.cats.slice(0, 4).map((cat) => (
                  <span key={cat} style={{ width: 4, height: 4, borderRadius: '50%', background: isToday ? '#1a140a' : CAL_CATEGORIES[cat].color }}></span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CalLegend() {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 12 }}>
      {Object.entries(CAL_CATEGORIES).map(([k, v]) => (
        <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: v.color }}></span>
          <span style={{ fontSize: 11.5, color: 'var(--text-2)' }}>{v.label}</span>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { AreaChart, PERF_SERIES, ChartLegend, MiniCalendar, CalLegend, CalLegend, buildMonthGrid });
