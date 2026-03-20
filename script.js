/* ═══════════════════════════════════════════════════
   UX PORTFOLIO - script.js
   ═══════════════════════════════════════════════════ */

// ── LOADER ─────────────────────────────────────────
(function () {
  var MAX_WAIT = 1200; // max ms before hiding loader
  var started = Date.now();

  function hideLoader() {
    var loader = document.getElementById('siteLoader');
    if (loader) loader.classList.add('hidden');
    // start typewriter if landing on cv view
    var saved = localStorage.getItem('pv') || 'recruiter';
    if (saved === 'recruiter') setTimeout(function () { if (window.rLoopStart) window.rLoopStart(); }, 200);
  }

  var fallback = setTimeout(hideLoader, MAX_WAIT);
  window.addEventListener('load', function () {
    var elapsed = Date.now() - started;
    var remaining = MAX_WAIT - elapsed;
    clearTimeout(fallback);
    // hide after a minimum of 600ms so the entrance animation plays
    setTimeout(hideLoader, Math.max(0, Math.min(remaining, 600)));
  });
})();

// ── AI CONFIG ──────────────────────────────────────
// For GitHub Pages, direct Anthropic API calls are blocked by CORS.
// Option A: Leave API_KEY empty → uses smart pre-written responses (works instantly)
// Option B: Deploy a Cloudflare Worker as proxy → see README
const AI_CONFIG = {
  API_KEY: '',            // Add your Anthropic API key here if using a proxy
  PROXY_URL: '',          // Your Cloudflare Worker / Vercel Edge Function URL
  MODEL: 'claude-sonnet-4-6',
  SYSTEM_PROMPT: `You are Priyanka Uttarkar, known online as pri.anka - a Product & UX Designer. You studied architecture, then completed a master's in HCI, and now you design digital products. You are empathetic, observant, detail-oriented, intentional, and curious. You love dogs deeply.

You are open to work. Answer questions about your projects:
- Healing Hearts: Mobile healthcare app redesign improving appointment booking UX
- WalletGyde: Personal finance app, +32% task completion through IA restructure and simplified onboarding
- Dashboard Statistics: End-to-end analytics dashboard redesign for enterprise users
- Orion Design System: 200+ components, full token library, Figma documentation built for scale
- Brand identity and visual design work

Your design process: Research → Define → Design → Test → Ship. You're currently in the Design phase of your next big project.

Speak in first person. Warm, intelligent, but not fluffy. No corporate buzzwords. Max 3 sentences per answer. End with something that invites a follow-up question or shows personality.

Tagline: "I notice what others walk past."

If anyone asks about your availability: you are actively looking for full-time Product or UX Design roles, especially in tech, healthtech, or fintech. Also open to freelance collabs.

If anyone asks about dogs: you are obsessed. You have two, a golden retriever and a dachshund.`
};

// ── Pre-written fallback responses ─────────────────
const SCRIPTED = {
  work: [
    "I've designed across mobile apps, SaaS dashboards, and design systems. My most impactful project was WalletGyde - I restructured the IA and simplified onboarding, which boosted task completion by 32%. Want to hear about Healing Hearts or the Orion Design System?",
    "My work spans product design, UX research, and design systems. Healing Hearts was a healthcare app where I redesigned the entire appointment booking flow - it was all about reducing anxiety at a vulnerable moment for users."
  ],
  process: [
    "Research → Define → Design → Test → Ship. But honestly, 'Research' isn't a phase for me - it's a constant mindset. I'm always observing, always asking why. The best insights come from noticing things others walk past.",
    "I start by understanding the problem space deeply before touching any tool. Define before you design - always. Then I prototype quickly, test with real users, and iterate. I'm currently in the Design phase on a new project."
  ],
  background: [
    "Architecture taught me to see space - how people move, where they hesitate, what they instinctively avoid. I brought that lens into a Master's in HCI, and now I apply it to digital products. The transition felt inevitable once I made it.",
    "I went from drawing floor plans to designing app flows. Both are fundamentally about the human experience of navigating space - physical or digital. The principles transfer more than people expect."
  ],
  available: [
    "Actively looking for full-time Product or UX Design roles, especially in tech, healthtech, or fintech. Also open to freelance collabs if the project is interesting enough. Say hello - let's see if we click.",
    "Yes! I'm available and excited about what's next. I'm drawn to teams that care about craft and move with intention. If that sounds like your team, I'd love to chat."
  ],
  systems: [
    "Orion is a design system I built from scratch - 200+ components, a full token library, and thorough Figma documentation. The goal was to make it so well-structured that any designer could onboard in a day. Systems thinking is really just good empathy at scale.",
    "I love design systems because they're the infrastructure nobody sees but everyone uses. Orion has 200+ components and a token architecture that makes theming effortless. It's the kind of work that multiplies every other designer's output."
  ],
  dogs: [
    "Absolutely obsessed. I have a golden retriever and a dachshund - completely opposite energy, the best combo. My golden is a professional morale booster, and the dachshund is convinced she runs the entire household. She's not wrong.",
    "Two dogs: a golden retriever who brings joy to every room, and a dachshund who brings chaos. Both excellent UX testers - if they walk away mid-interaction, the design failed."
  ],
  default: [
    "That's a great question - feel free to be more specific and I'll give you a real answer. Or try one of the chips below to explore my work, process, or background.",
    "I could answer this better with more context! Try asking about my projects, my design process, or my background. Or just ask if I'm available - the answer is yes."
  ]
};

