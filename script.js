/* ==========================================================================
   USAMOT OLAMILEKAN — PREMIUM PORTFOLIO
   script.js
   ----------------------------------------------------------
   Kept intentionally minimal. Only four behaviours:
     0. New-tab fallback for external links (target="_blank")
     1. Mobile navigation toggle
     2. Highlight active nav link while scrolling
     3. Reveal-on-scroll animation (skipped for reduced-motion users)
   ========================================================================== */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     0. Enable reveal styles ONLY when JS works AND motion is allowed.
        (CSS keeps content visible if JS is missing or motion is off.)
     ------------------------------------------------------------------ */
  if (!prefersReducedMotion) {
    document.documentElement.classList.add('js');
  }

  /* ------------------------------------------------------------------
     0b. NEW-TAB SAFETY NET FOR EXTERNAL LINKS
         Guarantees any link with target="_blank" opens in a new tab,
         even inside sandboxed preview panels that ignore the attribute.
         If the browser blocks window.open, we fall back to default.
     ------------------------------------------------------------------ */
  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[target="_blank"]');
    if (!link) return;
    var win = window.open(link.href, '_blank', 'noopener');
    if (win) event.preventDefault();
  });

  /* ------------------------------------------------------------------
     1. MOBILE NAVIGATION TOGGLE
     ------------------------------------------------------------------ */
  var header = document.querySelector('.nav');
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');

  var isMenuOpen = function () {
    return navToggle.getAttribute('aria-expanded') === 'true';
  };

  var setMenu = function (open) {
    var state = open ? 'true' : 'false';
    navToggle.setAttribute('aria-expanded', state);
    header.classList.toggle('nav-open', open);
  };

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      setMenu(!isMenuOpen());
    });

    /* Close when a link is tapped */
    navLinks.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });

    /* Close on Escape key */
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isMenuOpen()) setMenu(false);
    });
  }

  /* ------------------------------------------------------------------
     2. ACTIVE NAV LINK ON SCROLL (scrollspy)
        A section is "active" while it crosses the middle of the viewport.
     ------------------------------------------------------------------ */
  var navLinkEls = document.querySelectorAll('.nav-link');
  var sections = [];

  document.querySelectorAll('main section[id]').forEach(function (section) {
    sections.push(section);
  });

  var setActive = function (id) {
    navLinkEls.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
  };

  if ('IntersectionObserver' in window && sections.length && navLinkEls.length) {
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) {
      spyObserver.observe(section);
    });
  }

  /* ------------------------------------------------------------------
     3. REVEAL ON SCROLL
        Elements with class "reveal" fade + rise into view once.
     ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll('.reveal');

  if (!prefersReducedMotion && 'IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else if (prefersReducedMotion) {
    /* Safety net — never leave content hidden if JS ran but motion is disabled */
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

})();