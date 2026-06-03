/* ============================================================
   APP SHELL — routing between screens
   ============================================================ */
const TOPBAR = {
  dashboard:   null, // dashboard has its own welcome header
  video:       { title: 'Video Script Generator', sub: 'Turn one idea into a 45–60 second script' },
  linkedin:    { title: 'LinkedIn Post Generator', sub: 'Reflective posts that build influence' },
  x:           { title: 'X / Twitter Generator', sub: 'Sharp threads and one-liners' },
  substack:    { title: 'Substack Essay Builder', sub: 'Long-form thinking, fully structured' },
  inspiration: { title: 'Daily Inspiration', sub: 'A day of life → a week of content' },
  analyzer:    { title: 'Script Analyzer', sub: 'Score and sharpen your scripts' },
  bank:        { title: 'Content Bank', sub: 'Your personal content library' },
  calendar:    { title: 'Content Calendar', sub: '30-day content planning' },
  prompts:     { title: 'Prompt Generator', sub: 'Copy-ready prompts for any model' },
  settings:    { title: 'Settings', sub: 'Personalise your workspace' },
};

function App() {
  const [authed, setAuthed] = useState(() => localStorage.getItem('achq_authed') === '1');
  const [screen, setScreen] = useState(() => {
    const h = (location.hash || '').replace('#', '');
    return NAV_ITEMS.some((n) => n.id === h) ? h : 'dashboard';
  });

  const signIn = useCallback(() => { localStorage.setItem('achq_authed', '1'); setAuthed(true); showToast('Signed in to Adeniyi Content HQ', 'ok'); }, []);
  const signOut = useCallback(() => { localStorage.removeItem('achq_authed'); setAuthed(false); }, []);

  const navigate = useCallback((id) => {
    setScreen(id);
    location.hash = id;
    const main = document.querySelector('.main');
    if (main) main.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onHash = () => {
      const h = (location.hash || '').replace('#', '');
      if (NAV_ITEMS.some((n) => n.id === h)) setScreen(h);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // close any open dropdowns on outside click handled per-component; global esc for slideover handled there
  const renderScreen = () => {
    switch (screen) {
      case 'dashboard':   return <Dashboard onNavigate={navigate} onSignOut={signOut} />;
      case 'video':       return <VideoScreen />;
      case 'linkedin':    return <LinkedInScreen />;
      case 'x':           return <XScreen />;
      case 'substack':    return <SubstackScreen />;
      case 'inspiration': return <InspirationScreen onNavigate={navigate} />;
      case 'analyzer':    return <ScriptAnalyzer />;
      case 'bank':        return <ContentBank onNavigate={navigate} />;
      case 'calendar':    return <ContentCalendar onNavigate={navigate} />;
      case 'prompts':     return <PromptGenerator />;
      case 'settings':    return <Settings />;
      default:            return <Dashboard onNavigate={navigate} />;
    }
  };

  const tb = TOPBAR[screen];

  if (!authed) return (<React.Fragment><AuthScreen onAuth={signIn} /><ToastHost /></React.Fragment>);

  return (
    <div className="app">
      <Sidebar active={screen} onNavigate={navigate} onSignOut={signOut} />
      <div className="main" data-screen-label={screen}>
        {tb && <Topbar title={tb.title} sub={tb.sub} onSignOut={signOut} />}
        <div key={screen}>{renderScreen()}</div>
      </div>
      <ToastHost />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
