# Parusan Natheeswaran Portfolio

<div align="center">

![Parusan Natheeswaran portfolio banner](assets/readme-banner.svg)

Handcrafted portfolio website showcasing hardware design, software engineering, applied AI, and full-stack work.

[![Live Site](https://img.shields.io/badge/Live%20Site-parusann.github.io-2E8F52?style=for-the-badge)](https://parusann.github.io/)
[![HTML5](https://img.shields.io/badge/HTML5-Structure-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Styling-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-Interactions-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111111)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Responsive](https://img.shields.io/badge/Responsive-Desktop%20%2B%20Mobile-0F1C17?style=for-the-badge)](https://parusann.github.io/)

</div>

## Table of Contents

- [Overview](#overview)
- [Quick Stats](#quick-stats)
- [Recruiter Snapshot](#recruiter-snapshot)
- [Why This Portfolio Stands Out](#why-this-portfolio-stands-out)
- [Project Highlights](#project-highlights)
- [Site Sections](#site-sections)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Implementation Notes](#implementation-notes)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Social Preview Asset](#social-preview-asset)
- [Customization Ideas](#customization-ideas)
- [Contact](#contact)

## Overview

This repository powers my personal portfolio website, branded as `parusan.dev` and currently published at [parusann.github.io](https://parusann.github.io/).

The site is designed to do more than list experience. It presents my engineering profile like a product:

- a bold landing section with motion and visual depth
- two flagship project case studies with strong technical framing
- a further-work carousel covering the rest of the project portfolio, ordered strongest first
- a self-authored research paper archive with in-page detail dialogs
- a clear experience timeline and skills overview
- a direct path for recruiters, collaborators, and hiring teams to contact me

The site is built with plain HTML, CSS, and JavaScript, plus GSAP and ScrollTrigger for motion choreography — scrolling itself stays native. No framework, no build step, and no unnecessary complexity. The goal was to create something that feels polished, fast, and intentional while keeping the codebase simple and easy to maintain.

## Quick Stats

| Area | Snapshot |
| --- | --- |
| Live portfolio | [parusann.github.io](https://parusann.github.io/) |
| Role focus | Hardware/CPU design, software engineering, applied AI, and backend systems |
| Opportunity status | Open to internship and co-op roles |
| Flagship case studies | 2 (Xenolinguist, Bingery) |
| Further-work carousel | 7 projects, ordered strongest first |
| Research papers | Self-authored physics manuscripts with PDF downloads |
| Experience entries | 2 |
| Core implementation | Static front end: HTML, CSS, JavaScript, GSAP + ScrollTrigger |
| Signature interactions | Interactive grid, film-grain overlay, scroll choreography, sequential carousel, 3D card tilt |

## Recruiter Snapshot

If you are reviewing this repository as part of a hiring process, this portfolio is built to make three things immediately clear:

- I build across the full stack in the widest sense — from a formally verified RISC-V CPU in SystemVerilog, through backend systems and data pipelines, to polished front-end and desktop apps
- my strongest interests sit at the intersection of computer architecture, applied AI, and product-focused software engineering
- I am actively seeking internship and co-op opportunities where I can contribute quickly and keep growing as a builder

What you will find in this repo and on the live site:

- a custom portfolio instead of a recycled template
- flagship case studies with concrete, verifiable technical claims
- a carousel of further projects spanning hardware, data, ML systems, and backend work
- self-authored technical manuscripts that show scientific writing ability
- direct contact paths for follow-up

## Why This Portfolio Stands Out

This is not a generic template portfolio. It is a custom-built static site with a distinct visual identity and hand-coded interactions.

### Visual direction

- deep-space green and amber color palette
- glassmorphism-inspired cards with layered shadows and lighting
- cinematic hero section with image, overlay, gradient, and scroll cues
- real product screenshots for both flagship case studies
- pure-CSS schematic diagrams for every carousel project — no image assets
- technical typography using `Outfit` and `JetBrains Mono`

### Interaction design

- canvas-based interactive grid that reacts to cursor position
- animated film-grain noise overlay for atmosphere
- GSAP + ScrollTrigger choreography layered over an `IntersectionObserver` reveal system
- sequential further-work carousel with keyboard and dot navigation
- mouse-reactive 3D tilt and glare on glass cards
- active navigation state tracking while scrolling
- mobile navigation toggle for smaller screens
- every interaction module runs in isolation, so one failure can never disable the rest
- `prefers-reduced-motion` fallbacks for animated effects

### Content strategy

- strong engineering-focused introduction
- two deep flagship case studies instead of shallow one-line summaries
- a deliberate best-first ordering of further work, leading with CPU design
- research writing presented with honest framing (independent manuscripts, clearly marked as not peer-reviewed)
- professional experience, certifications, and active learning areas all in one place

## Project Highlights

| Project | Focus Area | Stack | What Makes It Strong |
| --- | --- | --- | --- |
| Xenolinguist | Offline AI desktop app | Electron, React 19, TypeScript, whisper.cpp, Transformers.js, Vite | Shipped v1.0.0 Windows release; fully offline voice pipeline (whisper.cpp transcription, wav2vec2 IPA, espeak-ng speech); six-phase language decoding workflow |
| Bingery | Full-stack product build | Python, Flask, React, SQLite, Fly.io, Claude API | 13,000-title catalog behind 30+ REST endpoints, JWT auth, AniList GraphQL sync, 590+ automated tests, live as an installable PWA |
| Pulsar-V | CPU design and verification | SystemVerilog, cocotb, riscv-formal, Yosys + nextpnr | Single-cycle and 5-stage pipelined RV32I cores; 39/39 riscv-arch-test compliance vs the SAIL golden model; 43/43 formal checks; 38.8 MHz post-route on ECP5-85F |
| LaunchLedger | Data engineering and analytics | DuckDB, dbt, SQL, Python | Vendor due diligence on the orbital launch market: 44 passing dbt tests, window-function SQL analyses, empirical-Bayes reliability ranking, static SVG dashboard |
| EdgeSpark | ML systems research | ROCm on RX 7900 XTX | Quantized speculative decoding on a single consumer AMD GPU, with a confidence-head calibration study |

The further-work carousel also covers Parley (offline push-to-talk dictation for Windows), the Distributed URL Shortener (Go, Redis, PostgreSQL, Docker), ZenithSpectra (AI science-intelligence platform), and the Bookstore Management System (Java Swing, State pattern).

## Site Sections

### 1. Hero

The landing section introduces the portfolio with a strong personal headline, positioning statement, internship/co-op availability, and fast-access calls to action for projects and contact. It layers a hero image with overlays and animated canvas effects, and links out to GitHub, LinkedIn, and email.

### 2. About

The About section frames the overall engineering profile:

- Computer Engineering student at Toronto Metropolitan University
- interested in computer architecture, applied AI, scalable backend systems, and full-stack development
- focused on building software that is both technically deep and practically useful

It is supported by highlight cards covering full-stack development, AI and machine learning integration, systems thinking, and cross-functional collaboration.

### 3. Featured Projects

The project section is the core of the portfolio, organized in two tiers.

**Flagship case studies** — full-width articles with real product screenshots, tech stacks, and key technical achievements:

- **Xenolinguist** — AI-powered language decoding workbench inspired by *Project Hail Mary*, shipped as a v1.0.0 Windows desktop app (Electron + React 19 + Vite). Runs a fully offline voice pipeline: whisper.cpp transcription, wav2vec2 IPA phoneme recognition, and espeak-ng speech. Six-phase decoding workflow with command palette, keyboard shortcuts, and undo system.
- **Bingery** — AI-powered anime discovery platform with personalized Claude recommendations, live as an installable PWA. Flask + React over a 13,000-title SQLite catalog on Fly.io, with JWT auth, collaborative genre voting, live search autocomplete, AniList GraphQL integration, and 590+ automated tests.

**Further-work carousel** — seven more projects, ordered strongest first, each drawn as a pure-CSS schematic: Pulsar-V, LaunchLedger, EdgeSpark, Parley, Distributed URL Shortener, ZenithSpectra, and the Bookstore Management System.

### 4. Experience

The experience section presents professional work with concise, impact-oriented summaries:

- Machine Learning Engineer at Outlier AI
- operations, leadership, and customer-facing responsibility at the Town of Milton

### 5. Research Papers

A data-driven archive of long-form technical manuscripts exploring CERN physics, antimatter precision systems, and collider searches for invisible matter. Each entry renders from a single data file into cards and detail dialogs with summaries, abstracts, topic tags, and PDF downloads.

These are independent portfolio manuscripts written to practice professional scientific synthesis — the site explicitly marks them as not peer-reviewed journal publications.

### 6. Skills, Certifications, and Learning

This section is intentionally broad so visitors can quickly understand both current strengths and growth direction. It covers languages, hardware and verification tooling, web and backend technologies, AI and data tooling, platforms, certifications, and current learning areas.

### 7. Contact

The final section makes outreach easy through email, LinkedIn, GitHub, and phone.

## Tech Stack

### Core technologies

- HTML5
- CSS3
- JavaScript
- GSAP + ScrollTrigger (motion only — scrolling stays native)

### Design and layout

- custom CSS variables for theming
- CSS Grid and Flexbox
- responsive breakpoints for tablet and mobile layouts
- handcrafted gradients, glass effects, and motion styling
- pure-CSS project schematics (flow and wireframe diagrams) with no image dependencies

### JavaScript techniques used

- `requestAnimationFrame` for smooth interaction loops
- `IntersectionObserver` for efficient reveal-on-scroll animations
- canvas rendering for the interactive background and noise overlay
- data-driven rendering for the research paper archive
- per-module fault isolation, so a failure in one interaction cannot break the others
- DOM event handling for mouse movement, scroll state, carousel controls, and mobile navigation

## Project Structure

```text
.
|-- assets/
|   |-- papers/              # self-authored research manuscript PDFs
|   |-- hero-bg.jpg          # hero background
|   |-- bingery-hero.jpg     # Bingery case study screenshot
|   |-- xenolinguist-hero.jpg# Xenolinguist case study screenshot
|   |-- favicon.svg, favicon-32.png, apple-touch-icon.png
|   |-- og-cover.png, social-preview.png, social-preview.svg
|   `-- readme-banner.svg
|-- css/
|   `-- styles.css           # full visual system
|-- js/
|   |-- main.js              # isolated interaction modules
|   |-- motion.js            # GSAP/ScrollTrigger choreography
|   |-- papers.js            # renders the research paper archive
|   `-- papers-data.js       # single source of truth for paper metadata
|-- index.html
`-- README.md
```

## Implementation Notes

### `index.html`

Defines the complete site structure: navigation, hero, about, featured projects (flagship cases plus the further-work carousel), experience, research papers, skills and certifications, contact, and footer. Includes structured data, Open Graph tags, and per-image dimensions for stable layout.

### `css/styles.css`

Contains the full visual system for the site: theme variables, layout rules, glass card styling, hero styling, flagship case layouts, carousel and schematic diagram styles, paper archive styling, responsive behavior, animation states, and `prefers-reduced-motion` fallbacks.

### `js/main.js`

Handles core site interactivity as independent modules — interactive grid canvas, noise overlay, reveal effects, navbar state, smooth in-page scrolling, mobile menu, 3D card tilt, and the further-work carousel. Each module is wrapped so one failure cannot disable the rest.

### `js/motion.js`

GSAP + ScrollTrigger choreography layered over the reveal system. Animates content only — never hijacks scrolling — and respects reduced-motion preferences.

### `js/papers.js` and `js/papers-data.js`

The research paper archive. `papers-data.js` is the single source of truth; `papers.js` renders cards and detail dialogs from it, so adding a paper means adding one object and one PDF.

## Local Development

This is a static site, so there is no build step and no dependency installation required.

### Clone the repository

```bash
git clone https://github.com/Parusann/Parusann.github.io.git
cd Parusann.github.io
```

### Option 1: Open directly

Open `index.html` in your browser.

### Option 2: Serve locally

Using Python:

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## Deployment

This repository is structured as a GitHub Pages portfolio site. Because the repository is named `Parusann.github.io`, it is served as a user site through GitHub Pages with `index.html` at the project root.

Current live URL:

- [https://parusann.github.io/](https://parusann.github.io/)

## Social Preview Asset

A matching social/share image is included in this repo at [assets/social-preview.png](assets/social-preview.png).

The editable source artwork also lives at [assets/social-preview.svg](assets/social-preview.svg).

If you want GitHub links to this repository to have a custom visual preview, upload the PNG file in the repository's social preview settings.

## Customization Ideas

If this portfolio continues evolving, strong next additions could include:

- project detail pages for deeper case studies
- a downloadable resume button
- lightweight analytics for visitor insights
- a live-demo button for ZenithSpectra once its deployment returns
- additional research manuscripts as the archive grows

## Contact

For opportunities, collaborations, or questions:

- GitHub: [github.com/Parusann](https://github.com/Parusann)
- LinkedIn: [linkedin.com/in/parusan](https://www.linkedin.com/in/parusan/)
- Email: [pnatheeswaran@torontomu.ca](mailto:pnatheeswaran@torontomu.ca)

I am especially interested in software engineering, hardware/CPU design, AI, and systems-focused internship or co-op roles.

## Usage Note

This repository contains personal branding, project descriptions, and portfolio content specific to Parusan Natheeswaran. Inspiration is welcome, but please do not copy the written content, identity, or branding directly.
