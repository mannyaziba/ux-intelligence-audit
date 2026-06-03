/* ═══════════════════════════════════════════════════
   CPSA — UX Intelligence Audit Tool
   Main Script — Audit Engine Simulation
   ═══════════════════════════════════════════════════ */

'use strict';

// ─── DOM References ───────────────────────────────
const runBtn       = document.getElementById('runBtn');
const runBtnText   = document.getElementById('runBtnText');
const runBtnIcon   = document.getElementById('runBtnIcon');
const runBtnLoader = document.getElementById('runBtnLoader');
const terminalBody = document.getElementById('terminalBody');
const outputTag    = document.getElementById('outputTag');
const scoreNum     = document.getElementById('scoreNum');
const scoreGrade   = document.getElementById('scoreGrade');
const scoreDesc    = document.getElementById('scoreDesc');
const ringFill     = document.getElementById('ringFill');
const urlInput     = document.getElementById('urlInput');
const typeSelect   = document.getElementById('typeSelect');
const audienceSelect = document.getElementById('audienceSelect');

// ─── Config ───────────────────────────────────────
const RING_RADIUS       = 52;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS; // 326.7px

// Simulate different results based on selected options
const AUDIT_PROFILES = {
  Dashboard: {
    score: 67,
    lenses: { Structure: 72, Flow: 58, Feedback: 43, Readability: 81, Consistency: 62 },
    failure: 'Navigation hierarchy breaks after second interaction layer.',
    detail: 'Users lose directional confidence during task continuation. No positional anchors beyond depth two.',
    grade: 'MODERATE RISK',
  },
  'SaaS Platform': {
    score: 74,
    lenses: { Structure: 80, Flow: 71, Feedback: 55, Readability: 78, Consistency: 69 },
    failure: 'Onboarding funnel loses users at permission configuration step.',
    detail: 'Feature discovery is blocked by unresolved permission states. Users cannot progress without implicit knowledge.',
    grade: 'LOW-MODERATE RISK',
  },
  Portfolio: {
    score: 58,
    lenses: { Structure: 65, Flow: 52, Feedback: 40, Readability: 70, Consistency: 48 },
    failure: 'No clear primary action path. Visitor intent cannot be converted.',
    detail: 'The interface presents equal weight to all content with no hierarchy. Conversion signals are absent.',
    grade: 'HIGH RISK',
  },
  'Admin Panel': {
    score: 61,
    lenses: { Structure: 68, Flow: 55, Feedback: 48, Readability: 66, Consistency: 57 },
    failure: 'Bulk action confirmation feedback is ambiguous across table states.',
    detail: 'Destructive operations lack sufficient confirmation signals. Undo affordance is absent in critical flows.',
    grade: 'MODERATE RISK',
  },
  'Dev Tool': {
    score: 79,
    lenses: { Structure: 82, Flow: 76, Feedback: 74, Readability: 84, Consistency: 75 },
    failure: 'Error messages lack actionable resolution paths.',
    detail: 'Runtime errors surface diagnostic codes without contextual fix guidance. Developer time is lost to external searches.',
    grade: 'LOW RISK',
  },
  'API Console': {
    score: 70,
    lenses: { Structure: 75, Flow: 68, Feedback: 60, Readability: 77, Consistency: 68 },
    failure: 'Authentication state visibility is insufficient during token expiry.',
    detail: 'Session termination is silent. Users discover expired states only on failed request execution.',
    grade: 'MODERATE RISK',
  },
};

// ─── Terminal Log System ───────────────────────────
let terminalLines = [];

function clearTerminal() {
  terminalBody.innerHTML = '';
  terminalLines = [];
}

function addTerminalLine(text, type = 'muted', delay = 0) {
  return new Promise(resolve => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className = `t-line ${type}`;
      line.textContent = text;
      terminalBody.appendChild(line);
      terminalBody.scrollTop = terminalBody.scrollHeight;
      resolve();
    }, delay);
  });
}

// ─── Score Ring Update ─────────────────────────────
function updateRing(score) {
  const progress = score / 100;
  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);
  ringFill.style.strokeDashoffset = dashOffset;
}

// ─── Lens Bar Animations ───────────────────────────
function updateLenses(lensData) {
  const lensRows = document.querySelectorAll('.lens-row');

  lensRows.forEach(row => {
    const name  = row.dataset.lens;
    const key   = name.charAt(0).toUpperCase() + name.slice(1);
    const score = lensData[key];

    if (score === undefined) return;

    row.dataset.score = score;

    const scoreEl  = row.querySelector('.lens-score');
    const fillEl   = row.querySelector('.lens-fill');
    const flagEl   = row.querySelector('.lens-flag');

    // Animate score count-up
    animateCount(scoreEl, parseInt(scoreEl.textContent), score, 800);

    // Animate bar
    setTimeout(() => {
      fillEl.style.width = score + '%';
    }, 100);

    // Update flag
    if (score >= 75) {
      flagEl.className = 'lens-flag flag-pass';
      flagEl.textContent = 'Stable';
    } else if (score >= 55) {
      flagEl.className = 'lens-flag flag-warn';
      flagEl.textContent = score < 65 ? 'Fragile' : 'Moderate';
    } else {
      flagEl.className = 'lens-flag flag-crit';
      flagEl.textContent = 'Critical';
    }
  });
}

