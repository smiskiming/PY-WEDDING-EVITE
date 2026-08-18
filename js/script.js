document.addEventListener('DOMContentLoaded', function () {
  var openingScreen = document.getElementById('opening-screen');
  var openBtn = document.getElementById('open-invite-btn');
  var mainInvite = document.getElementById('main-invite');
  var audio = document.getElementById('bg-audio');
  var musicToggle = document.getElementById('music-toggle');
  var musicIcon = musicToggle.querySelector('.music-icon');
  var bottomNav = document.getElementById('bottom-nav');

  // ---- Open invitation ----
  openBtn.addEventListener('click', function () {
    openingScreen.classList.add('closing');
    mainInvite.classList.remove('hidden');
    document.body.style.overflow = 'auto';

    // Show bottom navigation
    if (bottomNav) {
      bottomNav.classList.remove('hidden');
    }

    // Try to start background music after the user gesture.
    if (audio) {
      audio.play().catch(function () {
        // Autoplay blocked; user can start it via the toggle button.
        musicIcon.classList.add('paused');
      });
    }

    setTimeout(function () {
      openingScreen.remove();
    }, 1000);
  });

  document.body.style.overflow = 'hidden';

  // ---- Music toggle ----
  musicToggle.addEventListener('click', function () {
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(function () {});
      musicIcon.classList.remove('paused');
    } else {
      audio.pause();
      musicIcon.classList.add('paused');
    }
  });

  // ---- Reveal-on-scroll ----
  var animatedEls = document.querySelectorAll('[data-animate]');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  animatedEls.forEach(function (el) { observer.observe(el); });

  // ---- Gallery lightbox ----
  var galleryImgs = Array.prototype.slice.call(document.querySelectorAll('#gallery-grid img'));
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var closeBtn = document.getElementById('lightbox-close');
  var prevBtn = document.getElementById('lightbox-prev');
  var nextBtn = document.getElementById('lightbox-next');
  var currentIndex = 0;

  function showImage(index) {
    currentIndex = (index + galleryImgs.length) % galleryImgs.length;
    lightboxImg.src = galleryImgs[currentIndex].src;
    lightboxImg.alt = galleryImgs[currentIndex].alt;
  }

  galleryImgs.forEach(function (img, index) {
    img.addEventListener('click', function () {
      showImage(index);
      lightbox.classList.add('open');
    });
  });

  closeBtn.addEventListener('click', function () {
    lightbox.classList.remove('open');
  });

  prevBtn.addEventListener('click', function () { showImage(currentIndex - 1); });
  nextBtn.addEventListener('click', function () { showImage(currentIndex + 1); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) lightbox.classList.remove('open');
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') lightbox.classList.remove('open');
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
  });

  // ---- Add to calendar (.ics download) ----
  var addToCalendarBtn = document.getElementById('add-to-calendar');
  if (addToCalendarBtn) {
    addToCalendarBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        'SUMMARY:Wedding of Yolanda & Pairin',
        'DTSTART:20261031T003000Z',
        'DTEND:20261031T040000Z',
        'LOCATION:St. Faith Church, Kenyalang, Kuching',
        'DESCRIPTION:Wedding ceremony of Yolanda & Pairin',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      var blob = new Blob([icsContent], { type: 'text/calendar' });
      var link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Yolanda-Pairin-Wedding.ics';
      link.click();
      URL.revokeObjectURL(link.href);
    });
  }

  // ---- Countdown Timer ----
  var weddingDate = new Date('October 31, 2026 08:30:00').getTime();
  
  function updateCountdown() {
    var now = new Date().getTime();
    var distance = weddingDate - now;
    
    if (distance < 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }
    
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }
  
  // Update countdown immediately and then every second
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ---- Love Gift Modal ----
  var giftModal = document.getElementById('gift-modal');
  var showGiftBtn = document.getElementById('show-gift-btn');
  var giftModalClose = document.getElementById('gift-modal-close');

  if (showGiftBtn) {
    showGiftBtn.addEventListener('click', function () {
      giftModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (giftModalClose) {
    giftModalClose.addEventListener('click', function () {
      giftModal.classList.remove('open');
      document.body.style.overflow = 'auto';
    });
  }

  // Close modal when clicking outside the image
  giftModal.addEventListener('click', function (e) {
    if (e.target === giftModal) {
      giftModal.classList.remove('open');
      document.body.style.overflow = 'auto';
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && giftModal.classList.contains('open')) {
      giftModal.classList.remove('open');
      document.body.style.overflow = 'auto';
    }
  });

  // ---- Bottom Navigation ----
  var navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = this.getAttribute('href');
      var targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        var offsetTop = targetSection.offsetTop - 80; // Offset for better positioning
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        
        // Update active state
        navItems.forEach(function (navItem) {
          navItem.classList.remove('active');
        });
        this.classList.add('active');
      }
    });
  });

  // Highlight active nav item on scroll
  var sections = document.querySelectorAll('section[id$="-section"]');
  
  window.addEventListener('scroll', function () {
    var scrollPos = window.scrollY + 150;
    
    sections.forEach(function (section) {
      var sectionTop = section.offsetTop;
      var sectionHeight = section.offsetHeight;
      var sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navItems.forEach(function (item) {
          item.classList.remove('active');
          if (item.getAttribute('href') === '#' + sectionId) {
            item.classList.add('active');
          }
        });
      }
    });
  });
});
