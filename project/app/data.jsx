/* ============================================================
   DATA — placeholder content for Adeniyi Content HQ
   ============================================================ */

const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',        icon: 'home' },
  { id: 'video',       label: 'Video Scripts',    icon: 'video' },
  { id: 'linkedin',    label: 'LinkedIn',         brand: 'linkedin' },
  { id: 'x',           label: 'X / Twitter',      brand: 'x' },
  { id: 'substack',    label: 'Substack',         brand: 'substack' },
  { id: 'inspiration', label: 'Daily Inspiration',icon: 'lightbulb' },
  { id: 'analyzer',    label: 'Script Analyzer',  icon: 'target' },
  { id: 'bank',        label: 'Content Bank',     icon: 'archive' },
  { id: 'calendar',    label: 'Content Calendar', icon: 'calendar' },
  { id: 'prompts',     label: 'Prompt Generator', icon: 'terminal' },
  { id: 'settings',    label: 'Settings',         icon: 'settings' },
];

const STATS = [
  { id: 'ideas',  name: 'Ideas Generated',   value: '128', trend: '+18%', color: 'var(--video)',    bg: 'var(--video-bg)',    icon: 'lightbulb', spark: 'purple' },
  { id: 'scripts',name: 'Scripts Ready',     value: '24',  trend: '+26%', color: 'var(--linkedin)', bg: 'var(--linkedin-bg)', icon: 'doc',       spark: 'teal' },
  { id: 'repurp', name: 'Repurposed Posts',  value: '186', trend: '+31%', color: 'var(--ready)',    bg: 'var(--ready-bg)',    icon: 'recycle',   spark: 'green' },
  { id: 'sched',  name: 'Content Scheduled', value: '31',  trend: '+15%', color: 'var(--generating)',bg: 'var(--generating-bg)',icon: 'calendar', spark: 'gold' },
  { id: 'bank',   name: 'Content Bank Items',value: '342', trend: '+22%', color: 'var(--video)',    bg: 'var(--video-bg)',    icon: 'archive',   spark: 'purple' },
];

const QUOTES = [
  { text: 'The unexamined strategy is just hope with a deck.', author: 'Naval Ravikant',
    reflection: 'Strategy without deep thinking is just activity. Clarity comes from stillness, not motion.' },
  { text: 'We suffer more often in imagination than in reality.', author: 'Seneca',
    reflection: 'Most of the obstacles you fear never arrive. Build for the work, not the worry.' },
  { text: 'You have power over your mind — not outside events. Realize this, and you will find strength.', author: 'Marcus Aurelius',
    reflection: 'The founder’s edge is not control of the market. It is composure inside the chaos.' },
  { text: 'The things you own end up owning you.', author: 'Chuck Palahniuk',
    reflection: 'Every feature, every commitment, every audience is a leash. Choose what owns you carefully.' },
  { text: 'Don’t tell me what you think, tell me what you have in your portfolio.', author: 'Nassim Taleb',
    reflection: 'Skin in the game is the only honest signal. Build content from things you actually risked.' },
  { text: 'A man is rich in proportion to the number of things he can let alone.', author: 'Henry David Thoreau',
    reflection: 'Focus is subtraction. The depth you want comes from saying no to the noise.' },
];

const RECENT_SCRIPT = {
  title: 'The Quiet Edge: Thinking Deeply in a Noisy World',
  date: 'May 16, 2025',
  words: '1,248',
  duration: '6:48',
  status: 'ready',
  excerpt: 'Why depth is your unfair advantage as a founder in the age of constant noise.',
};

const PIPELINE = [
  { id: 'li', label: 'LinkedIn Post',     brand: 'linkedin', sub: 'The Quiet Edge: Thinking Deeply…', status: 'ready',      note: 'Scheduled May 17, 9:00 AM', progress: 100 },
  { id: 'x',  label: 'X / Twitter Thread', brand: 'x',        sub: 'The Quiet Edge: 7 insights',          status: 'generating', note: '60%',                      progress: 60 },
  { id: 'sub',label: 'Substack Post',     brand: 'substack', sub: 'The Quiet Edge: Full Essay',          status: 'draft',      note: 'Edit to continue',          progress: 30 },
  { id: 'yt', label: 'YouTube Description',brand: 'youtube',  sub: 'The Quiet Edge: Thinking Deeply…', status: 'ready',      note: 'Optimized',                 progress: 100 },
];

