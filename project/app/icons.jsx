/* ============================================================
   ICONS — Lucide-style line icons + platform brand marks
   Usage: <Icon name="home" /> , <Brand name="linkedin" />
   ============================================================ */
const { createElement: h } = React;

// Lucide line-icon path data (stroke-based, 24x24)
const ICONS = {
  home:        '<path d="M3 9.5 12 3l9 6.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/>',
  video:       '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m16 10 6-3v10l-6-3z"/>',
  film:        '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4M3 12h18"/>',
  lightbulb:   '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.6 1 1.4 1 2.3h6c0-.9.4-1.7 1-2.3A7 7 0 0 0 12 2Z"/>',
  target:      '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  archive:     '<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8"/><path d="M10 12h4"/>',
  calendar:    '<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/>',
  terminal:    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M13 15h4"/>',
  settings:    '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z"/>',
  doc:         '<path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M5 3h9l5 5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M9 12h6M9 16h6"/>',
  recycle:     '<path d="M7 19H4.8a2 2 0 0 1-1.7-3l1.5-2.6"/><path d="m7 19-1.5-2.5L8 15"/><path d="M14.6 5.6 16 8l2.5-1.4"/><path d="M16 8l1.3 2.2a2 2 0 0 0 3.4-2L19 5.3a2 2 0 0 0-1.7-1H12"/><path d="m12 4-2.2 1.3 1.4 2.4"/><path d="M9.3 9.3 7.8 12a2 2 0 0 0 1.7 3H13"/><path d="m13 17-2 2 2 2"/>',
  play:        '<path d="M7 4.5v15l13-7.5z" fill="currentColor" stroke="none"/>',
  copy:        '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/>',
  edit:        '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  trash:       '<path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6M10 11v6M14 11v6"/>',
  search:      '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  chevDown:    '<path d="m6 9 6 6 6-6"/>',
  chevRight:   '<path d="m9 6 6 6-6 6"/>',
  chevLeft:    '<path d="m15 6-6 6 6 6"/>',
  arrowRight:  '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowUp:     '<path d="M12 19V5M6 11l6-6 6 6"/>',
  shield:      '<path d="M12 3l8 3v5c0 4.5-3 8-8 10-5-2-8-5.5-8-10V6l8-3Z"/><path d="m9 12 2 2 4-4"/>',
  plus:        '<path d="M12 5v14M5 12h14"/>',
  sparkles:    '<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M5 16l.7 1.8L7.5 18.5l-1.8.7L5 21l-.7-1.8L2.5 18.5l1.8-.7z"/>',
  check:       '<path d="M5 12.5 10 17.5 19.5 7"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5L16 9"/>',
  x:           '<path d="M6 6l12 12M18 6 6 18"/>',
  refresh:     '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
  save:        '<path d="M5 3h11l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M8 3v5h7M8 21v-7h8v7"/>',
  download:    '<path d="M12 3v12M7 11l5 5 5-5"/><path d="M4 19h16"/>',
  upload:      '<path d="M12 17V5M7 9l5-5 5 5"/><path d="M4 19h16"/>',
  shuffle:     '<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
  user:        '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  quote:       '<path d="M7 7h4v4c0 2.5-1.5 4-4 4.5M14 7h4v4c0 2.5-1.5 4-4 4.5" fill="currentColor" stroke="none" opacity="0.9"/>',
  clock:       '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  message:     '<path d="M21 11.5a8 8 0 0 1-11.6 7.1L3 21l2.4-6.4A8 8 0 1 1 21 11.5Z"/>',
  bookmark:    '<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/>',
  trendUp:     '<path d="M3 17 9 11l4 4 8-8"/><path d="M16 7h5v5"/>',
  eye:         '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  users:       '<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-6 7-6s7 2 7 6"/><path d="M16 4a4 4 0 0 1 0 8M22 21c0-3-2-5-5-5.5"/>',
  zap:         '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  layers:      '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5M3 18l9 5 9-5"/>',
  wand:        '<path d="m15 4 1 1M9.5 7.5 4 13l7 7 5.5-5.5M19 9l1 1M13 3l1 1M20 4l1 1"/><path d="M14 8 8 14"/>',
  pen:         '<path d="M3 21l3-1L20 6a2 2 0 0 0-3-3L3 17l-1 4Z"/><path d="M15 5l3 3"/>',
  grid:        '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  list:        '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  filter:      '<path d="M3 5h18l-7 8v6l-4-2v-4z"/>',
  hash:        '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
  type:        '<path d="M4 7V5h16v2M9 19h6M12 5v14"/>',
  palette:     '<path d="M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.5 0-.4-.2-.7-.4-1-.3-.3-.4-.6-.4-1 0-.8.7-1.5 1.5-1.5H16a5 5 0 0 0 5-5c0-4.4-4-8-9-8Z"/><circle cx="7.5" cy="10.5" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16.5" cy="10.5" r="1"/>',
  logout:      '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  alert:       '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 9v5M12 17h.01"/>',
  star:        '<path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.3l6.1-.7z"/>',
};

