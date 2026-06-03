/* ============================================================
   SCREEN: DASHBOARD  (simplified)
   ============================================================ */
function Dashboard({ onNavigate, onSignOut }) {
  const platformRoute = { linkedin: 'linkedin', x: 'x', substack: 'substack', youtube: 'video' };

  return (
    <div className="content">
      {/* welcome */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 22, flexWrap: 'wrap' }}>
        <div>
          <h1 className="display" style={{ fontSize: 30 }}>Welcome back, Adeniyi 👋</h1>
          <div className="dim" style={{ fontSize: 14.5, marginTop: 5 }}>Create once. Share everywhere. Build influence that compounds.</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="access-chip"><Icon name="shield" /> Only authorized email can access</div>
          <button className="gauth"><Brand name="google" size={17} /> Google</button>
          <button className="avatar" title="Sign out" onClick={onSignOut} style={{ width: 38, height: 38, cursor: 'pointer', border: '1px solid var(--line-2)' }}>A</button>
        </div>
      </div>

      {/* stat row */}
      <div className="stat-row" style={{ marginBottom: 18 }}>
        {STATS.map((s) => <StatCard key={s.id} stat={s} />)}
      </div>

      {/* main row: pipeline / calendar / analyzer */}
      <div className="grid" style={{ gridTemplateColumns: '1.15fr 1fr 1.1fr', marginBottom: 18, alignItems: 'start' }}>

        {/* Repurposing Pipeline */}
        <div className="card card-pad">
          <div className="card-head">
            <div className="card-title">Repurposing Pipeline</div>
            <button className="card-link" onClick={() => onNavigate('bank')}>View pipeline</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PIPELINE.map((p) => (
              <div key={p.id} className="pipe-item" onClick={() => onNavigate(platformRoute[p.brand] || 'bank')}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 11, background: 'var(--surface-2)', border: '1px solid var(--line)', cursor: 'pointer', transition: 'border-color .15s, transform .15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold-line)'; e.currentTarget.style.transform = 'translateX(2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.transform = 'none'; }}>
                <Brand name={p.brand} size={26} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{p.label}</div>
                  <div className="muted" style={{ fontSize: 11.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.sub}</div>
                </div>
                <div style={{ textAlign: 'right', minWidth: 92 }}>
                  <StatusBadge status={p.status} />
                  {p.status === 'generating'
                    ? <div className="pbar" style={{ marginTop: 6, width: 84 }}><div className="pbar-fill" style={{ width: p.progress + '%', background: 'var(--generating)' }}></div></div>
                    : <div className="muted" style={{ fontSize: 10.5, marginTop: 4 }}>{p.note}</div>}
                </div>
                <Icon name="chevRight" size={15} color="var(--text-faint)" style={{ flex: 'none' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Calendar preview */}
        <div className="card card-pad">
          <div className="card-head">
            <div className="card-title">30-Day Calendar Preview</div>
            <button className="card-link" onClick={() => onNavigate('calendar')}>View calendar</button>
          </div>
          <MiniCalendar today={17} />
          <CalLegend />
        </div>

        {/* Analyzer */}
        <div className="card card-pad">
          <div className="card-head">
            <div className="card-title">Script Analyzer Summary</div>
            <button className="card-link" onClick={() => onNavigate('analyzer')}>View full report</button>
          </div>
          <div style={{ display: 'flex', gap: 18 }}>
            <div style={{ textAlign: 'center', flex: 'none' }}>
              <CircularScore score={ANALYZER.overall} label="Overall Score" />
              <div className="serif" style={{ fontSize: 14, color: 'var(--c-green)', marginTop: 8 }}>{ANALYZER.label}</div>
            </div>
            <div style={{ flex: 1, paddingTop: 2 }}>
              {ANALYZER.metrics.map((m) => <ProgressBar key={m.name} name={m.name} value={m.score} color={m.color} />)}
            </div>
          </div>
          <div style={{ marginTop: 6, display: 'flex', gap: 9, padding: '11px 13px', borderRadius: 10, background: 'var(--gold-dim)', border: '1px solid var(--gold-line)' }}>
            <Icon name="lightbulb" size={16} color="var(--gold)" style={{ flex: 'none', marginTop: 1 }} />
            <div style={{ fontSize: 12.5, color: 'var(--cream)', lineHeight: 1.5 }}><strong style={{ color: 'var(--gold)' }}>Tip:</strong> {ANALYZER.tip}</div>
          </div>
        </div>
      </div>

      {/* quick actions */}
      <div className="card card-pad">
        <div className="card-head"><div className="card-title">Quick Actions</div></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
          {QUICK_ACTIONS.map((a) => (
            <div key={a.id} className="qaction" onClick={() => onNavigate(a.id === 'repurpose' ? 'video' : a.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 15px', borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--line)', cursor: 'pointer', transition: 'all .15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold-line)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, flex: 'none', display: 'grid', placeItems: 'center', background: a.color ? 'rgba(255,255,255,0.04)' : 'transparent', color: a.color || 'var(--text)' }}>
                {a.brand ? <Brand name={a.brand} size={22} /> : <Icon name={a.icon} size={19} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{a.title}</div>
                <div className="muted" style={{ fontSize: 11.5 }}>{a.sub}</div>
              </div>
              <Icon name="chevRight" size={16} color="var(--text-faint)" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;
