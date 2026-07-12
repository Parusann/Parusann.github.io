/* ============================================
   PARUSAN.DEV — Signature motion
   Lenis smooth scroll + GSAP/ScrollTrigger
   choreography, layered over the existing
   reveal system. Loads last; every effect
   gates on prefers-reduced-motion and falls
   back to the base experience if a CDN
   library is missing.
   ============================================ */

(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==========================================
  // 4a · MARGIN RULE — the lab-notebook
  // through-line. Built for every JS-on mode:
  // under reduced motion (or with no GSAP) the
  // stylesheet renders it as a static full-
  // height rule with no figure label; the
  // motion layer below scrubs it instead.
  // Hidden under 1200px in CSS.
  // ==========================================
  var marginRule = (function () {
    var root = document.createElement('div');
    root.className = 'margin-rule';
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML =
      '<span class="mr-line"></span>' +
      '<span class="mr-fig"><span class="mr-cur"></span></span>';
    document.body.appendChild(root);
    return {
      root: root,
      line: root.querySelector('.mr-line'),
      fig: root.querySelector('.mr-fig'),
      cur: root.querySelector('.mr-cur')
    };
  })();

  if (REDUCED) return;
  if (!window.gsap || !window.ScrollTrigger || !window.Lenis) return;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  // JS mirror of --ease: cubic-bezier(0.22, 1, 0.36, 1) — keep in sync.
  var EASE = 'power4.out';

  // ==========================================
  // SUBSTRATE — one scroll clock. Lenis owns
  // the wheel, gsap.ticker drives Lenis, and
  // Lenis feeds ScrollTrigger plus the velocity
  // consumers (ticker lean, grid drift).
  // ==========================================
  var lenis = new Lenis({ autoRaf: false });
  window.__lenis = lenis;

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function (time) {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Pin-spacers change section offsets after main.js cached them —
  // re-measure the nav scroll-spy whenever ScrollTrigger re-measures.
  ScrollTrigger.addEventListener('refresh', function () {
    if (window.__navMeasure) window.__navMeasure();
  });

  // ------------------------------------------
  // Scroll velocity → ticker lean + grid drift.
  // ------------------------------------------
  (function initVelocity() {
    var tickerEl = document.querySelector('.ticker');
    var track = document.querySelector('.ticker-track');
    var cssAnim = null;
    if (track && track.getAnimations) {
      track.getAnimations().forEach(function (a) {
        if (a.animationName === 'tickerScroll') cssAnim = a;
      });
    }
    var skewX = tickerEl ? gsap.quickSetter(tickerEl, 'skewX', 'deg') : null;
    var vel = 0;

    lenis.on('scroll', function (e) {
      vel = e.velocity || 0;
      if (window.__gridDrift) window.__gridDrift(0, -e.scroll * 0.06);
    });

    var applied = null;
    gsap.ticker.add(function () {
      vel *= 0.9;
      if (vel > -0.01 && vel < 0.01) vel = 0;
      var v = gsap.utils.clamp(-60, 60, vel);
      if (v === applied) return; // idle — no style writes at rest
      applied = v;
      if (skewX) skewX(v * -0.045);
      if (cssAnim) cssAnim.playbackRate = 1 + Math.min(Math.abs(v) / 32, 1.35);
    });
  })();

  // ------------------------------------------
  // Shared: type text into an element behind a
  // blinking caret. The element keeps its line
  // box (minHeight) while empty; on any error
  // the original text is restored immediately.
  // ------------------------------------------
  function typeIn(el, opts) {
    opts = opts || {};
    if (!el || el.__typing) return;
    var full = el.textContent;
    if (!full.length) return;
    el.__typing = true;
    try {
      el.style.minHeight = el.offsetHeight + 'px';
      var txt = document.createTextNode('');
      var caret = document.createElement('span');
      caret.className = 'type-caret';
      caret.textContent = '_';
      caret.setAttribute('aria-hidden', 'true');
      el.textContent = '';
      el.appendChild(txt);
      el.appendChild(caret);
      var state = { n: 0 };
      gsap.to(state, {
        n: full.length,
        duration: Math.min(full.length * (opts.charMs || 24) / 1000, 1.6),
        delay: opts.delay || 0,
        ease: 'none',
        onUpdate: function () {
          txt.nodeValue = full.slice(0, Math.round(state.n));
        },
        onComplete: function () {
          txt.nodeValue = full;
          gsap.to(caret, {
            autoAlpha: 0,
            duration: 0.35,
            delay: opts.caretLingerS != null ? opts.caretLingerS : 1.4,
            onComplete: function () {
              caret.remove();
              el.style.minHeight = '';
            }
          });
        }
      });
    } catch (err) {
      el.textContent = full;
      el.style.minHeight = '';
    }
  }

  // ==========================================
  // 1 · DEVELOPING THE PLATE — the hero.
  // The astronaut plate arrives under-developed
  // and inks to the stylesheet's exact filter;
  // the kicker types in; the name ink-wipes up
  // word by word; the plate parallaxes within
  // its frame on the way out. All inner-content
  // work — the .rv reveal on the outer elements
  // keeps running untouched.
  // ==========================================
  function initHero() {
    var hero = document.getElementById('hero');
    if (!hero) return;
    var kicker = hero.querySelector('.hero-kicker');
    var name = hero.querySelector('.hero-name');
    var img = hero.querySelector('.hero-fig .mount img');

    // Name — masked ink-wipe upward, word by word.
    if (name) {
      var words = [];
      Array.prototype.slice.call(name.childNodes).forEach(function (node) {
        if (node.nodeType !== 3 || !node.nodeValue.trim()) return;
        var frag = document.createDocumentFragment();
        node.nodeValue.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (!part.trim()) {
            frag.appendChild(document.createTextNode(part));
            return;
          }
          var span = document.createElement('span');
          span.className = 'hn-word';
          span.textContent = part;
          frag.appendChild(span);
          words.push(span);
        });
        name.replaceChild(frag, node);
      });
      if (words.length) {
        gsap.fromTo(words,
          { yPercent: 70, clipPath: 'inset(-25% -8% 105% -8%)' },
          {
            yPercent: 0,
            clipPath: 'inset(-25% -8% -25% -8%)',
            duration: 1.05,
            stagger: 0.16,
            delay: 0.15,
            ease: EASE,
            onComplete: function () {
              gsap.set(words, { clearProps: 'all' });
            }
          });
      }
    }

    // Kicker — types in behind the caret.
    if (kicker) typeIn(kicker, { delay: 0.1 });

    if (img) {
      // Parallax within the frame as the hero scrolls out — created only
      // after the develop tween releases the scale channel, so the two
      // never contend. The scrub renders by scroll position immediately
      // on creation, so a mid-page deep link still lands correctly.
      // scale stays within the mount's 10px mat; the bottom edge the
      // translate reveals is the mat itself, so the frame never breaks.
      var makeParallax = function () {
        gsap.to(img, {
          yPercent: -5,
          scale: 1.02,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
      };

      // Develop — darkroom paper inking in. The under-developed state
      // applies immediately (so a slow image streams in washed-out) and
      // the develop plays once the pixels have actually arrived.
      var DEV_TO = 'grayscale(1) contrast(1.12) brightness(1.06)'; // = stylesheet filter
      gsap.set(img, { filter: 'grayscale(1) contrast(0.78) brightness(1.5)', scale: 1.05 });
      var develop = function () {
        gsap.to(img, {
          filter: DEV_TO,
          scale: 1,
          duration: 1.3,
          ease: 'power2.inOut',
          onComplete: function () {
            gsap.set(img, { clearProps: 'filter' });
            makeParallax();
          }
        });
      };
      if (img.decode) img.decode().then(develop, develop);
      else if (img.complete) develop();
      else img.addEventListener('load', develop, { once: true });
    }
  }

  try {
    initHero();
  } catch (err) {
    // Never leave hero content hidden or half-typed.
    var heroEl = document.getElementById('hero');
    if (heroEl) gsap.set(heroEl.querySelectorAll('.hn-word, .mount img'), { clearProps: 'all' });
  }

  // ==========================================
  // 2 · SELF-DRAWING DIAGRAMS — the five
  // .mini .diagram blocks draw themselves once
  // on entry. Every tween is a from()/fromTo()
  // whose end state is the stylesheet value,
  // and onComplete clears inline styles, so the
  // resting diagram is pixel-identical to the
  // static page. Packet + counters are
  // ephemeral flourishes — on a deep link past
  // a diagram its once-trigger still plays the
  // timeline from 0 (off-screen) and everything
  // converges to the recorded end states.
  // ==========================================
  var FAINT = (getComputedStyle(document.documentElement).getPropertyValue('--faint') || '#5F6B62').trim();

  function runPacket(flow) {
    var rows = flow.querySelectorAll('.drow');
    if (rows.length < 2) return;
    var frect = flow.getBoundingClientRect();
    var pts = [];
    rows.forEach(function (row) {
      var node = row.querySelector('.dnode.hit') || row.querySelector('.dnode');
      if (!node) return;
      var r = node.getBoundingClientRect();
      pts.push({ x: r.left + r.width / 2 - frect.left, y: r.top + r.height / 2 - frect.top });
    });
    if (pts.length < 2) return;
    var dot = document.createElement('span');
    dot.className = 'flow-packet';
    dot.setAttribute('aria-hidden', 'true');
    flow.appendChild(dot);
    var tl = gsap.timeline({
      onComplete: function () { dot.remove(); }
    });
    tl.set(dot, { xPercent: -50, yPercent: -50, x: pts[0].x, y: pts[0].y, autoAlpha: 0 })
      .to(dot, { autoAlpha: 1, duration: 0.12 });
    for (var i = 1; i < pts.length; i++) {
      tl.to(dot, { x: pts[i].x, y: pts[i].y, duration: 0.26, ease: 'power1.inOut' });
    }
    tl.to(dot, { autoAlpha: 0, duration: 0.2 }, '-=0.05');
  }

  function countUp(tl, foot, at) {
    foot.querySelectorAll('b').forEach(function (b) {
      var original = b.textContent;
      var m = original.match(/^([^\d]*)([\d][\d,]*(?:\.\d+)?)(.*)$/);
      if (!m) return;
      var prefix = m[1], numStr = m[2], suffix = m[3];
      var target = parseFloat(numStr.replace(/,/g, ''));
      var hasComma = numStr.indexOf(',') !== -1;
      var decimals = (numStr.split('.')[1] || '').length;
      var state = { v: 0 };
      tl.to(state, {
        v: target,
        duration: 0.9,
        ease: 'power2.out',
        onUpdate: function () {
          var v = state.v.toFixed(decimals);
          if (hasComma) {
            v = Number(v).toLocaleString('en-US', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals
            });
          }
          b.textContent = prefix + v + suffix;
        },
        onComplete: function () { b.textContent = original; }
      }, at);
    });
  }

  function initDiagrams() {
    document.querySelectorAll('.mini .diagram').forEach(function (dia) {
      var flow = dia.querySelector('.flow');
      var wire = dia.querySelector('.wire');
      var foot = dia.querySelector('.fig-foot');
      var animated = [];
      var tl = gsap.timeline({
        scrollTrigger: { trigger: dia, start: 'top 78%', once: true },
        defaults: { ease: EASE },
        onComplete: function () { gsap.set(animated, { clearProps: 'all' }); }
      });

      if (flow) {
        var nodes = flow.querySelectorAll('.dnode');
        var arrows = flow.querySelectorAll('.darr');
        animated.push.apply(animated, nodes);
        animated.push.apply(animated, arrows);
        tl.from(nodes, { autoAlpha: 0, scale: 0.88, y: 8, duration: 0.5, stagger: 0.14 }, 0)
          .from(arrows, { autoAlpha: 0, scaleY: 0.3, transformOrigin: '50% 0%', duration: 0.4, stagger: 0.14 }, 0.16)
          .add(function () { runPacket(flow); }, '-=0.1');
      }

      if (wire) {
        var dots = wire.querySelectorAll('.wire-dot');
        var title = wire.querySelector('.wire-title');
        var toolbarKids = wire.querySelectorAll('.wire-toolbar > *');
        var navs = wire.querySelectorAll('.wire-nav');
        var books = wire.querySelectorAll('.wire-book');
        var navOn = wire.querySelector('.wire-nav.on');
        animated.push(wire);
        [dots, toolbarKids, navs, books].forEach(function (group) {
          animated.push.apply(animated, group);
        });
        if (title) animated.push(title);
        tl.fromTo(wire,
            { clipPath: 'inset(0% 0% 100% 0% round 10px)' },
            {
              clipPath: 'inset(0% 0% 0% 0% round 10px)',
              duration: 0.55,
              ease: 'power2.inOut',
              // release the clip as soon as the chrome is drawn so the
              // wire's drop-shadow isn't clipped while the rest staggers in
              onComplete: function () { gsap.set(wire, { clearProps: 'clipPath' }); }
            }, 0)
          .from(dots, { scale: 0, transformOrigin: '50% 50%', duration: 0.3, stagger: 0.07 }, 0.1)
          .from(title, { autoAlpha: 0, x: 6, duration: 0.3 }, 0.25)
          .from(toolbarKids, { autoAlpha: 0, y: 5, duration: 0.35, stagger: 0.08 }, 0.3)
          .from(navs, { autoAlpha: 0, x: -8, duration: 0.3, stagger: 0.07 }, 0.45)
          .from(books, { autoAlpha: 0, scale: 0.9, y: 4, transformOrigin: '50% 60%', duration: 0.35, stagger: 0.05 }, 0.55);
        if (navOn) {
          tl.from(navOn, { backgroundColor: 'rgba(31, 107, 69, 0)', color: FAINT, duration: 0.45, ease: 'none' }, 0.95);
        }
      }

      if (foot) {
        animated.push(foot);
        var footAt = flow ? 1.0 : 1.1;
        tl.from(foot, { autoAlpha: 0, y: 6, duration: 0.45 }, footAt);
        countUp(tl, foot, footAt);
      }
    });
  }

  try {
    initDiagrams();
  } catch (err) {
    gsap.set(document.querySelectorAll('.mini .diagram, .mini .diagram *'), { clearProps: 'all' });
  }

  // ==========================================
  // 3 · PINNED CASE STUDIES — each .case pins
  // briefly while the plate scrubs (inner img
  // only — tilt owns the .mount transform) and
  // the .proj-info beats reveal in sequence;
  // the caption presses in like a letterpress
  // stamp. Desktop two-column layouts only:
  // below 961px (and under reduced motion, and
  // with no GSAP) the cases keep the existing
  // .rv reveal.
  // ==========================================
  function initCases() {
    var mm = gsap.matchMedia();
    mm.add('(min-width: 961px)', function () {
      document.querySelectorAll('.case').forEach(function (kase) {
        var flip = kase.classList.contains('flip');
        var img = kase.querySelector('.proj-plate img');
        var caption = kase.querySelector('.proj-caption');
        var info = kase.querySelector('.proj-info');
        if (!info) return;
        var beats = info.querySelectorAll(
          '.case-index, h3, .proj-sum, .case-note, .tech-line, .proj-hl li, .proj-links'
        );
        var dx = flip ? -26 : 26;

        var tl = gsap.timeline({
          scrollTrigger: {
            trigger: kase,
            start: 'center center',
            end: '+=80%',
            pin: true,
            // .proj-list is display:flex, where ScrollTrigger silently
            // disables padding-based pin spacing (no travel reserved →
            // the next case scrolls up over the pinned one). Margins DO
            // push siblings in a flex column, so force margin spacing.
            pinSpacing: 'margin',
            scrub: true
          },
          defaults: { ease: 'power2.out' }
        });
        if (img) {
          // stays within the mount's 10px mat at every progress value
          tl.fromTo(img,
            { scale: 1.03, yPercent: 1 },
            { scale: 1, yPercent: 0, ease: 'none', duration: 3 }, 0);
        }
        if (caption) {
          tl.from(caption, {
            opacity: 0,
            scale: 1.12,
            transformOrigin: flip ? '100% 100%' : '0% 100%',
            duration: 0.5
          }, 0.15);
        }
        // opacity (not autoAlpha) so links and headings stay in the
        // accessibility tree and tab order pre-scrub, like .rv does
        tl.from(beats, { opacity: 0, x: dx, duration: 0.55, stagger: 0.28 }, 0.25);
        tl.to({}, { duration: 0.5 }, '>'); // settle beat before the pin releases
      });
    });
  }

  try {
    initCases();
  } catch (err) {
    gsap.set(document.querySelectorAll('.case .proj-info *, .case .proj-caption, .case .proj-plate img'),
      { clearProps: 'all' });
  }

  // ==========================================
  // 4b · NOTEBOOK THROUGH-LINE + SECTION
  // TRANSITIONS — the margin rule inks down
  // the left edge with scroll progress and its
  // figure label ticks 01 → 06 in step with
  // the sections; the graph grid "page-turns"
  // at each boundary; section headers upgrade
  // to a typed label + masked title wipe.
  // ==========================================
  function initNotebook() {
    var sections = ['about', 'projects', 'experience', 'papers', 'skills', 'contact'];
    var about = document.getElementById('about');
    var contact = document.getElementById('contact');

    // Margin rule — length tied to scroll progress, label riding the tip.
    if (about && contact) {
      var line = marginRule.line;
      var fig = marginRule.fig;
      var cur = marginRule.cur;
      gsap.set(line, { scaleY: 0, transformOrigin: '50% 0%' });
      var setFigY = gsap.quickSetter(fig, 'y', 'px');
      var ruleH = 0;
      var measure = function () {
        ruleH = Math.max(0, marginRule.root.clientHeight - fig.offsetHeight);
      };
      measure();
      ScrollTrigger.addEventListener('refresh', measure);

      gsap.to(line, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: about,
          start: 'top 75%',
          endTrigger: contact,
          end: 'bottom bottom',
          scrub: true,
          onUpdate: function (self) {
            setFigY(self.progress * ruleH);
          }
        }
      });

      var tickTl = null;
      var shown = false;
      var pendingText = '';
      var tickFig = function (text) {
        if (!shown) {
          shown = true;
          gsap.to(fig, { autoAlpha: 1, duration: 0.3, overwrite: 'auto' });
        }
        // guard on the swap target, not the mid-fade textContent —
        // a direction flip during the 0.14s fade must still land the
        // label the reader is actually in
        if (pendingText === text) return;
        pendingText = text;
        if (tickTl) tickTl.kill();
        tickTl = gsap.timeline()
          .to(cur, { autoAlpha: 0, y: -5, duration: 0.14, ease: 'power1.in' })
          .add(function () { cur.textContent = text; })
          .fromTo(cur, { autoAlpha: 0, y: 5 }, { autoAlpha: 1, y: 0, duration: 0.2, ease: 'power1.out' });
      };

      sections.forEach(function (id, i) {
        var sec = document.getElementById(id);
        if (!sec) return;
        var label = 'fig. 0' + (i + 1);
        ScrollTrigger.create({
          trigger: sec,
          start: 'top 60%',
          end: 'bottom 60%',
          onToggle: function (self) {
            if (self.isActive) tickFig(label);
          }
        });
      });

      ScrollTrigger.create({
        trigger: about,
        start: 'top 75%',
        onLeaveBack: function () {
          shown = false;
          pendingText = '';
          if (tickTl) tickTl.kill();
          cur.textContent = '';
          gsap.to(fig, { autoAlpha: 0, duration: 0.25, overwrite: 'auto' });
        }
      });
    }

    // Page-turn — the graph grid lifts and settles across each section
    // boundary. Every keyframe pair starts and ends at identity, so the
    // grid is untransformed whenever no boundary is in range.
    var canvas = document.getElementById('grid-canvas');
    if (canvas) {
      sections.forEach(function (id) {
        var sec = document.getElementById(id);
        if (!sec) return;
        gsap.timeline({
          scrollTrigger: { trigger: sec, start: 'top 85%', end: 'top 30%', scrub: true }
        })
          // scale must out-cover translate + rotation corner drop so the
          // viewport-sized canvas never shows unpainted edges mid-turn
          .to(canvas, { y: -8, rotation: 0.3, scale: 1.03, ease: 'none', duration: 1 })
          .to(canvas, { y: 0, rotation: 0, scale: 1, ease: 'none', duration: 1 });
      });
    }

    // Section headers — the label types in, the title ink-wipes up.
    // States resolve on deep-link fast-forwards (the typing is a
    // callback, so it is skipped and the label just appears).
    sections.forEach(function (id) {
      var sec = document.getElementById(id);
      if (!sec) return;
      var hdr = sec.querySelector('.section-header') || sec.querySelector('.contact-say');
      if (!hdr) return;
      var flabel = hdr.querySelector('.flabel');
      var ftitle = hdr.querySelector('.ftitle');
      if (!flabel && !ftitle) return;
      var animated = [];
      var tl = gsap.timeline({
        scrollTrigger: { trigger: hdr, start: 'top 82%', once: true },
        onComplete: function () {
          gsap.set(animated, { clearProps: 'all' });
        }
      });
      if (flabel) {
        animated.push(flabel);
        tl.fromTo(flabel, { opacity: 0 }, { opacity: 1, duration: 0.01 }, 0)
          .add(function () {
            typeIn(flabel, { charMs: 22, caretLingerS: 0.4 });
          }, 0.01);
      }
      if (ftitle) {
        animated.push(ftitle);
        // immediateRender: fromTo at a non-zero position would otherwise
        // wait for the playhead — the .rv reveal would fade the title in
        // first and the wipe would visibly re-hide it (double reveal).
        tl.fromTo(ftitle,
          { y: '0.5em', clipPath: 'inset(-15% -5% 100% -5%)' },
          {
            y: 0,
            clipPath: 'inset(-15% -5% -20% -5%)',
            duration: 0.9,
            ease: EASE,
            immediateRender: true
          }, 0.12);
      }
    });
  }

  try {
    initNotebook();
  } catch (err) {
    gsap.set(document.querySelectorAll('.flabel, .ftitle, #grid-canvas, .mr-line, .mr-fig'),
      { clearProps: 'all' });
  }

  // ------------------------------------------
  // Papers dialog: halt the smooth scroller
  // while the modal is open so the dialog pane
  // scrolls natively behind the focus trap.
  // ------------------------------------------
  (function initDialogGuard() {
    var dlg = document.querySelector('.paper-dialog');
    if (!dlg) return;
    dlg.setAttribute('data-lenis-prevent', '');
    var papers = document.getElementById('papers');
    if (papers) {
      papers.addEventListener('click', function (e) {
        if (e.target.closest('[data-paper]')) lenis.stop();
      });
    }
    dlg.addEventListener('close', function () {
      lenis.start();
    });
  })();

  // Webfonts shift metrics after first layout — re-measure trigger positions.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      ScrollTrigger.refresh();
    });
  }
})();