function getScriptedResponse(query) {
  const q = query.toLowerCase();
  if (q.includes('project') || q.includes('work') || q.includes('portfolio') || q.includes('case')) return pick(SCRIPTED.work);
  if (q.includes('process') || q.includes('how do you') || q.includes('workflow') || q.includes('design process')) return pick(SCRIPTED.process);
  if (q.includes('background') || q.includes('architecture') || q.includes('hci') || q.includes('education') || q.includes('school')) return pick(SCRIPTED.background);
  if (q.includes('available') || q.includes('hire') || q.includes('job') || q.includes('opportunit') || q.includes('open to')) return pick(SCRIPTED.available);
  if (q.includes('design system') || q.includes('orion') || q.includes('component') || q.includes('token')) return pick(SCRIPTED.systems);
  if (q.includes('dog') || q.includes('pet') || q.includes('woof') || q.includes('golden')) return pick(SCRIPTED.dogs);
  return pick(SCRIPTED.default);
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ── Quick follow-up chips by topic ─────────────────
const FOLLOW_UPS = {
  work:     ['Tell me about WalletGyde', 'What about Healing Hearts?', 'Design System details'],
  process:  ['How do you do research?', 'Show me your work', 'Are you available?'],
  background: ['What projects have you worked on?', 'Are you available?'],
  available: ['See my work', 'What tools do you use?'],
  systems:  ['Other projects?', 'Tell me about your process', 'Are you available?'],
  dogs:     ['What about your work?', 'Are you available?'],
  default:  ['My work', 'Design process', 'Are you available?']
};

function getFollowUps(query) {
  const q = query.toLowerCase();
  if (q.includes('project') || q.includes('work') || q.includes('case')) return FOLLOW_UPS.work;
  if (q.includes('process') || q.includes('workflow')) return FOLLOW_UPS.process;
  if (q.includes('background') || q.includes('architecture') || q.includes('hci')) return FOLLOW_UPS.background;
  if (q.includes('available') || q.includes('hire') || q.includes('job')) return FOLLOW_UPS.available;
  if (q.includes('design system') || q.includes('orion')) return FOLLOW_UPS.systems;
  if (q.includes('dog') || q.includes('woof')) return FOLLOW_UPS.dogs;
  return FOLLOW_UPS.default;
}

// ── Case study data ─────────────────────────────────
const PROJECTS = {
  product: {
    title: 'Healing Hearts',
    img: 'assets/project-healinghearts.png',
    tags: ['Mobile App', 'UX Research', 'Prototyping', 'Healthcare'],
    stat: null,
    sections: [
      { h: 'Overview', p: 'Healing Hearts is a healthcare mobile app focused on improving the appointment booking experience for patients managing chronic conditions. The existing flow caused anxiety and drop-offs - people were giving up before they could get help.' },
      { h: 'My Role', p: 'End-to-end UX design: discovery research, IA restructure, wireframing, high-fidelity prototyping in Figma, and usability testing with 12 participants across two rounds.' },
      { h: 'Key Insight', p: '"I notice what others walk past." In this case - patients weren\'t dropping off because the app was hard to use. They were dropping off because the language felt clinical and cold. We redesigned the copy alongside the interface.' },
      { h: 'Outcome', p: 'Reduced booking drop-off by significant margins. Test participants described the new flow as "reassuring" and "like talking to a human". The design is now live in production.' }
    ]
  },
  wallet: {
    title: 'WalletGyde',
    img: 'assets/project-walletgyde.png',
    tags: ['Product Design', 'Finance', 'Mobile', 'IA'],
    stat: '+32%',
    statLabel: 'Task Completion',
    sections: [
      { h: 'Overview', p: 'WalletGyde is a personal finance app helping users track spending, set budgets, and understand their financial health. The app had strong features but terrible discoverability - users couldn\'t find what they needed.' },
      { h: 'The Problem', p: 'The information architecture had grown organically over time without a clear system. Core actions were buried 4-5 taps deep. The onboarding never explained the app\'s core value.' },
      { h: 'Solution', p: 'I restructured the IA around user mental models (not feature lists), simplified the nav from 7 items to 4, and redesigned the onboarding to front-load the "aha moment" - seeing your personal financial picture for the first time.' },
      { h: 'Outcome', p: 'Task completion rate increased by 32%. Users who completed onboarding were 2.4x more likely to be active after 30 days.' }
    ]
  },
  dashboard: {
    title: 'Dashboard Statistics',
    img: 'assets/project-dashboard.png',
    tags: ['SaaS', 'Data Viz', 'Product Design', 'Enterprise'],
    stat: null,
    sections: [
      { h: 'Overview', p: 'End-to-end redesign of an analytics dashboard for enterprise B2B users. The existing design was a data dump - everything visible, nothing prioritised, every user overwhelmed.' },
      { h: 'Research', p: 'Interviewed 8 power users and 6 occasional users. Key finding: power users needed density; occasional users needed guidance. The same UI was failing both.' },
      { h: 'Solution', p: 'Designed a progressive disclosure system - a clean summary view with drill-down capability. Introduced saved views, smart defaults, and a customisable layout for power users.' },
      { h: 'Result', p: 'Time-to-insight reduced significantly in usability testing. Both user groups rated the new design more favourably in post-test questionnaires.' }
    ]
  },
  systems: {
    title: 'Orion Design System',
    img: null,
    tags: ['Design Systems', 'Figma', 'Components', 'Tokens'],
    stat: '200+',
    statLabel: 'Components',
    sections: [
      { h: 'Overview', p: 'Orion is a design system I built from scratch - a single source of truth for a product team that had accumulated years of design debt and inconsistency.' },
      { h: 'Scope', p: '200+ components across atoms, molecules, organisms, and templates. Full design token library covering colour, typography, spacing, radius, and motion. Extensive Figma documentation and a component usage guide.' },
      { h: 'Philosophy', p: 'A design system is a product for your designers and developers. It needs to be well-designed, well-documented, and well-maintained. I treated adoption as a UX problem - if designers don\'t use it, it failed.' },
      { h: 'Outcome', p: 'Onboarding time for new designers dropped from weeks to days. Design-to-dev handoff became significantly smoother. The system is now actively maintained and extended by the team.' }
    ]
  }
};

// ── Clock ───────────────────────────────────────────
function updateClock() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  const el = document.getElementById('menuClock');
  if (el) el.textContent = `${h}:${m}`;
}
updateClock();
setInterval(updateClock, 30000);

