/* ============================================
   PARUSAN.DEV — Research paper archive DATA
   Single source of truth for fig. 03. Every
   card, beamline station, and detail dialog
   renders from this array (see js/papers.js).

   SCHEMA — one object per paper:
     id       string  unique slug; used for DOM ids ("paper-<id>")
     status   string  'live'    = PDF exists in assets/papers/ and the
                                  paper renders on the page
                      'pending' = entry is scaffolded but the PDF is not
                                  in assets/papers/ yet; the paper is
                                  EXCLUDED from the rendered section so
                                  no dead link ever ships
     featured boolean one paper may be featured (wide card). Optional.
     title    string  full manuscript title, as printed in the PDF
     short    string  compact title for the beamline station
     stage    string  trajectory stage label for the beamline station
     type     string  paper format, e.g. 'Review / Perspective'
     field    string  research field line shown under the title
     topic    string  short topic area for the metadata row
     year     string  manuscript year
     format   string  artifact format for the metadata row, e.g. 'PDF · 15 pp.'
     summary  string  2–3 sentence card summary
     abstract string  the manuscript's abstract, verbatim from the PDF
     why      string  short "why it matters" note for the detail dialog
     tags     array   card tag pills
     topics   array   key-topic pills for the detail dialog
     pdf      string  path to the PDF under assets/papers/

   HOW TO ADD A PAPER
   1. Drop the PDF into assets/papers/ (kebab-case filename).
   2. Rebuild the bundle so "Download All PDFs" stays complete:
        Compress-Archive -Path "assets\papers\*.pdf" `
          -DestinationPath "assets\papers\cern-research-papers-pdfs.zip" -Force
   3. Add ONE entry below with status: 'live'. Example:

      {
        id: 'my-next-paper',
        status: 'live',
        title: 'Full Manuscript Title',
        short: 'Short Title',
        stage: 'Trajectory stage label',
        type: 'Review / Perspective',
        field: 'Experimental particle physics',
        topic: 'Topic area',
        year: '2026',
        format: 'PDF · 12 pp.',
        summary: 'Two or three sentences for the card.',
        abstract: 'The abstract, verbatim from the PDF.',
        why: 'One or two sentences on why the paper matters.',
        tags: ['CERN', 'Tag two', 'Tag three'],
        topics: ['Key topic one', 'Key topic two'],
        pdf: 'assets/papers/my-next-paper.pdf'
      }

   The cards, the beamline trajectory, and the detail dialog all
   extend automatically — no HTML changes needed. If the PDF is not
   ready yet, add the entry with status: 'pending' instead.
   ============================================ */