const PERF_STATS = [
  { name: 'Impressions',     value: '82.4K', trend: '+28%', color: 'var(--c-purple)' },
  { name: 'Engagement Rate', value: '4.7%',  trend: '+12%', color: 'var(--c-teal)' },
  { name: 'Profile Visits',  value: '3.1K',  trend: '+35%', color: 'var(--c-gold)' },
  { name: 'Subscribers',     value: '+178',  trend: '+22%', color: 'var(--c-green)' },
];

const ANALYZER = {
  overall: 87,
  label: 'Great script!',
  tip: 'Strong hook and narrative flow. Consider adding a personal story moment in the middle to deepen emotional impact.',
  metrics: [
    { name: 'Hook Strength',    score: 90, color: 'var(--c-green)' },
    { name: 'Clarity',          score: 85, color: 'var(--c-green)' },
    { name: 'Depth',            score: 88, color: 'var(--c-green)' },
    { name: 'Emotional Impact', score: 84, color: 'var(--c-teal)' },
    { name: 'Call to Action',   score: 78, color: 'var(--generating)' },
  ],
};

const QUICK_ACTIONS = [
  { id: 'video',       title: 'Create New Script',     sub: 'Start from idea or blank', icon: 'doc',     color: 'var(--video)' },
  { id: 'repurpose',   title: 'Repurpose Content',      sub: 'Turn one piece into many', icon: 'recycle', color: 'var(--ready)' },
  { id: 'linkedin',    title: 'Generate LinkedIn Post', sub: 'From script or idea',      brand: 'linkedin' },
  { id: 'substack',    title: 'Write Substack Essay',   sub: 'Long-form content',        brand: 'substack' },
  { id: 'analyzer',    title: 'Analyze Script',         sub: 'Get AI feedback',          icon: 'target',  color: 'var(--gold)' },
];

// Calendar content map — keyed by day-of-month for May 2025
const CAL_CATEGORIES = {
  video:    { label: 'Video',     color: 'var(--video)' },
  linkedin: { label: 'LinkedIn',  color: 'var(--linkedin)' },
  x:        { label: 'X / Twitter', color: 'var(--c-teal)' },
  substack: { label: 'Substack',  color: 'var(--substack)' },
};

