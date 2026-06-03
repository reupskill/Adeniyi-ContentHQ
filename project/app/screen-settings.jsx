/* ============================================================
   SCREEN: SETTINGS (light)
   ============================================================ */
function Settings() {
  const [name, setName] = useState('Adeniyi');
  const [role, setRole] = useState('Founder / Product Leader');
  const [tone, setTone] = useState('Reflective');
  const [lens, setLens] = useState('Naval / leverage');
  const [cta, setCta] = useState('Reflection question');
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div className="content" style={{ maxWidth: 760 }}>
      <SectionTitle sub="Make Adeniyi Content HQ feel like yours.">Settings</SectionTitle>

      {/* Profile */}
      <div className="card card-pad" style={{ marginBottom: 18 }}>
        <div className="card-title" style={{ marginBottom: 18 }}>Profile</div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 18 }}>
          <div style={{ textAlign: 'center' }}>
            <div className="avatar" style={{ width: 76, height: 76, borderRadius: 18, fontSize: 30, margin: '0 auto 8px' }}>A</div>
            <button className="copy-btn" style={{ margin: '0 auto' }}><Icon name="upload" size={13} />Upload</button>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
              <Field label="Role"><Input value={role} onChange={(e) => setRole(e.target.value)} /></Field>
            </div>
          </div>
        </div>
      </div>

      {/* Content preferences */}
      <div className="card card-pad" style={{ marginBottom: 18 }}>
        <div className="card-title" style={{ marginBottom: 18 }}>Content Preferences</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          <Field label="Default tone"><Select options={TONES} value={tone} onChange={(e) => setTone(e.target.value)} /></Field>
          <Field label="Default philosophical lens"><Select options={LENSES} value={lens} onChange={(e) => setLens(e.target.value)} /></Field>
          <Field label="Default CTA type"><Select options={CTAS} value={cta} onChange={(e) => setCta(e.target.value)} /></Field>
        </div>
        <Button variant="primary" icon="check" onClick={() => showToast('Preferences saved', 'ok')} style={{ marginTop: 6 }}>Save preferences</Button>
      </div>

      {/* Content Bank */}
      <div className="card card-pad" style={{ marginBottom: 18 }}>
        <div className="card-title" style={{ marginBottom: 6 }}>Content Bank</div>
        <div className="muted" style={{ fontSize: 13, marginBottom: 16 }}>Back up your library or restore it from a JSON file.</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" icon="download" onClick={() => showToast('Exported library as JSON', 'ok')}>Export JSON</Button>
          <Button variant="secondary" icon="upload" onClick={() => showToast('Import dialog opened')}>Import JSON</Button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="card card-pad" style={{ borderColor: 'rgba(176,96,96,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
          <Icon name="alert" size={17} color="var(--danger)" />
          <div className="card-title" style={{ color: 'var(--danger)' }}>Clear all data</div>
        </div>
        <div className="muted" style={{ fontSize: 13, marginBottom: 16 }}>Permanently delete every script, post, and bank item. This cannot be undone.</div>
        {!confirmClear ? (
          <Button variant="danger" icon="trash" onClick={() => setConfirmClear(true)}>Clear all data</Button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, background: 'var(--danger-bg)', border: '1px solid rgba(176,96,96,0.3)' }}>
            <span style={{ fontSize: 13, color: 'var(--cream)', flex: 1 }}>Are you absolutely sure? This wipes everything.</span>
            <Button size="sm" variant="ghost" onClick={() => setConfirmClear(false)}>Cancel</Button>
            <Button size="sm" variant="danger" icon="trash" onClick={() => { setConfirmClear(false); showToast('All data cleared'); }}>Yes, clear it</Button>
          </div>
        )}
      </div>
    </div>
  );
}
window.Settings = Settings;
