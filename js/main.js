/**
 * Mandora Coffee Shop — Core Interactions & Living Atmosphere
 * Follows calm, minimal principles with gentle transitions and fail-safe logic.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAtmosphere();
  initScrollPourProgress();
  initScrollReveals();
  initEasterEgg();
  initMenuFiltering();
  initCopyAddress();
});

/**
 * Living Atmosphere: Time-of-day greeting, shop status, and returning visitor memory.
 */
function initAtmosphere() {
  const greetingTextEl = document.getElementById('time-greeting-text');
  const visitorBadgeEl = document.getElementById('visitor-badge');
  const statusTextEl = document.getElementById('status-text');
  const statusDotEl = document.querySelector('.status-dot');

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  // 1. Time-of-Day Poetic Greeting
  if (greetingTextEl) {
    let greeting = 'A slow cup awaits on the fifth floor';
    if (currentHour >= 5 && currentHour < 12) {
      greeting = 'Morning light over Nawam Mawatha — coffee is ready';
    } else if (currentHour >= 12 && currentHour < 17) {
      greeting = 'Afternoon calm — take a quiet pause above the city';
    } else if (currentHour >= 17 && currentHour < 21) {
      greeting = 'Dusk settles on Colombo — time for a slow pour';
    } else {
      greeting = 'Quiet hours — we open with the morning sun at 7:00 AM';
    }
    greetingTextEl.textContent = greeting;
  }

  // 2. Returning Visitor Greeting via localStorage (wrapped safely in try/catch)
  try {
    const hasVisited = localStorage.getItem('mandora_has_visited');
    if (hasVisited && visitorBadgeEl) {
      visitorBadgeEl.style.display = 'inline-block';
    }
    localStorage.setItem('mandora_has_visited', 'true');
    localStorage.setItem('mandora_last_visit', new Date().toISOString());
  } catch (err) {
    // Graceful fallback if localStorage is disabled/restricted in privacy modes
    console.debug('Storage access not available:', err);
  }

  // 3. Live Operating Hours (Mon–Sun: 7:00 AM – 9:00 PM)
  const isOpen = currentHour >= 7 && currentHour < 21;
  if (statusTextEl) {
    if (isOpen) {
      statusTextEl.textContent = 'Open today until 9:00 PM';
      if (statusDotEl) {
        statusDotEl.style.backgroundColor = 'var(--color-accent)';
      }
    } else {
      statusTextEl.textContent = 'Closed now • Opens at 7:00 AM';
      if (statusDotEl) {
        statusDotEl.style.backgroundColor = 'var(--color-text-faint)';
        statusDotEl.style.boxShadow = 'none';
      }
    }
  }
}

/**
 * Signature Creative Idea: "The Slow Pour" Scroll Progress
 * As the visitor journeys down the page, the mini ceramic cup gently fills with coffee.
 */
function initScrollPourProgress() {
  const progressBar = document.getElementById('scroll-progress-line');
  const miniCoffeeFill = document.getElementById('mini-coffee-fill');

  // Fill limits in SVG coordinate space:
  // Empty: y = 25, height = 0
  // Full:  y = 11, height = 15
  const emptyY = 25;
  const fullY = 11;
  const maxFillHeight = 15;

  let ticking = false;

  function updateScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? Math.min(Math.max(scrollTop / scrollHeight, 0), 1) : 0;

    // Update linear progress line
    if (progressBar) {
      progressBar.style.width = `${progress * 100}%`;
      progressBar.setAttribute('aria-valuenow', Math.round(progress * 100));
    }

    // Update miniature cup liquid level
    if (miniCoffeeFill) {
      const currentHeight = progress * maxFillHeight;
      const currentY = emptyY - (progress * (emptyY - fullY));
      miniCoffeeFill.setAttribute('y', currentY.toFixed(2));
      miniCoffeeFill.setAttribute('height', currentHeight.toFixed(2));
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollProgress);
      ticking = true;
    }
  }, { passive: true });

  // Initial calculation
  updateScrollProgress();
}