const CAL_TOPICS = {
  1:  { cats: ['linkedin'], topic: 'The gap between knowing and doing', platform: 'linkedin', hook: 'Most people know what to do. They just don’t do it.', message: 'Knowledge is abundant; execution is the scarce asset.', repurpose: 'Expand into a 3-tweet thread on discipline.', cta: 'What’s one thing you know but avoid?' },
  2:  { cats: ['video','x'], topic: 'Why self-awareness is a competitive advantage', platform: 'video', hook: 'The most underrated founder skill isn’t vision. It’s self-awareness.', message: 'Seeing yourself clearly compounds every other decision.', repurpose: 'Pull the hook into a standalone X one-liner.', cta: 'Audit one blind spot this week.' },
  5:  { cats: ['substack'], topic: 'The 100% of nothing trap', platform: 'substack', hook: 'You can own 100% of nothing, or 5% of something that matters.', message: 'Control is seductive; leverage is what builds influence.', repurpose: 'Trim into a LinkedIn post on letting go.', cta: 'Where are you over-owning?' },
  6:  { cats: ['linkedin','x'], topic: 'Depth as an unfair advantage', platform: 'linkedin', hook: 'In a world of fast takes, slow thinking is a moat.', message: 'Depth compounds; noise decays.', repurpose: 'Convert to a founder-lesson thread.', cta: 'Read one hard thing this week.' },
  8:  { cats: ['video'], topic: 'The cost of the unexamined strategy', platform: 'video', hook: 'A roadmap without reflection is just confident guessing.', message: 'Examine the strategy before you scale it.', repurpose: 'Repurpose into a Substack essay.', cta: 'Question one assumption today.' },
  9:  { cats: ['x'], topic: 'Skin in the game and honest content', platform: 'x', hook: 'Advice without risk is entertainment.', message: 'Create from things you actually staked something on.', repurpose: 'Expand into a LinkedIn carousel.', cta: 'Share one thing you risked.' },
  12: { cats: ['linkedin','substack'], topic: 'Building in public without performing', platform: 'linkedin', hook: 'There’s a difference between transparency and theatre.', message: 'Share the work, not the performance of work.', repurpose: 'Pull a quote for X.', cta: 'What would you share if no one clapped?' },
  13: { cats: ['video'], topic: 'The compounding of small reps', platform: 'video', hook: 'Influence isn’t a moment. It’s a thousand quiet reps.', message: 'Consistency beats intensity over a long enough horizon.', repurpose: 'Trim to a 3-tweet thread.', cta: 'Commit to one rep a day.' },
  15: { cats: ['x','linkedin'], topic: 'Why clarity beats cleverness', platform: 'x', hook: 'Clever impresses. Clear converts.', message: 'The goal of writing is to be understood, not admired.', repurpose: 'Expand into a LinkedIn post.', cta: 'Rewrite one sentence simpler.' },
  17: { cats: ['video','linkedin','x','substack'], topic: 'The Quiet Edge (flagship)', platform: 'video', hook: 'Let me challenge how you think for a second.', message: 'Depth is your unfair advantage in the age of noise.', repurpose: 'Full repurpose across all four platforms.', cta: 'Subscribe for the deep dives.' },
  19: { cats: ['substack'], topic: 'The discipline of saying no', platform: 'substack', hook: 'Every yes is a quiet no to something better.', message: 'Focus is the founder’s real superpower.', repurpose: 'Convert opening to a LinkedIn hook.', cta: 'What will you say no to this week?' },
  20: { cats: ['linkedin'], topic: 'Calm confidence over hype', platform: 'linkedin', hook: 'You don’t need to shout to be heard.', message: 'Calm authority outlasts loud certainty.', repurpose: 'Pull into an X one-liner.', cta: 'Lower the volume, raise the signal.' },
  22: { cats: ['video','x'], topic: 'Lessons from a failed launch', platform: 'video', hook: 'The launch flopped. Here’s what it taught me.', message: 'Failure is tuition if you actually read the receipt.', repurpose: 'Expand into a founder-lesson thread.', cta: 'Share a lesson from a failure.' },
  23: { cats: ['linkedin','substack'], topic: 'Thinking in decades, posting in days', platform: 'linkedin', hook: 'Play long-term games with long-term people.', message: 'Patience is a content strategy.', repurpose: 'Trim to a reflective X post.', cta: 'What are you building for 2035?' },
  26: { cats: ['x'], topic: 'The myth of the overnight idea', platform: 'x', hook: 'No idea is original. Execution is.', message: 'Your edge is the lived experience behind the idea.', repurpose: 'Expand into a LinkedIn post.', cta: 'Ship the unoriginal idea.' },
  27: { cats: ['video'], topic: 'How to think more clearly', platform: 'video', hook: 'Confusion is just unsorted thinking.', message: 'Writing is how you find out what you actually believe.', repurpose: 'Convert to a Substack essay.', cta: 'Write to think, not to publish.' },
  28: { cats: ['linkedin'], topic: 'The audience you don’t chase', platform: 'linkedin', hook: 'Stop writing for everyone. Write for the one.', message: 'Resonance beats reach.', repurpose: 'Pull a line for X.', cta: 'Who is your one reader?' },
  29: { cats: ['substack','x'], topic: 'Compounding influence', platform: 'substack', hook: 'Influence that lasts is built, not bought.', message: 'Trust compounds slower than attention — and lasts longer.', repurpose: 'Trim into a LinkedIn post.', cta: 'Invest in trust this week.' },
  30: { cats: ['video','linkedin'], topic: 'The reflective founder', platform: 'video', hook: 'The best founders I know journal more than they post.', message: 'Reflection is the input; content is the byproduct.', repurpose: 'Expand into a thread on journaling.', cta: 'Start a founder’s journal.' },
};