// ── Theme toggle ────────────────────────────────────
function setTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  const icon = dark ? 'sun' : 'moon';
  document.querySelectorAll('#themeBtn, #menuThemeBtn').forEach(btn => {
    if (btn) btn.textContent = icon;
  });
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

// Init theme from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') setTheme(true);

document.getElementById('themeBtn')?.addEventListener('click', () => {
  setTheme(document.documentElement.getAttribute('data-theme') !== 'dark');
});
document.getElementById('menuThemeBtn')?.addEventListener('click', () => {
  setTheme(document.documentElement.getAttribute('data-theme') !== 'dark');
});

// ── View toggle ─────────────────────────────────────
function switchView(target) {
  document.querySelectorAll('.view-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.view === target);
  });
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`view-${target}`)?.classList.add('active');
  localStorage.setItem('pv', target);
  if (target === 'recruiter') rActivate();
}

document.querySelectorAll('.view-btn').forEach(btn => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});

// Restore last view (default: recruiter)
(function() {
  const saved = localStorage.getItem('pv') || 'recruiter';
  if (saved !== 'recruiter') switchView(saved);
})();

// ── AI Search ───────────────────────────────────────
const searchInput = document.getElementById('searchInput');
const sendBtn = document.getElementById('sendBtn');
const answerPanel = document.getElementById('answerPanel');
const typingDots = document.getElementById('typingDots');
const answerText = document.getElementById('answerText');
const answerChips = document.getElementById('answerChips');

async function askAI(query) {
  if (!query.trim()) return;

  // Show answer panel + typing
  answerPanel.classList.add('visible');
  answerPanel.style.display = 'block';
  typingDots.classList.remove('hidden');
  answerText.textContent = '';
  answerChips.innerHTML = '';

  // If proxy configured, use real API; otherwise scripted
  let responseText = '';

  if (AI_CONFIG.PROXY_URL && AI_CONFIG.API_KEY) {
    try {
      const res = await fetch(AI_CONFIG.PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: AI_CONFIG.MODEL,
          max_tokens: 300,
          system: AI_CONFIG.SYSTEM_PROMPT,
          messages: [{ role: 'user', content: query }]
        })
      });
      const data = await res.json();
      responseText = data.content?.[0]?.text || getScriptedResponse(query);
    } catch (e) {
      responseText = getScriptedResponse(query);
    }
  } else {
    // Simulate typing delay for scripted responses
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    responseText = getScriptedResponse(query);
  }

  // Hide typing, show response with typewriter effect
  typingDots.classList.add('hidden');
  typewriterEffect(answerText, responseText, () => {
    // Show follow-up chips
    const fups = getFollowUps(query);
    answerChips.innerHTML = fups.map(q =>
      `<button class="chip" data-q="${q}" onclick="handleChip(this)">${q}</button>`
    ).join('');
  });
}

function typewriterEffect(el, text, onDone) {
  let i = 0;
  el.textContent = '';
  const interval = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      if (onDone) onDone();
    }
  }, 12);
}

function handleChip(btn) {
  const q = btn.dataset.q;
  searchInput.value = q;
  askAI(q);
}

// Chip clicks (initial chips)
document.querySelectorAll('#chips .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    searchInput.value = chip.dataset.q;
    askAI(chip.dataset.q);
  });
});

// Send button + Enter key
sendBtn.addEventListener('click', () => askAI(searchInput.value));
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') askAI(searchInput.value);
});

// Close answer panel when clicking outside search wrap
document.addEventListener('click', e => {
  const wrap = document.getElementById('searchWrap');
  if (wrap && !wrap.contains(e.target)) {
    answerPanel.style.display = 'none';
    answerPanel.classList.remove('visible');
  }
});

// ── Case Study Modal ────────────────────────────────
function openModal(projectKey) {
  const project = PROJECTS[projectKey];
  if (!project) return;

  const inner = document.getElementById('modalInner');
  inner.innerHTML = `
    ${project.img ? `<img src="${project.img}" class="modal-img" alt="${project.title}" />` : `<div class="modal-img" style="background:#EEF5FF;display:flex;align-items:center;justify-content:center;font-size:4rem;">🧩</div>`}
    <div class="modal-title">${project.title}</div>
    <div class="modal-tags">${project.tags.map(t => `<span class="modal-tag">${t}</span>`).join('')}</div>
    ${project.stat ? `<div><span class="modal-stat">${project.stat}</span><span style="font-size:0.78rem;color:var(--text-muted);font-weight:600;">${project.statLabel}</span></div>` : ''}
    <div class="modal-body">${project.sections.map(s => `<h4>${s.h}</h4><p>${s.p}</p>`).join('')}</div>
  `;

  document.getElementById('modalBg').classList.add('open');
  document.body.style.overflow = 'hidden';
}

