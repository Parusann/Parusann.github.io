/* ============================================
   PARUSAN.DEV — Monograph interactions
   Printed grid re-inked by the cursor · static grain
   IO reveals · plate tilt · nav state
   All systems honor prefers-reduced-motion.
   ============================================ */

(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==========================================
  // REVEAL FAILSAFE — registered before any
  // other module so it survives even if one of
  // them throws. Content must never stay
  // invisible: if the observer never fires (or
  // the script errors), force-reveal shortly
  // after load.
  // ==========================================
  function revealAllFailsafe() {
    var hidden = document.querySelectorAll('.rv:not(.on)');
    for (var i = 0; i < hidden.length; i++) hidden[i].classList.add('on');
  }
  // Fire from an unconditional top-level timer (not gated on the `load`
  // event) so content is revealed even where `load` is delayed/consumed or
  // a resource stalls. `load` stays as a second belt.
  setTimeout(revealAllFailsafe, 800);
  window.addEventListener('load', function () {
    setTimeout(revealAllFailsafe, 600);
  });

  // ==========================================
  // GRID — printed graph paper. Baseline is a
  // static print; the cursor re-inks nearby
  // lines. Loop idles out when the mouse rests.
  // ==========================================
  (function initGrid() {
    var canvas = document.getElementById('grid-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var SPACING = 44;
    var RADIUS = 220;
    var BASE_ALPHA = 0.055;
    var mx = -1000, my = -1000;
    var lastMove = 0;
    var running = false;
    var w = 0, h = 0;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      var x, y, dist, t;

      for (x = 0; x <= w; x += SPACING) {
        dist = Math.abs(x - mx);
        t = Math.max(0, 1 - dist / RADIUS);
        ctx.strokeStyle = 'rgba(31, 107, 69, ' + (BASE_ALPHA + t * 0.16) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, h);
        ctx.stroke();
      }

      for (y = 0; y <= h; y += SPACING) {
        dist = Math.abs(y - my);
        t = Math.max(0, 1 - dist / RADIUS);
        ctx.strokeStyle = 'rgba(31, 107, 69, ' + (BASE_ALPHA + t * 0.16) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(w, y + 0.5);
        ctx.stroke();
      }

      // Re-inked intersections near the pen
      if (mx > -500) {
        for (x = 0; x <= w; x += SPACING) {
          for (y = 0; y <= h; y += SPACING) {
            var dx = x - mx, dy = y - my;
            var d = Math.sqrt(dx * dx + dy * dy);
            var it = Math.max(0, 1 - d / RADIUS);
            if (it > 0.08) {
              ctx.beginPath();
              ctx.arc(x, y, 1 + it * 1.6, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(31, 107, 69, ' + it * 0.4 + ')';
              ctx.fill();
            }
          }
        }
      }
    }

    function loop() {
      draw();
      if (performance.now() - lastMove > 1600) {
        running = false; // print settles
        return;
      }
      requestAnimationFrame(loop);
    }

    function wake() {
      lastMove = performance.now();
      if (!running) {
        running = true;
        requestAnimationFrame(loop);
      }
    }

    window.addEventListener('resize', resize);
    resize();

    if (!REDUCED) {
      document.addEventListener('mousemove', function (e) {
        mx = e.clientX;
        my = e.clientY;
        wake();
      }, { passive: true });

      document.addEventListener('mouseleave', function () {
        mx = -1000;
        my = -1000;
        wake();
      });
    }
  })();

  // ==========================================
  // GRAIN — one static frame of paper texture.
  // No animation loop; it's printed matter.
  // ==========================================
  (function initGrain() {
    var canvas = document.getElementById('grain');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    function paint() {
      var w = canvas.width = window.innerWidth;
      var h = canvas.height = window.innerHeight;
      var idata = ctx.createImageData(w, h);
      var buf = new Uint32Array(idata.data.buffer);
      for (var i = 0; i < buf.length; i++) {
        if (Math.random() < 0.05) {
          // ink-colored speck, very low alpha (ABGR)
          buf[i] = (14 << 24) | (29 << 16) | (33 << 8) | 27;
        }
      }
      ctx.putImageData(idata, 0, 0);
    }

    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(paint, 200);
    });
    paint();
  })();

  // ==========================================
  // REVEALS — IntersectionObserver, ink-in.
  // ==========================================
  (function initReveals() {
    var containers = document.querySelectorAll('[data-reveal]');

    function reveal(container) {
      var items = container.querySelectorAll('.rv');
      items.forEach(function (el, i) {
        if (REDUCED) {
          el.classList.add('on');
        } else {
          setTimeout(function () { el.classList.add('on'); }, i * 50);
        }
      });
    }

    if (!('IntersectionObserver' in window)) {
      containers.forEach(reveal);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    containers.forEach(function (c) { io.observe(c); });

    // Reveal anything already above the fold on the first frame, without
    // waiting for the observer's async callback (fixes hero-invisible-on-load).
    requestAnimationFrame(function () {
      containers.forEach(function (c) {
        var r = c.getBoundingClientRect();
        if (r.top < (window.innerHeight || 0) * 0.92) {
          reveal(c);
          io.unobserve(c);
        }
      });
    });
  })();

  // ==========================================
  // NAVBAR — scrolled state + active section.
  // rAF-throttled; offsets cached on resize.
  // ==========================================
  (function initNavbar() {
    var navbar = document.getElementById('navbar');
    var links = document.querySelectorAll('.nav-links a[data-nav]');
    var sections = [];
    var ticking = false;

    function measure() {
      sections = [];
      document.querySelectorAll('section[id]').forEach(function (s) {
        sections.push({ id: s.id, top: s.offsetTop });
      });
    }

    function update() {
      ticking = false;
      var sy = window.scrollY;
      navbar.classList.toggle('scrolled', sy > 8);

      var current = '';
      for (var i = 0; i < sections.length; i++) {
        if (sy >= sections[i].top - 120) current = sections[i].id;
      }
      links.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });

    window.addEventListener('resize', function () {
      measure();
      update();
    });

    measure();
    update();

    // Webfonts and late images can shift section offsets after load — the
    // motion layer calls this to keep the scroll-spy offsets honest.
    window.__navMeasure = function () {
      measure();
      update();
    };
  })();

  // ==========================================
  // MOBILE MENU
  // ==========================================
  (function initMobileMenu() {
    var toggle = document.querySelector('.mob-tog');
    var navLinks = document.querySelector('.nav-links');
    if (!toggle || !navLinks) return;

    function setOpen(open) {
      toggle.classList.toggle('open', open);
      navLinks.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    toggle.addEventListener('click', function () {
      setOpen(!toggle.classList.contains('open'));
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });
  })();

  // ==========================================
  // SMOOTH ANCHOR SCROLL — respects reduced
  // motion; keeps the hash without a jump.
  // ==========================================
  (function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: top, behavior: REDUCED ? 'auto' : 'smooth' });
        history.replaceState(null, '', anchor.getAttribute('href'));
      });
    });
  })();

  // ==========================================
  // PLATE TILT — only elements marked
  // [data-tilt]. Max 3°, lerped rAF, glare via
  // CSS vars. Reading surfaces never tilt.
  // ==========================================
  (function initTilt() {
    if (REDUCED) return;
    var plates = document.querySelectorAll('[data-tilt]');

    plates.forEach(function (el) {
      var rafId = null;
      var tx = 0, ty = 0;   // target rotation
      var cx = 0, cy = 0;   // current rotation
      var hovering = false;

      function animate() {
        cx += (tx - cx) * 0.12;
        cy += (ty - cy) * 0.12;
        el.style.transform = 'perspective(700px) rotateX(' + cx.toFixed(3) + 'deg) rotateY(' + cy.toFixed(3) + 'deg) translateY(-4px)';
        if (hovering || Math.abs(cx) > 0.01 || Math.abs(cy) > 0.01) {
          rafId = requestAnimationFrame(animate);
        } else {
          el.style.transform = '';
          rafId = null;
        }
      }

      function wake() {
        if (!rafId) rafId = requestAnimationFrame(animate);
      }

      el.addEventListener('mouseenter', function () {
        hovering = true;
        wake();
      });

      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        el.style.setProperty('--mx', x + 'px');
        el.style.setProperty('--my', y + 'px');
        tx = ((y - rect.height / 2) / (rect.height / 2)) * -3;
        ty = ((x - rect.width / 2) / (rect.width / 2)) * 3;
      });

      el.addEventListener('mouseleave', function () {
        hovering = false;
        tx = 0;
        ty = 0;
        el.style.setProperty('--mx', '50%');
        el.style.setProperty('--my', '50%');
        wake();
      });
    });
  })();

})();