const BANK_ITEMS = [
  { id: 1, title: 'The Quiet Edge: Thinking Deeply in a Noisy World', platform: 'video', category: 'Philosophy', date: 'May 16, 2025', status: 'ready', words: 1248,
    preview: 'Depth is your unfair advantage as a founder in the age of constant noise. Let me show you why the quiet ones win.',
    body: 'HOOK\nLet me challenge how you think for a second. Most people know exactly what they should do. They just… don’t do it.\n\nINSIGHT\nDepth is your unfair advantage as a founder in the age of constant noise. Everyone is moving fast. Almost no one is thinking slowly. The quiet edge isn’t doing more — it’s understanding more before you move.\n\nCLOSE\nBefore you scale the plan, examine it. Before you post the take, sit with it. The founders who compound aren’t the loudest. They’re the ones who think one layer deeper than everyone else.' },
  { id: 2, title: 'Most people know what to do — they just don’t do it', platform: 'linkedin', category: 'Discipline', date: 'May 15, 2025', status: 'published', words: 196,
    preview: 'The gap between knowing and doing is the most expensive gap in business. Here’s how I close it daily.',
    body: 'Most people know exactly what they should do.\n\nThey just don’t do it.\n\nFor years I called that a discipline problem. I was wrong. It’s a depth problem.\n\n→ Speed feels like progress. Depth is progress.\n→ The unexamined strategy is just hope with a deck.\n→ The founders who compound aren’t the loudest. They’re the ones thinking one layer deeper.\n\nWhat’s one assumption you’re overdue to question?' },
  { id: 3, title: 'You can own 100% of nothing', platform: 'x', category: 'Founder Lesson', date: 'May 14, 2025', status: 'draft', words: 88,
    preview: 'Control is seductive. Leverage is what actually builds something that matters. A thread on letting go →',
    body: '1/ You can own 100% of nothing, or 5% of something that matters.\n\n2/ Control is seductive. It feels safe. It feels like ownership.\n\n3/ But leverage — not control — is what actually builds influence that compounds.\n\n4/ Where are you over-owning right now? That’s usually where the growth is hiding.' },
  { id: 4, title: 'Why self-awareness is a competitive advantage', platform: 'substack', category: 'Leadership', date: 'May 12, 2025', status: 'ready', words: 1410,
    preview: 'The most underrated founder skill isn’t vision or grit. It’s the ability to see yourself clearly.',
    body: 'SUBTITLE\nThe most underrated founder skill isn’t vision. It’s self-awareness — and it compounds every other decision you make.\n\nOPENING\nWe spend enormous energy understanding markets, competitors, and customers. We spend almost none understanding ourselves. Yet every strategic call passes through the same flawed instrument: our own judgement.\n\nMAIN ARGUMENT\nSeeing yourself clearly is a competitive advantage because it removes the most expensive variable from every decision — your blind spots…' },
  { id: 5, title: 'Skin in the game and honest content', platform: 'x', category: 'Philosophy', date: 'May 11, 2025', status: 'idea', words: 42,
    preview: 'Advice without risk is just entertainment. Create from the things you actually staked something on.',
    body: 'Advice without risk is just entertainment.\n\nThe best content you’ll ever make comes from the things you actually staked something on — and either won or lost.\n\nShare the scar, not the theory.' },
  { id: 6, title: 'Building in public without performing', platform: 'linkedin', category: 'Growth', date: 'May 9, 2025', status: 'ready', words: 178,
    preview: 'There’s a difference between transparency and theatre. Share the work, not the performance of work.',
    body: 'There’s a difference between transparency and theatre.\n\nTransparency is sharing the work.\nTheatre is performing the work for applause.\n\nOne builds trust slowly and permanently. The other builds attention quickly and temporarily.\n\nAsk yourself: what would you still share if no one clapped?' },
  { id: 7, title: 'The discipline of saying no', platform: 'substack', category: 'Focus', date: 'May 7, 2025', status: 'published', words: 1320,
    preview: 'Every yes is a quiet no to something better. Focus is the founder’s real and most underrated superpower.',
    body: 'OPENING\nEvery yes is a quiet no to something better. We rarely feel the cost of a yes in the moment — it arrives later, as the project you never had time to build.\n\nMAIN ARGUMENT\nFocus is not a personality trait. It’s a practice of subtraction — the willingness to disappoint people in the short term to do something that matters in the long term…' },
  { id: 8, title: 'Lessons from a launch that flopped', platform: 'video', category: 'Founder Lesson', date: 'May 5, 2025', status: 'draft', words: 980,
    preview: 'The launch flopped. Here are the three things it taught me that no successful launch ever could.',
    body: 'HOOK\nThe launch flopped. And it taught me three things no successful launch ever could.\n\nSTORY\nFast roadmap. Confident deck. Loud launch. Silence. I had mistaken motion for thought.\n\nINSIGHT\n1. Certainty is not the same as clarity.\n2. A loud launch can’t rescue a quiet idea.\n3. Failure is tuition — if you actually read the receipt.' },
];

