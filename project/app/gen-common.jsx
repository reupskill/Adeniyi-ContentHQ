/* ============================================================
   GENERATOR COMMONS — shared input panel + generate hook
   ============================================================ */

const TONES = ['Reflective', 'Philosophical', 'Conversational', 'Direct', 'Storytelling', 'Provocative'];
const CATEGORIES = ['Philosophy', 'Founder Lesson', 'Leadership', 'Discipline', 'Growth', 'Focus', 'Building'];
const LENSES = ['Stoicism', 'Naval / leverage', 'Taleb / antifragility', 'Systems thinking', 'First principles', 'None'];
const CTAS = ['Reflection question', 'Subscribe', 'Follow for more', 'Comment prompt', 'Soft sell', 'No CTA'];

function useGenerate() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const run = (cb, ms) => {
    setLoading(true); setDone(false);
    setTimeout(() => {
      setLoading(false); setDone(true);
      if (cb) cb();
      showToast('Content generated', 'ok');
    }, ms || 1500);
  };
  return { loading, done, setDone, run };
}

function GeneratorInputs({ values, onChange, fields, prefilled }) {
  const v = values || {};
  const set = (k) => (e) => onChange && onChange(k, e.target ? e.target.value : e);
  const show = (f) => !fields || fields.includes(f);
  return (
    <div>
      {prefilled && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 9, background: 'var(--gold-dim)', border: '1px solid var(--gold-line)', marginBottom: 16, fontSize: 12, color: 'var(--cream)' }}>
          <Icon name="zap" size={14} color="var(--gold)" />Pre-filled from “The Quiet Edge” script
        </div>
      )}
      {show('idea') && <Field label="Core Idea" req><Textarea value={v.idea || ''} onChange={set('idea')} placeholder="The one idea this content revolves around…" style={{ minHeight: 64 }} /></Field>}
      {show('story') && <Field label="Personal Story / Example"><Textarea value={v.story || ''} onChange={set('story')} placeholder="A lived moment that makes it real…" style={{ minHeight: 56 }} /></Field>}
      {show('audience') && <Field label="Target Audience"><Input value={v.audience || ''} onChange={set('audience')} placeholder="e.g. early-stage founders" /></Field>}
      {show('lesson') && <Field label="Main Lesson"><Input value={v.lesson || ''} onChange={set('lesson')} placeholder="The takeaway you want to land" /></Field>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {show('tone') && <Field label="Tone"><Select options={TONES} value={v.tone} onChange={set('tone')} /></Field>}
        {show('category') && <Field label="Content Category"><Select options={CATEGORIES} value={v.category} onChange={set('category')} /></Field>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {show('lens') && <Field label="Philosophical Lens"><Select options={LENSES} value={v.lens} onChange={set('lens')} /></Field>}
        {show('cta') && <Field label="CTA Type"><Select options={CTAS} value={v.cta} onChange={set('cta')} /></Field>}
      </div>
      {show('business') && <Field label="Business Lens"><Input value={v.business || ''} onChange={set('business')} placeholder="Tie it to a product or company angle" /></Field>}
      {show('variations') && (
        <Field label="Number of Variations">
          <Stepper value={v.variations || 1} onChange={(n) => onChange('variations', n)} min={1} max={3} />
        </Field>
      )}
    </div>
  );
}

// Default seed values so forms feel pre-loaded, not empty
const DEFAULT_GEN = {
  idea: 'Depth is the founder’s last unfair advantage in a noisy world.',
  story: 'I shipped a product I was certain about. It flopped because I never examined the strategy underneath the motion.',
  audience: 'Early-stage founders & builders',
  lesson: 'Think one layer deeper than everyone else.',
  tone: 'Reflective', category: 'Philosophy', lens: 'Naval / leverage', cta: 'Reflection question',
  business: 'Building a thought-leadership engine',
  variations: 1,
};

/* Two-panel generator layout */
function GenLayout({ left, right }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '344px 1fr', gap: 20, alignItems: 'start' }}>
      {left}
      {right}
    </div>
  );
}

function GenEmpty({ icon, title, sub }) {
  return (
    <div className="card" style={{ minHeight: 440, display: 'grid', placeItems: 'center' }}>
      <div className="empty-state">
        <div className="empty-ico" style={{ width: 64, height: 64 }}><Icon name={icon || 'sparkles'} size={28} color="var(--gold)" /></div>
        <div className="serif" style={{ fontSize: 19, color: 'var(--text)', marginBottom: 6 }}>{title}</div>
        <div className="muted" style={{ fontSize: 13, maxWidth: 300, margin: '0 auto' }}>{sub}</div>
      </div>
    </div>
  );
}

function GenLoading({ label }) {
  const steps = ['Reading your inputs', 'Finding the angle', 'Drafting sections', 'Polishing the voice'];
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 360);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="card" style={{ minHeight: 440, display: 'grid', placeItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, margin: '0 auto 18px', borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'var(--gold-dim)', border: '1px solid var(--gold-line)', boxShadow: '0 0 30px -6px rgba(201,169,110,0.5)', animation: 'pulse 1.4s ease-in-out infinite' }}>
          <span className="spinner spinner-light" style={{ width: 22, height: 22, borderWidth: 2.5 }}></span>
        </div>
        <div className="serif" style={{ fontSize: 18, color: 'var(--cream)', marginBottom: 14 }}>{label || 'Generating…'}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, alignItems: 'flex-start', width: 200, margin: '0 auto' }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12.5, color: i <= step ? 'var(--text)' : 'var(--text-faint)', transition: 'color .3s' }}>
              {i < step ? <Icon name="checkCircle" size={15} color="var(--c-green)" /> : i === step ? <span className="spinner spinner-light" style={{ width: 13, height: 13 }}></span> : <span style={{ width: 13, height: 13, borderRadius: '50%', border: '1.5px solid var(--text-faint)' }}></span>}
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const _pulseStyle = document.createElement('style');
_pulseStyle.textContent = '@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.08);opacity:.85}}';
document.head.appendChild(_pulseStyle);

Object.assign(window, {
  TONES, CATEGORIES, LENSES, CTAS, useGenerate, GeneratorInputs, DEFAULT_GEN,
  GenLayout, GenEmpty, GenLoading,
});
