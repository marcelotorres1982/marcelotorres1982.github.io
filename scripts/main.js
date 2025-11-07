/* ===============================
   PORTFOLIO MAIN SCRIPTS
   =============================== */

(function() {
  'use strict';

  // ===== THEME: Force Dark Mode =====
  const setDarkTheme = () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  };
  
  setDarkTheme();

  // ===== MOBILE MENU TOGGLE =====
  const initMobileMenu = () => {
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!menuBtn || !mobileMenu) return;
    
    menuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      
      // Update aria-expanded for accessibility
      menuBtn.setAttribute('aria-expanded', !isOpen);
      
      // Update button icon
      menuBtn.textContent = isOpen ? '☰' : '✕';
    });
    
    // Close menu when clicking on a link
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuBtn.textContent = '☰';
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
        menuBtn.textContent = '☰';
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  };

  // ===== HEADER SCROLL EFFECT =====
  const initHeaderScroll = () => {
    const header = document.getElementById('topbar');
    if (!header) return;
    
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    
    // Initial check
    handleScroll();
    
    // Listen to scroll with passive for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
  };

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        // Ignore empty or just # links
        if (!targetId || targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          e.preventDefault();
          
          const headerOffset = 80; // Account for fixed header
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without jumping
          history.pushState(null, null, targetId);
        }
      });
    });
  };

  // ===== INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS =====
  const initFadeInObserver = () => {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, options);
    
    // Observe all elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(element => {
      observer.observe(element);
    });
  };

  // ===== ACTIVE NAV LINK HIGHLIGHT =====
  const initActiveNavLinks = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    if (!sections.length || !navLinks.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('text-primary');
            } else {
              link.classList.remove('text-primary');
            }
          });
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-80px 0px -80px 0px'
    });
    
    sections.forEach(section => observer.observe(section));
  };

  // ===== LAZY LOAD IMAGES =====
  const initLazyLoading = () => {
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
    } else {
      // Fallback for older browsers
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
          }
        });
      });
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  };

  // ===== EXTERNAL LINKS: Add rel and target attributes =====
  const initExternalLinks = () => {
    const domain = window.location.hostname;
    const links = document.querySelectorAll('a[href^="http"]');
    
    links.forEach(link => {
      const linkDomain = new URL(link.href).hostname;
      
      if (linkDomain !== domain) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  };

  // ===== INITIALIZE ALL FEATURES =====
  const init = () => {
    // Core features
    initMobileMenu();
    initHeaderScroll();
    initSmoothScroll();
    initFadeInObserver();
    
    // Enhanced features
    initActiveNavLinks();
    initLazyLoading();
    initExternalLinks();
    
    // Log initialization
    console.log('✨ Portfolio initialized');
  };

  // ===== DOM READY =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();