document.getElementById('modalClose')?.addEventListener('click', closeModal);
document.getElementById('modalBg')?.addEventListener('click', e => {
  if (e.target === document.getElementById('modalBg')) closeModal();
});

function closeModal() {
  document.getElementById('modalBg')?.classList.remove('open');
  document.body.style.overflow = document.querySelector('#view-recruiter.active') ? 'auto' : 'hidden';
}

// Keyboard close
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// Card navigation is handled by the stack-anchor <a> tag.

// Recruiter card click → open modal
document.querySelectorAll('.rec-card').forEach(card => {
  card.addEventListener('click', () => {
    const project = card.dataset.project;
    if (project) openModal(project);
  });
});

// ── Dock hover magnification ────────────────────────
document.querySelectorAll('.dock-item').forEach(item => {
  item.addEventListener('mouseenter', function() {
    const siblings = [...this.parentElement.querySelectorAll('.dock-item')];
    const idx = siblings.indexOf(this);
    siblings.forEach((sib, i) => {
      const dist = Math.abs(i - idx);
      if (dist === 0) {
        sib.style.transform = 'translateY(-10px) scale(1.25)';
      } else if (dist === 1) {
        sib.style.transform = 'translateY(-5px) scale(1.12)';
      } else {
        sib.style.transform = '';
      }
    });
  });
  item.addEventListener('mouseleave', function() {
    this.parentElement.querySelectorAll('.dock-item').forEach(sib => {
      sib.style.transform = '';
    });
  });
});

// ── Sticker drag (basic) ────────────────────────────
document.querySelectorAll('.sticker').forEach(sticker => {
  let isDragging = false;
  let startX, startY, origLeft, origTop;

  sticker.style.cursor = 'grab';

  sticker.addEventListener('mousedown', e => {
    isDragging = true;
    sticker.style.cursor = 'grabbing';
    sticker.style.zIndex = '999';
    startX = e.clientX;
    startY = e.clientY;
    const rect = sticker.getBoundingClientRect();
    const desktopRect = document.getElementById('desktop').getBoundingClientRect();
    origLeft = rect.left - desktopRect.left;
    origTop = rect.top - desktopRect.top;
    sticker.style.left = origLeft + 'px';
    sticker.style.top = origTop + 'px';
    // Clear the positioning shortcuts that might conflict
    sticker.style.right = 'auto';
    sticker.style.bottom = 'auto';
    sticker.style.transform = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    sticker.style.left = (origLeft + dx) + 'px';
    sticker.style.top = (origTop + dy) + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      sticker.style.cursor = 'grab';
      sticker.style.zIndex = '12';
    }
  });
});

// ── ARRANGE MODE ────────────────────────────────────
// Drag any desktop element to reposition it.
// Click "Arrange" in the top bar, drag things around,
// then hit "Copy positions" and paste to me!
const ARRANGE_LABELS = {
  'work':        'Card stack',
  'process':     'Process widget',
  'about':       'About card',
  'contact':     'Talk card',
  'stk-dog':     'Dog sticker',
  'stk-dach':    'Dachshund',
  'stk-plant':   'Plant sticker',
  'stk-books':   'Books sticker',
  'stk-sparkle': 'Sparkle 1',
  'stk-sparkle2':'Sparkle 2',
  'stk-hw':      'Handwritten',
  'stk-dogs-row':'Dogs row sticker',
  'hero':        'Hero text',
  'searchWrap':  'Search bar',
  'float-toolbar': 'Toolbar'
};

let isArranging = false;
let arrangePanel = null;
let arrangeDragActive = null;

function toggleArrangeMode() {
  isArranging = !isArranging;
  const btn = document.getElementById('arrangeBtn');
  const desktop = document.getElementById('desktop');

  if (isArranging) {
    btn.classList.add('active');
    btn.textContent = 'Done arranging';
    document.body.classList.add('arranging');
    setupDesktopDrag(desktop);
    showArrangePanel();
  } else {
    btn.classList.remove('active');
    btn.textContent = 'Arrange';
    document.body.classList.remove('arranging');
    hideArrangePanel();
  }
}

function showArrangePanel() {
  if (!arrangePanel) {
    arrangePanel = document.createElement('div');
    arrangePanel.className = 'arrange-panel';
    arrangePanel.innerHTML = `
      <div class="arrange-panel-title">Drag elements above to reposition - then copy and send to me</div>
      <div class="arrange-positions" id="arrangePositions"></div>
      <div class="arrange-actions">
        <button class="arrange-copy-btn" id="arrangeCopyBtn" onclick="copyArrangePositions()">Copy positions</button>
        <button class="arrange-done-btn" onclick="toggleArrangeMode()">Done</button>
      </div>
    `;
    document.body.appendChild(arrangePanel);
  }
  arrangePanel.classList.add('visible');
  updateArrangeDisplay();
}

function hideArrangePanel() {
  if (arrangePanel) arrangePanel.classList.remove('visible');
}

function getArrangePositions() {
  const desktop = document.getElementById('desktop');
  if (!desktop) return [];
  const dRect = desktop.getBoundingClientRect();
  const dW = dRect.width;
  const dH = dRect.height;
  const items = [];

  desktop.querySelectorAll(':scope > *').forEach(el => {
    const id = el.id || '';
    const label = ARRANGE_LABELS[id] || id || el.className.split(' ')[0];
    const rect = el.getBoundingClientRect();
    const topPx  = rect.top  - dRect.top;
    const leftPx = rect.left - dRect.left;
    const topPct  = Math.round((topPx / dH) * 100);
    const leftPct = Math.round((leftPx / dW) * 100);
    items.push({ id, label, topPct, leftPct, topPx: Math.round(topPx), leftPx: Math.round(leftPx) });
  });
  return items;
}

