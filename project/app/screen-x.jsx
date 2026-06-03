/* ============================================================
   SCREEN: X / TWITTER GENERATOR
   ============================================================ */
function XScreen() {
  const [vals, setVals] = useState(DEFAULT_GEN);
  const { loading, done, run } = useGenerate();
  const [format, setFormat] = useState('5-Tweet Thread');
  const [collapsed, setCollapsed] = useState(false);
  const set = (k, val) => setVals((v) => ({ ...v, [k]: val }));
  const FORMATS = ['One-liner', '3-Tweet Thread', '5-Tweet Thread', 'Founder Lesson', 'Growth Lesson'];

  const tweets = format === 'One-liner' ? [X_THREAD[0]]
    : format === '3-Tweet Thread' ? X_THREAD.slice(0, 3)
    : X_THREAD;

  const left = (
    <div className="card card-pad" style={{ position: 'sticky', top: 88 }}>
      <div className="card-head" style={{ marginBottom: collapsed ? 0 : 16 }}>
        <div className="card-title">Inputs</div>
        <button className="card-link" onClick={() => setCollapsed((c) => !c)}>{collapsed ? 'Expand' : 'Collapse'}</button>
      </div>
      {!collapsed && (
        <React.Fragment>
          <GeneratorInputs values={vals} onChange={set} fields={['idea', 'lesson', 'tone', 'category']} />
          <Button variant="primary" brand="x" block loading={loading} onClick={() => run()} style={{ marginTop: 6 }}>
            {loading ? 'Composing…' : 'Generate Thread'}
          </Button>
        </React.Fragment>
      )}
      {collapsed && <Button variant="primary" brand="x" block loading={loading} onClick={() => run()}>Generate Thread</Button>}
    </div>
  );

  let right;
  if (loading) right = <GenLoading label="Composing your thread…" />;
  else if (!done) right = <GenEmpty icon="hash" title="Your X content will appear here" sub="Pick a format, generate, and get tweet-ready cards with live character counts and copy buttons." />;
  else right = (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div className="tabs" style={{ flexWrap: 'wrap' }}>
          {FORMATS.map((f) => <button key={f} className={'tab' + (format === f ? ' on' : '')} onClick={() => setFormat(f)}>{f}</button>)}
        </div>
        <div style={{ display: 'flex', gap: 9 }}>
          <Button size="sm" variant="ghost" icon="refresh" onClick={() => showToast('Regenerating…')}>Regenerate</Button>
          <Button size="sm" variant="secondary" icon="save" onClick={() => showToast('Saved to Content Bank', 'ok')}>Save to Bank</Button>
        </div>
      </div>

      <div style={{ maxWidth: 540, position: 'relative' }}>
        {tweets.map((t, i) => {
          const count = t.text.length;
          const over = count > 280;
          return (
            <div key={t.n} style={{ position: 'relative', animation: 'fadeUp .5s backwards', animationDelay: i * 90 + 'ms' }}>
              {i < tweets.length - 1 && tweets.length > 1 && (
                <div style={{ position: 'absolute', left: 23, top: 56, bottom: -14, width: 2, background: 'var(--line-2)', zIndex: 0 }}></div>
              )}
              <div className="card" style={{ padding: '14px 16px', marginBottom: 14, position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div className="avatar" style={{ width: 38, height: 38, borderRadius: '50%', flex: 'none' }}>A</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>Adeniyi</span>
                      <span className="muted" style={{ fontSize: 12.5 }}>@adeniyi_builds</span>
                      {tweets.length > 1 && <span className="muted" style={{ fontSize: 12, marginLeft: 'auto' }}>{t.n}/{tweets.length}</span>}
                    </div>
                    <div style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{t.text}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                      <span className="mono" style={{ fontSize: 11.5, color: over ? 'var(--danger)' : 'var(--text-3)' }}>{count}/280</span>
                      <CopyBtn text={t.text} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return <div className="content"><GenLayout left={left} right={right} /></div>;
}
window.XScreen = XScreen;
