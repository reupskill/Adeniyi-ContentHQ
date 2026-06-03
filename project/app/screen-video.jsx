/* ============================================================
   SCREEN: VIDEO SCRIPT GENERATOR
   ============================================================ */
function VideoScreen() {
  const [vals, setVals] = useState(DEFAULT_GEN);
  const [platforms, setPlatforms] = useState({ video: true, linkedin: false, x: false, substack: false });
  const { loading, done, run } = useGenerate();
  const set = (k, val) => setVals((v) => ({ ...v, [k]: val }));
  const togglePlat = (p) => setPlatforms((s) => ({ ...s, [p]: !s[p] }));

  const left = (
    <div className="card card-pad" style={{ position: 'sticky', top: 88 }}>
      <div className="card-head"><div className="card-title">Script Inputs</div></div>
      <div className="eyebrow" style={{ marginBottom: 9 }}>Generate for</div>
      <div className="pill-row" style={{ marginBottom: 18 }}>
        {[['video', 'Video', 'video'], ['linkedin', 'LinkedIn', 'linkedin'], ['x', 'X', 'x'], ['substack', 'Substack', 'substack']].map(([id, lbl, br]) => (
          <div key={id} className={'pill' + (platforms[id] ? ' on' : '')} onClick={() => togglePlat(id)}>
            {id === 'video' ? <Icon name="video" size={14} /> : <Brand name={br} size={14} />}{lbl}
          </div>
        ))}
      </div>
      <GeneratorInputs values={vals} onChange={set}
        fields={['idea', 'story', 'audience', 'lesson', 'tone', 'category', 'lens', 'cta', 'business', 'variations']} />
      <Button variant="primary" icon="sparkles" block loading={loading} onClick={() => run()} style={{ marginTop: 6 }}>
        {loading ? 'Generating…' : 'Generate Script'}
      </Button>
    </div>
  );

  let right;
  if (loading) right = <GenLoading label="Writing your script…" />;
  else if (!done) right = <GenEmpty icon="video" title="Your script will appear here" sub="Fill in the core idea and hit Generate. Output breaks into hook, story, insight, close and production notes." />;
  else right = (
    <div className="fade-seq">
      <div className="card card-pad" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <PlatformBadge platform="video" />
          <span className="badge badge-ready"><span className="dot" style={{ background: 'var(--ready)' }}></span>87 / 100 — Strong hook</span>
          <span className="muted" style={{ fontSize: 12.5 }}>~48 sec • 142 words</span>
        </div>
        <div style={{ display: 'flex', gap: 9 }}>
          <Button size="sm" variant="ghost" icon="refresh" onClick={() => showToast('Regenerating…')}>Regenerate</Button>
          <Button size="sm" variant="secondary" icon="save" onClick={() => showToast('Saved to Content Bank', 'ok')}>Save to Bank</Button>
        </div>
      </div>
      {SCRIPT_OUTPUT.map((s, i) => (
        <div key={s.label} style={{ animation: 'fadeUp .5s backwards', animationDelay: i * 70 + 'ms' }}>
          <OutputCard label={s.label} body={s.body} mono={s.mono} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="content"><GenLayout left={left} right={right} /></div>
  );
}
window.VideoScreen = VideoScreen;