function getStickerSizes() {
  const sizes = [];
  document.querySelectorAll('.sticker').forEach(sticker => {
    const img = sticker.querySelector('.sticker-png');
    if (!img || !sticker.id) return;
    const label = ARRANGE_LABELS[sticker.id] || sticker.id;
    sizes.push({ id: sticker.id, label, width: img.offsetWidth });
  });
  return sizes;
}

function updateArrangeDisplay() {
  const el = document.getElementById('arrangePositions');
  if (!el) return;
  const positions = getArrangePositions();
  const sizes = getStickerSizes();
  let text = positions
    .map(p => `${p.label.padEnd(18)} top:${String(p.topPct+'%').padEnd(6)} left:${p.leftPct+'%'}`)
    .join('\n');
  if (sizes.length) {
    text += '\n\n--- Sticker sizes ---\n' +
      sizes.map(s => `${s.label.padEnd(18)} ${s.width}px`).join('\n');
  }
  el.textContent = text;
}

function copyArrangePositions() {
  const positions = getArrangePositions();
  const sizes = getStickerSizes();
  let text = '--- Layout Positions ---\n' +
    positions.map(p => `${p.label}: top:${p.topPct}%  left:${p.leftPct}%`).join('\n');
  if (sizes.length) {
    text += '\n\n--- Sticker sizes ---\n' +
      sizes.map(s => `${s.label}: ${s.width}px`).join('\n');
  }

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('arrangeCopyBtn');
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy positions'; }, 2000);
  }).catch(() => {
    prompt('Copy this:', text);
  });
}

function setupDesktopDrag(desktop) {
  desktop.querySelectorAll(':scope > *').forEach(el => {
    if (el._arrangeDragReady) return;
    el._arrangeDragReady = true;

    // Add label tag
    const tag = document.createElement('div');
    tag.className = 'arrange-label-tag';
    tag.textContent = ARRANGE_LABELS[el.id] || el.id || 'element';
    el.style.position = el.style.position || 'absolute';
    el.appendChild(tag);

    let dragging = false, sx, sy, sl, st;

    el.addEventListener('mousedown', e => {
      if (!isArranging) return;
      e.preventDefault();
      e.stopPropagation();
      // Also suppress the upcoming click so anchors don't navigate
      const suppressClick = ev => { ev.preventDefault(); ev.stopPropagation(); el.removeEventListener('click', suppressClick, true); };
      el.addEventListener('click', suppressClick, { capture: true, once: true });
      dragging = true;
      arrangeDragActive = el;

      const dRect = desktop.getBoundingClientRect();
      const rect  = el.getBoundingClientRect();
      sx = e.clientX;
      sy = e.clientY;
      sl = rect.left - dRect.left;
      st = rect.top  - dRect.top;

      // Convert to absolute top/left
      el.style.left   = sl + 'px';
      el.style.top    = st + 'px';
      el.style.right  = 'auto';
      el.style.bottom = 'auto';
      el.classList.add('dragging-item');
    }, { capture: true });

    document.addEventListener('mousemove', e => {
      if (!dragging || arrangeDragActive !== el) return;
      el.style.left = (sl + e.clientX - sx) + 'px';
      el.style.top  = (st + e.clientY - sy) + 'px';
      updateArrangeDisplay();
    });

    document.addEventListener('mouseup', () => {
      if (dragging && arrangeDragActive === el) {
        dragging = false;
        arrangeDragActive = null;
        el.classList.remove('dragging-item');
        updateArrangeDisplay();
      }
    });
  });
}

// Block ALL link navigation and click events while arranging
document.addEventListener('click', e => {
  if (!isArranging) return;
  e.preventDefault();
  e.stopPropagation();
}, { capture: true });

// ── Secret developer shortcut: Alt+Shift+A triggers arrange mode ──
document.addEventListener('keydown', e => {
  if (e.altKey && e.shiftKey && e.key === 'A') toggleArrangeMode();
});

// ── Fun sticker drag for all visitors ───────────────
// Stickers are freely draggable by anyone — positions reset on refresh.
let activeStickerDrag = null;

function setupFunStickerDrag() {
  document.querySelectorAll('.sticker, .newspaper-clip').forEach(sticker => {
    if (sticker._funDragReady) return;
    sticker._funDragReady = true;

    let startX, startY, origLeft, origTop;

    sticker.addEventListener('mousedown', e => {
      if (isArranging) return; // arrange mode handles its own drag
      e.preventDefault();
      const desktop = document.getElementById('desktop');
      const dRect  = desktop.getBoundingClientRect();
      const sRect  = sticker.getBoundingClientRect();
      origLeft = sRect.left - dRect.left;
      origTop  = sRect.top  - dRect.top;
      startX = e.clientX;
      startY = e.clientY;
      sticker.style.left   = origLeft + 'px';
      sticker.style.top    = origTop  + 'px';
      sticker.style.right  = 'auto';
      sticker.style.bottom = 'auto';
      activeStickerDrag = { sticker, origLeft, origTop, startX, startY };
      sticker.style.zIndex = '200';
      sticker.style.cursor = 'grabbing';
    });
  });
}