// Generated script output (Video)
const SCRIPT_OUTPUT = [
  { label: 'Hook', body: 'Let me challenge how you think for a second. Most people know exactly what they should do. They just… don’t do it. And I used to think that was a discipline problem. It isn’t. It’s a depth problem.' },
  { label: 'Story', body: 'Two years ago I shipped a product I was certain about. Fast roadmap, confident deck, loud launch. It flopped. Not because the market was wrong — because I never sat still long enough to examine the strategy underneath the motion.' },
  { label: 'Insight', body: 'Depth is your unfair advantage as a founder in the age of constant noise. Everyone is moving fast. Almost no one is thinking slowly. The quiet edge isn’t doing more — it’s understanding more before you move.' },
  { label: 'Close', body: 'So here’s the invitation: before you scale the plan, examine it. Before you post the take, sit with it. The founders who compound aren’t the loudest. They’re the ones who think one layer deeper than everyone else.' },
  { label: 'Caption', body: 'The unexamined strategy is just hope with a deck. Depth is the quiet edge. 🧵↓' },
  { label: 'On-Screen Text', mono: true, body: '0:00  "Most people know what to do"\n0:08  "They just don’t do it"\n0:21  "It’s not discipline. It’s depth."\n0:40  "The quiet edge"' },
  { label: 'B-Roll Ideas', mono: true, body: '• Slow push-in on founder at desk, low light\n• Hand closing a laptop, deliberate\n• Empty whiteboard, single sentence\n• Walking shot, city at dawn, contemplative' },
  { label: 'Music Mood', body: 'Sparse, warm piano with a low ambient pad. Restrained tempo. Builds subtly under the Insight, resolves on the Close.' },
  { label: 'Recording Direction', body: 'Speak slower than feels natural. Hold a beat after the hook. Calm authority, not hype — like you’re telling one person something true, not performing for a crowd.' },
];

const LINKEDIN_OUTPUT = `Most people know exactly what they should do.

They just don't do it.

For years I called that a discipline problem. I was wrong.

It's a depth problem.

Two years ago I shipped a product I was certain about. Fast roadmap. Confident deck. Loud launch. It flopped — not because the market was wrong, but because I never sat still long enough to examine the strategy underneath all that motion.

Here's what I've learned since:

→ Speed feels like progress. Depth is progress.
→ The unexamined strategy is just hope with a deck.
→ The founders who compound aren't the loudest. They're the ones thinking one layer deeper than everyone else.

In a world optimised for fast takes, slow thinking is a moat.

Before you scale the plan, examine it.
Before you post the take, sit with it.

That's the quiet edge.

What's one assumption you're overdue to question?

#Founders #ThoughtLeadership #DeepWork #Leadership`;