window.PAPERS = [
  {
    id: 'antimatter-symmetry',
    status: 'live',
    featured: true,
    title: 'Antimatter at CERN: Precision Symmetry Tests from Antiprotons to Antihydrogen',
    short: 'Antimatter at CERN',
    stage: 'Antimatter foundations',
    type: 'Review / Perspective',
    field: 'Experimental particle physics · antimatter physics',
    topic: 'Antimatter physics',
    year: '2026',
    format: 'PDF · 15 pp.',
    summary: 'A review of CERN’s AD/ELENA antimatter program. It compares how ALPHA, BASE, AEgIS, GBAR, ASACUSA, and PUMA test matter–antimatter symmetry, gravity, and nuclear structure through complementary precision measurements.',
    abstract: 'This review examines CERN’s low-energy antimatter program as a coordinated precision-measurement ecosystem rather than a single search for missing cosmic antimatter. Using CERN’s AD/ELENA infrastructure as the organizing center, it compares how BASE, ALPHA, AEgIS, GBAR, ASACUSA, and PUMA turn broad questions about matter-antimatter symmetry, gravity, and nuclear structure into experimentally distinct observables. BASE constrains baryonic symmetry through Penning-trap measurements of antiprotons and protons; ALPHA develops antihydrogen as a platform for spectroscopy, accumulation, cooling, and gravity studies; AEgIS and GBAR pursue independent antihydrogen gravity strategies; ASACUSA uses antiprotonic atoms and antihydrogen spectroscopy; and PUMA applies antiprotons to rare nuclear systems. Recent 2023-2026 results show the field moving from first demonstrations toward improved control, including direct antihydrogen gravity observation, coherent single-antiproton spin spectroscopy, larger antihydrogen samples, and ppm-scale hyperfine measurements. The review argues that the program’s scientific value lies in complementarity: different experiments test different observables and systematic limits, together clarifying what current antimatter measurements establish and what remains open.',
    why: 'Matter–antimatter asymmetry is one of the open problems of fundamental physics, and CERN’s AD/ELENA complex is where it is probed at low energy. Reading six experiments as one coordinated ecosystem — rather than as isolated searches — shows how complementary observables and systematic limits combine into a stronger overall test of symmetry.',
    tags: ['CERN', 'Antimatter', 'CPT Symmetry', 'Antihydrogen', 'Precision Measurement'],
    topics: ['AD / ELENA infrastructure', 'CPT & baryon symmetry tests', 'Antihydrogen spectroscopy & gravity', 'Penning-trap measurements', 'Experiment complementarity'],
    pdf: 'assets/papers/01-antimatter-at-cern-precision-symmetry-tests.pdf'
  },
  {
    id: 'basestep-transport',
    status: 'live',
    title: 'Transportable Antimatter: BASE-STEP and the Next Stage of Precision Antiproton Physics',
    short: 'BASE-STEP',
    stage: 'Transportable instrumentation',
    type: 'Focused Methods Review',
    field: 'Experimental particle physics · antimatter instrumentation',
    topic: 'Antimatter instrumentation',
    year: '2026',
    format: 'PDF · 10 pp.',
    summary: 'A focused methods review of BASE-STEP, a transportable Penning-trap reservoir. It explains how trapped antiprotons can be moved from CERN’s accelerator environment into lower-noise precision laboratories.',
    abstract: 'Transporting antimatter sounds, at first, like a logistical achievement with scientific theater built into it. For precision antiproton physics, however, the deeper issue is not transport itself but measurement environment. CERN’s Antiproton Decelerator and ELENA make low-energy antiprotons available to experiments that compare matter and antimatter with extraordinary precision, yet the same accelerator complex also creates a facility context in which magnetic-field fluctuations and scheduling constraints can limit the next stage of Penning-trap measurements. This paper argues that BASE-STEP should be understood as precision-measurement infrastructure: a transportable, autonomous Penning-trap reservoir designed to move trapped antiprotons from the accelerator environment into quieter laboratories. By connecting BASE-STEP’s design logic, the 2025 proton-transport rehearsal, and the 2026 antiproton-transport milestone to recent BASE charge-to-mass and spin-spectroscopy results, the paper shows why transportable antimatter can matter scientifically without relying on exaggerated claims about macroscopic antimatter use. The central point is that, in this program, logistics becomes physics when it changes the attainable measurement conditions.',
    why: 'The next order of magnitude in antiproton precision is limited less by trap technology than by the measurement environment of the accelerator hall itself. Framing BASE-STEP as precision-measurement infrastructure explains why moving trapped antiprotons into quieter laboratories is a scientific step, not a logistical stunt.',
    tags: ['CERN', 'BASE-STEP', 'Antimatter', 'Penning Traps', 'Precision Measurement'],
    topics: ['BASE-STEP design logic', 'Transportable Penning traps', 'Magnetic-noise environments', 'Antiproton transport milestones', 'Charge-to-mass & spin spectroscopy'],
    pdf: 'assets/papers/02-transportable-antimatter-basestep.pdf'
  },
  {
    id: 'dark-sectors',
    status: 'live',
    title: 'From Missing Energy to Dark Sectors: How the LHC Searches for Invisible Matter',
    short: 'Missing Energy → Dark Sectors',
    stage: 'Collider dark-sector inference',
    type: 'Review / Methods Perspective',
    field: 'Experimental particle physics · collider dark-matter searches',
    topic: 'Collider dark-matter searches',
    year: '2026',
    format: 'PDF · 14 pp.',
    summary: 'A review explaining how ATLAS and CMS turn invisible or hidden physics into measurable collider signatures. It covers missing transverse momentum, mono-X recoil, mediator complementarity, semi-visible jets, emerging jets, long-lived particles, and model-dependent null-result interpretation.',
    abstract: 'Dark matter is motivated by astrophysical evidence, but the Large Hadron Collider cannot search for it by directly imaging invisible particles inside ATLAS or CMS. It searches through detector-level inference. This review explains how missing transverse momentum, mono-X recoil signatures, mediator models, visible-invisible complementarity, semi-visible jets, emerging jets, and long-lived-particle signatures turn hidden physics into measurable collider observables. The central claim is that LHC dark-matter searches are best understood as disciplined chains linking reconstruction, background control, statistical comparison, and model interpretation. Classic missing-momentum searches remain central, but modern dark-sector searches broaden the program by testing signatures in which hidden particles partly escape, decay visibly, shower in unusual ways, or appear through displaced detector structure. Null results are therefore not empty outcomes: they exclude defined benchmark scenarios and guide the expansion toward signatures that simpler prompt searches may miss.',
    why: 'The LHC cannot image dark matter directly, so every search is an inference chain — reconstruction, background control, statistical comparison, and model interpretation. Understanding that chain is what makes null results meaningful: they exclude defined benchmark scenarios and steer the program toward signatures simpler prompt searches would miss.',
    tags: ['CERN', 'LHC', 'Dark Matter', 'Dark Sectors', 'Missing Transverse Momentum'],
    topics: ['Missing transverse momentum', 'Mono-X & simplified mediator models', 'Visible–invisible complementarity', 'Semi-visible & emerging jets', 'Long-lived particle signatures', 'Interpreting null results'],
    pdf: 'assets/papers/03-from-missing-energy-to-dark-sectors.pdf'
  }
];
