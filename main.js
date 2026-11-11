/**
 * Mahmoud Magdy Portfolio — Interactive UI/UX Controller (Inspire Design v2.1)
 * Zero-Reflow Initial Boot & WCAG/ARIA Lighthouse 100 Compliant
 */

(function () {
  'use strict';

  /* ==========================================================================
     0. Activate Deferred Google Fonts After Initial Paint
     ========================================================================== */
  function activateDeferredFonts() {
    const fontLink = document.getElementById('google-fonts-css');
    if (fontLink && fontLink.media !== 'all') {
      fontLink.media = 'all';
    }
  }

  /* ==========================================================================
     1. Theme Management (Warm Alabaster Light <-> Forest Espresso Dark)
     ========================================================================== */
  const rootEl = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themeLabel = document.getElementById('theme-toggle-label');
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    rootEl.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', String(isDark));
    }
    if (themeLabel) {
      themeLabel.textContent = isDark ? 'Theme: Forest Dark' : 'Theme: Editorial Light';
    }
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#111814' : '#f4f2ec');
    }
  }

  function initTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem('mm_portfolio_theme');
    } catch (_) {
      saved = null;
    }
    // Avoid redundant DOM writes on boot when already in default 'light' state
    if (saved === 'dark') {
      applyTheme('dark');
    }

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const current = rootEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try {
          localStorage.setItem('mm_portfolio_theme', next);
        } catch (_) {
          // Ignore storage errors in restricted environments
        }
      });
    }
  }

  /* ==========================================================================
     2. Live Alexandria, Egypt Clock (Africa/Cairo Timezone)
     ========================================================================== */
  function updateAlexandriaClock() {
    const clockNodes = document.querySelectorAll('.js-alexandria-time');
    if (!clockNodes.length) return;
    try {
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Cairo',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      const timeStr = `${formatter.format(new Date())} EET`;
      clockNodes.forEach((node) => {
        if (node.textContent !== timeStr) {
          node.textContent = timeStr;
        }
      });
    } catch (_) {
      // Fallback if Intl timeZone is unavailable
    }
  }

  /* ==========================================================================
     3. One-Click Copy Email Micro-Interaction
     ========================================================================== */
  const EMAIL_ADDRESS = 'mahmoudmagdy@mail.com';

  function copyEmailToClipboard(buttonEl, defaultLabel) {
    if (!buttonEl) return;

    const handleSuccess = () => {
      buttonEl.classList.add('copied');
      buttonEl.textContent = 'Copied mahmoudmagdy@mail.com ✓';
      setTimeout(() => {
        buttonEl.classList.remove('copied');
        buttonEl.textContent = defaultLabel;
      }, 2600);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL_ADDRESS).then(handleSuccess).catch(() => {
        fallbackCopy(EMAIL_ADDRESS, handleSuccess);
      });
    } else {
      fallbackCopy(EMAIL_ADDRESS, handleSuccess);
    }
  }

  function fallbackCopy(text, callback) {
    const temp = document.createElement('textarea');
    temp.value = text;
    temp.setAttribute('readonly', '');
    temp.style.position = 'fixed';
    temp.style.opacity = '0';
    document.body.appendChild(temp);
    temp.select();
    try {
      document.execCommand('copy');
    } catch (_) {
      // Ignore
    }
    document.body.removeChild(temp);
    callback();
  }

  /* ==========================================================================
     4. Selected Work Filter Bar
     ========================================================================== */
  function initProjectFilters() {
    const filterButtons = document.querySelectorAll('[data-work-filter]');
    const projectCards = document.querySelectorAll('.project-card[data-tags]');
    const countLabel = document.getElementById('work-count-label');

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-work-filter');
        filterButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));

        let visibleCount = 0;
        projectCards.forEach((card) => {
          const tags = (card.getAttribute('data-tags') || '').split(',');
          const matches = filter === 'all' || tags.includes(filter);
          card.classList.toggle('is-hidden', !matches);
          if (matches) visibleCount++;
        });

        if (countLabel) {
          countLabel.textContent = `Showing 0${visibleCount} of 05 curated builds`;
        }
      });
    });
  }

  /* ==========================================================================
     5. Project 01 Interactive Sandbox: Social App
     ========================================================================== */
  const socialState = {
    mode: 'feed',
    liked: false,
    likes: 42,
    bookmarked: false,
    postText: 'Refactored client-side route guards and Zod form schemas for deterministic error recovery.',
    emailInput: 'mahmoud@okaab.dev',
    passwordInput: 'StrictTypeSafe#2026',
    activeRoute: '/feed',
    authenticated: true
  };

  function bindSocialFeedEvents() {
    const likeBtn = document.getElementById('social-like-btn');
    if (likeBtn) {
      likeBtn.addEventListener('click', () => {
        socialState.liked = !socialState.liked;
        socialState.likes += socialState.liked ? 1 : -1;
        renderSocialStage();
      });
    }

    const bookmarkBtn = document.getElementById('social-bookmark-btn');
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener('click', () => {
        socialState.bookmarked = !socialState.bookmarked;
        renderSocialStage();
      });
    }

    const composerForm = document.getElementById('social-composer-form');
    const composerInput = document.getElementById('social-composer-input');
    if (composerForm && composerInput) {
      composerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = composerInput.value.trim();
        if (val) {
          socialState.postText = val;
          socialState.likes += 1;
          socialState.liked = true;
          renderSocialStage();
        }
      });
    }
  }

  function renderSocialStage() {
    const container = document.getElementById('social-window-body');
    const statusReadout = document.getElementById('social-stage-status');
    if (!container) return;

    if (socialState.mode === 'feed') {
      container.innerHTML = `
        <div class="social-post-header">
          <div class="social-author">
            <div class="social-avatar" aria-hidden="true">MM</div>
            <div>
              <div class="social-author-name">Mahmoud Magdy</div>
              <div class="social-author-handle">@mahmoud_dev · React Router v6</div>
            </div>
          </div>
          <span class="status-badge">200 OK · Synced</span>
        </div>

        <div class="social-post-body" id="social-post-preview"></div>

        <form class="social-composer-row" id="social-composer-form">
          <input
            type="text"
            id="social-composer-input"
            class="demo-input"
            maxlength="140"
            placeholder="Write an optimistic post update..."
            aria-label="Write an optimistic post update"
          />
          <button type="submit" id="social-publish-btn" class="demo-btn-sm">Publish</button>
        </form>

        <div class="social-interaction-bar">
          <div style="display:flex; gap:0.5rem;">
            <button type="button" id="social-like-btn" class="interaction-chip" aria-pressed="${socialState.liked}">
              ♥ <span id="social-like-count">${socialState.likes}</span> Likes
            </button>
            <button type="button" id="social-bookmark-btn" class="interaction-chip" aria-pressed="${socialState.bookmarked}">
              ${socialState.bookmarked ? '★ Saved' : '☆ Save Post'}
            </button>
          </div>
          <span>Optimistic UI Ready</span>
        </div>
      `;

      const postPreview = document.getElementById('social-post-preview');
      if (postPreview) postPreview.textContent = socialState.postText;
      bindSocialFeedEvents();

      if (statusReadout) {
        statusReadout.textContent = 'State: FeedStream · Optimistic mutations active';
      }
    } else if (socialState.mode === 'validation') {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(socialState.emailInput);
      const passValid = socialState.passwordInput.length >= 8;
      const allValid = emailValid && passValid;

      container.innerHTML = `
        <div class="social-post-header">
          <div>
            <div class="social-author-name">Schema Validation Inspector</div>
            <div class="social-author-handle">Real-time field constraints &amp; error recovery</div>
          </div>
          <span class="status-badge ${allValid ? '' : 'error'}" id="social-schema-badge">
            ${allValid ? '✓ Schema Valid' : '✕ Validation Error'}
          </span>
        </div>

        <div class="lemon-grid">
          <div class="lemon-field-group">
            <label class="lemon-field-label" for="social-val-email">Email Address</label>
            <input type="text" id="social-val-email" class="demo-input" value="${socialState.emailInput.replace(/"/g, '&quot;')}" />
            <span class="mono-label" style="font-size:0.66rem; color:${emailValid ? 'var(--status-success)' : 'var(--status-error)'}">
              ${emailValid ? '✓ Valid email format' : '✕ Enter a valid domain'}
            </span>
          </div>
          <div class="lemon-field-group">
            <label class="lemon-field-label" for="social-val-pass">Password Token</label>
            <input type="text" id="social-val-pass" class="demo-input" value="${socialState.passwordInput.replace(/"/g, '&quot;')}" />
            <span class="mono-label" style="font-size:0.66rem; color:${passValid ? 'var(--status-success)' : 'var(--status-error)'}">
              ${passValid ? '✓ Min 8 chars satisfied' : '✕ Requires 8+ characters'}
            </span>
          </div>
        </div>

        <div class="social-interaction-bar">
          <div style="display:flex; gap:0.45rem;">
            <button type="button" id="social-preset-valid" class="interaction-chip">Load Valid Preset</button>
            <button type="button" id="social-preset-invalid" class="interaction-chip">Simulate Error</button>
          </div>
          <span>Submit Button: <strong>${allValid ? 'ENABLED' : 'LOCKED'}</strong></span>
        </div>
      `;

      const emailEl = document.getElementById('social-val-email');
      const passEl = document.getElementById('social-val-pass');
      if (emailEl) {
        emailEl.addEventListener('input', (e) => {
          socialState.emailInput = e.target.value;
          renderSocialStage();
          const refreshed = document.getElementById('social-val-email');
          if (refreshed) {
            refreshed.focus();
            refreshed.setSelectionRange(refreshed.value.length, refreshed.value.length);
          }
        });
      }
      if (passEl) {
        passEl.addEventListener('input', (e) => {
          socialState.passwordInput = e.target.value;
          renderSocialStage();
          const refreshed = document.getElementById('social-val-pass');
          if (refreshed) {
            refreshed.focus();
            refreshed.setSelectionRange(refreshed.value.length, refreshed.value.length);
          }
        });
      }

      const validPreset = document.getElementById('social-preset-valid');
      const invalidPreset = document.getElementById('social-preset-invalid');
      if (validPreset) {
        validPreset.addEventListener('click', () => {
          socialState.emailInput = 'mahmoud@okaab.dev';
          socialState.passwordInput = 'StrictTypeSafe#2026';
          renderSocialStage();
        });
      }
      if (invalidPreset) {
        invalidPreset.addEventListener('click', () => {
          socialState.emailInput = 'invalid-email';
          socialState.passwordInput = 'short';
          renderSocialStage();
        });
      }

      if (statusReadout) {
        statusReadout.textContent = `Validator: ${allValid ? '0 errors' : 'Field constraints triggered'}`;
      }
    } else if (socialState.mode === 'routes') {
      const allowed = socialState.authenticated || socialState.activeRoute === '/login';
      container.innerHTML = `
        <div class="social-post-header">
          <div>
            <div class="social-author-name">React Router Guard Inspector</div>
            <div class="social-author-handle">Protected route resolution &amp; session state</div>
          </div>
          <span class="status-badge ${allowed ? '' : 'error'}">
            ${allowed ? '200 Render Route' : '302 Redirect -> /login'}
          </span>
        </div>

        <div class="lemon-pill-row" role="group" aria-label="Select route path">
          <button type="button" class="lemon-choice" data-route="/feed" aria-pressed="${socialState.activeRoute === '/feed'}">/feed</button>
          <button type="button" class="lemon-choice" data-route="/profile/mm" aria-pressed="${socialState.activeRoute === '/profile/mm'}">/profile/mm</button>
          <button type="button" class="lemon-choice" data-route="/login" aria-pressed="${socialState.activeRoute === '/login'}">/login</button>
        </div>

        <div class="social-post-body" style="font-family:var(--font-mono); font-size:0.76rem;">
          <div>Active Path: <strong>${socialState.activeRoute}</strong></div>
          <div>AuthGuard Token: <strong>${socialState.authenticated ? 'Bearer jwt_verified_okaab' : 'null (Unauthenticated)'}</strong></div>
          <div>Resolution: <strong>${allowed ? `Mounted <Route path="${socialState.activeRoute}" />` : 'Blocked by <ProtectedRoute />'}</strong></div>
        </div>

        <div class="social-interaction-bar">
          <button type="button" id="social-toggle-auth" class="interaction-chip" aria-pressed="${socialState.authenticated}">
            Session: ${socialState.authenticated ? 'Authenticated ✓' : 'Signed Out ✕'} (Click to toggle)
          </button>
          <span>React Router DOM</span>
        </div>
      `;

      container.querySelectorAll('[data-route]').forEach((btn) => {
        btn.addEventListener('click', () => {
          socialState.activeRoute = btn.getAttribute('data-route');
          renderSocialStage();
        });
      });

      const toggleAuth = document.getElementById('social-toggle-auth');
      if (toggleAuth) {
        toggleAuth.addEventListener('click', () => {
          socialState.authenticated = !socialState.authenticated;
          renderSocialStage();
        });
      }

      if (statusReadout) {
        statusReadout.textContent = `Router: ${socialState.activeRoute} (${allowed ? 'Authorized' : 'Redirected'})`;
      }
    }
  }

  function initSocialSandbox() {
    const tabs = document.querySelectorAll('[data-social-tab]');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        socialState.mode = tab.getAttribute('data-social-tab');
        tabs.forEach((t) => t.setAttribute('aria-pressed', String(t === tab)));
        renderSocialStage();
      });
    });
    // Bind directly to pre-rendered SSR/static HTML without triggering reflow on boot
    bindSocialFeedEvents();
  }

  /* ==========================================================================
     6. Project 02 Interactive Sandbox: Little Lemon Reservation Flow
     ========================================================================== */
  const lemonState = {
    guests: 2,
    slot: '19:30',
    zone: 'Patio',
    confirmed: false,
    bookingCode: 'LL-2026-AX'
  };

  function updateLemonSandboxUI() {
    const summaryText = document.getElementById('lemon-summary-text');
    const statusBadge = document.getElementById('lemon-status-badge');
    const stageReadout = document.getElementById('lemon-stage-status');
    const confirmBtn = document.getElementById('lemon-confirm-btn');

    document.querySelectorAll('[data-lemon-guests]').forEach((btn) => {
      const val = Number(btn.getAttribute('data-lemon-guests'));
      btn.setAttribute('aria-pressed', String(val === lemonState.guests));
    });

    document.querySelectorAll('[data-lemon-slot]').forEach((btn) => {
      const val = btn.getAttribute('data-lemon-slot');
      btn.setAttribute('aria-pressed', String(val === lemonState.slot));
    });

    document.querySelectorAll('[data-lemon-zone]').forEach((btn) => {
      const val = btn.getAttribute('data-lemon-zone');
      btn.setAttribute('aria-pressed', String(val === lemonState.zone));
    });

    if (summaryText) {
      if (lemonState.confirmed) {
        summaryText.innerHTML = `Confirmed: <strong>${lemonState.guests} Guests</strong> · <strong>${lemonState.slot}</strong> (${lemonState.zone}) · Ref <code>${lemonState.bookingCode}</code>`;
      } else {
        summaryText.innerHTML = `Draft Table: <strong>${lemonState.guests} Guests</strong> at <strong>${lemonState.slot}</strong> · ${lemonState.zone} Seating`;
      }
    }

    if (statusBadge) {
      statusBadge.textContent = lemonState.confirmed ? '✓ Reserved (Local)' : '● Slot Available';
    }

    if (confirmBtn) {
      confirmBtn.textContent = lemonState.confirmed ? 'Reset Demo Booking' : 'Confirm Demo Booking';
    }

    if (stageReadout) {
      stageReadout.textContent = lemonState.confirmed
        ? `ARIA Live: Reservation ${lemonState.bookingCode} saved to local state`
        : 'WCAG 2.1 AA · Form validation & slot check ready';
    }
  }

  function initLemonSandbox() {
    document.querySelectorAll('[data-lemon-guests]').forEach((btn) => {
      btn.addEventListener('click', () => {
        lemonState.guests = Number(btn.getAttribute('data-lemon-guests'));
        lemonState.confirmed = false;
        updateLemonSandboxUI();
      });
    });

    document.querySelectorAll('[data-lemon-slot]').forEach((btn) => {
      btn.addEventListener('click', () => {
        lemonState.slot = btn.getAttribute('data-lemon-slot');
        lemonState.confirmed = false;
        updateLemonSandboxUI();
      });
    });

    document.querySelectorAll('[data-lemon-zone]').forEach((btn) => {
      btn.addEventListener('click', () => {
        lemonState.zone = btn.getAttribute('data-lemon-zone');
        lemonState.confirmed = false;
        updateLemonSandboxUI();
      });
    });

    const confirmBtn = document.getElementById('lemon-confirm-btn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        lemonState.confirmed = !lemonState.confirmed;
        if (lemonState.confirmed) {
          const suffix = Math.floor(100 + Math.random() * 899);
          lemonState.bookingCode = `LL-${lemonState.guests}P-${suffix}`;
        }
        updateLemonSandboxUI();
      });
    }
  }

  /* ==========================================================================
     7. Expandable Technical Spec Drawers
     ========================================================================== */
  function initSpecDrawers() {
    document.querySelectorAll('[data-spec-target]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-spec-target');
        const drawer = document.getElementById(targetId);
        if (!drawer) return;
        const isHidden = drawer.hasAttribute('hidden');
        if (isHidden) {
          drawer.removeAttribute('hidden');
          btn.setAttribute('aria-expanded', 'true');
          btn.textContent = 'Hide architecture specs −';
        } else {
          drawer.setAttribute('hidden', '');
          btn.setAttribute('aria-expanded', 'false');
          btn.textContent = 'Inspect architecture specs +';
        }
      });
    });
  }

  /* ==========================================================================
     8. Section 02: Interactive Engineering Craft & Capability Inspector
     ========================================================================== */
  const CAPABILITY_DETAILS = {
    react: {
      tag: 'FRONTEND ARCHITECTURE · 01',
      title: 'React & Next.js Component Systems',
      desc: 'Designing composable, predictable component hierarchies with clean separation between presentational primitives and domain state hooks.',
      code: `// Composable Reservation & Feed Pattern
export function useOptimisticMutation<T>(initial: T) {
  const [state, setState] = useState<T>(initial);
  const [pending, setPending] = useState(false);
  return { state, pending, mutate: setState };
}`
    },
    typescript: {
      tag: 'TYPE SAFETY · 02',
      title: 'Strict TypeScript & Contract Modeling',
      desc: 'Applying analytical rigor to model domain invariants with discriminated unions, strict null checks, and end-to-end API response contracts.',
      code: `type BookingResolution =
  | { status: 'confirmed'; refCode: string; guests: number }
  | { status: 'conflict'; alternativeSlots: string[] };`
    },
    validation: {
      tag: 'UX & FORMS · 03',
      title: 'Deterministic Form Validation & Accessibility',
      desc: 'Building accessible forms with semantic ARIA live regions, keyboard-first focus management, and immediate inline constraint feedback.',
      code: `<div role="status" aria-live="polite" className="sr-feedback">
  {isValid ? "Table available for reservation" : errorMessage}
</div>`
    },
    backend: {
      tag: 'FULL STACK · 04',
      title: 'Node.js, Express & REST API Architecture',
      desc: 'Constructing clean RESTful endpoints, middleware validation pipelines, and resilient client-server data synchronization at Okaab.',
      code: `router.post('/api/v1/reservations', validateSchema(BookingDTO), async (req, res) => {
  const ticket = await bookingService.reserve(req.body);
  return res.status(201).json({ data: ticket });
});`
    },
    testing: {
      tag: 'QUALITY ASSURANCE · 05',
      title: 'Automated Testing & Edge-Case Verification',
      desc: 'Verifying user-critical workflows—from reservation slot boundaries to route guards—using unit and integration test assertions.',
      code: `test('rejects reservation when party size exceeds capacity', () => {
  render(<BookingForm maxGuests={6} />);
  expect(screen.getByRole('button', { name: /confirm/i })).toBeEnabled();
});`
    },
    lawlogic: {
      tag: 'STRUCTURED THINKING · 06',
      title: 'From Legal Analysis to Software Architecture',
      desc: 'Translating a Bachelor of Laws (Alexandria University) into software engineering: defining unambiguous rules, anticipating edge cases, and writing self-documenting logic.',
      code: `// Legal contracts & software interfaces share the same core truth:
// Explicit preconditions + deterministic outcomes = resilient systems.`
    }
  };

  function initCapabilityMatrix() {
    const cards = document.querySelectorAll('.capability-card[data-cap-key]');
    const filterPills = document.querySelectorAll('[data-stack-filter]');
    const tagEl = document.getElementById('inspector-tag');
    const titleEl = document.getElementById('inspector-title');
    const descEl = document.getElementById('inspector-desc');
    const codeEl = document.getElementById('inspector-code');

    function selectCapability(key) {
      const detail = CAPABILITY_DETAILS[key];
      if (!detail) return;
      cards.forEach((c) => {
        c.setAttribute('aria-pressed', String(c.getAttribute('data-cap-key') === key));
      });
      if (tagEl) tagEl.textContent = detail.tag;
      if (titleEl) titleEl.textContent = detail.title;
      if (descEl) descEl.textContent = detail.desc;
      if (codeEl) codeEl.textContent = detail.code;
    }

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        selectCapability(card.getAttribute('data-cap-key'));
      });
    });

    filterPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const category = pill.getAttribute('data-stack-filter');
        filterPills.forEach((p) => p.setAttribute('aria-pressed', String(p === pill)));

        let firstVisibleKey = null;
        cards.forEach((card) => {
          const cat = card.getAttribute('data-cap-category');
          const show = category === 'all' || cat === category;
          card.classList.toggle('is-filtered-out', !show);
          if (show && !firstVisibleKey) {
            firstVisibleKey = card.getAttribute('data-cap-key');
          }
        });

        if (firstVisibleKey) {
          selectCapability(firstVisibleKey);
        }
      });
    });
  }

  /* ==========================================================================
     9. Contact Inquiry Composer & Scroll Spy
     ========================================================================== */
  function initContactActions() {
    const heroCopyBtn = document.getElementById('hero-copy-email-btn');
    const contactCopyBtn = document.getElementById('contact-copy-email-btn');

    if (heroCopyBtn) {
      heroCopyBtn.addEventListener('click', () => {
        copyEmailToClipboard(heroCopyBtn, 'Copy mahmoudmagdy@mail.com');
      });
    }

    if (contactCopyBtn) {
      contactCopyBtn.addEventListener('click', () => {
        copyEmailToClipboard(contactCopyBtn, 'Copy email address');
      });
    }

    const inquiryForm = document.getElementById('contact-inquiry-form');
    const inquiryStatus = document.getElementById('contact-inquiry-status');
    if (inquiryForm) {
      inquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const topicEl = document.getElementById('inquiry-topic');
        const msgEl = document.getElementById('inquiry-message');
        const topic = topicEl ? topicEl.value : 'Frontend / Full Stack Opportunity';
        const message = msgEl && msgEl.value.trim()
          ? msgEl.value.trim()
          : 'Hi Mahmoud, I reviewed your portfolio and would love to connect.';

        const mailtoUrl = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(topic)}&body=${encodeURIComponent(message)}`;
        if (inquiryStatus) {
          inquiryStatus.textContent = `✓ Prepared email draft for ${EMAIL_ADDRESS}`;
        }
        window.location.href = mailtoUrl;
      });
    }
  }

  function initScrollSpy() {
    const sections = ['work', 'craft', 'about', 'contact']
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const navLinks = document.querySelectorAll('.nav-link[data-section]');

    if (!('IntersectionObserver' in window) || !sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('data-section') === id);
            });
          }
        });
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0.05 }
    );

    sections.forEach((sec) => observer.observe(sec));
  }

  /* ==========================================================================
     Initialize Everything Without Triggering Forced Reflow
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    activateDeferredFonts();
    initTheme();
    initProjectFilters();
    initSocialSandbox();
    initLemonSandbox();
    initSpecDrawers();
    initCapabilityMatrix();
    initContactActions();

    const deferTask = window.requestIdleCallback || window.requestAnimationFrame || function (cb) { setTimeout(cb, 16); };
    deferTask(() => {
      updateAlexandriaClock();
      setInterval(updateAlexandriaClock, 30000);
      initScrollSpy();
    });
  });
})();