const X_THREAD = [
  { n: 1, text: 'Most people know exactly what they should do.\n\nThey just don’t do it.\n\nI used to call that a discipline problem.\n\nIt’s a depth problem. 🧵' },
  { n: 2, text: '2 years ago I shipped a product I was certain about.\n\nFast roadmap. Confident deck. Loud launch.\n\nIt flopped.\n\nNot because the market was wrong — because I never sat still long enough to examine the strategy underneath the motion.' },
  { n: 3, text: 'Speed feels like progress.\n\nDepth IS progress.\n\nIn a world optimised for fast takes, slow thinking is a moat.' },
  { n: 4, text: 'The unexamined strategy is just hope with a deck.\n\nThe founders who compound aren’t the loudest.\n\nThey’re the ones thinking one layer deeper than everyone else.' },
  { n: 5, text: 'Before you scale the plan, examine it.\nBefore you post the take, sit with it.\n\nThat’s the quiet edge.\n\nWhat’s one assumption you’re overdue to question?' },
];

const SUBSTACK_OUTPUT = [
  { label: 'Title Options', accent: 'var(--substack)', body: '1. The Quiet Edge: Thinking Deeply in a Noisy World\n2. Why Depth Is the Last Unfair Advantage\n3. The Unexamined Strategy' },
  { label: 'Subtitle', accent: 'var(--gold)', body: 'In a world optimised for speed, slow thinking has quietly become a moat. A reflection on depth, discipline, and the founders who compound.' },
  { label: 'Opening Story', accent: 'var(--video)', body: 'Two years ago, I shipped a product I was certain about. The roadmap was fast, the deck was confident, the launch was loud. And it flopped — not because the market was wrong, but because I had mistaken motion for thought…' },
  { label: 'Main Argument', accent: 'var(--linkedin)', body: 'Knowledge has never been more abundant or more useless. The bottleneck is no longer information; it is the willingness to sit with it long enough to understand. Depth, not speed, is the scarce resource.' },
  { label: 'Section 1 — The Cost of Speed', accent: 'var(--c-teal)', body: 'Every fast take is a small loan against your credibility. Sometimes it pays off. Often it compounds into a reputation for noise rather than signal…' },
  { label: 'Section 2 — Depth as a Moat', accent: 'var(--c-teal)', body: 'A competitor can copy your features in a quarter. They cannot copy a decade of thinking clearly about the same problem…' },
  { label: 'Section 3 — The Practice', accent: 'var(--c-teal)', body: 'Depth is a practice, not a personality trait. It looks like writing to think, reading hard things slowly, and refusing to publish until you understand…' },
  { label: 'Practical Reflection', accent: 'var(--ready)', body: 'This week, pick one assumption underneath your current strategy. Write a page on why it might be wrong. You’ll either strengthen it or save yourself a flopped launch.' },
  { label: 'Closing Paragraph', accent: 'var(--gold)', body: 'The founders who compound aren’t the loudest in the room. They’re the ones thinking one layer deeper than everyone else — quietly, patiently, on purpose. That’s the edge. It always was.' },
  { label: 'Newsletter CTA', accent: 'var(--substack)', body: 'If this resonated, subscribe. Every week I share one reflection on building, thinking, and creating with depth in a noisy world.' },
];