document.addEventListener('mousemove', e => {
  if (!activeStickerDrag) return;
  const { sticker, origLeft, origTop, startX, startY } = activeStickerDrag;
  // Divide mouse delta by canvas scale so drag speed matches element scale
  sticker.style.left = (origLeft + (e.clientX - startX) / cvScale) + 'px';
  sticker.style.top  = (origTop  + (e.clientY - startY) / cvScale) + 'px';
});

document.addEventListener('mouseup', () => {
  if (!activeStickerDrag) return;
  activeStickerDrag.sticker.style.zIndex = '12';
  activeStickerDrag.sticker.style.cursor = '';
  activeStickerDrag = null;
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupFunStickerDrag);
} else {
  setupFunStickerDrag();
}


// ── CANVAS / ARTBOARD ───────────────────────────────
const cvViewport = document.getElementById('cvViewport');
const cvSurface  = document.getElementById('cvSurface');
const cvBadge    = document.getElementById('cvBadge');
const cvBackBtn  = document.getElementById('cvBackBtn');

let cvScale = 1;
let cvX = 0;
let cvY = 0;
let cvSpaceHeld = false;
let cvPanning = false;
let cvPanStart = { x: 0, y: 0 };
let cvBadgeTimer = null;
let cvBackTimer  = null;

const CV_MIN = 0.1;
const CV_MAX = 4;

function cvApply(animate) {
  if (animate) {
    cvSurface.style.transition = 'transform 0.18s cubic-bezier(0.25,0.46,0.45,0.94)';
    setTimeout(() => { cvSurface.style.transition = ''; }, 200);
  } else {
    cvSurface.style.transition = '';
  }
  cvSurface.style.transform = `translate(${cvX}px,${cvY}px) scale(${cvScale})`;
  cvShowBadge();
  cvCheckBack();
}

function cvShowBadge() {
  cvBadge.textContent = Math.round(cvScale * 100) + '%';
  cvBadge.classList.add('cv-badge-visible');
  clearTimeout(cvBadgeTimer);
  cvBadgeTimer = setTimeout(() => cvBadge.classList.remove('cv-badge-visible'), 1200);
}

function cvCheckBack() {
  // Is the artboard still meaningfully visible in the viewport?
  const vw = cvViewport.clientWidth;
  const vh = cvViewport.clientHeight;
  const aw = cvSurface.offsetWidth  * cvScale;
  const ah = cvSurface.offsetHeight * cvScale;
  const inX = cvX + aw > 60 && cvX < vw - 60;
  const inY = cvY + ah > 60 && cvY < vh - 60;
  const visible = inX && inY;
  cvBackBtn.classList.toggle('cv-back-visible', !visible);
}

function cvZoom(delta, ox, oy) {
  const factor = delta > 0 ? 1 / 1.12 : 1.12;
  const next = Math.min(CV_MAX, Math.max(CV_MIN, cvScale * factor));
  const ratio = next / cvScale;
  cvX = ox - ratio * (ox - cvX);
  cvY = oy - ratio * (oy - cvY);
  cvScale = next;
  cvApply();
}

function cvReframe() {
  // Fit artboard to viewport with padding
  const vw = cvViewport.clientWidth;
  const vh = cvViewport.clientHeight;
  const aw = cvSurface.offsetWidth;
  const ah = cvSurface.offsetHeight;
  const pad = 40;
  const s = Math.min((vw - pad * 2) / aw, (vh - pad * 2) / ah, 1);
  cvScale = s;
  cvX = (vw - aw * s) / 2;
  cvY = (vh - ah * s) / 2;
  cvApply(true);
}

// Wheel — zoom centered on cursor
cvViewport.addEventListener('wheel', e => {
  e.preventDefault();
  const r = cvViewport.getBoundingClientRect();
  cvZoom(e.deltaY, e.clientX - r.left, e.clientY - r.top);
}, { passive: false });

// Middle-mouse or Space+drag to pan
cvViewport.addEventListener('mousedown', e => {
  if (e.button === 1 || (e.button === 0 && cvSpaceHeld)) {
    e.preventDefault();
    cvPanning = true;
    cvPanStart = { x: e.clientX - cvX, y: e.clientY - cvY };
    cvViewport.classList.add('cv-panning');
  }
});
document.addEventListener('mousemove', e => {
  if (!cvPanning) return;
  cvX = e.clientX - cvPanStart.x;
  cvY = e.clientY - cvPanStart.y;
  cvApply();
});
document.addEventListener('mouseup', e => {
  if (cvPanning && (e.button === 1 || e.button === 0)) {
    cvPanning = false;
    cvViewport.classList.remove('cv-panning');
  }
});

// Space key
document.addEventListener('keydown', e => {
  if (e.code === 'Space' && !e.target.matches('input,textarea,[contenteditable="true"]')) {
    if (!cvSpaceHeld) { cvSpaceHeld = true; cvViewport.classList.add('cv-spaceheld'); }
    e.preventDefault();
  }
  // Ctrl+0 — reset/fit
  if (e.key === '0' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); cvReframe(); }
  // Ctrl++ / Ctrl+-
  if ((e.key === '=' || e.key === '+') && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    cvZoom(-1, cvViewport.clientWidth / 2, cvViewport.clientHeight / 2);
  }
  if (e.key === '-' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    cvZoom(1, cvViewport.clientWidth / 2, cvViewport.clientHeight / 2);
  }
});
document.addEventListener('keyup', e => {
  if (e.code === 'Space') {
    cvSpaceHeld = false;
    cvViewport.classList.remove('cv-spaceheld');
    if (!cvPanning) cvViewport.classList.remove('cv-panning');
  }
});

