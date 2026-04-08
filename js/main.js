/* ============================================
   PARUSAN.DEV — Main JavaScript
   Interactive grid, scroll animations, noise, parallax
   ============================================ */

(function () {
  'use strict';

  // ==========================================
  // INTERACTIVE GRID BACKGROUND
  // Grid that's blurred/dim by default, lights up near cursor
  // ==========================================
  const gridCanvas = document.getElementById('grid-canvas');
  const gridCtx = gridCanvas.getContext('2d');
  let mouseX = -1000;
  let mouseY = -1000;
  let gridAnimFrame;

  function resizeGrid() {
    gridCanvas.width = window.innerWidth;
    gridCanvas.height = window.innerHeight;
  }

  function drawGrid() {
    const w = gridCanvas.width;
    const h = gridCanvas.height;
    const spacing = 60;
    const radius = 250; // How far the cursor effect reaches
    const scrollY = window.scrollY;

    gridCtx.clearRect(0, 0, w, h);

    // Draw vertical lines
    for (let x = 0; x <= w; x += spacing) {
      gridCtx.beginPath();
      gridCtx.moveTo(x, 0);
      gridCtx.lineTo(x, h);

      // Calculate distance from cursor for this line
      const dist = Math.abs(x - mouseX);
      const intensity = Math.max(0, 1 - dist / radius);
      const alpha = 0.03 + intensity * 0.2;

      gridCtx.strokeStyle = `rgba(46, 143, 82, ${alpha})`;
      gridCtx.lineWidth = intensity > 0.1 ? 1 : 0.5;
      gridCtx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= h; y += spacing) {
      gridCtx.beginPath();
      gridCtx.moveTo(0, y);
      gridCtx.lineTo(w, y);

      const dist = Math.abs(y - mouseY);
      const intensity = Math.max(0, 1 - dist / radius);
      const alpha = 0.03 + intensity * 0.2;

      gridCtx.strokeStyle = `rgba(46, 143, 82, ${alpha})`;
      gridCtx.lineWidth = intensity > 0.1 ? 1 : 0.5;
      gridCtx.stroke();
    }

    // Draw intersection glow points
    for (let x = 0; x <= w; x += spacing) {
      for (let y = 0; y <= h; y += spacing) {
        const dx = x - mouseX;
        const dy = y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const intensity = Math.max(0, 1 - dist / radius);

        if (intensity > 0.05) {
          gridCtx.beginPath();
          gridCtx.arc(x, y, 1.5 + intensity * 3, 0, Math.PI * 2);
          gridCtx.fillStyle = `rgba(115, 217, 106, ${intensity * 0.6})`;
          gridCtx.fill();

          // Outer glow
          if (intensity > 0.3) {
            gridCtx.beginPath();
            gridCtx.arc(x, y, 4 + intensity * 8, 0, Math.PI * 2);
            gridCtx.fillStyle = `rgba(46, 143, 82, ${intensity * 0.08})`;
            gridCtx.fill();
          }
        }
      }
    }

    gridAnimFrame = requestAnimationFrame(drawGrid);
  }

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  window.addEventListener('resize', resizeGrid);
  resizeGrid();
  drawGrid();

  // ==========================================
  // NOISE OVERLAY (Film grain effect)
  // ==========================================
  const noiseCanvas = document.getElementById('noise');
  const noiseCtx = noiseCanvas.getContext('2d');
  let noiseData = [];
  let noiseFrame = 0;

  function setupNoise() {
    noiseCanvas.width = window.innerWidth;
    noiseCanvas.height = window.innerHeight;
    noiseData = [];

    for (let i = 0; i < 10; i++) {
      const idata = noiseCtx.createImageData(noiseCanvas.width, noiseCanvas.height);
      const buffer32 = new Uint32Array(idata.data.buffer);
      for (let j = 0; j < buffer32.length; j++) {
        if (Math.random() < 0.08) {
          buffer32[j] = 0xff000000;
        }
      }
      noiseData.push(idata);
    }
  }

  function paintNoise() {
    if (noiseFrame >= 9) noiseFrame = 0;
    else noiseFrame++;
    if (noiseData[noiseFrame]) {
      noiseCtx.putImageData(noiseData[noiseFrame], 0, 0);
    }
  }

  function loopNoise() {
    paintNoise();
    setTimeout(() => requestAnimationFrame(loopNoise), 1000 / 20);
  }

  let noiseResizeThrottle;
  window.addEventListener('resize', () => {
    clearTimeout(noiseResizeThrottle);
    noiseResizeThrottle = setTimeout(setupNoise, 200);
  });

  setupNoise();
  loopNoise();

  // ==========================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // ==========================================
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // If it's a container with anim-text children, reveal them
          const animChildren = entry.target.querySelectorAll('.anim-text');
          if (animChildren.length > 0) {
            animChildren.forEach((child, i) => {
              setTimeout(() => {
                child.classList.add('visible');
              }, i * 100); // Stagger by 100ms each
            });
          }

          // If the element itself has anim classes
          entry.target.classList.add('visible');

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all scroll-triggered elements
    document.querySelectorAll('[data-scroll]').forEach((el) => {
      observer.observe(el);
    });

    // Observe project cards
    document.querySelectorAll('.proj-card').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.15}s`;
      observer.observe(el);
    });

    // Observe experience cards
    document.querySelectorAll('.exp-card').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.15}s`;
      observer.observe(el);
    });
  }

  // ==========================================
  // PARALLAX EFFECT ON HERO
  // ==========================================
  function initParallax() {
    const heroBgImg = document.querySelector('.hero-bg-img');
    const heroContent = document.querySelector('.hero-content');

    if (!heroBgImg) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;

      if (scrollY < heroHeight) {
        // Parallax: image moves slower than scroll
        const parallaxOffset = scrollY * 0.4;
        heroBgImg.style.transform = `translateY(${parallaxOffset}px) scale(1.1)`;

        // Fade out hero content as you scroll
        const opacity = 1 - (scrollY / heroHeight) * 1.5;
        heroContent.style.opacity = Math.max(0, opacity);
        heroContent.style.transform = `translateY(${scrollY * 0.2}px)`;
      }
    }, { passive: true });
  }

  // ==========================================
  // NAVBAR SCROLL EFFECT
  // ==========================================
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[data-nav]');

    window.addEventListener('scroll', () => {
      // Add scrolled class
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Active section highlighting
      let current = '';
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }, { passive: true });
  }

  // ==========================================
  // MOBILE MENU TOGGLE
  // ==========================================
  function initMobileMenu() {
    const toggle = document.querySelector('.mob-tog');
    const navLinks = document.querySelector('.nav-links');

    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // ==========================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ==========================================
  // ADVANCED GLASSMORPHISM — 3D Tilt + Glare
  // Uses requestAnimationFrame for smooth 60fps
  // ==========================================
  function initGlassCards() {
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach((card) => {
      let rafId = null;
      let currentX = 0;
      let currentY = 0;
      let targetRotateX = 0;
      let targetRotateY = 0;
      let currentRotateX = 0;
      let currentRotateY = 0;
      let isHovering = false;

      // Smooth interpolation loop
      function animateTilt() {
        // Lerp towards target (0.15 = smoothing factor, lower = smoother)
        currentRotateX += (targetRotateX - currentRotateX) * 0.12;
        currentRotateY += (targetRotateY - currentRotateY) * 0.12;

        // Apply transform directly — no CSS transition fighting
        card.style.transform = `perspective(800px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) translateY(-2px)`;

        // Keep looping while hovering or still animating back to 0
        if (isHovering || Math.abs(currentRotateX) > 0.01 || Math.abs(currentRotateY) > 0.01) {
          rafId = requestAnimationFrame(animateTilt);
        } else {
          // Snap to exact zero
          currentRotateX = 0;
          currentRotateY = 0;
          card.style.transform = '';
          rafId = null;
        }
      }

      card.addEventListener('mouseenter', () => {
        isHovering = true;
        // Mark card as tilt-ready to override slow scroll transitions
        card.classList.add('tilt-ready');
        if (!rafId) {
          rafId = requestAnimationFrame(animateTilt);
        }
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Set CSS custom properties for the radial gradient glare
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // Calculate target tilt (max 6 degrees)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        targetRotateX = ((y - centerY) / centerY) * -6;
        targetRotateY = ((x - centerX) / centerX) * 6;
      });

      card.addEventListener('mouseleave', () => {
        isHovering = false;
        targetRotateX = 0;
        targetRotateY = 0;
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
        // The animation loop will smoothly return to 0 and then stop
        if (!rafId) {
          rafId = requestAnimationFrame(animateTilt);
        }
      });
    });
  }

  // ==========================================
  // INITIALIZE EVERYTHING
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initParallax();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initGlassCards();
  });

})();
