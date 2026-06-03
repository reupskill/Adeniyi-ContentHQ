/* ============================================================
   SHARED COMPONENTS
   ============================================================ */
const { useState, useEffect, useRef, useCallback } = React;

/* ---------- Toast system (event-driven global) ---------- */
function showToast(text, kind) {
  window.dispatchEvent(new CustomEvent('app-toast', { detail: { text, kind: kind || 'default', id: Date.now() + Math.random() } }));
}
function ToastHost() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const handler = (e) => {
      const t = e.detail;
      setItems((cur) => [...cur, t]);
      setTimeout(() => setItems((cur) => cur.filter((x) => x.id !== t.id)), 3000);
    };
    window.addEventListener('app-toast', handler);
    return () => window.removeEventListener('app-toast', handler);
  }, []);
  return (
    <div className="toast-wrap">
      {items.map((t) => (
        <div key={t.id} className={'toast ' + (t.kind === 'ok' ? 'ok' : '')}>
          <Icon name={t.kind === 'ok' ? 'checkCircle' : 'sparkles'} />
          <span className="toast-text">{t.text}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Sparkline ---------- */
function Sparkline({ color, seed, height, fill }) {
  const colorMap = { purple: 'var(--c-purple)', teal: 'var(--c-teal)', green: 'var(--c-green)', gold: 'var(--c-gold)' };
  const stroke = colorMap[color] || color || 'var(--gold)';
  const pts = useRef(null);
  if (!pts.current) {
    let s = (seed || 1) * 9301 + 49297;
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    const n = 26; const arr = [];
    let v = 0.5;
    for (let i = 0; i < n; i++) { v += (rnd() - 0.45) * 0.22; v = Math.max(0.12, Math.min(0.92, v)); arr.push(v); }
    // gentle upward bias at the end
    pts.current = arr;
  }
  const arr = pts.current; const w = 100; const hgt = height || 38;
  const step = w / (arr.length - 1);
  const line = arr.map((y, i) => `${(i * step).toFixed(1)},${((1 - y) * hgt).toFixed(1)}`).join(' ');
  const area = `0,${hgt} ` + line + ` ${w},${hgt}`;
  const gid = 'sg' + (seed || 0) + color;
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${hgt}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill !== false && <polygon points={area} fill={`url(#${gid})`} />}
      <polyline points={line} fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* ---------- Stat card ---------- */
function StatCard({ stat }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-ico" style={{ background: stat.bg, color: stat.color }}>
          <Icon name={stat.icon} />
        </div>
        <div className="stat-name">{stat.name}</div>
      </div>
      <div className="stat-num">{stat.value}</div>
      <Sparkline color={stat.spark} seed={stat.id.length * 7 + stat.value.length} />
      <div className="stat-trend">
        <span className="up"><Icon name="arrowUp" size={12} strokeWidth={2.4} />{stat.trend}</span>
        <span>vs last 30 days</span>
      </div>
    </div>
  );
}

/* ---------- Badges ---------- */
function StatusBadge({ status }) {
  const map = {
    ready: ['badge-ready', 'Ready'], generating: ['badge-generating', 'Generating'],
    draft: ['badge-draft', 'Draft'], published: ['badge-published', 'Published'], idea: ['badge-idea', 'Idea'],
  };
  const [cls, label] = map[status] || map.idea;
  const dotColor = { ready: 'var(--ready)', generating: 'var(--generating)', draft: 'var(--draft)', published: 'var(--published)', idea: 'var(--text-3)' }[status];
  return <span className={'badge ' + cls}><span className="dot" style={{ background: dotColor }}></span>{label}</span>;
}

function PlatformBadge({ platform, label }) {
  const map = {
    video: ['pbadge-video', 'video', 'Video'], linkedin: ['pbadge-linkedin', 'linkedin', 'LinkedIn'],
    x: ['pbadge-x', 'x', 'X'], substack: ['pbadge-substack', 'substack', 'Substack'], youtube: ['pbadge-youtube', 'youtube', 'YouTube'],
  };
  const [cls, brand, def] = map[platform] || map.video;
  return <span className={'pbadge ' + cls}>{platform === 'video' ? <Icon name="video" size={13} /> : <Brand name={brand} size={13} />}{label || def}</span>;
}

/* ---------- Buttons ---------- */
function Button({ variant, size, icon, iconR, brand, children, loading, onClick, disabled, block, style, title }) {
  const cls = ['btn', 'btn-' + (variant || 'secondary')];
  if (size) cls.push('btn-' + size);
  if (block) cls.push('btn-block');
  return (
    <button className={cls.join(' ')} onClick={onClick} disabled={disabled || loading} style={style} title={title}>
      {loading ? <span className={'spinner' + (variant === 'primary' ? '' : ' spinner-light')}></span>
        : (brand ? <Brand name={brand} size={16} /> : (icon && <Icon name={icon} size={size === 'sm' ? 14 : 16} />))}
      {children}
      {iconR && !loading && <Icon name={iconR} size={size === 'sm' ? 14 : 16} />}
    </button>
  );
}

/* ---------- Copy button ---------- */
function CopyBtn({ text, label }) {
  const [done, setDone] = useState(false);
  const onCopy = () => {
    try { navigator.clipboard.writeText(text || ''); } catch (e) {}
    setDone(true); showToast('Copied to clipboard', 'ok');
    setTimeout(() => setDone(false), 1400);
  };
  return (
    <button className="copy-btn" onClick={onCopy}>
      <Icon name={done ? 'check' : 'copy'} size={13} />{done ? 'Copied' : (label || 'Copy')}
    </button>
  );
}

/* ---------- Progress bar ---------- */
function ProgressBar({ name, value, color, suffix }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(value), 80); return () => clearTimeout(t); }, [value]);
  return (
    <div className="pbar-row">
      <div className="pbar-top">
        <span className="pbar-name">{name}</span>
        <span className="pbar-val">{value}{suffix || '/100'}</span>
      </div>
      <div className="pbar"><div className="pbar-fill" style={{ width: w + '%', background: color || 'var(--gold)' }}></div></div>
    </div>
  );
}