// Touch pinch zoom
let cvLastPinchDist = null;
cvViewport.addEventListener('touchstart', e => {
  if (e.touches.length === 2) {
    cvLastPinchDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
  }
}, { passive: true });
cvViewport.addEventListener('touchmove', e => {
  if (e.touches.length !== 2 || !cvLastPinchDist) return;
  e.preventDefault();
  const dist = Math.hypot(
    e.touches[0].clientX - e.touches[1].clientX,
    e.touches[0].clientY - e.touches[1].clientY
  );
  const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
  const my = (e.touches[0].clientY + e.touches[1].clientY) / 2;
  cvZoom((cvLastPinchDist - dist) * 0.8, mx, my);
  cvLastPinchDist = dist;
}, { passive: false });
cvViewport.addEventListener('touchend', () => { cvLastPinchDist = null; });

// Init — start at scale 1, centered (artboard fills viewport naturally)
window.addEventListener('load', () => {
  // Artboard is already viewport-sized at scale 1, so no initial offset needed
  cvApply();
});

console.log('%c pri.anka - I notice what others walk past.', 'font-family:serif;font-size:14px;color:#f0e040;background:#1a1a1a;padding:8px 16px;border-radius:6px;');

// ── RECRUITER VIEW ──────────────────────────────────

const rDiv = document.getElementById('view-recruiter');

// Location + time
function rUpdateTime() {
  const now = new Date();
  const h = now.getHours(), m = now.getMinutes().toString().padStart(2,'0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const timeStr = `${(h%12)||12}:${m} ${ampm}`;
  const heroLoc = document.getElementById('rHeroLoc');
  const stripTime = document.getElementById('rLocTime');
  if (heroLoc) heroLoc.textContent = `Tempe, AZ  •  ${timeStr}`;
  if (stripTime) stripTime.textContent = timeStr;
}
rUpdateTime();
setInterval(rUpdateTime, 30000);

// Called when the recruiter view becomes active
function rActivate() {
  if (rDiv) rDiv.scrollTop = 0;
  setTimeout(() => { if (window.rLoopStart) window.rLoopStart(); }, 50);
}

let rTwTimer = null;
function rTypewriterStart() {
  const word = 'Priyanka';
  const el = document.getElementById('rTypeword');
  const cursor = document.getElementById('rTypeCursor');
  if (!el || !cursor) return;
  if (rTwTimer) clearInterval(rTwTimer);
  el.textContent = '';
  cursor.classList.remove('done');
  let i = 0;
  rTwTimer = setInterval(() => {
    el.textContent += word[i];
    i++;
    if (i >= word.length) {
      clearInterval(rTwTimer);
      setTimeout(() => cursor.classList.add('done'), 1000);
    }
  }, 80);
}



// "View Work" hero button scrolls to tiles within the recruiter div
document.getElementById('rHeroWork')?.addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('rct-section')?.scrollIntoView({ behavior: 'smooth' });
});

// Phone chat bot
(function() {
  const responses = {
    'design-process': "I start with the problem, not a wireframe. First I spend time obsessing over what question we're actually answering — then I map the ecosystem before touching a screen. Figma comes later.",
    'availability': "Open to full-time product design roles right now. Based in Tempe, AZ — totally fine with remote or hybrid. If you're building something people will actually use, I want to talk.",
    'background': "Architecture → HCI. I spent years designing physical spaces, then switched to digital. The overlap is bigger than you'd think — both are about how people move through & feel inside a space.",
    'design-systems': "I built Orion, a design system for Mayo Clinic covering 40+ components used across internal tools. Tokens, documentation, the whole thing. Design systems are the most underrated leverage in any org.",
    'thinking': "I think in constraints. Give me a tight brief over a blank canvas any day — the best solutions I've made came from a wall I wasn't supposed to get past.",
  };
  const fallback = "Hmm, try one of the chips below — or ask me about my work, process, or background!";

  const msgs = document.getElementById('rpchatMessages');
  const input = document.getElementById('rpchatInput') || document.querySelector('.rchat-input');
  const sendBtn = document.getElementById('rpchatSend') || document.querySelector('.rchat-send');
  const chips = document.querySelectorAll('.rpchat-chip');
  if (!msgs) return;

  function addMsg(text, isUser) {
    const wrap = document.createElement('div');
    wrap.className = 'rchat-row rchat-live ' + (isUser ? 'rchat-row--user' : 'rchat-row--bot');
    const bubble = document.createElement('div');
    bubble.className = 'rchat-bub ' + (isUser ? 'rchat-bub--user' : 'rchat-bub--bot');
    bubble.textContent = text;
    wrap.appendChild(bubble);
    msgs.appendChild(wrap);
    msgs.scrollTop = msgs.scrollHeight;
    return wrap;
  }

  function botReply(key) {
    const typing = document.createElement('div');
    typing.className = 'rchat-row rchat-live rchat-row--bot';
    typing.innerHTML = '<div class="rchat-typing-dots"><span></span><span></span><span></span></div>';
    msgs.appendChild(typing);
    msgs.scrollTop = msgs.scrollHeight;
    setTimeout(() => {
      typing.remove();
      addMsg(responses[key] || fallback, false);
    }, 900);
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.q;
      const label = chip.textContent;
      addMsg(label, true);
      botReply(q);
    });
  });

  function handleSend() {
    const val = input.value.trim();
    if (!val) return;
    input.value = '';
    addMsg(val, true);
    const lc = val.toLowerCase();
    let key = 'fallback';
    if (lc.match(/process|workflow|approach|how.*(work|design)/)) key = 'design-process';
    else if (lc.match(/availab|hire|open|role|job|opportunit/)) key = 'availability';
    else if (lc.match(/background|story|archit|hci|studied|school/)) key = 'background';
    else if (lc.match(/system|orion|component|token|ds/)) key = 'design-systems';
    else if (lc.match(/think|approach|mindset|philosophy/)) key = 'thinking';
    botReply(key);
  }

  sendBtn?.addEventListener('click', handleSend);
  input?.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });

  // Phone clock
  function updatePhoneClock() {
    const el = document.getElementById('rPhoneTime');
    if (!el) return;
    const now = new Date();
    const h = now.getHours() % 12 || 12;
    const m = String(now.getMinutes()).padStart(2,'0');
    el.textContent = h + ':' + m;
  }
  updatePhoneClock();
  setInterval(updatePhoneClock, 30000);
})();

