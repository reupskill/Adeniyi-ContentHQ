/* ============================================================
   SCREEN: DAILY INSPIRATION ENGINE
   ============================================================ */
function InspirationScreen({ onNavigate }) {
  const { loading, done, run } = useGenerate();
  const FIELDS = [
    ['theme', 'Recent Theme', 'A thread running through your week'],
    ['event', 'Recent Event', 'Something that actually happened'],
    ['frustration', 'A Frustration', 'What’s been grinding on you'],
    ['mistake', 'A Mistake', 'A recent misstep & what it taught'],
    ['belief', 'A Belief', 'Something you hold strongly'],
    ['lesson', 'A Lesson', 'Hard-won wisdom'],
    ['question', 'A Question', 'Something you’re sitting with'],
    ['disagreement', 'An Online Disagreement', 'A take you pushed back on'],
    ['building', 'Lesson from Building', 'From the work itself'],
    ['struggle', 'Current Struggle', 'What’s genuinely hard right now'],
  ];
  const [vals, setVals] = useState({ theme: 'The cost of moving fast without thinking', frustration: 'Everyone optimizing for speed over depth' });
  const set = (k) => (e) => setVals((v) => ({ ...v, [k]: e.target.value }));

  const out = INSPIRATION_OUTPUT;

  return (
    <div className="content">
      <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 28px' }}>
        <h1 className="display" style={{ fontSize: 30 }}>What’s happening in your world today?</h1>
        <div className="dim" style={{ fontSize: 14.5, marginTop: 8, lineHeight: 1.55 }}>
          Real content comes from real life. Drop in what you’re thinking, feeling, and wrestling with — and turn a single day into a week of ideas across every platform.
        </div>
      </div>

      <div className="card card-pad" style={{ maxWidth: 920, margin: '0 auto 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
          {FIELDS.map(([k, label, ph]) => (
            <Field key={k} label={label}><Input value={vals[k] || ''} onChange={set(k)} placeholder={ph} /></Field>
          ))}
        </div>
        <Button variant="primary" icon="sparkles" loading={loading} onClick={() => run(null, 1900)} block style={{ marginTop: 8 }}>
          {loading ? 'Generating a day of ideas…' : 'Generate Content Ideas'}
        </Button>
      </div>

      {loading && <div style={{ maxWidth: 920, margin: '0 auto' }}><GenLoading label="Mining your inputs for ideas…" /></div>}

      {done && !loading && (
        <div className="fade-seq" style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* 10 daily ideas */}
          <InspoBlock title="10 Daily Content Ideas" icon="lightbulb" count={out.ideas.length}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {out.ideas.map((idea, i) => (
                <div key={i} className="qaction" onClick={() => { showToast('Loaded into generator', 'ok'); onNavigate('video'); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 15px', borderRadius: 11, background: 'var(--surface-2)', border: '1px solid var(--line)', cursor: 'pointer', animation: 'fadeUp .4s backwards', animationDelay: i * 45 + 'ms' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--gold-line)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--line)'}>
                  <div className="serif" style={{ fontSize: 17, color: 'var(--gold)', width: 26, flex: 'none', textAlign: 'center' }}>{i + 1}</div>
                  <div style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.4 }}>{idea}</div>
                  <Icon name="arrowRight" size={15} color="var(--text-faint)" style={{ marginLeft: 'auto', flex: 'none' }} />
                </div>
              ))}
            </div>
          </InspoBlock>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <InspoBlock title="5 Video Hooks" icon="video" count={5}>
              {out.hooks.map((htext, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: i < 4 ? '1px solid var(--line)' : 'none' }}>
                  <div style={{ fontSize: 13.5, color: 'var(--cream)', lineHeight: 1.5, flex: 1 }}>“{htext}”</div>
                  <Button size="sm" variant="secondary" onClick={() => { showToast('Hook loaded', 'ok'); onNavigate('video'); }}>Use Hook</Button>
                </div>
              ))}
            </InspoBlock>
            <InspoBlock title="5 LinkedIn Angles" brand="linkedin" count={5}>
              {out.linkedin.map((t, i) => <ListRow key={i} text={t} last={i === 4} />)}
            </InspoBlock>
            <InspoBlock title="5 X Post Ideas" brand="x" count={5}>
              {out.x.map((t, i) => <ListRow key={i} text={t} last={i === 4} mono />)}
            </InspoBlock>
            <InspoBlock title="3 Substack Essay Angles" brand="substack" count={3}>
              {out.substack.map((t, i) => <ListRow key={i} text={t} last={i === 2} />)}
            </InspoBlock>
            <InspoBlock title="3 Personal Story Prompts" icon="user" count={3}>
              {out.stories.map((t, i) => <ListRow key={i} text={t} last={i === 2} />)}
            </InspoBlock>
            <InspoBlock title="3 Philosophical Connections" icon="quote" count={3}>
              {out.philosophy.map((t, i) => <ListRow key={i} text={t} last={i === 2} />)}
            </InspoBlock>
            <InspoBlock title="3 Business Metaphors" icon="target" count={3} full>
              {out.metaphors.map((t, i) => <ListRow key={i} text={t} last={i === 2} />)}
            </InspoBlock>
          </div>
        </div>
      )}
    </div>
  );
}

function InspoBlock({ title, icon, brand, count, children, full }) {
  return (
    <div className="card card-pad" style={{ marginBottom: 18, gridColumn: full ? '1 / -1' : undefined }}>
      <div className="card-head" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {brand ? <Brand name={brand} size={18} /> : <Icon name={icon} size={17} color="var(--gold)" />}
          <div className="card-title" style={{ fontSize: 15 }}>{title}</div>
        </div>
        <span className="nav-badge">{count}</span>
      </div>
      {children}
    </div>
  );
}
function ListRow({ text, last, mono }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: last ? 'none' : '1px solid var(--line)' }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)', marginTop: 7, flex: 'none' }}></span>
      <div className={mono ? 'mono' : ''} style={{ fontSize: mono ? 12.5 : 13.5, color: 'var(--text-2)', lineHeight: 1.5, flex: 1 }}>{text}</div>
    </div>
  );
}
window.InspirationScreen = InspirationScreen;
