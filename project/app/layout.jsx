/* ============================================================
   LAYOUT SHELL — Sidebar + Topbar
   ============================================================ */

function BrandMark({ size }) {
  const s = size || 22;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 2.5c-3 0-5.3 2.4-5.3 5.4 0 2 1.1 3.7 2.7 4.7.5.3.8.8.8 1.4v.8h3.6v-.8c0-.6.3-1.1.8-1.4 1.6-1 2.7-2.7 2.7-4.7 0-3-2.3-5.4-5.3-5.4Z"
        fill="none" stroke="var(--gold)" strokeWidth="1.5" />
      <path d="M9.4 18.5h5.2M10 21h4" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1.6" fill="var(--gold)" />
    </svg>
  );
}

function Sidebar({ active, onNavigate, onSignOut }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><BrandMark /></div>
        <div>
          <div className="brand-name">Adeniyi Content HQ</div>
          <div className="brand-sub">Thought Leadership Engine</div>
        </div>
      </div>

      <nav className="nav">
        {NAV_ITEMS.map((item) => (
          <div key={item.id}
            className={'nav-item' + (active === item.id ? ' active' : '')}
            onClick={() => onNavigate(item.id)}>
            {item.brand ? <Brand name={item.brand} size={18} /> : <Icon name={item.icon} />}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="side-foot">
        <div className="profile-card">
          <div className="profile-row">
            <div className="avatar">A</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="profile-name">Adeniyi</div>
              <div className="profile-role">Founder / Product Leader</div>
            </div>
            <button className="btn btn-ghost btn-icon" title="Sign out" onClick={onSignOut} style={{ flex: 'none' }}><Icon name="logout" size={16} /></button>
          </div>
          <div className="plan-card">
            <div className="plan-top">
              <Icon name="zap" size={14} color="var(--gold)" />
              <div>
                <div className="plan-name">Pro Plan</div>
                <div className="plan-renew">Renews Jun 12, 2025</div>
              </div>
            </div>
            <div className="usage-track"><div className="usage-fill" style={{ width: '87%' }}></div></div>
            <div className="usage-label">87% of monthly usage</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ title, sub, actions, onSignOut }) {
  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
        {sub && <div className="sub">{sub}</div>}
      </div>
      <div className="topbar-spacer"></div>
      {actions || (
        <React.Fragment>
          <div className="access-chip"><Icon name="shield" /> Only authorized email can access</div>
          <button className="gauth"><Brand name="google" size={17} /> Google</button>
          <button className="avatar" title="Sign out" onClick={onSignOut} style={{ width: 36, height: 36, cursor: 'pointer', border: '1px solid var(--line-2)' }}>A</button>
        </React.Fragment>
      )}
    </header>
  );
}

Object.assign(window, { Sidebar, Topbar, BrandMark });
