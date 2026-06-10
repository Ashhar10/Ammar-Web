/* ==========================================================================
   CORESIGHT MARKETING — ENHANCED SCRIPT LOGIC
   Anti-Gravity System with Bloom Effects, Smooth Interactions & Premium Feel
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 0. CURSOR-FOLLOWING BLOOM ORB
  // ============================================================
  const cursorBloom = document.getElementById('cursorBloom');
  let cursorX = 0, cursorY = 0;
  let bloomX = 0, bloomY = 0;
  let isMouseOnPage = false;

  // Touch device detection
  const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const getViewportWidth = () => window.innerWidth || document.documentElement.clientWidth;

  document.addEventListener('mousemove', e => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    isMouseOnPage = true;

    if (cursorBloom && !cursorBloom.classList.contains('active')) {
      cursorBloom.classList.add('active');
    }
  });

  document.addEventListener('mouseleave', () => {
    isMouseOnPage = false;
    if (cursorBloom) {
      cursorBloom.classList.remove('active');
    }
  });

  // Smooth follow with lerp (linear interpolation)
  function animateBloom() {
    if (isMouseOnPage && cursorBloom) {
      const lerpFactor = 0.06; // Lower = smoother/laggier, higher = snappier
      bloomX += (cursorX - bloomX) * lerpFactor;
      bloomY += (cursorY - bloomY) * lerpFactor;
      cursorBloom.style.left = `${bloomX}px`;
      cursorBloom.style.top = `${bloomY}px`;
    }
    requestAnimationFrame(animateBloom);
  }
  animateBloom();

  // ============================================================
  // 1. MOBILE MENU TOGGLE OVERLAY
  // ============================================================
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

  function toggleMobileMenu() {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', toggleMobileMenu);
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (hamburger.classList.contains('open')) {
          toggleMobileMenu();
        }
      });
    });
  }

  // ============================================================
  // 2. NAV BAR SCROLL GLOW & SCROLL PROGRESS BAR
  // ============================================================
  const navContainer = document.querySelector('.nav-container');
  const progressIndicator = document.getElementById('scroll-progress');
  let ticking = false;

  function handleScrollEffects() {
    const scrollY = window.scrollY;

    if (navContainer) {
      navContainer.classList.toggle('scrolled', scrollY > 40);
    }

    if (progressIndicator) {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (scrollY / scrollHeight * 100).toFixed(1) : 0;
      progressIndicator.style.width = `${progress}%`;
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleScrollEffects);
      ticking = true;
    }
  }, { passive: true });
  handleScrollEffects(); // Initial call

  // Smooth scroll links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      const navHeight = 72;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

  // ============================================================
  // 3. ELASTIC COUNTERS COUNT-UP ANIMATION
  // ============================================================
  function animateCount(el) {
    const target = parseFloat(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const startTime = performance.now();

    // Ease-out cubic for smooth deceleration
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    const numWrap = el.closest('.metric-num-wrap');

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentVal = target * easedProgress;
      
      el.textContent = prefix + (
        Number.isInteger(target)
          ? Math.floor(currentVal).toLocaleString()
          : currentVal.toFixed(1)
      ) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
        // Trigger soft elastic vertical bounce settlement on completion
        if (numWrap) {
          numWrap.classList.add('bounce-settle');
        }
      }
    }

    requestAnimationFrame(step);
  }

  // ============================================================
  // 4. VIEWPORT REVEAL SCROLL MONITOR
  // ============================================================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Count up stats inside metrics section when observed
        entry.target.querySelectorAll('.ticker-number').forEach(stat => {
          if (!stat.classList.contains('counted')) {
            stat.classList.add('counted');
            animateCount(stat);
          }
        });
        
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ============================================================
  // 5. VALUE PROP CONTENT TOGGLES & PERSPECTIVE PARALLAX
  // ============================================================
  const toggleCards = document.querySelectorAll('.toggle-card');
  const valueSection = document.querySelector('.value-prop-section');
  const depthCards = document.querySelectorAll('.depth-card');

  // Hover/click selectors for active toggle card highlight dims
  toggleCards.forEach((card) => {
    card.addEventListener('click', () => {
      toggleCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  // Highlight toggles as user scrolls through the value-prop section
  let scrollToggleTicking = false;
  window.addEventListener('scroll', () => {
    if (scrollToggleTicking) return;
    scrollToggleTicking = true;
    
    requestAnimationFrame(() => {
      if (!valueSection) { scrollToggleTicking = false; return; }
      const rect = valueSection.getBoundingClientRect();
      const sectionHeight = rect.height;
      
      // Check if section is visible in the viewport middle
      if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
        const scrolledRatio = Math.min(Math.max((window.innerHeight / 2 - rect.top) / sectionHeight, 0), 1);
        const activeIdx = Math.min(Math.floor(scrolledRatio * toggleCards.length), toggleCards.length - 1);
        
        toggleCards.forEach((c, idx) => {
          c.classList.toggle('active', idx === activeIdx);
        });
      }
      scrollToggleTicking = false;
    });
  }, { passive: true });

  // 3D Perspective parallax alignment tracking based on user mouse pointer
  // Only activate on non-touch devices above 900px (where cards are absolutely positioned)
  if (valueSection && depthCards.length > 0 && !isTouchDevice) {
    let parallaxRAF = null;
    let mouseX = 0, mouseY = 0;

    valueSection.addEventListener('mousemove', e => {
      // Skip parallax if viewport is too small (cards are stacked/reflowed)
      if (getViewportWidth() <= 900) return;

      const rect = valueSection.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - rect.width / 2) / 20;
      mouseY = (e.clientY - rect.top - rect.height / 2) / 20;

      if (!parallaxRAF) {
        parallaxRAF = requestAnimationFrame(() => {
          depthCards.forEach(card => {
            const factor = parseFloat(card.style.getPropertyValue('--d')) || 1;
            const tx = mouseX * factor * 3.5;
            const ty = mouseY * factor * 3.5;
            const rx = -mouseY * 0.12;
            const ry = mouseX * 0.12;
            card.style.transform = `translate(${tx}px, ${ty}px) rotateY(${ry}deg) rotateX(${rx}deg) translateZ(${factor * 22}px)`;
          });
          parallaxRAF = null;
        });
      }
    });

    valueSection.addEventListener('mouseleave', () => {
      depthCards.forEach(card => {
        card.style.transform = '';
      });
    });

    // Reset depth card transforms when viewport crosses the 900px threshold
    let wasAbove900 = getViewportWidth() > 900;
    window.addEventListener('resize', () => {
      const isAbove900 = getViewportWidth() > 900;
      if (wasAbove900 && !isAbove900) {
        depthCards.forEach(card => { card.style.transform = ''; });
      }
      wasAbove900 = isAbove900;
    }, { passive: true });
  }

  // ============================================================
  // 6. LIQUID TAB MENU STRIPS & CASE STUDIES SWITCHER
  // ============================================================
  const tabPills = document.querySelectorAll('.tab-pill');
  const liquidBgPill = document.querySelector('.liquid-bg-pill');
  const caseShowcaseCard = document.getElementById('caseShowcaseCard');

  // Case Study data records
  const casesData = {
    "Cybersecurity": {
      tag: "Cybersecurity",
      title: "Defending Data: 4.5M Reach overlay campaign for Bitdefender",
      descr: "By matching security compliance experts with tech influencers, we built an authoritative series outlining structural security, driving thousands of direct sign-ups.",
      metaVal1: "4.5M",
      metaLbl1: "Impressions",
      metaVal2: "+42%",
      metaLbl2: "CTR Gain",
      img: "assets/case_1.png"
    },
    "EdTech": {
      tag: "EdTech",
      title: "Educating Millions: Scaling ALLEN Digital search channels",
      descr: "Leveraging academic influencers and content creator modules to showcase ALLEN Digital's custom test prep systems, resulting in rapid organic enrollment boosts.",
      metaVal1: "8.2M",
      metaLbl1: "Video Views",
      metaVal2: "3.5x",
      metaLbl2: "CPA Reduction",
      img: "assets/case_2.png"
    },
    "HealthTech": {
      tag: "HealthTech",
      title: "Healthy Growth: Organic authority compound for HealthTap",
      descr: "Mapping medical practitioners to custom search topics, compound launching key organic features that established HealthTap as the leading QA health space.",
      metaVal1: "3.2M",
      metaLbl1: "Organic Visits",
      metaVal2: "+95%",
      metaLbl2: "Inquiry Rate",
      img: "assets/case_3.png"
    },
    "Mobile Apps": {
      tag: "Mobile Apps",
      title: "Mobile Domination: Multi-channel scaling for Velo App",
      descr: "Deploying user-acquisition reels and continuous TikTok tickers to scale Velo App's daily active user footprint across metropolitan target markets.",
      metaVal1: "650K",
      metaLbl1: "App Installs",
      metaVal2: "18%",
      metaLbl2: "Conversion Rate",
      img: "assets/case_4.png"
    },
    "SaaS": {
      tag: "SaaS",
      title: "Driving Results: Thousands of New Sign-ups For a Car Buying Platform | CarEdge.com/bids",
      descr: "We engineered high-performing creator bids campaigns alongside SaaS analytics metrics integrations to drive direct conversion pipelines and qualified bids registrations.",
      metaVal1: "12K",
      metaLbl1: "Bids Signups",
      metaVal2: "4.8x",
      metaLbl2: "ROI Factor",
      img: "assets/case_2.png"
    }
  };

  // Adjust absolute fluid liquid-stretch background active state pill bounds
  function updateLiquidPill(tab) {
    if (!liquidBgPill || !tab) return;
    const wrap = tab.closest('.tabs-pill-wrap');
    if (!wrap) return;

    const wrapRect = wrap.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    
    const leftOffset = tabRect.left - wrapRect.left;
    const width = tabRect.width;

    liquidBgPill.style.left = `${leftOffset}px`;
    liquidBgPill.style.width = `${width}px`;
  }

  // Set initial position
  const activeTab = document.querySelector('.tab-pill.active');
  if (activeTab) {
    setTimeout(() => updateLiquidPill(activeTab), 150);
  }

  // Handle resizing recalculation
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const currentActiveTab = document.querySelector('.tab-pill.active');
      if (currentActiveTab) {
        updateLiquidPill(currentActiveTab);
      }
    }, 100);
  }, { passive: true });

  // Handle Tab pill clicks
  tabPills.forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('active')) return;

      tabPills.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      updateLiquidPill(tab);

      const category = tab.dataset.category;
      const data = casesData[category];

      if (data && caseShowcaseCard) {
        // Visual fade out with scale down
        caseShowcaseCard.style.opacity = '0';
        caseShowcaseCard.style.transform = 'translateY(20px) scale(0.98)';

        setTimeout(() => {
          // Update details
          document.getElementById('showcaseTag').textContent = data.tag;
          document.getElementById('showcaseTitle').textContent = data.title;
          document.getElementById('showcaseDescr').textContent = data.descr;
          document.getElementById('showcaseImg').src = data.img;
          
          const metaItems = document.getElementById('showcaseMeta').querySelectorAll('.meta-item');
          metaItems[0].querySelector('.meta-val').textContent = data.metaVal1;
          metaItems[0].querySelector('.meta-lbl').textContent = data.metaLbl1;
          metaItems[1].querySelector('.meta-val').textContent = data.metaVal2;
          metaItems[1].querySelector('.meta-lbl').textContent = data.metaLbl2;

          // Anti-gravity float upward from underneath
          requestAnimationFrame(() => {
            caseShowcaseCard.style.transform = 'translateY(-8px) scale(1.01)';
            caseShowcaseCard.style.transition = 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)';
            caseShowcaseCard.style.opacity = '1';
            
            // Settle to resting position
            setTimeout(() => {
              caseShowcaseCard.style.transform = '';
              caseShowcaseCard.style.transition = '';
            }, 600);
          });
        }, 280);
      }
    });
  });

  // Link dropdown panel shortcut click tab triggers
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const filter = item.dataset.filter;
      const matchingTab = Array.from(tabPills).find(t => t.dataset.category === filter);
      if (matchingTab) {
        matchingTab.click();
        
        // Scroll to cases section
        const target = document.getElementById('cases');
        if (target) {
          const navHeight = 72;
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - navHeight,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // ============================================================
  // 7. 3D ROTATION SKEW EFFECT FOR TESTIMONIAL CARDS
  // ============================================================
  const testimonialCards = document.querySelectorAll('.testimonial-3d-card');

  // Only apply 3D tilt on non-touch devices
  if (!isTouchDevice) {
    testimonialCards.forEach(card => {
      let cardRAF = null;
      let cardMouseX = 0, cardMouseY = 0;

      card.addEventListener('mousemove', e => {
        if (getViewportWidth() <= 768) return;

        const rect = card.getBoundingClientRect();
        cardMouseX = e.clientX - rect.left;
        cardMouseY = e.clientY - rect.top;

        if (!cardRAF) {
          cardRAF = requestAnimationFrame(() => {
            const xc = rect.width / 2;
            const yc = rect.height / 2;

            const rx = -(yc - cardMouseY) / 14;
            const ry = (xc - cardMouseX) / 14;

            card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.02)`;
            cardRAF = null;
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ============================================================
  // 8. MAGNETIC INPUT FIELD EFFECTS (Desktop only)
  // ============================================================
  if (!isTouchDevice) {
    const magneticElements = document.querySelectorAll('.btn-magnetic, .lead-input');

    document.addEventListener('mousemove', e => {
      // Skip magnetic effects on small screens
      if (getViewportWidth() <= 768) return;

      magneticElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 80) {
          const strength = 0.18;
          const tx = dx * strength;
          const ty = dy * strength;
          el.style.transform = `translate(${tx}px, ${ty}px)`;
          
          if (el.classList.contains('btn-magnetic')) {
            el.style.transform += ` skewX(${dx * 0.04}deg)`;
          }
        } else {
          el.style.transform = '';
        }
      });
    });
  }

  // ============================================================
  // 9. FORM VALIDATION & SUCCESS OVERLAY TRANSITION
  // ============================================================
  const leadContactForm = document.getElementById('leadContactForm');
  const leadSuccessOverlay = document.getElementById('leadSuccessOverlay');

  if (leadContactForm) {
    const inputs = leadContactForm.querySelectorAll('.lead-input');

    // Field checker
    function validateField(input) {
      // Avoid validation checking checkbox unless required
      if (input.type === 'checkbox') {
        const wrap = input.closest('.recaptcha-mock-wrap');
        const isValid = input.checked;
        if (wrap) wrap.classList.toggle('invalid', !isValid);
        return isValid;
      }

      const wrap = input.closest('.form-group-magnetic');
      if (!wrap) return true;

      let isValid = true;

      if (input.required && !input.value.trim()) {
        isValid = false;
      }

      if (input.type === 'email' && input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(input.value.trim());
      }

      if (input.type === 'url' && input.value.trim()) {
        // Soft URL regex
        const urlRegex = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i;
        isValid = urlRegex.test(input.value.trim());
      }

      wrap.classList.toggle('invalid', !isValid);
      return isValid;
    }

    // Attach inline checks
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        const wrap = input.closest('.form-group-magnetic') || input.closest('.recaptcha-mock-wrap');
        if (wrap && wrap.classList.contains('invalid')) {
          validateField(input);
        }
      });
    });

    const recaptchaCheckbox = leadContactForm.querySelector('.recaptcha-checkbox');
    if (recaptchaCheckbox) {
      recaptchaCheckbox.addEventListener('change', () => validateField(recaptchaCheckbox));
    }

    leadContactForm.addEventListener('submit', e => {
      e.preventDefault();

      let formIsValid = true;
      inputs.forEach(input => {
        if (!validateField(input)) {
          formIsValid = false;
        }
      });
      
      if (recaptchaCheckbox && !validateField(recaptchaCheckbox)) {
        formIsValid = false;
      }

      if (formIsValid) {
        // Send state transition
        const submitBtn = leadContactForm.querySelector('.lead-submit');
        submitBtn.textContent = 'Sending...';
        submitBtn.style.pointerEvents = 'none';
        submitBtn.style.opacity = '0.7';

        setTimeout(() => {
          leadContactForm.reset();
          submitBtn.textContent = "Let's Talk +";
          submitBtn.style.pointerEvents = '';
          submitBtn.style.opacity = '';

          // Transition Success Overlay show
          if (leadSuccessOverlay) {
            leadSuccessOverlay.classList.add('show');
            leadSuccessOverlay.setAttribute('aria-hidden', 'false');

            // Hide after 6.5s
            setTimeout(() => {
              leadSuccessOverlay.classList.remove('show');
              leadSuccessOverlay.setAttribute('aria-hidden', 'true');
            }, 6500);
          }
        }, 1000);
      }
    });
  }

  // ============================================================
  // 10. SMOOTH PARALLAX SCROLL FOR HERO MESH BLOBS
  // ============================================================
  const meshContainer = document.querySelector('.liquid-mesh-container');
  if (meshContainer) {
    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const parallaxFactor = scrollY * 0.15;
        meshContainer.style.transform = `translateY(${parallaxFactor}px)`;
      });
    }, { passive: true });
  }

});