// ─── Number Count-Up Animation ─────────────────────
function animateCount(el, from, to, duration) {
  const start = performance.now();
  const diff  = to - from;

  function step(timestamp) {
    const elapsed  = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    el.textContent = Math.round(from + diff * eased);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// ─── Grade Color Map ──────────────────────────────
function applyGradeStyle(grade) {
  scoreGrade.style.color = 'var(--muted)';
  if (grade.includes('HIGH'))     scoreGrade.style.color = 'var(--red)';
  else if (grade.includes('LOW')) scoreGrade.style.color = 'var(--green)';
  else                            scoreGrade.style.color = 'var(--yellow)';
}

// ─── Main Audit Runner ─────────────────────────────
async function runAudit() {
  const url      = urlInput.value.trim() || 'https://yourproduct.com';
  const type     = typeSelect.value;
  const audience = audienceSelect.value;
  const profile  = AUDIT_PROFILES[type] || AUDIT_PROFILES['Dashboard'];

  // ── UI: Set loading state ──
  runBtn.disabled     = true;
  runBtnText.textContent = 'Running Audit';
  runBtnIcon.classList.add('hidden');
  runBtnLoader.classList.remove('hidden');
  outputTag.textContent = 'SCANNING';
  outputTag.className = 'panel-tag';

  // ── Terminal: begin sequence ──
  clearTerminal();

  await addTerminalLine('$ cpsa audit --init', 'accent', 0);
  await addTerminalLine(`> target   ${url}`, 'muted', 200);
  await addTerminalLine(`> type     ${type}`, 'muted', 350);
  await addTerminalLine(`> audience ${audience}`, 'muted', 500);
  await addTerminalLine('', 'muted', 650);
  await addTerminalLine('↳ Crawling interface tree...', 'muted', 700);
  await addTerminalLine('↳ Mapping interaction graph...', 'muted', 1000);
  await addTerminalLine('↳ Running Structure lens...', 'muted', 1300);
  await addTerminalLine('↳ Running Flow lens...', 'muted', 1600);
  await addTerminalLine('↳ Running Feedback lens...', 'muted', 1900);
  await addTerminalLine('↳ Running Readability lens...', 'muted', 2200);
  await addTerminalLine('↳ Running Consistency lens...', 'muted', 2500);
  await addTerminalLine('', 'muted', 2700);
  await addTerminalLine('↳ Compositing scores...', 'muted', 2800);
  await addTerminalLine('↳ Identifying failure modes...', 'muted', 3100);
  await addTerminalLine('↳ Building fix priorities...', 'muted', 3400);
  await addTerminalLine('', 'muted', 3600);
  await addTerminalLine(`✓ Audit complete — score: ${profile.score}/100`, 'accent', 3700);

  // ── Update output panel ──
  setTimeout(() => {
    // Score
    const prevScore = parseInt(scoreNum.textContent);
    animateCount(scoreNum, prevScore, profile.score, 1000);
    updateRing(profile.score);

    // Grade
    scoreGrade.textContent = profile.grade;
    applyGradeStyle(profile.grade);

    // Desc
    scoreDesc.textContent = profile.detail;

    // Lenses
    updateLenses(profile.lenses);

    // Failure block
    document.querySelector('.failure-title').textContent = profile.failure;
    document.querySelector('.failure-body').textContent  = profile.detail + ' The system provides no positional anchors, forcing cognitive reorientation on each interaction.';

    // Tag
    outputTag.textContent = 'COMPLETE';
    outputTag.className   = 'panel-tag tag-live';

    // Reset button
    runBtn.disabled = false;
    runBtnText.textContent = 'Re-run Audit';
    runBtnIcon.classList.remove('hidden');
    runBtnLoader.classList.add('hidden');

  }, 3900);
}

// ─── Depth Button Toggle ──────────────────────────
document.querySelectorAll('.depth-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.depth-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ─── Run Button ───────────────────────────────────
runBtn.addEventListener('click', runAudit);

// Also allow Enter in URL field
urlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') runAudit();
});

// ─── Initial Ring State ───────────────────────────
// Set ring to match the default displayed score (67)
document.addEventListener('DOMContentLoaded', () => {
  updateRing(67);
});

// ─── Intersection Observer: Stagger Lens Bars ─────
// Animate bars into view on initial load
const lensObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const rows = entry.target.querySelectorAll('.lens-row');
      rows.forEach((row, i) => {
        const fill  = row.querySelector('.lens-fill');
        const score = parseInt(row.dataset.score) || 0;
        setTimeout(() => {
          fill.style.width = score + '%';
        }, i * 120);
      });
      lensObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const lensContainer = document.getElementById('lenses');
if (lensContainer) {
  // Set all fills to 0 initially
  lensContainer.querySelectorAll('.lens-fill').forEach(f => f.style.width = '0%');
  lensObserver.observe(lensContainer);
}
