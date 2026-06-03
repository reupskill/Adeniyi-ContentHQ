/* ============================================================
   SCREEN: LINKEDIN POST GENERATOR
   ============================================================ */
function LinkedInScreen() {
  const [vals, setVals] = useState(DEFAULT_GEN);
  const { loading, done, run } = useGenerate();
  const [variation, setVariation] = useState(0);
  const set = (k, val) => setVals((v) => ({ ...v, [k]: val }));

  const left = (
    <div className="card card-pad" style={{ position: 'sticky', top: 88 }}>
      <div className="card-head"><div className="card-title">Post Inputs</div></div>
      <GeneratorInputs values={vals} onChange={set} prefilled
        fields={['idea', 'story', 'audience', 'lesson', 'tone', 'category', 'cta', 'variations']} />
      <Button variant="primary" brand="linkedin" block loading={loading} onClick={() => run(() => setVariation(0))} style={{ marginTop: 6 }}>
        {loading ? 'Writing…' : 'Generate LinkedIn Post'}
      </Button>
    </div>
  );

  let right;
  if (loading) right = <GenLoading label="Writing your post…" />;
  else if (!done) right = <GenEmpty icon="message" title="Your LinkedIn post will appear here" sub="See it rendered in a realistic feed preview, ready to copy or refine across variations." />;
  else right = (
    <div className="fade-seq">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div className="tabs">
          {[0, 1, 2].map((i) => <button key={i} className={'tab' + (variation === i ? ' on' : '')} onClick={() => setVariation(i)}>Variation {i + 1}</button>)}
        </div>
        <div style={{ display: 'flex', gap: 9 }}>
          <Button size="sm" variant="ghost" icon="refresh" onClick={() => showToast('Regenerating…')}>Regenerate</Button>
          <Button size="sm" variant="secondary" icon="save" onClick={() => showToast('Saved to Content Bank', 'ok')}>Save to Bank</Button>
        </div>
      </div>

      {/* LinkedIn post preview card */}
      <div className="card" style={{ maxWidth: 560, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 18px 0' }}>
          <div style={{ display: 'flex', gap: 11, alignItems: 'center', marginBottom: 14 }}>
            <div className="avatar" style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#2e2740,#1a1626)' }}>A</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text)' }}>Adeniyi <span className="muted" style={{ fontWeight: 400 }}>• You</span></div>
              <div className="muted" style={{ fontSize: 12 }}>Founder / Product Leader • 12,480 followers</div>
              <div className="muted" style={{ fontSize: 11.5, display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>Now • <Icon name="users" size={11} /></div>
            </div>
            <Brand name="linkedin" size={24} />
          </div>
        </div>
        <div style={{ padding: '0 18px 14px', fontSize: 14, lineHeight: 1.62, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>
          {variation === 0 ? LINKEDIN_OUTPUT
            : variation === 1 ? LINKEDIN_OUTPUT.replace('Most people know exactly what they should do.', 'Speed is not the same as progress.').replace('They just don’t do it.', 'But almost everyone confuses the two.')
            : LINKEDIN_OUTPUT.replace('Most people know exactly what they should do.\n\nThey just don’t do it.', 'I lost six months to a launch I never paused to question.')}
        </div>
        <div style={{ borderTop: '1px solid var(--line)', padding: '10px 18px', display: 'flex', gap: 22 }}>
          {['Like', 'Comment', 'Repost', 'Send'].map((a) => <span key={a} className="muted" style={{ fontSize: 12.5, fontWeight: 500 }}>{a}</span>)}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <CopyBtn text={LINKEDIN_OUTPUT} label="Copy post" />
        <Button size="sm" variant="ghost" icon="edit" onClick={() => showToast('Inline editing enabled')}>Edit inline</Button>
      </div>
    </div>
  );

  return <div className="content"><GenLayout left={left} right={right} /></div>;
}
window.LinkedInScreen = LinkedInScreen;
