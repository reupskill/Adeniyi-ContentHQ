/* ============================================================
   SCREEN: SUBSTACK ESSAY BUILDER
   ============================================================ */
function SubstackScreen() {
  const [vals, setVals] = useState(DEFAULT_GEN);
  const { loading, done, run } = useGenerate();
  const [depth, setDepth] = useState('Full Draft');
  const set = (k, val) => setVals((v) => ({ ...v, [k]: val }));

  const sections = depth === 'Outline Only' ? SUBSTACK_OUTPUT.filter((s) => !s.label.startsWith('Section') || s.label.includes('Section')).slice(0, 6) : SUBSTACK_OUTPUT;
  const fullDraft = SUBSTACK_OUTPUT.map((s) => s.label.toUpperCase() + '\n' + s.body).join('\n\n');

  const left = (
    <div className="card card-pad" style={{ position: 'sticky', top: 88 }}>
      <div className="card-head"><div className="card-title">Essay Inputs</div></div>
      <GeneratorInputs values={vals} onChange={set} fields={['idea', 'story', 'audience', 'lesson', 'tone', 'lens']} />
      <Field label="Essay depth">
        <div className="pill-row">
          {['Outline Only', 'Full Draft'].map((d) => (
            <div key={d} className={'pill' + (depth === d ? ' on' : '')} onClick={() => setDepth(d)} style={{ flex: 1, justifyContent: 'center' }}>{d}</div>
          ))}
        </div>
      </Field>
      <Button variant="primary" brand="substack" block loading={loading} onClick={() => run(null, 1800)} style={{ marginTop: 10 }}>
        {loading ? 'Drafting…' : 'Build Essay'}
      </Button>
    </div>
  );

  let right;
  if (loading) right = <GenLoading label="Drafting your essay…" />;
  else if (!done) right = <GenEmpty icon="pen" title="Your Substack essay will appear here" sub="A fully structured long-form draft — from title options through to the newsletter CTA." />;
  else right = (
    <div className="fade-seq">
      <div className="card card-pad" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <PlatformBadge platform="substack" />
          <span className="muted" style={{ fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="clock" size={14} />~6 min read</span>
          <span className="muted" style={{ fontSize: 12.5 }}>• {depth}</span>
        </div>
        <div style={{ display: 'flex', gap: 9 }}>
          <CopyBtn text={fullDraft} label="Copy Full Draft" />
          <Button size="sm" variant="secondary" icon="save" onClick={() => showToast('Saved to Content Bank', 'ok')}>Save to Bank</Button>
        </div>
      </div>
      <div style={{ maxWidth: 720 }}>
        {sections.map((s, i) => (
          <div key={s.label} style={{ animation: 'fadeUp .5s backwards', animationDelay: i * 65 + 'ms' }}>
            <OutputCard label={s.label} body={s.body} accent={s.accent} />
          </div>
        ))}
      </div>
    </div>
  );

  return <div className="content"><GenLayout left={left} right={right} /></div>;
}
window.SubstackScreen = SubstackScreen;
