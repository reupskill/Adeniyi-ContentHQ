/* ============================================================
   SCREEN: CONTENT CALENDAR (full view + slide-over)
   ============================================================ */
function ContentCalendar({ onNavigate }) {
  const [selected, setSelected] = useState(null);
  const [generated, setGenerated] = useState(true);
  const [genLoading, setGenLoading] = useState(false);
  const cells = buildMonthGrid(2025, 4);
  const dows = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const generatePlan = () => {
    setGenLoading(true); setGenerated(false);
    setTimeout(() => { setGenLoading(false); setGenerated(true); showToast('30-day plan generated — balanced content mix', 'ok'); }, 1600);
  };

  return (
    <div className="content">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button className="btn btn-secondary btn-icon"><Icon name="chevLeft" size={16} /></button>
          <h1 className="display" style={{ fontSize: 26 }}>May 2025</h1>
          <button className="btn btn-secondary btn-icon"><Icon name="chevRight" size={16} /></button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <CalLegend />
          <Button variant="primary" icon="sparkles" loading={genLoading} onClick={generatePlan}>{genLoading ? 'Planning…' : 'Generate 30-Day Plan'}</Button>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {/* dow header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderBottom: '1px solid var(--line)' }}>
          {dows.map((d) => <div key={d} style={{ padding: '12px 14px', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', textAlign: 'left' }}>{d.slice(0, 3)}</div>)}
        </div>
        {/* grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gridAutoRows: '116px' }}>
          {cells.map((c, i) => {
            const t = !c.out && generated && CAL_TOPICS[c.day];
            const isToday = !c.out && c.day === 17;
            return (
              <div key={i} onClick={() => t && setSelected({ ...t, day: c.day })}
                style={{
                  borderRight: (i % 7 !== 6) ? '1px solid var(--line)' : 'none',
                  borderBottom: i < 35 ? '1px solid var(--line)' : 'none',
                  padding: '8px 10px', cursor: t ? 'pointer' : 'default',
                  background: c.out ? 'rgba(0,0,0,0.18)' : (selected && selected.day === c.day ? 'var(--surface-2)' : 'transparent'),
                  transition: 'background .15s', position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={(e) => { if (t) e.currentTarget.style.background = 'var(--surface-2)'; }}
                onMouseLeave={(e) => { if (t && !(selected && selected.day === c.day)) e.currentTarget.style.background = 'transparent'; }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                  <span style={{
                    fontSize: 13, fontWeight: isToday ? 700 : 500,
                    color: c.out ? 'var(--text-faint)' : (isToday ? '#1a140a' : 'var(--text-2)'),
                    background: isToday ? 'var(--gold)' : 'transparent',
                    width: isToday ? 24 : 'auto', height: isToday ? 24 : 'auto', borderRadius: '50%',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>{c.day}</span>
                  {t && <div style={{ display: 'flex', gap: 3 }}>{t.cats.map((cat) => <span key={cat} style={{ width: 6, height: 6, borderRadius: '50%', background: CAL_CATEGORIES[cat].color }}></span>)}</div>}
                </div>
                {t && (
                  <div>
                    <div style={{ fontSize: 11.5, color: 'var(--text)', lineHeight: 1.3, marginBottom: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{t.topic}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {t.platform === 'video' ? <Icon name="video" size={12} color={CAL_CATEGORIES.video.color} /> : <Brand name={t.platform} size={12} />}
                      <span className="muted" style={{ fontSize: 10 }}>{CAL_CATEGORIES[t.cats[0]].label}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* slide-over */}
      {selected && (
        <React.Fragment>
          <div className="scrim" onClick={() => setSelected(null)}></div>
          <div className="slideover">
            <div style={{ padding: '22px 24px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 6 }}>May {selected.day}, 2025</div>
                <h2 className="display" style={{ fontSize: 22, lineHeight: 1.2 }}>{selected.topic}</h2>
                <div style={{ display: 'flex', gap: 7, marginTop: 12 }}>
                  {selected.cats.map((cat) => (
                    <span key={cat} className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: CAL_CATEGORIES[cat].color }}><span className="dot" style={{ background: CAL_CATEGORIES[cat].color }}></span>{CAL_CATEGORIES[cat].label}</span>
                  ))}
                </div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelected(null)}><Icon name="x" size={18} /></button>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <SlideField icon="video" label="Video Hook" body={'“' + selected.hook + '”'} />
              <SlideField icon="message" label="Main Message" body={selected.message} />
              <SlideField icon="target" label="Best Platform" body={CAL_CATEGORIES[selected.cats[0]].label + ' — highest fit for this topic & format'} />
              <SlideField icon="recycle" label="Repurpose Recommendation" body={selected.repurpose} />
              <SlideField icon="zap" label="Call to Action" body={selected.cta} />
              <Button variant="primary" icon="arrowRight" block onClick={() => { showToast('Topic loaded into generator', 'ok'); setSelected(null); onNavigate('video'); }} style={{ marginTop: 8 }}>Use This Topic</Button>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

function SlideField({ icon, label, body }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
        <Icon name={icon} size={15} color="var(--gold)" />
        <span className="label-gold">{label}</span>
      </div>
      <div className="dim" style={{ fontSize: 13.5, lineHeight: 1.55, paddingLeft: 23 }}>{body}</div>
    </div>
  );
}
window.ContentCalendar = ContentCalendar;