// Daily Inspiration output
const INSPIRATION_OUTPUT = {
  ideas: [
    'The gap between knowing and doing', 'Why self-awareness is a competitive advantage',
    'The 100% of nothing trap', 'Depth as an unfair advantage', 'Building in public without performing',
    'The discipline of saying no', 'Why clarity beats cleverness', 'Lessons from a launch that flopped',
    'The myth of the overnight idea', 'Thinking in decades, posting in days',
  ],
  hooks: [
    'Let me challenge how you think for a second — most people know what to do. They just don’t do it.',
    'I shipped a product I was certain about. It flopped. Here’s what it actually taught me.',
    'In a world of fast takes, slow thinking is a moat. Here’s why.',
    'You can own 100% of nothing, or 5% of something that matters.',
    'The most underrated founder skill isn’t vision. It’s self-awareness.',
  ],
  linkedin: [
    'A reflection on why execution — not knowledge — is the scarce asset in 2025.',
    'The difference between transparency and theatre when building in public.',
    'How calm confidence outlasts loud certainty in a founder’s career.',
    'Why I journal more than I post (and why it makes the posts better).',
    'The audience you stop chasing is the one that finally listens.',
  ],
  x: [
    'Advice without risk is just entertainment.',
    'Clever impresses. Clear converts.',
    'No idea is original. Execution is.',
    'Every yes is a quiet no to something better.',
    'Influence isn’t a moment. It’s a thousand quiet reps.',
  ],
  substack: [
    'The Quiet Edge: a long-form essay on depth as the last unfair advantage.',
    'On saying no: how subtraction became my real content strategy.',
    'Skin in the game: why the best content comes from what you actually risked.',
  ],
  stories: [
    'The launch that flopped — and the one sentence on the whiteboard that explained why.',
    'The investor call where I realised I’d been confident, not clear.',
    'The week I stopped posting and started journaling, and what changed.',
  ],
  philosophy: [
    'Seneca on imagined suffering → the obstacles founders fear that never arrive.',
    'Taleb on skin in the game → honest content vs. performed expertise.',
    'Marcus Aurelius on control → composure inside startup chaos.',
  ],
  metaphors: [
    'A moat: depth of thinking competitors can’t copy in a quarter.',
    'Compound interest: trust accrues slower than attention, and lasts far longer.',
    'A leash: every feature and commitment you own also owns you.',
  ],
};

const PROMPT_TYPES = [
  { id: 1,  title: 'Generate Video Script',    sub: '45–60s from a core idea',  icon: 'video' },
  { id: 2,  title: 'Expand into Substack',      sub: 'Idea → long-form essay',   icon: 'pen' },
  { id: 3,  title: 'Convert to LinkedIn',       sub: 'Reframe for the feed',       brand: 'linkedin' },
  { id: 4,  title: 'Convert to X Thread',       sub: 'Break into tweets',          brand: 'x' },
  { id: 5,  title: 'Create 10 Hooks',           sub: 'Scroll-stopping openers',    icon: 'zap' },
  { id: 6,  title: 'Improve This Script',       sub: 'Tighten and sharpen',        icon: 'wand' },
  { id: 7,  title: 'Make More Natural',         sub: 'Less polished, more human',  icon: 'message' },
  { id: 8,  title: 'Make More Philosophical',   sub: 'Add depth and reflection',   icon: 'quote' },
  { id: 9,  title: 'Make More Personal',        sub: 'Lead with lived experience', icon: 'user' },
  { id: 10, title: 'Make Founder-Led',          sub: 'Builder’s point of view', icon: 'target' },
  { id: 11, title: 'Create Carousel Slides',    sub: 'Multi-slide breakdown',      icon: 'layers' },
];

const GENERATED_PROMPT = `You are a world-class content strategist and ghostwriter for a founder and product leader named Adeniyi. His voice is reflective, philosophical, grounded, and conversational — calm confidence, never hype.

TASK: Write a 45–60 second video script from the idea below.

CORE IDEA:
"""
[Paste your idea or draft here]
"""

REQUIREMENTS:
• Open with a hook that challenges the viewer's assumption in the first 3 seconds.
• Include one short, specific personal story or example.
• Land on a single, memorable insight — depth over breadth.
• Close with a calm, non-salesy call to reflection.
• Keep sentences short. Write for the ear, not the eye.
• Tone: thoughtful, philosophical, grounded. No buzzwords, no hype.

OUTPUT FORMAT:
HOOK / STORY / INSIGHT / CLOSE / CAPTION / ON-SCREEN TEXT / B-ROLL IDEAS

End with a one-line note on recording direction (pace, energy, delivery).`;

Object.assign(window, {
  NAV_ITEMS, STATS, QUOTES, RECENT_SCRIPT, PIPELINE, PERF_STATS, ANALYZER, QUICK_ACTIONS,
  CAL_CATEGORIES, CAL_TOPICS, BANK_ITEMS, SCRIPT_OUTPUT, LINKEDIN_OUTPUT, X_THREAD,
  SUBSTACK_OUTPUT, INSPIRATION_OUTPUT, PROMPT_TYPES, GENERATED_PROMPT,
});