/* ---------- Circular score ---------- */
function CircularScore({ score, label, size }) {
  const sz = size || 116; const stroke = 9; const r = (sz - stroke) / 2; const c = 2 * Math.PI * r;
  const [off, setOff] = useState(c);
  useEffect(() => { const t = setTimeout(() => setOff(c - (score / 100) * c), 120); return () => clearTimeout(t); }, [score, c]);
  const col = score >= 85 ? 'var(--c-green)' : score >= 70 ? 'var(--generating)' : 'var(--danger)';
  return (
    <div style={{ position: 'relative', width: sz, height: sz }}>
      <svg width={sz} height={sz} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
        <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={col} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(.22,.61,.36,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
        <div>
          <div className="serif" style={{ fontSize: sz * 0.32, color: 'var(--text)', lineHeight: 1 }}>{score}</div>
          {label && <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginTop: 2 }}>{label}</div>}
        </div>
      </div>
    </div>
  );
}

/* ---------- Output card (labelled script section) ---------- */
function OutputCard({ label, body, mono, accent, copy, delay }) {
  return (
    <div className="out-card" style={{ animationDelay: (delay || 0) + 'ms', borderLeft: accent ? `3px solid ${accent}` : undefined }}>
      <div className="out-card-head">
        <span className="label-gold" style={accent ? { color: accent } : undefined}>{label}</span>
        {copy !== false && <CopyBtn text={typeof body === 'string' ? body : ''} />}
      </div>
      <div className={'out-body' + (mono ? ' mono' : '')} style={{ whiteSpace: 'pre-wrap' }}>{body}</div>
    </div>
  );
}

/* ---------- Section title (page-level) ---------- */
function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 className="display" style={{ fontSize: 22, color: 'var(--text)' }}>{children}</h2>
      {sub && <div className="dim" style={{ fontSize: 13.5, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

/* ---------- Field helpers ---------- */
function Field({ label, req, children }) {
  return (
    <div className="field">
      <label className="field-label">{label}{req && <span className="req"> *</span>}</label>
      {children}
    </div>
  );
}
function Input(props) { return <input className="input" {...props} />; }
function Textarea(props) { return <textarea className="textarea" {...props} />; }
function Select({ options, ...rest }) {
  return <select className="select" {...rest}>{options.map((o) => <option key={o} value={o}>{o}</option>)}</select>;
}
function Stepper({ value, onChange, min, max }) {
  return (
    <div className="stepper">
      <button onClick={() => onChange(Math.max(min ?? 1, value - 1))}>−</button>
      <span className="val">{value}</span>
      <button onClick={() => onChange(Math.min(max ?? 9, value + 1))}>+</button>
    </div>
  );
}

/* ---------- Image placeholder ---------- */
function Placeholder({ label, style, children, playable }) {
  return (
    <div className="ph" style={style}>
      {playable && (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(0,0,0,0.45)', border: '1.5px solid rgba(255,255,255,0.5)', display: 'grid', placeItems: 'center', color: '#fff', backdropFilter: 'blur(2px)' }}>
            <Icon name="play" size={22} />
          </div>
        </div>
      )}
      {!playable && (children || label)}
    </div>
  );
}

Object.assign(window, {
  showToast, ToastHost, Sparkline, StatCard, StatusBadge, PlatformBadge,
  Button, CopyBtn, ProgressBar, CircularScore, OutputCard, SectionTitle,
  Field, Input, Textarea, Select, Stepper, Placeholder,
});
