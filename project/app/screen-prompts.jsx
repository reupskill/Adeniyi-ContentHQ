/* ============================================================
   SCREEN: PROMPT GENERATOR
   ============================================================ */
function PromptGenerator() {
  const [selected, setSelected] = useState(1);
  const [text, setText] = useState('');
  const { loading, done, run } = useGenerate();

  return (
    <div className="content">
      <SectionTitle sub="Generate copy-ready prompts for Claude or ChatGPT — tuned to your voice.">Prompt Generator</SectionTitle>

      <div className="eyebrow" style={{ marginBottom: 12 }}>Choose a prompt type</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
        {PROMPT_TYPES.map((p) => (
          <div key={p.id} onClick={() => setSelected(p.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
              background: selected === p.id ? 'var(--gold-dim)' : 'var(--surface)',
              border: '1px solid', borderColor: selected === p.id ? 'var(--gold-line)' : 'var(--line)', transition: 'all .15s',
            }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, flex: 'none', display: 'grid', placeItems: 'center', background: selected === p.id ? 'rgba(201,169,110,0.18)' : 'var(--surface-2)', color: selected === p.id ? 'var(--gold)' : 'var(--text-2)' }}>
              {p.brand ? <Brand name={p.brand} size={20} /> : <Icon name={p.icon} size={18} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: selected === p.id ? 'var(--cream)' : 'var(--text)' }}>{p.title}</div>
              <div className="muted" style={{ fontSize: 11.5 }}>{p.sub}</div>
            </div>
            {selected === p.id && <Icon name="checkCircle" size={18} color="var(--gold)" />}
          </div>
        ))}
      </div>

      <div className="card card-pad" style={{ marginBottom: 18 }}>
        <Field label="Paste your idea or draft here">
          <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Drop in a raw idea, a rough draft, or a finished script you want to transform…" style={{ minHeight: 120 }} />
        </Field>
        <Button variant="primary" icon="terminal" loading={loading} onClick={() => run(null, 1200)}>{loading ? 'Building prompt…' : 'Generate Prompt'}</Button>
      </div>

      {loading && <GenLoading label="Assembling your prompt…" />}
      {done && !loading && (
        <div className="fade-seq card card-pad">
          <div className="card-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="terminal" size={17} color="var(--gold)" />
              <div className="card-title">Generated Prompt</div>
            </div>
            <div style={{ display: 'flex', gap: 9 }}>
              <CopyBtn text={GENERATED_PROMPT} label="Copy prompt" />
              <Button size="sm" variant="secondary" icon="save" onClick={() => showToast('Saved to Content Bank', 'ok')}>Save to Bank</Button>
            </div>
          </div>
          <div className="out-body mono" style={{ whiteSpace: 'pre-wrap', background: '#0c0c14', border: '1px solid var(--line)', borderRadius: 10, padding: 18, fontSize: 12.5 }}>{GENERATED_PROMPT}</div>
        </div>
      )}
    </div>
  );
}
window.PromptGenerator = PromptGenerator;

/* ============================================================
   SCREEN: SCRIPT ANALYZER (full report)
   ============================================================ */
function ScriptAnalyzer() {
  const [analyzed, setAnalyzed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState(SCRIPT_OUTPUT.slice(0, 4).map((s) => s.body).join('\n\n'));

  const analyze = () => { setLoading(true); setAnalyzed(false); setTimeout(() => { setLoading(false); setAnalyzed(true); showToast('Analysis complete', 'ok'); }, 1500); };

  return (
    <div className="content">
      <SectionTitle sub="Score any script on the five dimensions that make content land.">Script Analyzer</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>
        <div className="card card-pad">
          <div className="card-head"><div className="card-title">Script to analyze</div><span className="muted" style={{ fontSize: 12 }}>{text.split(/\s+/).filter(Boolean).length} words</span></div>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} style={{ minHeight: 320, fontFamily: 'JetBrains Mono, monospace', fontSize: 13, lineHeight: 1.7 }} />
          <Button variant="primary" icon="target" loading={loading} onClick={analyze} style={{ marginTop: 14 }}>{loading ? 'Analyzing…' : 'Analyze Script'}</Button>
        </div>

        <div style={{ position: 'sticky', top: 88 }}>
          {loading ? <GenLoading label="Scoring your script…" /> : (
            <div className="fade-seq">
              <div className="card card-pad" style={{ textAlign: 'center', marginBottom: 16 }}>
                <CircularScore score={ANALYZER.overall} label="Overall Score" size={150} />
                <div className="serif" style={{ fontSize: 19, color: 'var(--c-green)', marginTop: 10 }}>{ANALYZER.label}</div>
                <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>Top 8% of your scripts this month</div>
              </div>
              <div className="card card-pad" style={{ marginBottom: 16 }}>
                <div className="card-title" style={{ fontSize: 14, marginBottom: 16 }}>Breakdown</div>
                {ANALYZER.metrics.map((m) => <ProgressBar key={m.name} name={m.name} value={m.score} color={m.color} />)}
              </div>
              <div style={{ display: 'flex', gap: 9, padding: '13px 15px', borderRadius: 12, background: 'var(--gold-dim)', border: '1px solid var(--gold-line)' }}>
                <Icon name="lightbulb" size={16} color="var(--gold)" style={{ flex: 'none', marginTop: 1 }} />
                <div style={{ fontSize: 12.5, color: 'var(--cream)', lineHeight: 1.5 }}><strong style={{ color: 'var(--gold)' }}>AI Tip:</strong> {ANALYZER.tip}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
window.ScriptAnalyzer = ScriptAnalyzer;