/**
 * Scroll-Triggered Reveals: Sections and elements unfold gently as user explores.
 */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * Signature Easter Egg: The Hidden Coffee Bean
 * Unveils a calm, unhurried reflection when clicked.
 */
function initEasterEgg() {
  const beanBtn = document.getElementById('secret-bean-btn');
  const reflectionModal = document.getElementById('secret-bean-reflection');
  const quoteText = document.getElementById('reflection-quote-text');
  const closeBtn = document.getElementById('close-reflection-btn');

  if (!beanBtn || !reflectionModal || !quoteText) return;

  const sereneThoughts = [
    '"A good cup of coffee takes four minutes to brew and a lifetime of unhurried mornings to appreciate."',
    '"Slow living is not about doing things at a snail\'s pace; it is about doing everything at the right pace."',
    '"Single origin, roasted with quiet patience. Let the steam warm your thoughts before the first sip."',
    '"In the flurry of Colombo, peace is a five-story ascent away."',
    '"Notice the morning light across your table. Even the steam dances with no intention to rush."'
  ];

  let currentThoughtIndex = 0;

  function toggleReflection(forceClose = false) {
    const isCurrentlyOpen = beanBtn.getAttribute('aria-expanded') === 'true';

    if (isCurrentlyOpen || forceClose) {
      beanBtn.setAttribute('aria-expanded', 'false');
      reflectionModal.hidden = true;
      beanBtn.focus();
    } else {
      // Pick next thought in cycle
      currentThoughtIndex = (currentThoughtIndex + 1) % sereneThoughts.length;
      quoteText.textContent = sereneThoughts[currentThoughtIndex];
      reflectionModal.hidden = false;
      beanBtn.setAttribute('aria-expanded', 'true');
    }
  }

  beanBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleReflection();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleReflection(true);
    });
  }

  // Keyboard accessibility: ESC closes the secret thought
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && beanBtn.getAttribute('aria-expanded') === 'true') {
      toggleReflection(true);
    }
  });
}

/**
 * Menu Category Filtering: Smoothly switches between Coffee, Tea, and Bakes.
 */
function initMenuFiltering() {
  const filterButtons = document.querySelectorAll('.filter-tab-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  if (!filterButtons.length || !menuCards.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const selectedCategory = button.getAttribute('data-filter');

      // Update Tab ARIA & active styling
      filterButtons.forEach(btn => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('is-active');
      button.setAttribute('aria-selected', 'true');

      // Filter Cards with a calm, unhurried transition
      menuCards.forEach(card => {
        const itemCategory = card.getAttribute('data-category');

        if (selectedCategory === 'all' || itemCategory === selectedCategory) {
          card.classList.remove('is-hidden');
          // Ensure newly unhidden elements are marked revealed
          card.classList.add('is-revealed');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });
}

/**
 * Copy Address helper with quiet tactile feedback
 */
function initCopyAddress() {
  const copyBtn = document.getElementById('copy-address-btn');
  const copyText = document.getElementById('copy-btn-text');
  const checkIcon = document.getElementById('copy-check-icon');

  if (!copyBtn || !copyText) return;

  const fullAddress = 'Mandora, 5th Floor, IBM Building, No. 48 Nawam Mawatha, Colombo 02, Sri Lanka';

  copyBtn.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullAddress);
      } else {
        // Fallback for environments without modern clipboard permissions
        const tempInput = document.createElement('textarea');
        tempInput.value = fullAddress;
        tempInput.style.position = 'fixed';
        tempInput.style.opacity = '0';
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      copyText.textContent = 'Address Copied';
      if (checkIcon) checkIcon.style.display = 'inline';
      copyBtn.style.borderColor = 'var(--color-accent)';

      setTimeout(() => {
        copyText.textContent = 'Copy Address';
        if (checkIcon) checkIcon.style.display = 'none';
        copyBtn.style.borderColor = '';
      }, 2400);
    } catch (err) {
      console.warn('Clipboard write prevented:', err);
    }
  });
}