// Graphic design strip — drag scroll
(function() {
  const track = document.getElementById('rgfxTrack');
  if (!track) return;
  let isDown = false, startX, scrollLeft;
  track.addEventListener('mousedown', e => {
    isDown = true; track.classList.add('dragging');
    startX = e.pageX - track.offsetLeft; scrollLeft = track.scrollLeft;
  });
  document.addEventListener('mouseup', () => { isDown = false; track.classList.remove('dragging'); });
  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX) * 1.2;
  });
  track.addEventListener('mouseleave', () => { isDown = false; track.classList.remove('dragging'); });
})();


// ── PHONE: DRAG + 3D TILT ────────────────────────────────────────────
(function () {
  var el = document.querySelector('.rhero-right');
  if (!el) return;

  // Base translate baked into CSS: translate(-442px, -63px)
  var bx = -442, by = -63;
  var dx = 0, dy = 0; // drag delta on top of base
  var dragging = false, sx, sy;

  function set(ry, rx) {
    el.style.transform =
      'translate(' + (bx + dx) + 'px,' + (by + dy) + 'px)' +
      ' perspective(900px) rotateY(' + ry + 'deg) rotateX(' + rx + 'deg)';
  }

  // hover tilt
  el.addEventListener('mousemove', function (e) {
    if (dragging) return;
    var r = el.getBoundingClientRect();
    var nx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    var ny = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    el.style.transition = 'transform 0.08s linear';
    set(nx * 18, -ny * 12);
  });

  el.addEventListener('mouseleave', function () {
    if (dragging) return;
    el.style.transition = 'transform 0.7s cubic-bezier(0.16,1,0.3,1)';
    set(0, 0);
  });

  // drag
  el.addEventListener('mousedown', function (e) {
    if (['INPUT','BUTTON','TEXTAREA'].includes(e.target.tagName)) return;
    dragging = true;
    sx = e.clientX - dx;
    sy = e.clientY - dy;
    el.style.cursor = 'grabbing';
    el.style.transition = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    dx = e.clientX - sx;
    dy = e.clientY - sy;
    set(0, 0);
  });

  document.addEventListener('mouseup', function () {
    if (!dragging) return;
    dragging = false;
    el.style.cursor = 'grab';
    dx = 0; dy = 0;
    el.style.transition = 'transform 0.7s cubic-bezier(0.16,1,0.3,1)';
    set(0, 0);
  });
}());

// "Creative View" footer link switches view
document.getElementById('rSwitchCreative')?.addEventListener('click', e => {
  e.preventDefault();
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.view-btn[data-view="creative"]')?.classList.add('active');
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-creative')?.classList.add('active');
  document.body.style.overflow = 'hidden';
});

// ── GFX LIGHTBOX ─────────────────────────────────────────────────────
(function () {
  var lb  = document.getElementById('rgfxLightbox');
  var img = document.getElementById('rgfxLbImg');
  var cls = document.getElementById('rgfxLbClose');
  if (!lb || !img) return;

  function open(src) {
    img.src = src;
    lb.classList.add('rgfx-lb--open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('rgfx-lb--open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(function () { img.src = ''; }, 300);
  }

  // Open on thumb click/tap
  document.querySelectorAll('.rgfx-thumb[data-img]').forEach(function (thumb) {
    thumb.addEventListener('click', function (e) {
      e.stopPropagation();
      open(thumb.getAttribute('data-img'));
    });
  });

  // Close on backdrop, close button, or Escape
  lb.addEventListener('click', close);
  if (cls) cls.addEventListener('click', function (e) { e.stopPropagation(); close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();

// ── CUSTOM CURSOR ─────────────────────────────────────────────────────
(function () {
  var dot  = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  var mx = -100, my = -100;  // off-screen until mouse moves
  var rx = -100, ry = -100;  // ring follows with lag

  // Track real mouse position
  document.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    dot.classList.remove('cursor-hidden');
    ring.classList.remove('cursor-hidden');
  });

  // Ring follows with spring lag
  (function animateRing() {
    rx += (mx - rx) * 0.22;
    ry += (my - ry) * 0.22;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Hover expand
  var hoverTargets = 'a, button, [role="button"], .view-btn, .rgfx-thumb, .rproject-card, .rwtile, .rctile, label';
  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(hoverTargets)) ring.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(hoverTargets)) ring.classList.remove('cursor-hover');
  });

  // Click pulse
  document.addEventListener('mousedown', function () { dot.classList.add('cursor-click'); });
  document.addEventListener('mouseup',   function () { dot.classList.remove('cursor-click'); });

  // Hide when mouse leaves window
  document.addEventListener('mouseleave', function () {
    dot.classList.add('cursor-hidden');
    ring.classList.add('cursor-hidden');
  });
})();

