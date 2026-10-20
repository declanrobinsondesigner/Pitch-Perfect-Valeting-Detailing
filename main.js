(function () {
  "use strict";

  var WA_LINK =
    "https://wa.me/447546819467?text=Hi%20Pitch%20Perfect%2C%20I%27d%20like%20a%20quote.%0AVehicle%3A%20%0APackage%3A%20%0AArea%20or%20postcode%3A%20";

  document.querySelectorAll('a[data-wa="true"]').forEach(function (el) {
    el.setAttribute("href", WA_LINK);
  });

  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.querySelector(".site-nav");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var open = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  if (window.matchMedia("(max-width: 767px)").matches) {
    document.body.classList.add("has-sticky-bar");
  }
  window
    .matchMedia("(max-width: 767px)")
    .addEventListener("change", function (e) {
      document.body.classList.toggle("has-sticky-bar", e.matches);
    });

  document.querySelectorAll(".ba-slider").forEach(function (slider) {
    var range = slider.querySelector('input[type="range"]');
    var after = slider.querySelector(".ba-slider-after");
    if (!range || !after) return;

    function setClip(val) {
      after.style.clipPath = "inset(0 " + (100 - val) + "% 0 0)";
    }

    setClip(range.value);
    range.addEventListener("input", function () {
      setClip(range.value);
    });

    slider.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        range.value = Math.max(0, Number(range.value) - 2);
        setClip(range.value);
        e.preventDefault();
      }
      if (e.key === "ArrowRight") {
        range.value = Math.min(100, Number(range.value) + 2);
        setClip(range.value);
        e.preventDefault();
      }
    });
  });

  var lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  var lbImg = lightbox.querySelector(".lightbox-img");
  var lbCaption = lightbox.querySelector(".lightbox-caption");
  var lbClose = lightbox.querySelector(".lightbox-close");
  var lbPrev = lightbox.querySelector(".lightbox-prev");
  var lbNext = lightbox.querySelector(".lightbox-next");
  var triggers = [];
  var currentIndex = 0;
  var lastFocus = null;

  var activeGroup = null;

  function triggersInGroup(group) {
    if (!group) {
      return Array.prototype.slice.call(
        document.querySelectorAll("[data-lightbox]")
      );
    }
    return Array.prototype.slice.call(
      group.querySelectorAll("[data-lightbox]")
    );
  }

  function openAt(index) {
    if (!triggers.length) return;
    currentIndex = index;
    lastFocus = document.activeElement;
    var btn = triggers[currentIndex];
    var src = btn.getAttribute("data-lightbox");
    var cap = btn.getAttribute("data-caption") || "";
    var alt = btn.getAttribute("data-alt") || "";
    lbImg.src = src;
    lbImg.alt = alt;
    lbCaption.textContent = cap;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    lbClose.focus();
  }

  function closeLb() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
    lbImg.src = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function showPrev() {
    openAt((currentIndex - 1 + triggers.length) % triggers.length);
  }

  function showNext() {
    openAt((currentIndex + 1) % triggers.length);
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-lightbox]");
    if (!btn) return;
    var group = btn.closest("[data-lightbox-group]");
    activeGroup = group;
    triggers = triggersInGroup(group);
    var idx = triggers.indexOf(btn);
    if (idx >= 0) {
      e.preventDefault();
      openAt(idx);
    }
  });

  lbClose.addEventListener("click", closeLb);
  lbPrev.addEventListener("click", showPrev);
  lbNext.addEventListener("click", showNext);

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLb();
  });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
  });

  lightbox.addEventListener("keydown", function (e) {
    if (e.key !== "Tab") return;
    var focusable = lightbox.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable = Array.prototype.filter.call(focusable, function (el) {
      return !el.disabled && el.offsetParent !== null;
    });
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();
