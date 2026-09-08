// Initialize Lucide icons on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize lucide SVGs
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- Typewriter Effect (replays each time hero scrolls into view) ---
  const prefixEl = document.getElementById('typewriter-prefix');
  const nameEl   = document.getElementById('typewriter-name');
  const cursorEl = document.querySelector('.typewriter-cursor');

  const prefixText = "Hi, I'm ";
  const nameText   = "SUBASH";

  let typeTimer = null; // track ongoing timeout so we can cancel it

  function runTypewriter() {
    // Clear any ongoing animation
    if (typeTimer) clearTimeout(typeTimer);

    // Reset text and show cursor
    prefixEl.textContent = '';
    nameEl.textContent   = '';
    if (cursorEl) {
      cursorEl.style.display = 'inline-block';
      cursorEl.style.animation = 'cursor-blink 0.8s infinite';
    }

    let prefixIndex = 0;
    let nameIndex   = 0;

    function typeStep() {
      if (prefixIndex < prefixText.length) {
        prefixEl.textContent += prefixText.charAt(prefixIndex++);
        typeTimer = setTimeout(typeStep, 100);
      } else if (nameIndex < nameText.length) {
        nameEl.textContent += nameText.charAt(nameIndex++);
        typeTimer = setTimeout(typeStep, 130);
      } else {
        // Done — blink cursor then hide
        if (cursorEl) {
          cursorEl.style.animation = 'cursor-blink 1.2s infinite';
          typeTimer = setTimeout(() => {
            cursorEl.style.display = 'none';
          }, 2500);
        }
      }
    }

    typeStep();
  }

  // Fire on load immediately
  if (prefixEl && nameEl) {
    runTypewriter();
  }

  // Re-fire every time hero section enters the viewport
  const heroSection = document.getElementById('hero');
  if (heroSection && prefixEl && nameEl) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runTypewriter();
        }
      });
    }, { threshold: 0.4 }); // trigger when 40% of hero is visible
    heroObserver.observe(heroSection);
  }

  // --- Theme Toggle Logic ---
  const themeToggleBtn = document.getElementById('themeToggle');
  const body = document.body;

  // Retrieve existing theme preference or check system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    body.className = savedTheme;
  } else {
    // Default to dark theme as requested for professional dev vibe
    body.className = 'dark-theme';
    localStorage.setItem('portfolio-theme', 'dark-theme');
  }

  themeToggleBtn.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
      localStorage.setItem('portfolio-theme', 'light-theme');
    } else {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
      localStorage.setItem('portfolio-theme', 'dark-theme');
    }
  });

  // --- Mobile Hamburger Menu Menu Toggle ---
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
  const closeIcon = mobileMenuBtn.querySelector('.close-icon');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    
    // Toggle active icon visible classes
    if (navMenu.classList.contains('active')) {
      menuIcon.style.display = 'none';
      closeIcon.style.display = 'block';
      closeIcon.classList.remove('d-none');
    } else {
      menuIcon.style.display = 'block';
      closeIcon.style.display = 'none';
      closeIcon.classList.add('d-none');
    }
  }

  mobileMenuBtn.addEventListener('click', toggleMobileMenu);

  // Close mobile navigation menu on clicking a nav item
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // --- Scroll Actions: Sticky Nav && Back to Top ---
  const header = document.querySelector('.navbar');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    // Header shadow/blur controller
    if (window.scrollY > 50) {
      header.classList.add('navbar-scrolled'); // Optional hooks for advanced style shifts
    } else {
      header.classList.remove('navbar-scrolled');
    }

    // Scroll back to top visibility flag
    if (window.scrollY > 600) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // --- Scroll Spy Nav Highlight ---
  const sections = document.querySelectorAll('section');
  
  function scrollSpy() {
    const scrollPos = window.scrollY + 120; // offset corresponding to navbar height

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        const currentId = section.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', scrollSpy);
  scrollSpy(); // Trigger call initially to highlights menu on load

  // --- Section Animation Observer on scroll ---
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const animObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Apply selectors for elements that get fade in effects
  const animatedElements = document.querySelectorAll(
    '.section-title, .section-subtitle, .about-text-content, .metric-card, .skills-category-card, .project-card, .education-card, .cert-card, .timeline-item, .contact-info-panel, .contact-form-panel'
  );

  animatedElements.forEach((el, index) => {
    el.classList.add('scroll-reveal');
    animObserver.observe(el);
  });

  // --- Skills Section Progress Bar & Percentage Counter Animation ---
  const skillsSection = document.getElementById('skills');
  let skillsAnimated = false;

  function animateSkills() {
    if (!skillsSection || skillsAnimated) return;

    const rect = skillsSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.85) {
      skillsAnimated = true;

      // Animate progress bar fills
      const skillFills = document.querySelectorAll('.skill-bar-fill');
      skillFills.forEach(fill => {
        const targetWidth = fill.getAttribute('data-width');
        fill.style.width = targetWidth;
      });

      // Animate percentage numbers from 0% to target%
      const percentEls = document.querySelectorAll('.skill-percentage');
      percentEls.forEach(el => {
        const targetVal = parseInt(el.getAttribute('data-target'), 10);
        let count = 0;
        const duration = 1500;
        const interval = Math.max(15, Math.floor(duration / targetVal));

        const timer = setInterval(() => {
          count++;
          el.textContent = `${count}%`;
          if (count >= targetVal) {
            clearInterval(timer);
          }
        }, interval);
      });
    }
  }

  window.addEventListener('scroll', animateSkills);
  animateSkills();

  // --- Academic Accordion Toggle Handler ---
  const eduToggleBtn = document.getElementById('eduToggleBtn');
  const eduExpandContent = document.getElementById('eduExpandContent');

  if (eduToggleBtn && eduExpandContent) {
    eduToggleBtn.addEventListener('click', () => {
      eduToggleBtn.classList.toggle('active');
      eduExpandContent.classList.toggle('expanded');
    });
  }

  // Inject animation CSS rule classes directly through JavaScript for robust encapsulation
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    .scroll-reveal {
      opacity: 0;
      transform: translateY(35px);
      transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .scroll-reveal.animate-in {
      opacity: 1;
      transform: translateY(0);
    }
    .metric-card:nth-child(2), .skills-category-card:nth-child(2), .project-card:nth-child(2), .cert-card:nth-child(2) {
      transition-delay: 0.15s;
    }
    .metric-card:nth-child(3), .skills-category-card:nth-child(3), .project-card:nth-child(3), .cert-card:nth-child(3) {
      transition-delay: 0.3s;
    }
    .metric-card:nth-child(4) {
      transition-delay: 0.45s;
    }
  `;
  document.head.appendChild(styleSheet);

  // --- Contact Form Submission Handler (Simulation) ---
  const contactForm = document.getElementById('contactForm');
  const formSuccessAlert = document.getElementById('formSuccessMessage');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Collect standard fields
    const nameVal = document.getElementById('formName').value;
    const emailVal = document.getElementById('formEmail').value;
    const subjectVal = document.getElementById('formSubject').value;
    const messageVal = document.getElementById('formMessage').value;

    if (!nameVal || !emailVal || !subjectVal || !messageVal) {
      alert("Please fill out all contact fields.");
      return;
    }

    // Simulate Server Request delay
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i data-lucide="loader-2" class="icon-sm spin"></i> Sending...';
    lucide.createIcons();

    setTimeout(() => {
      // Success triggers
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      // Show custom success screen overlay
      formSuccessAlert.classList.remove('d-none');
      
      // Reset inputs
      contactForm.reset();
      
      // Auto close/reset overlay state after 4 seconds
      setTimeout(() => {
        formSuccessAlert.classList.add('d-none');
      }, 4000);

    }, 1500); // 1.5 seconds mock delay
  });
});
