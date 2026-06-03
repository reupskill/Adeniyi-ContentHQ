/* ============================================================
   SCREEN: AUTH (sign in / create account gate)
   ============================================================ */
function AuthScreen({ onAuth }) {
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onAuth(); }, 900);
  };

  return (
    <div className="auth-wrap">
      {/* left brand panel */}
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <div className="brand" style={{ padding: 0, marginBottom: 0 }}>
            <div className="brand-mark"><BrandMark /></div>
            <div>
              <div className="brand-name">Adeniyi Content HQ</div>
              <div className="brand-sub">Thought Leadership Engine</div>
            </div>
          </div>

          <div>
            <h1 className="display" style={{ fontSize: 46, lineHeight: 1.08, color: 'var(--cream)', maxWidth: 480 }}>
              Create once.<br />Share everywhere.<br />Build influence that compounds.
            </h1>
            <p className="dim" style={{ fontSize: 15.5, lineHeight: 1.6, maxWidth: 420, marginTop: 22 }}>
              A bespoke creative command centre for generating, repurposing, and scheduling content with depth — across video, LinkedIn, X, and Substack.
            </p>
          </div>

          <div className="auth-quote">
            <Icon name="quote" size={22} color="var(--gold)" />
            <div>
              <div className="serif" style={{ fontSize: 19, color: 'var(--cream)', lineHeight: 1.35 }}>
                “The unexamined strategy is just hope with a deck.”
              </div>
              <div style={{ fontSize: 13, color: 'var(--gold)', marginTop: 8, fontWeight: 500 }}>— Naval Ravikant</div>
            </div>
          </div>
        </div>
        <div className="auth-glow"></div>
      </div>

      {/* right auth card */}
      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-lock">
            <Icon name="shield" size={22} color="var(--gold)" />
          </div>

          <h2 className="display" style={{ fontSize: 27, marginBottom: 6, textAlign: 'center' }}>Sign in to continue</h2>
          <p className="muted" style={{ fontSize: 13.5, marginBottom: 26, textAlign: 'center', lineHeight: 1.55 }}>
            This is a private workspace. Sign in with the authorized Google account to enter.
          </p>

          <button className="auth-google" onClick={submit} disabled={loading}>
            {loading ? <span className="spinner spinner-light"></span> : <Brand name="google" size={19} />}
            Continue with Google
          </button>

          <div className="auth-access">
            <Icon name="shield" size={15} color="var(--ready)" />
            Only the authorized Gmail account can access this workspace. All other sign-ins are declined.
          </div>
        </div>

        <div className="auth-foot muted">Secured by Google Auth · Single-user access</div>
      </div>
    </div>
  );
}
window.AuthScreen = AuthScreen;
