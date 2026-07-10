/* ============================================
   PARUSAN.DEV — Research paper archive
   Everything in fig. 03 renders from window.PAPERS
   (js/papers-data.js): the beamline trajectory,
   the cards, and the detail dialog. Runs before
   main.js so injected nodes join the site's
   reveal observer. Motion lives in CSS and is
   disabled under prefers-reduced-motion there.
   ============================================ */

(function () {
  'use strict';

  var papers = (window.PAPERS || []).filter(function (p) { return p.status === 'live'; });
  var grid = document.getElementById('papers-grid');
  var beam = document.getElementById('papers-beamline');
  var count = document.getElementById('papers-count');
  if (!grid || papers.length === 0) return;

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  // ==========================================
  // BEAMLINE — the research trajectory. One
  // station per paper; the beam passes through
  // all of them, oldest work upstream.
  // ==========================================
  function stationHTML(p, i) {
    return (
      '<li class="beam-node rv">' +
        '<button type="button" class="beam-btn" data-paper="' + esc(p.id) + '" aria-haspopup="dialog">' +
          '<span class="beam-dot" aria-hidden="true"></span>' +
          '<span class="sr-only">View details — </span>' +
          '<span class="beam-stage">' + pad(i + 1) + ' — ' + esc(p.stage) + '</span>' +
          '<span class="beam-short">' + esc(p.short) + '</span>' +
          '<span class="beam-year">' + esc(p.year) + ' · ' + esc(p.type.toLowerCase()) + '</span>' +
        '</button>' +
      '</li>'
    );
  }

  beam.innerHTML =
    '<div class="beam-cap rv">research trajectory — ' + pad(papers.length) + ' stations, one beamline</div>' +
    '<div class="beamline-wrap rv">' +
      '<div class="beam-track" aria-hidden="true"></div>' +
      '<ol class="beamline" aria-label="Research trajectory">' + papers.map(stationHTML).join('') + '</ol>' +
    '</div>';

  // ==========================================
  // CARDS
  // ==========================================
  function metaHTML(p) {
    return esc(p.year) + '<span>·</span>' + esc(p.format) + '<span>·</span>' + esc(p.topic);
  }

  function tagsHTML(p) {
    return p.tags.map(function (t) { return '<span class="pill">' + esc(t) + '</span>'; }).join('');
  }

  function actionsHTML(p) {
    return (
      '<div class="paper-actions">' +
        '<a class="btn btn-ink btn-sm" href="' + esc(p.pdf) + '" target="_blank" rel="noopener">' +
          'Read PDF <span class="btn-arrow">&#8599;</span>' +
          '<span class="sr-only"> — ' + esc(p.title) + ' (opens in a new tab)</span>' +
        '</a>' +
        '<button type="button" class="btn btn-line btn-sm paper-details" data-paper="' + esc(p.id) + '" aria-haspopup="dialog">' +
          'Details<span class="sr-only"> — ' + esc(p.title) + '</span>' +
        '</button>' +
      '</div>'
    );
  }

  function cardHTML(p, i) {
    return (
      '<article class="paper-card rv' + (p.featured ? ' featured' : '') + '" id="paper-' + esc(p.id) + '"' +
        ' aria-labelledby="pt-' + esc(p.id) + '">' +
        '<div class="pc-main">' +
          '<div class="paper-cap">' +
            '<span>paper ' + pad(i + 1) + ' · ' + esc(p.year) + '</span>' +
            '<span class="pstatus">Working manuscript</span>' +
          '</div>' +
          '<h3 id="pt-' + esc(p.id) + '">' + esc(p.title) + '</h3>' +
          '<div class="paper-kind"><span class="pk-type">' + esc(p.type) + '</span> · ' + esc(p.field) + '</div>' +
          '<p class="paper-sum">' + esc(p.summary) + '</p>' +
        '</div>' +
        '<div class="pc-side">' +
          '<div class="paper-tags" aria-label="Topics">' + tagsHTML(p) + '</div>' +
          '<div class="paper-meta">' + metaHTML(p) + '</div>' +
          actionsHTML(p) +
        '</div>' +
      '</article>'
    );
  }

  grid.className = 'papers-grid';
  grid.innerHTML = papers.map(cardHTML).join('');

  if (count) {
    count.textContent = pad(papers.length) + ' manuscripts · bundled as one archive';
  }

  // ==========================================
  // DETAIL DIALOG — one <dialog>, repopulated
  // per paper. Native focus trap + Esc; backdrop
  // click and both buttons close it.
  // ==========================================
  var dlg = document.createElement('dialog');
  dlg.className = 'paper-dialog';
  dlg.setAttribute('aria-labelledby', 'pd-title');
  document.body.appendChild(dlg);

  function fillDialog(p, i) {
    dlg.innerHTML =
      '<div class="pd-head">' +
        '<div class="paper-cap"><span>paper ' + pad(i + 1) + ' · ' + esc(p.year) + '</span>' +
          '<span class="pstatus">Working manuscript</span></div>' +
        '<button type="button" class="pd-close" aria-label="Close details">&times;</button>' +
      '</div>' +
      '<h3 id="pd-title">' + esc(p.title) + '</h3>' +
      '<div class="paper-kind"><span class="pk-type">' + esc(p.type) + '</span> · ' + esc(p.field) + '</div>' +
      '<div class="pd-label">abstract</div>' +
      '<p class="pd-body">' + esc(p.abstract) + '</p>' +
      '<div class="pd-label">why it matters</div>' +
      '<p class="pd-body">' + esc(p.why) + '</p>' +
      '<div class="pd-label">key topics</div>' +
      '<div class="paper-tags">' + p.topics.map(function (t) {
        return '<span class="pill">' + esc(t) + '</span>';
      }).join('') + '</div>' +
      '<p class="pd-disclaimer">Independent working manuscript — a portfolio research artifact. It has not been peer-reviewed or published in a journal, and it is not affiliated with or endorsed by CERN.</p>' +
      '<div class="pd-actions">' +
        '<a class="btn btn-ink btn-sm" href="' + esc(p.pdf) + '" target="_blank" rel="noopener">' +
          'Read PDF <span class="btn-arrow">&#8599;</span>' +
          '<span class="sr-only"> — ' + esc(p.title) + ' (opens in a new tab)</span>' +
        '</a>' +
        '<button type="button" class="btn btn-line btn-sm pd-dismiss">Close</button>' +
      '</div>';
  }

  function openDialog(id) {
    var i = -1, p = null, k;
    for (k = 0; k < papers.length; k++) {
      if (papers[k].id === id) { i = k; p = papers[k]; break; }
    }
    if (!p) return;
    fillDialog(p, i);
    dlg.showModal();
    document.body.classList.add('dialog-open');
    dlg.scrollTop = 0;
  }

  dlg.addEventListener('close', function () {
    document.body.classList.remove('dialog-open');
  });

  // Backdrop-close: e.target === dlg is also true for clicks in the
  // dialog's own padding, and for drag-selections that release over
  // whitespace. Only close when both the press and the release land
  // outside the panel's box — i.e. on the ::backdrop itself.
  function onBackdrop(e) {
    if (e.target !== dlg) return false;
    var r = dlg.getBoundingClientRect();
    return e.clientX < r.left || e.clientX > r.right ||
           e.clientY < r.top || e.clientY > r.bottom;
  }

  var pressedOnBackdrop = false;

  dlg.addEventListener('mousedown', function (e) {
    pressedOnBackdrop = onBackdrop(e);
  });

  dlg.addEventListener('click', function (e) {
    if (pressedOnBackdrop && onBackdrop(e)) { dlg.close(); return; }
    if (e.target.closest('.pd-close') || e.target.closest('.pd-dismiss')) dlg.close();
  });

  document.getElementById('papers').addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-paper]');
    if (trigger) openDialog(trigger.getAttribute('data-paper'));
  });

  // ==========================================
  // BEAM ↔ CARD linking — hovering a station
  // inks its card, and vice versa.
  // ==========================================
  document.querySelectorAll('.beam-btn').forEach(function (btn) {
    var card = document.getElementById('paper-' + btn.getAttribute('data-paper'));
    if (!card) return;
    btn.addEventListener('mouseenter', function () { card.classList.add('hl'); });
    btn.addEventListener('mouseleave', function () { card.classList.remove('hl'); });
    card.addEventListener('mouseenter', function () { btn.classList.add('hl'); });
    card.addEventListener('mouseleave', function () { btn.classList.remove('hl'); });
  });

})();
