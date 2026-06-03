/* ============================================================
   SCREEN: CONTENT BANK
   ============================================================ */
function ContentBank({ onNavigate }) {
  const [items, setItems] = useState(BANK_ITEMS);
  const [platform, setPlatform] = useState('All');
  const [status, setStatus] = useState('All');
  const [query, setQuery] = useState('');
  const [openMenu, setOpenMenu] = useState(null);
  const [preview, setPreview] = useState(null);

  const STATUSES = ['idea', 'draft', 'ready', 'published'];
  const STATUS_LABELS = { idea: 'Idea', draft: 'Draft', ready: 'Ready to Record', published: 'Published' };

  const filtered = items.filter((it) =>
    (platform === 'All' || it.platform === platform.toLowerCase().replace(' / twitter', '').replace('x', 'x')) &&
    (status === 'All' || it.status === status.toLowerCase().split(' ')[0]) &&
    (query === '' || it.title.toLowerCase().includes(query.toLowerCase()) || it.preview.toLowerCase().includes(query.toLowerCase()))
  );

  const platMatch = (it) => {
    if (platform === 'All') return true;
    const map = { 'Video': 'video', 'LinkedIn': 'linkedin', 'X': 'x', 'Substack': 'substack' };
    return it.platform === map[platform];
  };
  const statMatch = (it) => status === 'All' || it.status === status.toLowerCase().replace('ready to record', 'ready');
  const visible = items.filter((it) => platMatch(it) && statMatch(it) &&
    (query === '' || (it.title + it.preview).toLowerCase().includes(query.toLowerCase())));

  const changeStatus = (id, st) => {
    setItems((cur) => cur.map((it) => it.id === id ? { ...it, status: st } : it));
    setOpenMenu(null); showToast('Status updated to ' + STATUS_LABELS[st], 'ok');
  };
  const del = (id) => { setItems((cur) => cur.filter((it) => it.id !== id)); showToast('Item deleted'); };

  return (
    <div className="content">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <SectionTitle sub={`${visible.length} of ${items.length} pieces in your library`}>Content Bank</SectionTitle>
        <div style={{ display: 'flex', gap: 9 }}>
          <Button size="sm" variant="secondary" icon="download" onClick={() => showToast('Exported library as JSON', 'ok')}>Export JSON</Button>
          <Button size="sm" variant="secondary" icon="upload" onClick={() => showToast('Import dialog opened')}>Import JSON</Button>
        </div>
      </div>

      {/* filter bar */}
      <div className="card card-pad" style={{ padding: '14px 16px', marginBottom: 18, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <FilterGroup label="Platform" options={['All', 'Video', 'LinkedIn', 'X', 'Substack']} value={platform} onChange={setPlatform} />
        <div style={{ width: 1, height: 28, background: 'var(--line)' }}></div>
        <FilterGroup label="Status" options={['All', 'Idea', 'Draft', 'Ready', 'Published']} value={status} onChange={setStatus} />
        <div style={{ flex: 1 }}></div>
        <div style={{ position: 'relative', minWidth: 220 }}>
          <Icon name="search" size={15} color="var(--text-3)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
          <input className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search content…" style={{ paddingLeft: 34 }} />
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-ico"><Icon name="archive" size={26} /></div>
            <div className="serif" style={{ fontSize: 19, color: 'var(--text)', marginBottom: 6 }}>No content here yet</div>
            <div className="muted" style={{ fontSize: 13, marginBottom: 18 }}>Generate your first piece and it’ll land right here.</div>
            <Button variant="primary" icon="plus" onClick={() => onNavigate('video')} style={{ margin: '0 auto' }}>Create your first content</Button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {visible.map((it) => (
            <div key={it.id} className="card" style={{ padding: '16px 18px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                <div className="serif bank-title" onClick={() => setPreview(it)} style={{ fontSize: 16.5, lineHeight: 1.3, color: 'var(--text)', cursor: 'pointer' }}>{it.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <PlatformBadge platform={it.platform} />
                  <span className="badge badge-idea">{it.category}</span>
                  <span className="muted" style={{ fontSize: 12 }}>• {it.date}</span>
                </div>
                <div className="dim" style={{ fontSize: 13, lineHeight: 1.5, maxWidth: 760 }}>{it.preview}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, flex: 'none' }}>
                {/* status dropdown */}
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setOpenMenu(openMenu === it.id ? null : it.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <StatusBadge status={it.status} />
                    <Icon name="chevDown" size={13} color="var(--text-3)" />
                  </button>
                  {openMenu === it.id && (
                    <div style={{ position: 'absolute', top: '125%', right: 0, background: 'var(--surface-3)', border: '1px solid var(--line-2)', borderRadius: 10, padding: 6, zIndex: 30, minWidth: 168, boxShadow: '0 18px 40px -16px rgba(0,0,0,0.8)' }}>
                      {STATUSES.map((st) => (
                        <div key={st} onClick={() => changeStatus(it.id, st)}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 9px', borderRadius: 7, cursor: 'pointer' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                          <StatusBadge status={st} />
                          {it.status === st && <Icon name="check" size={14} color="var(--gold)" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn btn-ghost btn-icon" title="Preview" onClick={() => setPreview(it)}><Icon name="eye" size={15} /></button>
                  <button className="btn btn-ghost btn-icon" title="Copy" onClick={() => { try { navigator.clipboard.writeText(it.body || it.preview); } catch (e) {} showToast('Copied to clipboard', 'ok'); }}><Icon name="copy" size={15} /></button>
                  <button className="btn btn-ghost btn-icon" title="Edit" onClick={() => onNavigate(it.platform === 'x' ? 'x' : it.platform)}><Icon name="edit" size={15} /></button>
                  <button className="btn btn-ghost btn-icon" title="Delete" onClick={() => del(it.id)} style={{ color: 'var(--danger)' }}><Icon name="trash" size={15} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* preview slide-over */}
      {preview && (
        <React.Fragment>
          <div className="scrim" onClick={() => setPreview(null)}></div>
          <div className="slideover">
            <div style={{ padding: '22px 24px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                  <PlatformBadge platform={preview.platform} />
                  <StatusBadge status={preview.status} />
                </div>
                <h2 className="display" style={{ fontSize: 22, lineHeight: 1.2 }}>{preview.title}</h2>
                <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>{preview.category} • {preview.date}{preview.words ? ' • ' + preview.words.toLocaleString() + ' words' : ''}</div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setPreview(null)}><Icon name="x" size={18} /></button>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div className="label-gold" style={{ marginBottom: 10 }}>Full content</div>
              <div className="out-body" style={{ whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.68, color: 'var(--cream)' }}>{preview.body || preview.preview}</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
                <CopyBtn text={preview.body || preview.preview} label="Copy content" />
                <Button size="sm" variant="secondary" icon="edit" onClick={() => { const p = preview; setPreview(null); onNavigate(p.platform === 'x' ? 'x' : p.platform); }}>Open in editor</Button>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span className="eyebrow">{label}</span>
      <div style={{ display: 'flex', gap: 4 }}>
        {options.map((o) => (
          <button key={o} onClick={() => onChange(o)}
            style={{ padding: '5px 11px', borderRadius: 7, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', border: '1px solid', borderColor: value === o ? 'var(--gold-line)' : 'transparent', background: value === o ? 'var(--gold-dim)' : 'transparent', color: value === o ? 'var(--cream)' : 'var(--text-2)' }}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
window.ContentBank = ContentBank;
