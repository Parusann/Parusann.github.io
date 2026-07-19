/* ============================================
   PARUSAN.DEV — Motion
   GSAP/ScrollTrigger choreography layered over
   the existing reveal system. Scrolling is
   native — GSAP only animates content, never
   the scroll itself. Loads last; every effect
   gates on prefers-reduced-motion and falls
   back to the base experience if a CDN
   library is missing.
   ============================================ */

(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==========================================
  // 2a · MARGIN RULE — the lab-notebook
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
  if (!window.gsap || !window.ScrollTrigger) return;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  // JS mirror of --ease: cubic-bezier(0.22, 1, 0.36, 1) — keep in sync.
  var EASE = 'power4.out';

  // Webfonts and late images shift section offsets after main.js cached
  // them — re-measure the nav scroll-spy whenever ScrollTrigger does.
  ScrollTrigger.addEventListener('refresh', function () {
    if (window.__navMeasure) window.__navMeasure();
  });

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
  // 2b · NOTEBOOK THROUGH-LINE + SECTION
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

  // Webfonts shift metrics after first layout — re-measure trigger positions.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      ScrollTrigger.refresh();
    });
  }
})();
