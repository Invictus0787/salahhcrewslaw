/* =========================================================
   [Firm Name] · Landing page interactions
   - Zero dependencies, ~5KB gz
   - Uses requestAnimationFrame, Intersection Observer, CSS vars
   - Honors prefers-reduced-motion
   ========================================================= */
(() => {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;

  /* -------------------------------------------------------
     1. Curtain loader
     ------------------------------------------------------- */
  const curtain = $('#curtain');
  requestAnimationFrame(() => curtain && curtain.classList.add('is-loading'));
  window.addEventListener('load', () => {
    setTimeout(() => curtain && curtain.classList.add('is-done'), 650);
  });

  /* -------------------------------------------------------
     2. Year
     ------------------------------------------------------- */
  const yr = $('#yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* -------------------------------------------------------
     3. Scroll progress + nav stuck
     ------------------------------------------------------- */
  const progress = $('#scrollProgress');
  const nav = $('#nav');
  let ticking = false;
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if (progress) progress.style.width = pct + '%';
    if (nav) nav.classList.toggle('is-stuck', h.scrollTop > 24);
    ticking = false;
  };
  document.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* -------------------------------------------------------
     4. Mobile sheet
     ------------------------------------------------------- */
  const burger = $('#burger');
  const sheet  = $('#sheet');
  const closeSheet = () => {
    sheet?.classList.remove('is-open');
    burger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  burger?.addEventListener('click', () => {
    const open = sheet?.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  sheet?.addEventListener('click', (e) => {
    if (e.target === sheet) closeSheet();
    if (e.target.tagName === 'A') closeSheet();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });

  /* -------------------------------------------------------
     5. Custom cursor (fine pointer only, not reduced motion)
     ------------------------------------------------------- */
  if (finePointer && !reduced) {
    const cursor = $('#cursor');
    const dot    = $('.cursor__dot');
    const ring   = $('.cursor__ring');
    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my, dx = mx, dy = my;

    addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    addEventListener('mousedown', () => cursor.classList.add('is-press'));
    addEventListener('mouseup',   () => cursor.classList.remove('is-press'));

    const hoverSel = 'a, button, [data-magnetic], [data-tilt], .card, input, select, textarea, label';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest?.(hoverSel)) cursor.classList.add('is-hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest?.(hoverSel)) cursor.classList.remove('is-hover');
    });

    const tick = () => {
      dx += (mx - dx) * 0.9;
      dy += (my - dy) * 0.9;
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.transform  = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    tick();
  }

  /* -------------------------------------------------------
     6. Magnetic buttons (fine pointer + not reduced)
     ------------------------------------------------------- */
  if (finePointer && !reduced) {
    $$('[data-magnetic]').forEach((el) => {
      let rect, raf;
      const STRENGTH = 0.22;
      const onMove = (e) => {
        if (!rect) rect = el.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width  / 2);
        const y = e.clientY - (rect.top  + rect.height / 2);
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = `translate3d(${x * STRENGTH}px, ${y * STRENGTH}px, 0)`;
        });
      };
      el.addEventListener('mouseenter', () => { rect = el.getBoundingClientRect(); });
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', () => {
        rect = null;
        cancelAnimationFrame(raf);
        el.style.transform = '';
      });
    });
  }

  /* -------------------------------------------------------
     7. Card spotlight + tilt
     ------------------------------------------------------- */
  if (finePointer && !reduced) {
    $$('[data-tilt]').forEach((card) => {
      let rect;
      const STRENGTH = 6;
      card.addEventListener('mouseenter', () => { rect = card.getBoundingClientRect(); });
      card.addEventListener('mousemove', (e) => {
        if (!rect) rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top)  / rect.height;
        card.style.setProperty('--mx', x * 100 + '%');
        card.style.setProperty('--my', y * 100 + '%');
        const rx = (0.5 - y) * STRENGTH;
        const ry = (x - 0.5) * STRENGTH;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        rect = null;
        card.style.transform = '';
      });
    });
  }

  /* -------------------------------------------------------
     8. Reveal on scroll (and counter triggers)
     ------------------------------------------------------- */
  const onceObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target;
      el.classList.add('is-in');

      // count-up
      if (el.dataset.count !== undefined) animateCount(el);
      $$('[data-count]', el).forEach(animateCount);

      onceObserver.unobserve(el);
    }
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

  $$('[data-reveal]').forEach(el => onceObserver.observe(el));
  $$('.compare__row').forEach(el => onceObserver.observe(el));
  $$('.steps li').forEach(el => onceObserver.observe(el));
  $$('.fee__bar').forEach(el => onceObserver.observe(el));

  /* -------------------------------------------------------
     9. Number counter
     ------------------------------------------------------- */
  function animateCount(el) {
    if (el._counted) return;
    el._counted = true;
    const target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dur = reduced ? 0 : 1100;
    const start = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const t = Math.min(1, (now - start) / Math.max(1, dur));
      const v = Math.round(target * easeOut(t));
      el.textContent = `${prefix}${v}${suffix}`;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* -------------------------------------------------------
     10. Hero parallax (transform on bg image) — pointer + scroll
     ------------------------------------------------------- */
  const heroImg = $('#heroImg');
  if (heroImg && !reduced) {
    let mx = 0, my = 0, tx = 0, ty = 0;
    let scrollY = 0;
    addEventListener('mousemove', (e) => {
      mx = (e.clientX / innerWidth  - 0.5) * 2;
      my = (e.clientY / innerHeight - 0.5) * 2;
    }, { passive: true });
    addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

    const tick = () => {
      tx += (mx - tx) * 0.06;
      ty += (my - ty) * 0.06;
      const yShift = scrollY * 0.15;
      heroImg.style.transform = `scale(1.12) translate3d(${tx * 14}px, ${ty * 14 + yShift}px, 0)`;
      requestAnimationFrame(tick);
    };
    tick();
  }

  /* -------------------------------------------------------
     11. Albany image parallax (subtle)
     ------------------------------------------------------- */
  const albanyImg = $('#albanyImg');
  const rootedSection = $('#rooted') || $('#albany');
  if (albanyImg && rootedSection && !reduced) {
    const onScrollA = () => {
      const r = rootedSection.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const off = (innerHeight / 2 - center) / innerHeight;
      albanyImg.style.transform = `scale(1.1) translate3d(0, ${off * 30}px, 0)`;
    };
    addEventListener('scroll', () => requestAnimationFrame(onScrollA), { passive: true });
    onScrollA();
  }

  /* -------------------------------------------------------
     12. Hero word rotator
     ------------------------------------------------------- */
  const rotator = $('.hero__rotator');
  if (rotator) {
    const items = $$('i', rotator);
    let idx = 0;

    // Ensure first item is sized correctly: set min-width to widest
    requestAnimationFrame(() => {
      let widest = 0;
      items.forEach((i) => {
        i.style.position = 'relative';
        i.style.opacity = '1';
        widest = Math.max(widest, i.offsetWidth);
        i.style.position = '';
        i.style.opacity = '';
      });
      rotator.style.minWidth = widest + 'px';
      items.forEach(i => { if (!i.classList.contains('active')) i.style.opacity = '0'; });
    });

    if (!reduced) {
      setInterval(() => {
        items[idx].classList.remove('active');
        idx = (idx + 1) % items.length;
        items[idx].classList.add('active');
      }, 3000);
    }
  }

  /* -------------------------------------------------------
     13. Voices / quotes carousel
     ------------------------------------------------------- */
  const quotesEl = $('#quotes');
  if (quotesEl) {
    const quotes = $$('.quote', quotesEl);
    const dots   = $$('.quotes__nav button');
    let q = 0, timer;
    const show = (i) => {
      quotes[q].classList.remove('is-active');
      dots[q]?.classList.remove('is-active');
      q = (i + quotes.length) % quotes.length;
      quotes[q].classList.add('is-active');
      dots[q]?.classList.add('is-active');
    };
    const start = () => {
      if (reduced) return;
      stop();
      timer = setInterval(() => show(q + 1), 5500);
    };
    const stop = () => { if (timer) clearInterval(timer); timer = null; };
    dots.forEach((btn, i) => btn.addEventListener('click', () => { show(i); start(); }));
    quotesEl.addEventListener('mouseenter', stop);
    quotesEl.addEventListener('mouseleave', start);
    start();
  }

  /* -------------------------------------------------------
     14. Contact form (client-only success state)
     ------------------------------------------------------- */
  const form = $('#contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // basic native validation
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const success = $('#contactSuccess');
      success?.classList.add('is-shown');
      success?.setAttribute('aria-hidden', 'false');
      form.querySelectorAll('input, select, textarea').forEach(el => (el.disabled = true));
      form.querySelector('button[type="submit"]')?.setAttribute('disabled', 'true');
      success?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* -------------------------------------------------------
     15. Active section indicator in nav
     ------------------------------------------------------- */
  const sectionIds = ['difference', 'fee', 'about', 'why', 'quality', 'practice', 'process', 'rooted'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  const navLinks = new Map();
  $$('.nav__links a').forEach(a => {
    const id = a.getAttribute('href')?.replace('#', '');
    if (id) navLinks.set(id, a);
  });
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = navLinks.get(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(a => { a.style.opacity = ''; a.style.color = ''; });
        link.style.opacity = '1';
      }
    });
  }, { threshold: 0.5, rootMargin: '-30% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));

})();
