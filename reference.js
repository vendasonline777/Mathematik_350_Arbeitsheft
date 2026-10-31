document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. URGENCY COUNTDOWN TIMER
     ========================================== */
  // Persistent 24-hour countdown is handled by offer-timer.js.


  /* ==========================================
     2. PREVIEW CAROUSEL
     ========================================== */
  // Preview carousel is now managed infinitely and seamlessly using CSS animation marquee


  /* ==========================================
     3. FAQ ACCORDION
     ========================================== */
  const initFAQ = () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const trigger = item.querySelector('.faq-trigger');
      const content = item.querySelector('.faq-content');

      if (!trigger || !content) return;

      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other items first
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.faq-content');
          if (otherContent) otherContent.style.maxHeight = null;
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          item.classList.remove('active');
          content.style.maxHeight = null;
        }
      });
    });
  };
  initFAQ();


  /* ==========================================
     4. CHECKOUT CONTROLS & TABS
     ========================================== */
  // Product checkout is configured in config.js and handled by requested-updates.js.

  /* ==========================================
     5. DYNAMIC PROMO END DATE & PURCHASE NOTIFICATIONS
     ========================================== */
  const initUrgencyAndNotifications = () => {
    // B. Purchase Toast Notifications
    const firstNames = ['Anna', 'Julia', 'Laura', 'Lena', 'Marie', 'Sophie', 'Hannah', 'Lea', 'Katharina', 'Lisa', 'Johanna', 'Clara', 'Emma', 'Sabine', 'Stefanie', 'Thomas', 'Michael', 'Andreas', 'Stefan', 'Christian', 'Daniel', 'Markus', 'Lukas', 'Jonas', 'Felix', 'Leon', 'Paul', 'Maximilian', 'Tim', 'Jan'];
    
    const lastInitials = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.', 'G.', 'H.', 'I.', 'J.', 'K.', 'L.', 'M.', 'N.', 'O.', 'P.', 'Q.', 'R.', 'S.', 'T.', 'U.', 'V.', 'W.', 'X.', 'Y.', 'Z.'];
    
    const actions = [
      'hat sich das Paket gesichert!',
      'hat sich gerade das Paket gesichert!',
      'hat sich das komplette Paket gesichert!'
    ];

    const times = ['Beispiel – keine echte Bestellung'];

    const toast = document.getElementById('purchase-notification');
    const nameSpan = document.getElementById('toast-name');
    const actionSpan = document.getElementById('toast-action');
    const timeSpan = document.getElementById('toast-time');
    const closeBtn = document.getElementById('toast-close');
    
    if (toast && nameSpan && actionSpan) {
      let toastTimeout;

      const showNotification = () => {
        // Generate random name, pick action and time
        const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const randomLastInitial = lastInitials[Math.floor(Math.random() * lastInitials.length)];
        const randomName = `${randomFirstName} ${randomLastInitial}`;
        
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        const randomTime = times[Math.floor(Math.random() * times.length)];
        
        nameSpan.textContent = randomName;
        actionSpan.textContent = randomAction;
        if (timeSpan) timeSpan.textContent = randomTime;
        
        toast.classList.add('show');
        
        // Clear any previous auto-close timer
        if (toastTimeout) clearTimeout(toastTimeout);
        
        toastTimeout = setTimeout(() => {
          toast.classList.remove('show');
        }, 5000);
      };
      
      // Show first notification after 4 seconds, then repeat every 30 seconds
      setTimeout(() => {
        showNotification();
        setInterval(showNotification, 30000);
      }, 4000);

      // Close button handler
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          if (toastTimeout) clearTimeout(toastTimeout);
          toast.classList.remove('show');
        });
      }
    }
  };
  initUrgencyAndNotifications();
  
  /* ==========================================
     6. CURRICULUM TABS INTERACTION
     ========================================== */
  const initCurriculumTabs = () => {
    const tabBtns = document.querySelectorAll('.curriculum-tab-btn');
    const panes = document.querySelectorAll('.curriculum-pane');
    const placeholder = document.getElementById('curriculum-placeholder');

    if (tabBtns.length === 0) return;

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetLevel = btn.getAttribute('data-level');
        const targetPane = document.getElementById(`pane-${targetLevel}`);
        const isActive = btn.classList.contains('active');

        // Reset all buttons and panes first
        tabBtns.forEach(b => b.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));

        if (isActive) {
          // If clicked the already active button, collapse it and show placeholder
          if (placeholder) {
            placeholder.classList.remove('hidden');
          }
        } else {
          // If clicked a new button, activate it and hide placeholder
          btn.classList.add('active');
          if (targetPane) {
            targetPane.classList.add('active');
          }
          if (placeholder) {
            placeholder.classList.add('hidden');
          }
          // Smoothly center the active tab button on mobile horizontal track
          btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      });
    });
  };
  initCurriculumTabs();

  /* ==========================================
     7. DRAGGABLE INFINITE MARQUEE
     ========================================== */
  const initDraggableMarquees = () => {
    const makeDraggableMarquee = (carouselSelector, trackSelector, durationSeconds) => {
      const carousel = document.querySelector(carouselSelector);
      if (!carousel) return;
      const track = carousel.querySelector(trackSelector);
      if (!track) return;

      // Disable default CSS animations
      track.style.animation = 'none';

      let currentTranslateX = 0;
      let isDragging = false;
      let startX = 0;
      let prevTranslateX = 0;
      let animationId = null;

      const getGroupWidth = () => {
        const groups = track.querySelectorAll('.carousel-group, .testimonials-group');
        if (groups.length > 0) {
          return groups[0].offsetWidth;
        }
        return track.offsetWidth / 2;
      };

      // Base speed per frame at 60fps
      const getSpeed = () => {
        return getGroupWidth() / (durationSeconds * 60);
      };

      let lastTime = performance.now();

      const update = (now) => {
        const deltaTime = now - lastTime;
        lastTime = now;

        // Scale by delta time to keep speed consistent on 60Hz, 120Hz, etc.
        const timeScale = isNaN(deltaTime) ? 1 : deltaTime / 16.67;
        const speed = getSpeed();

        if (!isDragging) {
          currentTranslateX -= speed * timeScale;

          const limit = getGroupWidth();
          // Wrap around seamlessly
          if (Math.abs(currentTranslateX) >= limit) {
            currentTranslateX += limit;
          }

          track.style.transform = `translate3d(${currentTranslateX}px, 0, 0)`;
        }
        animationId = requestAnimationFrame(update);
      };

      // Start looping
      animationId = requestAnimationFrame(update);

      // Handle drag prevention on images
      track.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
      });

      let hasMoved = false;

      const onDragStart = (e) => {
        isDragging = true;
        hasMoved = false;
        startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        prevTranslateX = currentTranslateX;
        carousel.classList.add('grabbing');
      };

      const onDragMove = (e) => {
        if (!isDragging) return;
        const currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const dx = currentX - startX;

        if (Math.abs(dx) > 6) {
          hasMoved = true;
        }

        currentTranslateX = prevTranslateX + dx;

        const limit = getGroupWidth();
        // Seamless wrap around while dragging
        if (currentTranslateX > 0) {
          currentTranslateX -= limit;
        } else if (Math.abs(currentTranslateX) >= limit) {
          currentTranslateX += limit;
        }

        track.style.transform = `translate3d(${currentTranslateX}px, 0, 0)`;
      };

      const onDragEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        carousel.classList.remove('grabbing');
        if (hasMoved) {
          track.setAttribute('data-dragged', 'true');
          setTimeout(() => {
            track.removeAttribute('data-dragged');
          }, 200);
        } else {
          track.removeAttribute('data-dragged');
        }
      };

      // Event Listeners
      track.addEventListener('mousedown', onDragStart);
      window.addEventListener('mousemove', onDragMove);
      window.addEventListener('mouseup', onDragEnd);

      track.addEventListener('touchstart', onDragStart, { passive: true });
      track.addEventListener('touchmove', onDragMove, { passive: true });
      track.addEventListener('touchend', onDragEnd);
    };

    // Initialize both marquees (previews: 68s, testimonials: 85s)
    makeDraggableMarquee('.preview-carousel', '.carousel-track', 68);
    makeDraggableMarquee('.testimonials-carousel', '.testimonials-track', 85);
  };
  initDraggableMarquees();

  /* ==========================================
     8. PASS UTM PARAMETERS TO CHECKOUT LINKS
     ========================================== */
  const passUtmsToCheckout = () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.toString() === '') return;

    const checkoutLinks = document.querySelectorAll('a[href*="pay.wiapy.com"], a[href*="payfast.greenn.com.br"]');

    checkoutLinks.forEach(link => {
      try {
        const linkUrl = new URL(link.href);
        urlParams.forEach((value, key) => {
          linkUrl.searchParams.set(key, value);
        });
        link.href = linkUrl.toString();
      } catch (err) {
        console.error('Erro ao repassar UTMs para o link:', link.href, err);
      }
    });
  };
  passUtmsToCheckout();

  /* ==========================================
     9. SMOOTH SCROLL FOR ANCHOR LINKS
     ========================================== */
  const initSmoothScroll = () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          
          // Get the height of the sticky promo banner dynamically
          const banner = document.querySelector('.promo-banner');
          const bannerHeight = banner ? banner.offsetHeight : 0;
          
          // Compute final scroll position with dynamic banner height and 16px safety margin
          const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - bannerHeight - 16;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  };
  initSmoothScroll();

  /* ==========================================
     10. ESSENCIAL TO PREMIUM UPGRADE MODAL (LP2)
     ========================================== */
  const initEssencialUpgradeModal = () => {
    const modal = document.getElementById('upgrade-modal');
    if (!modal) return;

    const closeBtn = document.getElementById('upgrade-modal-close');
    const backdrop = modal.querySelector('.upgrade-modal-backdrop');
    const continueBtn = document.getElementById('modal-continue-essencial-btn');
    const upgradeBtn = document.getElementById('modal-upgrade-btn');

    window.openUpgradeModal = (e) => {
      if (e) {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
      }
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      return false;
    };

    window.closeUpgradeModal = (e) => {
      if (e) {
        if (typeof e.preventDefault === 'function') e.preventDefault();
      }
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      return false;
    };

    // Global document capture listener to guarantee modal opens
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('#btn-kit-essencial, [data-open-modal="upgrade-modal"]');
      if (trigger) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        window.openUpgradeModal(e);
      }
    }, true);

    if (closeBtn) closeBtn.addEventListener('click', window.closeUpgradeModal);
    if (backdrop) backdrop.addEventListener('click', window.closeUpgradeModal);

    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        window.closeUpgradeModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        window.closeUpgradeModal();
      }
    });
  };
  initEssencialUpgradeModal();

  /* ==========================================
     11. IMAGE LIGHTBOX MODAL (LP2)
     ========================================== */
  const initImageLightbox = () => {
    const modal = document.getElementById('lightbox-modal');
    if (!modal) return;

    const modalImg = document.getElementById('lightbox-img');
    const modalCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');
    const backdrop = document.getElementById('lightbox-backdrop');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    // Collect distinct images from the first group
    const firstGroupImages = document.querySelectorAll('.preview-carousel .carousel-group:first-child .carousel-slide img');
    if (firstGroupImages.length === 0) return;

    const imagesList = Array.from(firstGroupImages).map(img => ({
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt') || 'Mapa Mental de Espanhol'
    }));

    let currentIndex = 0;

    const updateImage = (index) => {
      if (index < 0) {
        currentIndex = imagesList.length - 1;
      } else if (index >= imagesList.length) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }

      const item = imagesList[currentIndex];
      if (modalImg) {
        modalImg.src = item.src;
        modalImg.alt = item.alt;
      }
      if (modalCaption) {
        modalCaption.textContent = `${item.alt} (${currentIndex + 1}/${imagesList.length})`;
      }
    };

    const openLightbox = (index) => {
      updateImage(index);
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    // Attach click listeners to all slides in the preview carousel
    const allSlides = document.querySelectorAll('.preview-carousel .carousel-slide');
    allSlides.forEach(slide => {
      slide.addEventListener('click', (e) => {
        const track = slide.closest('.carousel-track');
        if (track && track.getAttribute('data-dragged') === 'true') {
          track.removeAttribute('data-dragged');
          return;
        }
        const idx = parseInt(slide.getAttribute('data-preview-idx') || '0', 10);
        openLightbox(idx);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (backdrop) backdrop.addEventListener('click', closeLightbox);

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateImage(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateImage(currentIndex + 1);
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('show')) return;
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        updateImage(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        updateImage(currentIndex + 1);
      }
    });

    // Touch swipe support inside modal
    let touchStartX = 0;
    let touchEndX = 0;
    modal.addEventListener('touchstart', (e) => {
      if (e.changedTouches && e.changedTouches[0]) {
        touchStartX = e.changedTouches[0].screenX;
      }
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches[0]) {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) {
            updateImage(currentIndex - 1);
          } else {
            updateImage(currentIndex + 1);
          }
        }
      }
    }, { passive: true });
  };
  initImageLightbox();

});


