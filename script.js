(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ============ THEME TOGGLE ============ */
  (function initTheme() {
    var toggle = document.getElementById("themeToggle");
    toggle.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme");
      var next = current === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  })();

  /* ============ NAVBAR ============ */
  (function initNav() {
    var navbar = document.getElementById("navbar");
    var navToggle = document.getElementById("navToggle");
    var navMenu = document.getElementById("navMenu");

    var lastState = false;
    window.addEventListener("scroll", function () {
      var compact = window.scrollY > 40;
      if (compact !== lastState) {
        navbar.classList.toggle("is-compact", compact);
        lastState = compact;
      }
    }, { passive: true });

    navToggle.addEventListener("click", function () {
      var open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });

    navMenu.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  })();

  /* ============ SCROLL REVEAL ============ */
  (function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    var projectIndex = 0;
    items.forEach(function (el) {
      if (el.classList.contains("project")) {
        el.style.setProperty("--i", projectIndex++);
      }
    });

    if (prefersReduced || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

    items.forEach(function (el) { observer.observe(el); });

    // Process line fill trigger
    var track = document.querySelector(".process-track");
    if (track) {
      var lineObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            track.classList.add("in-view");
            lineObs.unobserve(track);
          }
        });
      }, { threshold: 0.4 });
      lineObs.observe(track);
    }
  })();

  /* ============ HERO INTERACTION ============ */
  (function initHero() {
    if (prefersReduced || isTouch) return;

    var hero = document.querySelector(".hero");
    var frame = document.getElementById("reelFrame");
    var badges = document.querySelectorAll(".glass-badge");
    if (!hero || !frame) return;

    var ticking = false;
    hero.addEventListener("mousemove", function (e) {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var rect = hero.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;

        frame.style.transform = "rotateY(" + (px * 6) + "deg) rotateX(" + (py * -6) + "deg)";

        badges.forEach(function (badge, i) {
          var depth = i % 2 === 0 ? 10 : -14;
          badge.style.transform = "translate(" + (px * depth) + "px, " + (py * depth) + "px)";
        });

        ticking = false;
      });
    });

    hero.addEventListener("mouseleave", function () {
      frame.style.transform = "rotateY(0deg) rotateX(0deg)";
      badges.forEach(function (badge) { badge.style.transform = ""; });
    });
  })();

  /* ============ SHOWREEL PLAY ============ */
  (function initReel() {
    var video = document.getElementById("reelVideo");
    var playBtn = document.getElementById("reelPlay");
    if (!video || !playBtn) return;

    playBtn.addEventListener("click", function () {
      video.muted = false;
      video.play();
      playBtn.classList.add("is-playing");
    });

    video.addEventListener("pause", function () {
      playBtn.classList.remove("is-playing");
    });
  })();

  /* ============ PORTFOLIO DATA + PREVIEWS ============ */
  var projects = [
    { title: "Real Estate Reel", category: "Property & Lifestyle", desc: "A fast-paced walkthrough edit built to hold attention on listing pages and social feeds, cutting between wide shots and detail inserts on the beat.", src: "assets/videos/real-estate-reel.mp4" },
    { title: "Podcast Short", category: "Talking Points", desc: "A long-form conversation distilled into a single sharp moment, reframed and captioned for vertical viewing.", src: "assets/videos/podcast-short.mp4" },
    { title: "Talking Head", category: "Interview Cut", desc: "Clean multi-take interview editing with tightened pacing, seamless jump cuts and subtle color matching.", src: "assets/videos/talking-head.mp4" },
    { title: "Product Promo", category: "Brand Film", desc: "A short brand piece balancing clean product shots with lifestyle footage and a confident voiceover pace.", src: "assets/videos/product-promo.mp4" },
    { title: "YouTube Short", category: "Hook & Retention", desc: "Built around a strong opening hook and rhythmic pacing designed to keep completion rates high.", src: "assets/videos/youtube-short.mp4" },
    { title: "Cinematic Edit", category: "Narrative Piece", desc: "A slower, more deliberate cut leaning on composition, sound design and color grading to carry the story.", src: "assets/videos/cinematic-edit.mp4" }
  ];

  (function initProjectPreviews() {
    var cards = document.querySelectorAll(".project");

    cards.forEach(function (card) {
      var video = card.querySelector(".project-video");
      if (!video) return;
      var loaded = false;

      function load() {
        if (loaded) return;
        var src = video.getAttribute("data-src");
        if (src) {
          var source = document.createElement("source");
          source.src = src;
          source.type = "video/mp4";
          video.appendChild(source);
          video.load();
        }
        loaded = true;
      }

      if (isTouch) return; // avoid autoplay data usage on touch devices

      card.addEventListener("mouseenter", function () {
        load();
        video.play().catch(function () {});
      });
      card.addEventListener("mouseleave", function () {
        video.pause();
        video.currentTime = 0;
      });
    });
  })();

  /* ============ PROJECT MODAL ============ */
  (function initModal() {
    var modal = document.getElementById("projectModal");
    var backdrop = document.getElementById("modalBackdrop");
    var closeBtn = document.getElementById("modalClose");
    var prevBtn = document.getElementById("modalPrev");
    var nextBtn = document.getElementById("modalNext");
    var modalVideo = document.getElementById("modalVideo");
    var modalTitle = document.getElementById("modalTitle");
    var modalCat = document.getElementById("modalCat");
    var modalDesc = document.getElementById("modalDesc");

    var currentIndex = 0;
    var lastFocused = null;

    function renderProject(index) {
      currentIndex = (index + projects.length) % projects.length;
      var p = projects[currentIndex];
      modalVideo.pause();
      modalVideo.src = p.src;
      modalTitle.textContent = p.title;
      modalCat.textContent = p.category;
      modalDesc.textContent = p.desc;
    }

    function openModal(index) {
      lastFocused = document.activeElement;
      renderProject(index);
      modal.hidden = false;
      requestAnimationFrame(function () { modal.classList.add("is-open"); });
      document.body.classList.add("modal-open");
      closeBtn.focus();
    }

    function closeModal() {
      modal.classList.remove("is-open");
      document.body.classList.remove("modal-open");
      modalVideo.pause();
      setTimeout(function () { modal.hidden = true; }, 400);
      if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll(".project").forEach(function (card) {
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      var idx = Number(card.getAttribute("data-project"));

      card.addEventListener("click", function () { openModal(idx); });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(idx);
        }
      });
    });

    closeBtn.addEventListener("click", closeModal);
    backdrop.addEventListener("click", closeModal);
    prevBtn.addEventListener("click", function () { renderProject(currentIndex - 1); });
    nextBtn.addEventListener("click", function () { renderProject(currentIndex + 1); });

    document.addEventListener("keydown", function (e) {
      if (modal.hidden) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") renderProject(currentIndex + 1);
      if (e.key === "ArrowLeft") renderProject(currentIndex - 1);
    });
  })();

  /* ============ CUSTOM CURSOR ============ */
  (function initCursor() {
    if (isTouch || prefersReduced) return;

    var dot = document.getElementById("cursorDot");
    var ring = document.getElementById("cursorRing");
    if (!dot || !ring) return;

    var ringX = 0, ringY = 0, targetX = 0, targetY = 0;
    var rafId = null;
    var idleTimer = null;

    function loop() {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";
      // Stop once the ring has effectively caught up to the cursor, instead
      // of running an rAF loop forever even when the mouse is idle.
      if (Math.abs(targetX - ringX) > 0.3 || Math.abs(targetY - ringY) > 0.3) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = null;
      }
    }

    document.addEventListener("mousemove", function (e) {
      document.body.classList.add("cursor-ready");
      targetX = e.clientX;
      targetY = e.clientY;
      dot.style.left = targetX + "px";
      dot.style.top = targetY + "px";
      if (rafId === null) rafId = requestAnimationFrame(loop);

      clearTimeout(idleTimer);
      idleTimer = setTimeout(function () {
        document.body.classList.remove("cursor-ready");
      }, 3000);
    });

    var interactive = "a, button, .project, .theme-toggle, input, select, textarea";
    document.querySelectorAll(interactive).forEach(function (el) {
      el.addEventListener("mouseenter", function () { ring.classList.add("is-active"); });
      el.addEventListener("mouseleave", function () { ring.classList.remove("is-active"); });
    });
  })();

  /* ============ CONTACT FORM ============ */
  (function initForm() {
    var form = document.getElementById("contactForm");
    var status = document.getElementById("formStatus");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // No backend wired up yet — replace this block with a fetch() call
      // to Formspree or another form endpoint when ready.
      status.textContent = "Thanks — I'll get back to you shortly.";
      form.reset();
    });
  })();

})();