function Icon({ name, size, color, strokeWidth, style, className }) {
  const d = ICONS[name];
  return h('svg', {
    width: size || 20, height: size || 20, viewBox: '0 0 24 24',
    fill: 'none', stroke: color || 'currentColor',
    strokeWidth: strokeWidth || 1.8, strokeLinecap: 'round', strokeLinejoin: 'round',
    style, className, dangerouslySetInnerHTML: { __html: d },
  });
}

// Brand / platform marks (filled glyphs)
function Brand({ name, size }) {
  const s = size || 20;
  const wrap = (children) => h('svg', { width: s, height: s, viewBox: '0 0 24 24', fill: 'none' }, children);
  switch (name) {
    case 'linkedin':
      return wrap([
        h('rect', { key: 'r', x: 2, y: 2, width: 20, height: 20, rx: 4.5, fill: '#0a66c2' }),
        h('path', { key: 'p', fill: '#fff', d: 'M6.4 9.4h2.4v8H6.4v-8Zm1.2-3.8a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8ZM10.5 9.4h2.3v1.1h.03c.32-.6 1.1-1.3 2.3-1.3 2.45 0 2.9 1.6 2.9 3.7v4.5h-2.4v-4c0-.95-.02-2.2-1.34-2.2-1.34 0-1.54 1.05-1.54 2.13v4.07h-2.4v-8Z' }),
      ]);
    case 'x':
      return wrap([
        h('rect', { key: 'r', x: 2, y: 2, width: 20, height: 20, rx: 4.5, fill: '#0a0a0a', stroke: 'rgba(255,255,255,0.15)' }),
        h('path', { key: 'p', fill: '#e7e7e7', d: 'M13.9 10.6 18 6h-1.5l-3.3 3.8L10.4 6H6.5l4.3 6.2L6.5 18H8l3.5-4 2.9 4h3.9l-4.4-7.4Zm-1.2 1.4-.4-.6L8.4 7h1.6l2.6 3.7.4.6 3.4 4.9h-1.6l-2.5-3.2Z' }),
      ]);
    case 'substack':
      return wrap([
        h('rect', { key: 'r', x: 2, y: 2, width: 20, height: 20, rx: 4.5, fill: '#e8772a' }),
        h('path', { key: 'p', fill: '#fff', d: 'M7 7h10v1.6H7V7Zm0 3.1h10V18l-5-2.8L7 18v-7.9Z' }),
      ]);
    case 'youtube':
      return wrap([
        h('rect', { key: 'r', x: 2, y: 4.5, width: 20, height: 15, rx: 4, fill: '#e0504a' }),
        h('path', { key: 'p', fill: '#fff', d: 'M10 9l5 3-5 3V9Z' }),
      ]);
    case 'google':
      return wrap([
        h('path', { key: 1, fill: '#4285F4', d: 'M21.6 12.2c0-.6-.05-1.2-.15-1.8H12v3.4h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.1Z' }),
        h('path', { key: 2, fill: '#34A853', d: 'M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 .95-3.4.95-2.6 0-4.8-1.75-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z' }),
        h('path', { key: 3, fill: '#FBBC05', d: 'M6.4 13.95a6 6 0 0 1 0-3.9V7.45H3.1a10 10 0 0 0 0 9.1l3.3-2.6Z' }),
        h('path', { key: 4, fill: '#EA4335', d: 'M12 5.95c1.5 0 2.8.5 3.85 1.5l2.85-2.85A10 10 0 0 0 3.1 7.45l3.3 2.6C7.2 7.7 9.4 5.95 12 5.95Z' }),
      ]);
    default: return null;
  }
}

window.Icon = Icon;
window.Brand = Brand;
window.ICON_NAMES = Object.keys(ICONS);
