const body = document.body;
const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const BOOKING_ROUTE_ALIASES = {
  "devils-staircase": "devils-staircase-overland-trail",
  "devils-staircase-overland-trail": "devils-staircase-overland-trail",
  "gal-oya-backwater-run": "central-highlands-backroad-trail",
  "central-highlands-backroad-trail": "central-highlands-backroad-trail",
  "east-coast-salt-roads": "kalpitiya-salt-roads",
  "kalpitiya-salt-roads": "kalpitiya-salt-roads",
  "custom": "custom-route",
  "custom-route": "custom-route",
  "custom-hidden-loop": "custom-route",
};

function normalizeRouteSlug(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getCanonicalBookingRouteSlug(value = "") {
  const normalized = normalizeRouteSlug(value);
  return BOOKING_ROUTE_ALIASES[normalized] || normalized;
}

function getCurrentPageSlug() {
  const pageName = (window.location.pathname.split("/").pop() || "index.html").replace(/\.html$/i, "");
  return normalizeRouteSlug(pageName);
}

function getContextualBookingRouteSlug() {
  if (body?.classList.contains("about-page")) return "custom-route";
  if (!body?.classList.contains("route-detail-page")) return "";

  return getCanonicalBookingRouteSlug(getCurrentPageSlug());
}

function getBookingHref(routeSlug = getContextualBookingRouteSlug()) {
  const canonicalRoute = getCanonicalBookingRouteSlug(routeSlug);
  return canonicalRoute ? `booking.html?route=${encodeURIComponent(canonicalRoute)}` : "booking.html";
}

function initSmoothScroll() {
  document.documentElement.classList.add("native-scroll");
  window.ceylonLenis = null;
}

function ensureHeaderPreferences() {
  const nav = header?.querySelector(".nav");
  const brand = nav?.querySelector(".brand");
  if (!nav || !brand || nav.querySelector(".header-preferences")) return;

  const preferences = document.createElement("div");
  preferences.className = "header-preferences notranslate";
  preferences.setAttribute("translate", "no");
  preferences.setAttribute("aria-label", "Language and currency");
  preferences.innerHTML = `
    <div class="preference-menu language-menu" data-language-menu>
      <button class="preference-trigger notranslate" type="button" data-language-trigger data-language="en" aria-haspopup="listbox" aria-expanded="false" aria-label="Change language" translate="no">
        <img class="preference-flag" src="assets/icons/flag-gb.svg" alt="" data-language-active-flag />
        <span class="preference-symbol" data-language-active-symbol>EN</span>
        <span class="preference-chevron" aria-hidden="true"></span>
      </button>
      <div class="preference-option-list notranslate" data-language-options role="listbox" aria-label="Language options" translate="no">
        <button type="button" role="option" aria-selected="true" data-language-option data-language="en" data-language-flag-src="assets/icons/flag-gb.svg" data-language-symbol="EN" data-language-label="English"><img class="preference-flag" src="assets/icons/flag-gb.svg" alt="" /><span>EN</span></button>
        <button type="button" role="option" aria-selected="false" data-language-option data-language="fr" data-language-flag-src="assets/icons/flag-fr.svg" data-language-symbol="FR" data-language-label="French"><img class="preference-flag" src="assets/icons/flag-fr.svg" alt="" /><span>FR</span></button>
        <button type="button" role="option" aria-selected="false" data-language-option data-language="ru" data-language-flag-src="assets/icons/flag-ru.svg" data-language-symbol="RU" data-language-label="Russian"><img class="preference-flag" src="assets/icons/flag-ru.svg" alt="" /><span>RU</span></button>
        <button type="button" role="option" aria-selected="false" data-language-option data-language="de" data-language-flag-src="assets/icons/flag-de.svg" data-language-symbol="DE" data-language-label="German"><img class="preference-flag" src="assets/icons/flag-de.svg" alt="" /><span>DE</span></button>
      </div>
    </div>
    <div class="preference-menu currency-menu" data-currency-menu data-compact-currency>
      <button class="preference-trigger notranslate" type="button" data-currency-trigger data-currency="USD" aria-haspopup="listbox" aria-expanded="false" aria-label="Change currency" translate="no">
        <img class="preference-flag" src="assets/icons/flag-us.svg" alt="" data-currency-active-flag />
        <span class="preference-symbol" data-currency-active-label>USD</span>
        <span class="preference-chevron" aria-hidden="true"></span>
      </button>
      <div class="preference-option-list notranslate" data-currency-options role="listbox" aria-label="Currency options" translate="no">
        <button type="button" role="option" aria-selected="false" data-currency-option data-currency="LKR" data-currency-label="LKR Sri Lankan Rupee" data-currency-compact-label="LKR" data-currency-flag-src="assets/icons/flag-lk.svg"><img class="preference-flag" src="assets/icons/flag-lk.svg" alt="" /><span>LKR</span></button>
        <button type="button" role="option" aria-selected="true" data-currency-option data-currency="USD" data-currency-label="USD US Dollar" data-currency-compact-label="USD" data-currency-flag-src="assets/icons/flag-us.svg"><img class="preference-flag" src="assets/icons/flag-us.svg" alt="" /><span>USD</span></button>
        <button type="button" role="option" aria-selected="false" data-currency-option data-currency="AUD" data-currency-label="AUD Australian Dollar" data-currency-compact-label="AUD" data-currency-flag-src="assets/icons/flag-au.svg"><img class="preference-flag" src="assets/icons/flag-au.svg" alt="" /><span>AUD</span></button>
        <button type="button" role="option" aria-selected="false" data-currency-option data-currency="CAD" data-currency-label="CAD Canadian Dollar" data-currency-compact-label="CAD" data-currency-flag-src="assets/icons/flag-ca.svg"><img class="preference-flag" src="assets/icons/flag-ca.svg" alt="" /><span>CAD</span></button>
        <button type="button" role="option" aria-selected="false" data-currency-option data-currency="EUR" data-currency-label="EUR Euro" data-currency-compact-label="EUR" data-currency-flag-src="assets/icons/flag-eu.svg"><img class="preference-flag" src="assets/icons/flag-eu.svg" alt="" /><span>EUR</span></button>
      </div>
    </div>
  `;
  brand.insertAdjacentElement("afterend", preferences);
}

ensureHeaderPreferences();

function protectHeaderChromeFromTranslate() {
  document.querySelectorAll(".site-header .brand, .header-preferences, .preference-trigger, .preference-option-list, .preference-symbol").forEach((element) => {
    element.classList.add("notranslate");
    element.setAttribute("translate", "no");
  });
}

protectHeaderChromeFromTranslate();

function ensureHeaderBookingButton() {
  const nav = header?.querySelector(".nav");
  if (!nav || nav.querySelector(".header-book-route")) return;

  const button = document.createElement("a");
  button.className = "header-book-route";
  button.href = getBookingHref();
  button.textContent = "Book a route";
  nav.insertBefore(button, menuButton || null);
}

ensureHeaderBookingButton();

function syncContextualBookingLinks() {
  const contextualHref = getBookingHref();
  if (contextualHref === "booking.html") return;

  document.querySelectorAll('a[href="booking.html"], a[href^="booking.html?route="]').forEach((link) => {
    link.setAttribute("href", contextualHref);
  });
}

syncContextualBookingLinks();
const navLinks = document.querySelectorAll(".nav-links a");
const hero = document.querySelector(".hero");
const heroStrip = document.querySelector(".hero-strip");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const loaderStartedAt = performance.now();
const shouldSkipLoader = document.documentElement.classList.contains("skip-loader");
const LANGUAGE_RELOAD_SESSION_KEY = "ceylon-language-reload-target";
const isLanguageReload = document.documentElement.classList.contains("language-reload");
const desktopHeaderQuery = window.matchMedia("(min-width: 941px)");
const mobileHeaderQuery = window.matchMedia("(max-width: 940px)");
let headerPreferencesHome = null;
let lastHeaderScrollY = window.scrollY || 0;
let mobileHeaderOffset = 0;
let lastScrollGuardY = window.scrollY || 0;
let heroStripStopSettled = false;
let heroStripSnapFrame = null;
let heroStripInputLocked = false;
let heroStripTouchStartY = null;
let heroStripTouchStartX = null;

const clamp01 = (value) => Math.min(Math.max(value, 0), 1);
const smoothStep = (value) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

const smoothSnapEase = (value) => {
  const t = clamp01(value);
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const lerp = (start, end, amount) => start + (end - start) * amount;

function scheduleHeaderStateUpdate() {
  requestAnimationFrame(() => {
    setHeaderState();
    requestAnimationFrame(setHeaderState);
  });
  window.setTimeout(setHeaderState, 240);
  window.setTimeout(setHeaderState, 900);
  window.setTimeout(setHeaderState, 1700);
}

function syncMobileHeaderMenuStructure() {
  const nav = header?.querySelector(".nav");
  const navLinksPanel = header?.querySelector(".nav-links");
  const preferences = header?.querySelector(".header-preferences");
  const brand = header?.querySelector(".brand");
  if (!nav || !navLinksPanel || !preferences || !brand) return;

  if (!headerPreferencesHome) {
    headerPreferencesHome = document.createComment("header-preferences-home");
    preferences.parentNode.insertBefore(headerPreferencesHome, preferences);
  }

  if (mobileHeaderQuery.matches) {
    if (preferences.parentElement !== navLinksPanel) navLinksPanel.appendChild(preferences);
    return;
  }

  if (headerPreferencesHome.parentNode && preferences.parentElement !== nav) {
    headerPreferencesHome.parentNode.insertBefore(preferences, headerPreferencesHome.nextSibling);
  }
}

function setMobileHeaderOffset(offset) {
  if (!header) return;
  const headerHeight = Math.ceil(header.offsetHeight || header.getBoundingClientRect().height || 64);
  const maxOffset = headerHeight + 2;
  mobileHeaderOffset = Math.min(Math.max(offset, 0), maxOffset);
  document.documentElement.style.setProperty("--mobile-header-y", `${(-mobileHeaderOffset).toFixed(1)}px`);
  header.classList.toggle("header-hidden", mobileHeaderOffset >= maxOffset - 1);
}

function isHomeGalleryPhotoStageActive() {
  if (body?.classList.contains("inner-page")) return false;

  const section = document.querySelector(".visual-manifest");
  const photoFrame = document.querySelector(".manifesto-photos");
  if (!section || !photoFrame) return false;

  const rect = section.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
  if (rect.top > 2 || rect.bottom < viewportHeight * 0.34) return false;

  const photoOpacity = Number.parseFloat(getComputedStyle(photoFrame).opacity) || 0;
  return photoOpacity > 0.08 || document.documentElement.classList.contains("manifesto-snapping");
}

function syncManifestoPhotoStageChrome(isActive = isHomeGalleryPhotoStageActive()) {
  document.documentElement.classList.toggle("manifesto-photo-stage-active", isActive);
  if (themeColorMeta && !body?.classList.contains("inner-page")) {
    themeColorMeta.setAttribute("content", isActive ? "#111511" : "#f7f6f1");
  }
}

function updateMobileHeaderVisibility(y = window.scrollY || 0) {
  if (!header) return;
  y = Math.max(0, y);
  const isMobile = mobileHeaderQuery.matches;
  const photoStageActive = isMobile && isHomeGalleryPhotoStageActive();
  syncManifestoPhotoStageChrome(photoStageActive);

  if (!isMobile) {
    syncManifestoPhotoStageChrome(false);
    setMobileHeaderOffset(0);
    header.classList.remove("header-hidden");
    lastHeaderScrollY = y;
    return;
  }

  if (photoStageActive) {
    const headerHeight = Math.ceil(header.offsetHeight || header.getBoundingClientRect().height || 64);
    setMobileHeaderOffset(headerHeight + 2);
    lastHeaderScrollY = y;
    return;
  }

  const shouldPinHeader = body.classList.contains("menu-open") || body.classList.contains("is-loading") || y <= 0;

  if (shouldPinHeader) {
    setMobileHeaderOffset(0);
    lastHeaderScrollY = y;
    return;
  }

  const delta = y - lastHeaderScrollY;
  if (Math.abs(delta) > 0.5) setMobileHeaderOffset(mobileHeaderOffset + delta);
  lastHeaderScrollY = y;
}

let mobileTopOverscrollStartY = 0;
let mobileHeaderOverscrollTimer = null;
let mobileHeaderOverscrollFrame = null;

function setMobileHeaderOverscroll(offset = 0) {
  document.documentElement.style.setProperty("--mobile-header-overscroll-y", `${offset.toFixed(1)}px`);
  header?.classList.toggle("header-top-locked", Math.abs(offset) > 0.5);
}

function shouldTrackMobileTopOverscroll(event) {
  if (!mobileHeaderQuery.matches || body.classList.contains("menu-open")) return false;
  if ((window.scrollY || 0) > 0) return false;

  const target = event.target;
  if (target?.closest?.(".nav-links, .preference-menu, .price-currency-control.is-open, .booking-select-options, .gallery-lightbox")) {
    return false;
  }

  return true;
}

function lockMobileHeaderDuringTopOverscroll() {
  if (mobileHeaderOverscrollFrame) return;

  mobileHeaderOverscrollFrame = requestAnimationFrame(() => {
    mobileHeaderOverscrollFrame = null;

    if (!mobileHeaderQuery.matches || (window.scrollY || 0) > 0 || body.classList.contains("menu-open")) {
      setMobileHeaderOverscroll(0);
      return;
    }

    setMobileHeaderOffset(0);
    lastHeaderScrollY = 0;

    const headerTop = header ? header.getBoundingClientRect().top : 0;
    setMobileHeaderOverscroll(headerTop > 0 ? -Math.min(headerTop, 96) : 0);
  });
}

document.addEventListener(
  "touchstart",
  (event) => {
    if (!mobileHeaderQuery.matches || event.touches.length !== 1) return;
    if (mobileHeaderOverscrollTimer) window.clearTimeout(mobileHeaderOverscrollTimer);
    setMobileHeaderOverscroll(0);
    mobileTopOverscrollStartY = event.touches[0].clientY;
  },
  { passive: true }
);

document.addEventListener(
  "touchmove",
  (event) => {
    if (!shouldTrackMobileTopOverscroll(event) || event.touches.length !== 1) return;

    const touchY = event.touches[0].clientY;
    const pullDistance = Math.max(touchY - mobileTopOverscrollStartY, 0);
    if (!pullDistance) {
      setMobileHeaderOverscroll(0);
      return;
    }

    lockMobileHeaderDuringTopOverscroll();
  },
  { passive: true }
);

["touchend", "touchcancel"].forEach((eventName) => {
  document.addEventListener(
    eventName,
    () => {
      if (mobileHeaderOverscrollTimer) window.clearTimeout(mobileHeaderOverscrollTimer);
      mobileHeaderOverscrollTimer = window.setTimeout(() => {
        setMobileHeaderOverscroll(0);
      }, 180);
    },
    { passive: true }
  );
});

function handleMobileHeaderModeChange() {
  syncMobileHeaderMenuStructure();
  body.classList.remove("menu-open");
  menuButton?.setAttribute("aria-expanded", "false");
  setMobileHeaderOffset(0);
  header?.classList.remove("header-hidden");
  lastHeaderScrollY = window.scrollY || 0;
  updateMobileHeaderVisibility();
  scheduleHeaderStateUpdate();
}

if (mobileHeaderQuery.addEventListener) {
  mobileHeaderQuery.addEventListener("change", handleMobileHeaderModeChange);
} else if (mobileHeaderQuery.addListener) {
  mobileHeaderQuery.addListener(handleMobileHeaderModeChange);
}

function waitForCriticalImageElement(image, priority = "auto") {
  if (!image) return Promise.resolve();

  image.loading = "eager";
  image.decoding = "async";
  image.fetchPriority = priority;

  if (image.complete && image.naturalWidth > 0) {
    return image.decode ? image.decode().catch(() => undefined) : Promise.resolve();
  }

  return new Promise((resolve) => {
    image.addEventListener("load", resolve, { once: true });
    image.addEventListener("error", resolve, { once: true });
  }).then(() => (image.decode ? image.decode().catch(() => undefined) : undefined));
}

const CRITICAL_LOADER_SESSION_KEY = "ceylon-critical-assets-ready";
const CRITICAL_LOADER_IMAGE_URLS = [
  "assets/optimized/home-hero-rikillagaskada-fast.jpg",
  "assets/optimized/bg-rathkale.jpg",
  "assets/optimized/home-kanthale-slide.jpg",
  "assets/optimized/home-wasgamuwa-slide.jpg",
  "assets/optimized/about-hero-hulu-fast.jpg",
  "assets/optimized/who-img-0434-fast.jpg",
  "assets/optimized/who-img-4731-fast.jpg",
  "assets/optimized/who-pxl-20250511-fast.jpg",
  "assets/optimized/who-img-5449-fast.jpg",
  "assets/optimized/who-pxl-20250725-fast.jpg",
  "assets/optimized/who-dsc03071-fast.jpg",
  "assets/optimized/who-pxl-20250706-fast.jpg",
  "assets/optimized/who-pxl-20250727-fast.jpg",
];

function hasCriticalAssetSessionFlag() {
  try {
    return sessionStorage.getItem(CRITICAL_LOADER_SESSION_KEY) === "true";
  } catch (error) {
    return false;
  }
}

function setCriticalAssetSessionFlag() {
  try {
    sessionStorage.setItem(CRITICAL_LOADER_SESSION_KEY, "true");
  } catch (error) {
    // Storage may be unavailable in private modes; the image gate still completes.
  }
}

function getLanguageReloadTarget() {
  try {
    return sessionStorage.getItem(LANGUAGE_RELOAD_SESSION_KEY) || "";
  } catch (error) {
    return "";
  }
}

function clearLanguageReloadTarget() {
  try {
    sessionStorage.removeItem(LANGUAGE_RELOAD_SESSION_KEY);
  } catch (error) {
    // Storage may be unavailable in private modes; the reload still completes.
  }
}

function waitForLanguageReloadTranslation() {
  const targetLanguage = getLanguageReloadTarget();
  if (!isLanguageReload || !targetLanguage || targetLanguage === "en") {
    clearLanguageReloadTarget();
    return Promise.resolve();
  }

  const startedAt = performance.now();
  const minWait = 1600;
  const maxWait = 5200;

  return new Promise((resolve) => {
    const settle = () => {
      clearLanguageReloadTarget();
      document.documentElement.classList.remove("language-reload");
      resolve();
    };

    const check = () => {
      const elapsed = performance.now() - startedAt;
      const combo = document.querySelector(".goog-te-combo");
      const comboReady = combo?.value === targetLanguage;
      if ((elapsed >= minWait && comboReady) || elapsed >= maxWait) {
        settle();
        return;
      }
      window.setTimeout(check, 160);
    };

    check();
  });
}

function waitForCriticalImageUrl(src) {
  if (!src) return Promise.resolve();

  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.fetchPriority = "high";
    image.addEventListener("load", () => {
      if (image.decode) {
        image.decode().catch(() => undefined).then(resolve);
        return;
      }
      resolve();
    }, { once: true });
    image.addEventListener("error", resolve, { once: true });
    image.src = new URL(src, document.baseURI).href;
    if (image.complete && image.naturalWidth > 0) {
      if (image.decode) {
        image.decode().catch(() => undefined).then(resolve);
        return;
      }
      resolve();
    }
  }).then(() => undefined);
}

function getCriticalLoaderImagePromises() {
  const promises = CRITICAL_LOADER_IMAGE_URLS.map((src) => waitForCriticalImageUrl(src));

  document.querySelectorAll(".manifesto-photos .photo-tile img").forEach((image) => {
    promises.push(waitForCriticalImageElement(image, "high"));
  });
  document.querySelectorAll(".who-photo").forEach((image, index) => {
    promises.push(waitForCriticalImageElement(image, index < 4 ? "high" : "auto"));
  });

  return promises;
}

let loaderFinishStarted = false;

function finishLoader() {
  if (loaderFinishStarted) return;
  loaderFinishStarted = true;

  const minDuration = 1000;
  const elapsed = performance.now() - loaderStartedAt;
  const delay = Math.max(minDuration - elapsed, 0);

  window.setTimeout(() => {
    body.classList.add("loader-done", "site-ready");
    body.classList.remove("is-loading");
    scheduleHeaderStateUpdate();
  }, delay);
}

function finishLoaderAfterCriticalImages() {
  document.documentElement.classList.remove("skip-loader");
  Promise.all(getCriticalLoaderImagePromises()).then(() => {
    setCriticalAssetSessionFlag();
    waitForLanguageReloadTranslation().then(finishLoader);
  });
}

const shouldBypassLoader = !isLanguageReload && (shouldSkipLoader || hasCriticalAssetSessionFlag());

if (shouldBypassLoader) {
  body.classList.add("loader-done", "site-ready");
  body.classList.remove("is-loading");
  scheduleHeaderStateUpdate();
} else {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", finishLoaderAfterCriticalImages, { once: true });
  } else {
    finishLoaderAfterCriticalImages();
  }
  window.setTimeout(() => {
    if (body.classList.contains("is-loading")) finishLoaderAfterCriticalImages();
  }, 1800);
}

function onSiteReady(callback) {
  if (body.classList.contains("site-ready")) {
    callback();
    return;
  }

  const observer = new MutationObserver(() => {
    if (!body.classList.contains("site-ready")) return;
    observer.disconnect();
    callback();
  });
  observer.observe(body, { attributes: true, attributeFilter: ["class"] });
}

let headerNavMorphStart = null;
let headerNavLabelClones = [];

function syncHeaderLabelClones(labels) {
  if (!header) return [];

  while (headerNavLabelClones.length < labels.length) {
    const clone = document.createElement("span");
    clone.className = "nav-floating-label";
    clone.setAttribute("aria-hidden", "true");
    header.appendChild(clone);
    headerNavLabelClones.push(clone);
  }

  headerNavLabelClones.forEach((clone, index) => {
    if (!labels[index]) {
      clone.style.display = "none";
      return;
    }

    clone.textContent = labels[index].textContent;
  });

  return headerNavLabelClones;
}

function hideHeaderLabelClones() {
  headerNavLabelClones.forEach((clone) => {
    clone.style.display = "none";
    clone.style.opacity = "";
  });
}

function updateDesktopHeaderMorph(progress, morphProgress) {
  if (!header) return;

  const links = Array.from(navLinks);
  const nav = header.querySelector(".nav");
  const labels = Array.from(header.querySelectorAll(".nav-group strong"));
  const innerPage = body.classList.contains("inner-page");
  const compactHeader = innerPage || (!desktopHeaderQuery.matches && progress >= 0.72);

  if (compactHeader || !desktopHeaderQuery.matches || !nav || !links.length) {
    links.forEach((link) => {
      link.style.transform = "";
      link.style.transition = "";
      link.style.color = "";
      link.style.textShadow = "";
      link.style.willChange = "";
      link.style.removeProperty("--header-link-transform");
      link.style.removeProperty("--header-link-color");
      link.style.removeProperty("--header-link-shadow");
    });
    labels.forEach((label) => {
      label.style.opacity = "";
      label.style.removeProperty("opacity");
      label.style.transform = "";
      label.style.pointerEvents = "";
      label.style.removeProperty("--header-label-transform");
    });
    hideHeaderLabelClones();
    headerNavMorphStart = null;
    return;
  }

  links.forEach((link) => {
    link.style.transition = "none";
    link.style.transform = "none";
    link.style.setProperty("--header-link-transform", "none");
  });
  labels.forEach((label) => {
    label.style.transform = "none";
    label.style.setProperty("--header-label-transform", "none");
  });
  nav.style.setProperty("--header-nav-measuring", "1");

  const rects = links.map((link) => link.getBoundingClientRect());
  const labelRects = labels.map((label) => label.getBoundingClientRect());
  const navRect = nav.getBoundingClientRect();
  const gap = Math.min(34, Math.max(22, window.innerWidth * 0.024));
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
  const shouldResetMorphStart =
    !headerNavMorphStart ||
    headerNavMorphStart.viewportWidth !== viewportWidth ||
    headerNavMorphStart.linkCount !== links.length ||
    progress < 0.012;

  if (shouldResetMorphStart) {
    headerNavMorphStart = {
      viewportWidth,
      linkCount: links.length,
      links: rects.map((rect) => ({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      })),
      labels: labelRects.map((rect) => ({
        left: rect.left,
        top: rect.top,
      })),
    };
  }

  const startRects = headerNavMorphStart.links;
  const totalWidth = startRects.reduce((total, rect) => total + rect.width, 0) + gap * Math.max(links.length - 1, 0);
  let targetLeft = (window.innerWidth - totalWidth) / 2;
  const linkColorProgress = smoothStep((progress - 0.35) / 0.45);
  const linkR = Math.round(lerp(255, 17, linkColorProgress));
  const linkG = Math.round(lerp(255, 21, linkColorProgress));
  const linkB = Math.round(lerp(255, 17, linkColorProgress));
  const shadowAlpha = 0.36 * (1 - linkColorProgress);
  const labelProgress = smoothStep(progress / 0.32);
  const labelOpacity = 1 - labelProgress;

  links.forEach((link, index) => {
    const rect = rects[index];
    const startRect = startRects[index] || rect;
    const targetTop = navRect.top + navRect.height / 2 - startRect.height / 2;
    const desiredLeft = lerp(startRect.left, targetLeft, morphProgress);
    const desiredTop = lerp(startRect.top, targetTop, morphProgress);
    const dx = desiredLeft - rect.left;
    const dy = desiredTop - rect.top;

    const linkColor = `rgba(${linkR}, ${linkG}, ${linkB}, ${lerp(0.62, 0.68, linkColorProgress).toFixed(2)})`;
    const linkShadow = `0 2px 18px rgba(0, 0, 0, ${shadowAlpha.toFixed(3)})`;
    link.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;
    link.style.color = linkColor;
    link.style.textShadow = linkShadow;
    link.style.setProperty("--header-link-transform", `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`);
    link.style.setProperty("--header-link-color", linkColor);
    link.style.setProperty("--header-link-shadow", linkShadow);
    link.style.willChange = "transform, color";

    targetLeft += startRect.width + gap;
  });

  const labelClones = syncHeaderLabelClones(labels);
  labels.forEach((label, index) => {
    const startRect = headerNavMorphStart.labels[index] || labelRects[index] || label.getBoundingClientRect();
    const dy = -28 * labelProgress;
    const clone = labelClones[index];

    label.style.setProperty("opacity", "0", "important");
    label.style.transform = "none";
    label.style.setProperty("--header-label-transform", "none");
    label.style.pointerEvents = "none";

    if (!clone) return;

    clone.style.display = "block";
    clone.style.left = `${startRect.left.toFixed(2)}px`;
    clone.style.top = `${(startRect.top + dy).toFixed(2)}px`;
    clone.style.opacity = labelOpacity.toFixed(4);
    clone.style.transform = "translate3d(0, 0, 0)";
    clone.style.pointerEvents = labelProgress > 0.5 ? "none" : "";
  });
  nav.style.removeProperty("--header-nav-measuring");
}

let headerBookHeroStart = null;

function updateHeaderBookingMorph(progress) {
  const headerButton = header?.querySelector(".header-book-route");
  if (!headerButton) return;

  if (body.classList.contains("inner-page") || window.innerWidth <= 940) {
    headerBookHeroStart = null;
    headerButton.style.setProperty("--header-book-x", "0px");
    headerButton.style.setProperty("--header-book-y", "0px");
    headerButton.style.setProperty("--header-book-scale-x", "1");
    headerButton.style.setProperty("--header-book-scale-y", "1");
    const fill = body.classList.contains("inner-page") ? 1 : progress;
    headerButton.style.setProperty("--header-book-fill", fill.toFixed(4));
    headerButton.style.setProperty("--header-book-fill-percent", `${(fill * 100).toFixed(1)}%`);
    return;
  }

  headerBookHeroStart = null;
  headerButton.style.setProperty("--header-book-x", "0px");
  headerButton.style.setProperty("--header-book-y", "0px");
  headerButton.style.setProperty("--header-book-scale-x", "1");
  headerButton.style.setProperty("--header-book-scale-y", "1");
  const fill = smoothStep(progress);
  headerButton.style.setProperty("--header-book-fill", fill.toFixed(4));
  headerButton.style.setProperty("--header-book-fill-percent", `${(fill * 100).toFixed(1)}%`);
}

function setHeaderState() {
  const y = window.scrollY || 0;
  const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const innerPage = body.classList.contains("inner-page");
  const heroHeight = hero ? hero.offsetHeight : window.innerHeight;
  const progress = innerPage ? 1 : clamp01(y / Math.max(heroHeight - 80, 1));
  const groupOpacity = innerPage ? 0 : 1 - smoothStep((progress - 0.06) / 0.68);
  const compactOpacity = innerPage ? 1 : smoothStep((progress - 0.58) / 0.42);
  const rowMorph = innerPage ? 1 : smoothStep(progress / 0.58);
  const viewport = window.innerWidth || document.documentElement.clientWidth || 0;
  const compactHeader = innerPage || (viewport <= 940 && progress >= 0.72);
  const headerSizeProgress = innerPage ? 1 : smoothStep(progress / 0.24);
  const topWidth = Math.max(320, Math.min(760, viewport - 548));
  const compactWidth = Math.max(0, viewport - 32);
  const navWidth = topWidth + (compactWidth - topWidth) * headerSizeProgress;
  const navHeight = 118 - 68 * headerSizeProgress;
  const headerPadTop = viewport > 940 ? 8 : 18 - 10 * headerSizeProgress;
  const headerPadBottom = 8 * headerSizeProgress;
  const headerBlur = 11 * progress;
  const groupNavY = -18 * progress;
  const compactNavY = (1 - compactOpacity) * 12;
  const headerPreferenceFinalX = 62;
  const preferenceSlideProgress = innerPage ? 1 : smoothStep(progress / 0.32);
  const preferenceLiftProgress = innerPage ? 1 : smoothStep((progress - 0.08) / 0.55);
  const headerPreferenceX = headerPreferenceFinalX * preferenceSlideProgress;
  const headerPreferenceY = innerPage ? 0 : 52 * (1 - preferenceLiftProgress);
  const brandR = Math.round(255 + (17 - 255) * progress);
  const brandG = Math.round(255 + (21 - 255) * progress);
  const brandB = Math.round(255 + (17 - 255) * progress);

  document.documentElement.style.setProperty("--scroll", y.toFixed(0));
  document.documentElement.style.setProperty("--read-progress", Math.min(y / max, 1).toFixed(4));
  document.documentElement.style.setProperty("--header-progress", progress.toFixed(4));
  document.documentElement.style.setProperty("--group-nav-opacity", groupOpacity.toFixed(4));
  document.documentElement.style.setProperty("--compact-nav-opacity", compactOpacity.toFixed(4));
  document.documentElement.style.setProperty("--nav-width", `${Math.round(navWidth)}px`);
  document.documentElement.style.setProperty("--nav-height", `${Math.round(navHeight)}px`);
  document.documentElement.style.setProperty("--header-pad-top", `${headerPadTop.toFixed(1)}px`);
  document.documentElement.style.setProperty("--header-pad-bottom", `${headerPadBottom.toFixed(1)}px`);
  document.documentElement.style.setProperty("--header-bg-alpha", (0.58 * progress).toFixed(4));
  document.documentElement.style.setProperty("--header-border-alpha", (0.09 * progress).toFixed(4));
  document.documentElement.style.setProperty("--header-blur", `${headerBlur.toFixed(1)}px`);
  document.documentElement.style.setProperty("--group-nav-y", `${groupNavY.toFixed(1)}px`);
  document.documentElement.style.setProperty("--compact-nav-y", `${compactNavY.toFixed(1)}px`);
  document.documentElement.style.setProperty("--header-pref-x", `${headerPreferenceX.toFixed(1)}px`);
  document.documentElement.style.setProperty("--header-pref-y", `${headerPreferenceY.toFixed(1)}px`);
  document.documentElement.style.setProperty("--header-control-bg-alpha", (0.14 + progress * 0.78).toFixed(4));
  document.documentElement.style.setProperty("--header-control-bg-hover-alpha", (0.24 + progress * 0.72).toFixed(4));
  document.documentElement.style.setProperty("--header-control-border-alpha", (0.18 + progress * 0.28).toFixed(4));
  document.documentElement.style.setProperty("--header-control-shadow-alpha", (0.16 * (1 - progress)).toFixed(4));
  document.documentElement.style.setProperty("--pre-row-progress", rowMorph.toFixed(4));
  document.documentElement.style.setProperty("--pre-group-gap", `${(12 - 6 * rowMorph).toFixed(1)}px`);
  document.documentElement.style.setProperty("--header-brand-color", `rgb(${brandR}, ${brandG}, ${brandB})`);
  document.documentElement.style.setProperty("--header-shadow-alpha", (0.36 * (1 - progress)).toFixed(4));
  if (header) {
    header.classList.toggle("scrolled", progress > 0.02 || innerPage);
    header.classList.toggle("compact-ready", compactHeader);
    updateDesktopHeaderMorph(progress, rowMorph);
    updateHeaderBookingMorph(progress);
    updateMobileHeaderVisibility(y);
  }
}

syncMobileHeaderMenuStructure();
setHeaderState();
initSmoothScroll();
window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("resize", setHeaderState, { passive: true });
window.addEventListener("load", scheduleHeaderStateUpdate, { once: true });
if (document.fonts) document.fonts.ready.then(scheduleHeaderStateUpdate);

window.addEventListener(
  "pointermove",
  (event) => {
    const x = (event.clientX / Math.max(window.innerWidth, 1) - 0.5).toFixed(3);
    const y = (event.clientY / Math.max(window.innerHeight, 1) - 0.5).toFixed(3);
    document.documentElement.style.setProperty("--pointer-x", x);
    document.documentElement.style.setProperty("--pointer-y", y);
  },
  { passive: true }
);

if (menuButton) {
  menuButton.addEventListener("click", () => {
    syncMobileHeaderMenuStructure();
    const open = body.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(open));
    if (open) {
      setMobileHeaderOffset(0);
      header?.classList.remove("header-hidden");
    }
  });
}

navLinks.forEach((link) => {
  const current = window.location.pathname.split("/").pop() || "index.html";
  const href = link.getAttribute("href");
  if (href === current) link.classList.add("active");
  link.addEventListener("click", () => {
    body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll("a[href]").forEach((link) => {
  link.addEventListener("click", () => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || link.target) return;

    try {
      const url = new URL(href, window.location.href);
      if (url.origin === window.location.origin) {
        sessionStorage.setItem("ceylon-skip-loader-next", "true");
      }
    } catch (error) {}
  });
});

const routesRevealSection = document.querySelector("#routes");
const shouldUseRoutesReveal = (el) => Boolean(routesRevealSection && routesRevealSection.contains(el));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

onSiteReady(() => {
  document.querySelectorAll(".reveal").forEach((el, index) => {
    if (!el.style.getPropertyValue("--delay")) {
      el.style.setProperty("--delay", `${Math.min(index % 4, 3) * 80}ms`);
    }
    if (shouldUseRoutesReveal(el)) return;
    revealObserver.observe(el);
  });

  if (routesRevealSection) {
    const routesRevealItems = Array.from(routesRevealSection.querySelectorAll(".reveal"));
    routesRevealItems.forEach((el, index) => {
      el.classList.remove("visible");
      el.style.setProperty("--delay", `${Math.min(index, 6) * 90}ms`);
    });

    const routesRevealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          routesRevealItems.forEach((el) => el.classList.add("visible"));
          routesRevealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -18% 0px" }
    );

    routesRevealObserver.observe(routesRevealSection);
  }
});

const storyScrollReveal = document.querySelector(".story-scroll-reveal");
if (storyScrollReveal) {
  const storyPanels = Array.from(storyScrollReveal.querySelectorAll("h2, .about-story-body"));
  let storyRevealFrame = null;
  const storyMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  storyPanels.forEach((panel) => {
    panel.classList.add("story-panel-reveal", "is-story-panel-hidden-down");
  });

  const setStoryRevealState = () => {
    storyRevealFrame = null;

    if (storyMotionQuery.matches) {
      storyPanels.forEach((panel) => {
        panel.classList.add("is-story-panel-visible");
        panel.classList.remove("is-story-panel-hidden-up", "is-story-panel-hidden-down");
      });
      return;
    }

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;

    storyPanels.forEach((panel) => {
      const rect = panel.getBoundingClientRect();
      const isVisibleRange = rect.top < viewportHeight * 0.82 && rect.bottom > viewportHeight * 0.14;
      panel.classList.toggle("is-story-panel-visible", isVisibleRange);

      if (isVisibleRange) {
        panel.classList.remove("is-story-panel-hidden-up", "is-story-panel-hidden-down");
      } else if (rect.bottom <= viewportHeight * 0.14) {
        panel.classList.add("is-story-panel-hidden-up");
        panel.classList.remove("is-story-panel-hidden-down");
      } else {
        panel.classList.add("is-story-panel-hidden-down");
        panel.classList.remove("is-story-panel-hidden-up");
      }
    });
  };

  const requestStoryRevealState = () => {
    if (storyRevealFrame) return;
    storyRevealFrame = requestAnimationFrame(setStoryRevealState);
  };

  requestStoryRevealState();
  window.addEventListener("scroll", requestStoryRevealState, { passive: true });
  window.addEventListener("resize", requestStoryRevealState, { passive: true });
  if (storyMotionQuery.addEventListener) storyMotionQuery.addEventListener("change", requestStoryRevealState);
}

document.querySelectorAll(".who-we-are-section").forEach((section) => {
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let spreadFrame = null;

  if (motionQuery.matches) {
    section.classList.add("is-spread");
    section.style.setProperty("--who-progress", "1");
    return;
  }

  const setSpreadState = () => {
    spreadFrame = null;
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
    const spreadStart = viewportHeight * 0.75;
    const spreadEnd = viewportHeight * 0.12;
    const rawProgress = (spreadStart - rect.top) / Math.max(spreadStart - spreadEnd, 1);
    const progress = smoothStep(rawProgress);

    section.style.setProperty("--who-progress", progress.toFixed(4));
    section.classList.toggle("is-spread", progress >= 0.995);
  };

  const requestSpreadState = () => {
    if (spreadFrame) return;
    spreadFrame = requestAnimationFrame(setSpreadState);
  };

  requestSpreadState();
  window.addEventListener("scroll", requestSpreadState, { passive: true });
  window.addEventListener("resize", requestSpreadState, { passive: true });
});

const routePlanSection = document.querySelector(".route-plan-section");
if (routePlanSection) {
  const routePlanText = routePlanSection.querySelector(".route-plan-text-reveal");
  const routePlanWords = Array.from(routePlanSection.querySelectorAll(".route-plan-word"));
  const routePlanActions = routePlanSection.querySelector(".route-plan-actions");
  const routePlanMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const setRoutePlanWordState = (word, amount) => {
    const progress = smoothStep(amount);
    word.style.opacity = progress.toFixed(4);
    word.style.transform = `translate3d(0, ${(0.62 * (1 - progress)).toFixed(3)}em, 0)`;
    word.style.filter = `blur(${(5 * (1 - progress)).toFixed(2)}px)`;
  };

  const updateRoutePlanScroll = () => {
    if (!routePlanWords.length && !routePlanActions) return;

    if (routePlanMotionQuery.matches) {
      routePlanWords.forEach((word) => setRoutePlanWordState(word, 1));
      if (routePlanActions) {
        routePlanActions.style.opacity = "1";
        routePlanActions.style.transform = "translate3d(0, 0, 0)";
        routePlanActions.style.filter = "none";
        routePlanActions.classList.add("is-scroll-ready");
      }
      return;
    }

    const rect = routePlanSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
    const scrollableDistance = Math.max(routePlanSection.offsetHeight - viewportHeight, 1);
    const progress = clamp01(-rect.top / scrollableDistance);

    routePlanWords.forEach((word, index) => {
      const wordStart = index * 0.045;
      setRoutePlanWordState(word, (progress - wordStart) / 0.28);
    });

    if (routePlanActions) {
      const actionProgress = smoothStep((progress - 0.76) / 0.2);
      routePlanActions.style.opacity = actionProgress.toFixed(4);
      routePlanActions.style.transform = `translate3d(0, ${(28 * (1 - actionProgress)).toFixed(2)}px, 0)`;
      routePlanActions.style.filter = `blur(${(8 * (1 - actionProgress)).toFixed(2)}px)`;
      routePlanActions.classList.toggle("is-scroll-ready", actionProgress > 0.92);
    }

    if (routePlanText) routePlanText.classList.toggle("visible", progress > 0.02);
  };

  updateRoutePlanScroll();
  window.addEventListener("scroll", updateRoutePlanScroll, { passive: true });
  window.addEventListener("resize", updateRoutePlanScroll, { passive: true });
  window.addEventListener("load", updateRoutePlanScroll, { once: true });
  if (routePlanMotionQuery.addEventListener) {
    routePlanMotionQuery.addEventListener("change", updateRoutePlanScroll);
  }
}

document.querySelectorAll("[data-map-frame]").forEach((frame) => {
  const iframe = frame.querySelector("iframe[data-map-src]");
  let mapInteractionTimer = null;

  const loadMap = () => {
    if (!iframe || iframe.src) return;
    iframe.src = iframe.dataset.mapSrc;
    frame.classList.add("is-map-loading");
  };

  const activateMap = () => {
    loadMap();
    frame.classList.add("is-map-active");
    if (mapInteractionTimer) window.clearTimeout(mapInteractionTimer);
    mapInteractionTimer = window.setTimeout(() => {
      frame.classList.remove("is-map-active");
      mapInteractionTimer = null;
    }, 5000);
  };

  frame.addEventListener("pointerdown", activateMap);
  if (iframe) iframe.addEventListener("load", () => frame.classList.add("is-map-loaded"), { once: true });

  const warmMap = () => loadMap();
  document.addEventListener("pointerdown", warmMap, { once: true, passive: true });
  document.addEventListener("keydown", warmMap, { once: true });
  window.addEventListener(
    "load",
    () => {
      const idleWarmMap = () => loadMap();
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(idleWarmMap, { timeout: 2400 });
      } else {
        window.setTimeout(idleWarmMap, 1200);
      }
    },
    { once: true }
  );

  if ("IntersectionObserver" in window) {
    const mapWarmObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        loadMap();
        mapWarmObserver.disconnect();
      },
      { rootMargin: "900px 0px" }
    );
    mapWarmObserver.observe(frame);
  }

  frame.addEventListener("mouseleave", () => {
    frame.classList.remove("is-map-active");
    if (mapInteractionTimer) window.clearTimeout(mapInteractionTimer);
    mapInteractionTimer = null;
  });
});

document.querySelectorAll("[data-route-plan]").forEach((control) => {
  const trigger = control.querySelector(".route-plan-trigger");
  const options = control.querySelector(".route-plan-options");
  if (!trigger || !options) return;

  const setOpen = (open) => {
    control.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", String(open));
    options.setAttribute("aria-hidden", String(!open));
  };

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(!control.classList.contains("is-open"));
  });

  control.addEventListener("click", (event) => event.stopPropagation());

  document.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
});

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const tour3dCards = Array.from(document.querySelectorAll(".tour-card-3d"));
if (tour3dCards.length && !reducedMotionQuery.matches) {
  tour3dCards.forEach((card) => {
    let cardRect = null;
    let rafId = 0;
    let pointerX = 0.5;
    let pointerY = 0.5;

    const applyTilt = () => {
      rafId = 0;
      const tiltY = (pointerX - 0.5) * 14;
      const tiltX = (0.5 - pointerY) * 14;

      card.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
      card.style.setProperty("--glare-x", `${(pointerX * 100).toFixed(1)}%`);
      card.style.setProperty("--glare-y", `${(pointerY * 100).toFixed(1)}%`);
    };

    card.addEventListener("pointerenter", () => {
      cardRect = card.getBoundingClientRect();
      card.classList.add("is-tilting");
    });

    card.addEventListener("pointermove", (event) => {
      if (!cardRect) cardRect = card.getBoundingClientRect();
      pointerX = clamp01((event.clientX - cardRect.left) / Math.max(cardRect.width, 1));
      pointerY = clamp01((event.clientY - cardRect.top) / Math.max(cardRect.height, 1));
      if (!rafId) rafId = window.requestAnimationFrame(applyTilt);
    });

    card.addEventListener("pointerleave", () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = 0;
      cardRect = null;
      card.classList.remove("is-tilting");
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
      card.style.setProperty("--glare-x", "50%");
      card.style.setProperty("--glare-y", "50%");
    });
  });
}

const inclusionRevealCards = Array.from(document.querySelectorAll(".route-inclusion-card.inclusion-reveal"));
if (inclusionRevealCards.length) {
  inclusionRevealCards.forEach((card, index) => {
    card.style.setProperty("--inclusion-delay", `${Math.min(index, 1) * 80}ms`);
  });

  if (reducedMotionQuery.matches) {
    inclusionRevealCards.forEach((card) => card.classList.add("is-visible"));
  } else {
    const inclusionRevealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    inclusionRevealCards.forEach((card) => inclusionRevealObserver.observe(card));
  }
}

const routeGalleryCards = Array.from(document.querySelectorAll(".route-collage-card"));
if (routeGalleryCards.length) {
  const galleryItems = routeGalleryCards
    .map((card, index) => {
      const image = card.querySelector("img");
      if (!image) return null;

      image.decoding = "async";
      if (index < 8) {
        image.loading = "eager";
        image.fetchPriority = index < 4 ? "high" : "auto";
      }

      const label = card.querySelector("figcaption")?.textContent?.trim() || image.alt || `Gallery image ${index + 1}`;
      card.style.setProperty("--gallery-delay", `${Math.min(index % 3, 2) * 80}ms`);
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `Open image: ${label}`);

      return { card, image, label };
    })
    .filter(Boolean);

  const galleryTrack = document.querySelector(".route-collage-track");
  const isStaticRouteGallery = Boolean(galleryTrack?.closest(".route-collage-static"));
  let galleryLayoutFrame = null;
  let galleryCurrentRowSize = null;

  function warmRouteGalleryImages(limit = 8) {
    galleryItems.slice(0, limit).forEach(({ image }, index) => {
      image.loading = "eager";
      image.fetchPriority = index < 4 ? "high" : "auto";
      image.decode?.().catch(() => undefined);
    });
    requestRouteGalleryLayout();
  }

  function getGalleryGap() {
    if (!galleryTrack) return 4;
    return Number.parseFloat(getComputedStyle(galleryTrack).gap) || 4;
  }

  function layoutRouteGalleryRows() {
    galleryLayoutFrame = null;
    if (!galleryTrack || !galleryItems.length) return;

    const trackWidth = galleryTrack.clientWidth;
    if (!trackWidth) return;

    const gap = getGalleryGap();
    const rowSize = window.innerWidth < 980 ? 2 : 3;
    if (galleryCurrentRowSize !== rowSize || !galleryTrack.querySelector(".route-collage-row")) {
      galleryTrack.querySelectorAll(".route-collage-row").forEach((row) => {
        while (row.firstChild) galleryTrack.insertBefore(row.firstChild, row);
        row.remove();
      });

      galleryCurrentRowSize = rowSize;
      const nextRows = [];
      for (let index = 0; index < galleryItems.length; index += rowSize) {
        nextRows.push(galleryItems.slice(index, index + rowSize));
      }

      if (nextRows.length > 1 && nextRows[nextRows.length - 1].length === 1) {
        const lastSingle = nextRows.pop()[0];
        if (rowSize === 3 && nextRows.length > 2) {
          const mixRowIndex = Math.max(1, Math.floor(nextRows.length / 2));
          nextRows[mixRowIndex].push(lastSingle);
        } else {
          nextRows[nextRows.length - 1].push(lastSingle);
        }
      }

      nextRows.forEach((row) => {
        const rowElement = document.createElement("div");
        rowElement.className = "route-collage-row";
        row.forEach(({ card }) => rowElement.append(card));
        galleryTrack.append(rowElement);
      });
    }

    const rows = [];

    galleryTrack.querySelectorAll(".route-collage-row").forEach((row) => {
      rows.push(galleryItems.filter(({ card }) => row.contains(card)));
    });

    rows.forEach((row) => {
      const rowGap = gap * Math.max(row.length - 1, 0);
      const ratioTotal = row.reduce((total, item) => {
        const ratio = item.image.naturalWidth && item.image.naturalHeight
          ? item.image.naturalWidth / item.image.naturalHeight
          : 4 / 3;
        item.card.style.setProperty("--gallery-item-ratio", ratio.toFixed(5));
        return total + ratio;
      }, 0);
      const rowHeight = row.length === 1
        ? (trackWidth - rowGap) / Math.max(row[0].image.naturalWidth / row[0].image.naturalHeight || 4 / 3, 0.1)
        : (trackWidth - rowGap) / Math.max(ratioTotal, 0.1);

      row.forEach((item) => {
        const ratio = Number.parseFloat(item.card.style.getPropertyValue("--gallery-item-ratio")) || 4 / 3;
        item.card.style.setProperty("--gallery-item-width", `${(rowHeight * ratio).toFixed(2)}px`);
        item.card.style.setProperty("--gallery-item-height", `${rowHeight.toFixed(2)}px`);
      });
    });

    galleryTrack.classList.add("is-justified");
  }

  function requestRouteGalleryLayout() {
    if (galleryLayoutFrame) return;
    galleryLayoutFrame = requestAnimationFrame(layoutRouteGalleryRows);
  }

  if (isStaticRouteGallery) {
    galleryTrack?.classList.add("is-static");
  } else {
    galleryItems.forEach(({ image }) => {
      if (image.complete) return;
      image.addEventListener("load", requestRouteGalleryLayout, { once: true });
    });
    requestRouteGalleryLayout();
    window.addEventListener("resize", requestRouteGalleryLayout, { passive: true });
    window.addEventListener("load", requestRouteGalleryLayout, { once: true });
  }

  warmRouteGalleryImages(Math.min(galleryItems.length, 8));

  if ("IntersectionObserver" in window && galleryTrack) {
    const galleryWarmObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          warmRouteGalleryImages(Math.min(galleryItems.length, 16));
          galleryWarmObserver.disconnect();
        });
      },
      { rootMargin: "1200px 0px 1200px 0px", threshold: 0.01 }
    );
    galleryWarmObserver.observe(galleryTrack);
  }

  if (reducedMotionQuery.matches) {
    routeGalleryCards.forEach((card) => card.classList.add("is-visible"));
  } else {
    const galleryRevealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          galleryRevealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    routeGalleryCards.forEach((card) => galleryRevealObserver.observe(card));
  }

  if (galleryItems.length) {
    const lightbox = document.createElement("div");
    lightbox.className = "gallery-lightbox";
    lightbox.hidden = true;
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Route gallery image viewer");
    lightbox.innerHTML = `
      <button class="gallery-lightbox-button gallery-lightbox-close" type="button" aria-label="Close image viewer">×</button>
      <figure class="gallery-lightbox-figure">
        <img class="gallery-lightbox-image" alt="" />
      </figure>
      <button class="gallery-lightbox-button gallery-lightbox-nav gallery-lightbox-prev" type="button" aria-label="Previous image">‹</button>
      <button class="gallery-lightbox-button gallery-lightbox-nav gallery-lightbox-next" type="button" aria-label="Next image">›</button>
    `;
    body.append(lightbox);

    const lightboxImage = lightbox.querySelector(".gallery-lightbox-image");
    const closeButton = lightbox.querySelector(".gallery-lightbox-close");
    const previousButton = lightbox.querySelector(".gallery-lightbox-prev");
    const nextButton = lightbox.querySelector(".gallery-lightbox-next");
    let activeGalleryIndex = 0;
    let lastGalleryFocus = null;
    let closeLightboxTimer = null;

    const getGalleryIndex = (index) => (index + galleryItems.length) % galleryItems.length;

    function updateLightboxImage(index, animate = true) {
      activeGalleryIndex = getGalleryIndex(index);
      const item = galleryItems[activeGalleryIndex];
      const nextSource = item.image.currentSrc || item.image.src;
      const nextAlt = item.image.alt || item.label;

      const applyImage = () => {
        lightboxImage.src = nextSource;
        lightboxImage.alt = nextAlt;
        const settleImage = () => {
          requestAnimationFrame(() => lightboxImage.classList.remove("is-switching"));
        };

        if (lightboxImage.complete) settleImage();
        else lightboxImage.addEventListener("load", settleImage, { once: true });
      };

      if (!animate || reducedMotionQuery.matches) {
        lightboxImage.classList.remove("is-switching");
        applyImage();
        return;
      }

      lightboxImage.classList.add("is-switching");
      window.setTimeout(applyImage, 150);
    }

    function openLightbox(index) {
      lastGalleryFocus = document.activeElement;
      updateLightboxImage(index, false);
      lightbox.hidden = false;
      if (closeLightboxTimer) window.clearTimeout(closeLightboxTimer);
      requestAnimationFrame(() => {
        lightbox.classList.add("is-active");
        body.classList.add("gallery-lightbox-open");
        closeButton.focus({ preventScroll: true });
      });
    }

    function closeLightbox() {
      lightbox.classList.remove("is-active");
      body.classList.remove("gallery-lightbox-open");
      closeLightboxTimer = window.setTimeout(() => {
        lightbox.hidden = true;
        lightboxImage.removeAttribute("src");
        lastGalleryFocus?.focus?.({ preventScroll: true });
      }, reducedMotionQuery.matches ? 0 : 420);
    }

    routeGalleryCards.forEach((card, index) => {
      card.addEventListener("click", () => openLightbox(index));
      card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        openLightbox(index);
      });
    });

    closeButton.addEventListener("click", closeLightbox);
    previousButton.addEventListener("click", () => updateLightboxImage(activeGalleryIndex - 1));
    nextButton.addEventListener("click", () => updateLightboxImage(activeGalleryIndex + 1));
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (event) => {
      if (lightbox.hidden) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") updateLightboxImage(activeGalleryIndex - 1);
      if (event.key === "ArrowRight") updateLightboxImage(activeGalleryIndex + 1);
    });
  }
}

const baseRoutePrice = 60000;
const currencyRates = {
  LKR: { rate: 1, locale: "en-LK" },
  USD: { rate: 1 / 300, locale: "en-US" },
  AUD: { rate: 1 / 200, locale: "en-AU" },
  CAD: { rate: 1 / 220, locale: "en-CA" },
  EUR: { rate: 1 / 325, locale: "en-IE" }
};
const currencySymbols = {
  LKR: { prefix: "Rs ", locale: "en-LK" },
  USD: { prefix: "$", locale: "en-US" },
  AUD: { prefix: "A$", locale: "en-AU" },
  CAD: { prefix: "C$", locale: "en-CA" },
  EUR: { prefix: "\u20ac", locale: "en-IE" }
};
const currencyMenus = Array.from(document.querySelectorAll("[data-currency-menu]"));
const priceConverters = Array.from(document.querySelectorAll("[data-price-converter]"));
const currencyUserPreferenceKey = "ceylon-currency-user-set";
const currencyPreferenceVersionKey = "ceylon-currency-preference-version";
const currencyPreferenceVersion = "usd-default-20260529";
const compactCurrencyLabelQuery = window.matchMedia("(max-width: 760px)");
const getLocalPreference = (key, fallback) => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch (error) {
    return fallback;
  }
};
const setLocalPreference = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {}
};
let activeCurrency = "USD";
if (getLocalPreference(currencyPreferenceVersionKey, "") === currencyPreferenceVersion) {
  activeCurrency = getLocalPreference(currencyUserPreferenceKey, "") === "true"
    ? getLocalPreference("ceylon-currency", "USD")
    : "USD";
} else {
  setLocalPreference(currencyUserPreferenceKey, "false");
}
setLocalPreference("ceylon-currency", activeCurrency);
setLocalPreference(currencyPreferenceVersionKey, currencyPreferenceVersion);
let priceAnimationTimer = null;
let priceAnimationEndTimer = null;

function formatRoutePrice(currency) {
  const config = currencyRates[currency] || currencyRates.LKR;
  const symbol = currencySymbols[currency] || currencySymbols.LKR;
  const convertedPrice = baseRoutePrice * config.rate;
  const formattedNumber = new Intl.NumberFormat(symbol.locale, {
    maximumFractionDigits: 0
  }).format(convertedPrice);

  return `${symbol.prefix}${formattedNumber}`;
}

function updateRoutePrices(currency, animate = true) {
  priceConverters.forEach((converter) => {
    converter.dataset.activeCurrency = currencyRates[currency] ? currency : "USD";
    const output = converter.querySelector("[data-price-output]");
    const priceMotion = converter.querySelector("[data-price-motion]");
    if (!output) return;

    const nextText = formatRoutePrice(currency);
    if (output.textContent === nextText) return;

    if (!animate || reducedMotionQuery.matches || !priceMotion) {
      output.textContent = nextText;
      return;
    }

    priceMotion.classList.remove("is-price-changing");
    void priceMotion.offsetWidth;
    priceMotion.classList.add("is-price-changing");
    if (priceAnimationTimer) window.clearTimeout(priceAnimationTimer);
    if (priceAnimationEndTimer) window.clearTimeout(priceAnimationEndTimer);

    priceAnimationTimer = window.setTimeout(() => {
      output.textContent = nextText;
    }, 260);

    priceAnimationEndTimer = window.setTimeout(() => {
      priceMotion.classList.remove("is-price-changing");
      priceAnimationTimer = null;
      priceAnimationEndTimer = null;
    }, 700);
  });
}

function syncCurrencyMenus(currency, animate = true, userInitiated = false) {
  const normalizedCurrency = currencyRates[currency] ? currency : "USD";
  activeCurrency = normalizedCurrency;
  setLocalPreference("ceylon-currency", normalizedCurrency);
  setLocalPreference(currencyPreferenceVersionKey, currencyPreferenceVersion);
  if (userInitiated) setLocalPreference(currencyUserPreferenceKey, "true");

  currencyMenus.forEach((control) => {
    const trigger = control.querySelector("[data-currency-trigger]");
    const activeFlag = control.querySelector("[data-currency-active-flag]");
    const activeLabel = control.querySelector("[data-currency-active-label]");
    const options = Array.from(control.querySelectorAll("[data-currency-option]"));
    const option = options.find((item) => item.dataset.currency === normalizedCurrency) || options[0];
    if (!trigger || !activeFlag || !activeLabel || !option) return;

    const compact = control.hasAttribute("data-compact-currency") || compactCurrencyLabelQuery.matches;
    const label = compact
      ? option.dataset.currencyCompactLabel || option.dataset.currency || option.textContent.trim()
      : option.dataset.currencyLabel || option.textContent.trim();

    trigger.dataset.currency = normalizedCurrency;
    if (option.dataset.currencyFlagSrc) {
      activeFlag.setAttribute("src", option.dataset.currencyFlagSrc);
    } else if (option.dataset.currencyFlag) {
      activeFlag.textContent = option.dataset.currencyFlag;
    }
    control.classList.add("notranslate");
    control.setAttribute("translate", "no");
    trigger.classList.add("notranslate");
    trigger.setAttribute("translate", "no");
    activeLabel.classList.add("notranslate");
    activeLabel.setAttribute("translate", "no");
    activeLabel.textContent = label;
    options.forEach((item) => {
      item.classList.add("notranslate");
      item.setAttribute("translate", "no");
      item.querySelectorAll("span").forEach((span) => {
        span.classList.add("notranslate");
        span.setAttribute("translate", "no");
      });
      item.setAttribute("aria-selected", String(item === option));
    });
  });

  updateRoutePrices(normalizedCurrency, animate);
  document.dispatchEvent(new CustomEvent("ceylon:currencychange", {
    detail: { currency: normalizedCurrency }
  }));
}

if (compactCurrencyLabelQuery.addEventListener) {
  compactCurrencyLabelQuery.addEventListener("change", () => syncCurrencyMenus(activeCurrency, false));
} else if (compactCurrencyLabelQuery.addListener) {
  compactCurrencyLabelQuery.addListener(() => syncCurrencyMenus(activeCurrency, false));
}

function readCurrencyRate(rates, currency) {
  return Number(rates?.[currency] ?? rates?.[currency.toLowerCase()]);
}

function closePreferenceMenu(control) {
  const trigger = control.querySelector("[aria-expanded]");
  control.classList.remove("is-open");
  if (trigger) trigger.setAttribute("aria-expanded", "false");
}

function openPreferenceMenu(control) {
  document.querySelectorAll(".preference-menu.is-open, .price-currency-control.is-open").forEach((menu) => {
    if (menu !== control) closePreferenceMenu(menu);
  });

  const trigger = control.querySelector("[aria-expanded]");
  control.classList.add("is-open");
  if (trigger) trigger.setAttribute("aria-expanded", "true");
}

function togglePreferenceMenu(control) {
  if (control.classList.contains("is-open")) closePreferenceMenu(control);
  else openPreferenceMenu(control);
}

function bindCurrencyMenus() {
  currencyMenus.forEach((control) => {
    const trigger = control.querySelector("[data-currency-trigger]");
    const options = Array.from(control.querySelectorAll("[data-currency-option]"));
    if (!trigger || !options.length) return;

    trigger.addEventListener("click", () => togglePreferenceMenu(control));
    trigger.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowDown" && event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openPreferenceMenu(control);
      options.find((option) => option.getAttribute("aria-selected") === "true")?.focus();
    });

    options.forEach((option, index) => {
      option.addEventListener("click", () => {
        syncCurrencyMenus(option.dataset.currency || "USD", true, true);
        closePreferenceMenu(control);
        trigger.focus({ preventScroll: true });
      });

      option.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closePreferenceMenu(control);
          trigger.focus({ preventScroll: true });
          return;
        }

        const direction = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
        if (!direction) return;

        event.preventDefault();
        options[(index + direction + options.length) % options.length].focus();
      });
    });
  });
}

function bindFaqMenus() {
  const faqCategoryContent = {
    "general-questions": [
      {
        question: "How are your tours different from normal Sri Lanka tour packages?",
        answer: [
          "Most standard tour packages focus on famous places and common tourist routes. Ceylon Backroads focuses on hidden roads, small communities, estate routes, remote viewpoints, natural landscapes and slow travel experiences.",
          "The journey itself is part of the experience, not just the final destination."
        ]
      },
      {
        question: "Are your tours private?",
        answer: [
          "Yes. Our routes are usually operated as private journeys. Your group travels in a private vehicle with a driver and guide.",
          "We do not normally combine unrelated guests in the same vehicle unless we announce a special fixed group expedition."
        ]
      },
      {
        question: "Do you offer fixed routes or custom tours?",
        answer: [
          "We offer both fixed routes and selected custom journeys.",
          "Our fixed routes are planned experiences with a clear itinerary, route, accommodation and included stops. Custom journeys may be arranged depending on travel dates, route conditions, vehicle availability and guest requirements."
        ]
      },
      {
        question: "Who are these routes suitable for?",
        answer: [
          "Our routes are suitable for travellers who enjoy nature, scenic drives, photography, waterfalls, mountains, tea estates, local culture and adventure.",
          "They are ideal for couples, families, small groups, photographers, content creators and travellers who want something different from a standard sightseeing tour."
        ]
      },
      {
        question: "Are your routes difficult?",
        answer: [
          "Difficulty depends on the route. Some routes are mostly scenic and comfortable, while others include rough roads, narrow mountain tracks, steep sections, gravel roads and remote areas.",
          "Each route page will mention the general route style, such as scenic, moderate, technical or adventure-focused."
        ]
      },
      {
        question: "Can children join the routes?",
        answer: [
          "Yes, children can join selected routes, but suitability depends on the route, road conditions, travel time and the child's comfort with long drives or bumpy roads.",
          "Please tell us the age of the children before booking so we can advise properly."
        ]
      },
      {
        question: "Can elderly travellers join?",
        answer: [
          "Yes, elderly travellers can join suitable routes, but we recommend choosing routes with lower difficulty and less rough-road travel.",
          "Please inform us about any mobility concerns before booking."
        ]
      }
    ],
    "booking-pricing": [
      {
        question: "How is the tour price calculated?",
        answer: [
          "Our routes are priced on a private vehicle basis. The listed per-person starting price is calculated based on 4 guests sharing one private vehicle.",
          "Smaller groups are welcome, but the per-person price may be higher because fixed costs such as the vehicle, driver, guide, fuel, accommodation arrangements and route operations are shared between fewer travellers."
        ]
      },
      {
        question: "Is the listed price per person or per vehicle?",
        answer: [
          "The listed price is shown as a per-person starting price, based on 4 guests sharing one private vehicle.",
          "For example, if 4 guests travel, the total route cost is divided between 4 people. If only 2 guests travel, the same private vehicle and route costs still apply, so the cost is divided between 2 people instead."
        ]
      },
      {
        question: "Why does the price increase for smaller groups?",
        answer: [
          "Many costs remain the same regardless of whether 2 guests or 4 guests travel. These include the private 4x4 vehicle, driver, guide, fuel, route planning, accommodation coordination and standard route operations.",
          "Because your trip remains private, these fixed costs are shared only among your confirmed group."
        ]
      },
      {
        question: "Are accommodation and meals included in the price?",
        answer: [
          "Yes. For our multi-day routes, accommodation and meals are included in the starting price, unless stated otherwise for a specific route.",
          "The exact accommodation type and meal plan will be confirmed in your quotation before the booking is finalised."
        ]
      },
      {
        question: "Are activity fees included?",
        answer: [
          "Standard route-related fees and planned activities mentioned in the package are included.",
          "However, any additional activities requested by the guest, hotel extras, upgrades or optional experiences outside the confirmed package will be charged separately."
        ]
      },
      {
        question: "Are pickup and drop-off included?",
        answer: [
          "Pickup and drop-off are included from selected locations stated in the route package.",
          "Pickup or drop-off from other locations can be arranged, but additional charges may apply based on distance and route planning."
        ]
      },
      {
        question: "Can the final price change after I send an inquiry?",
        answer: [
          "Yes. The final price may vary depending on your travel date, group size, pickup location, accommodation availability, route conditions and any additional requests.",
          "We will always send a clear quotation before confirming the booking, so you know exactly what is included and what may cost extra."
        ]
      },
      {
        question: "Do I need to pay a deposit?",
        answer: [
          "Yes. A booking deposit is required to confirm your travel date, vehicle, guide and accommodation arrangements.",
          "The remaining balance can be paid before the trip or on the first day, depending on the agreed booking terms."
        ]
      },
      {
        question: "Can I pay in foreign currency?",
        answer: [
          "Yes, we can show estimated prices in major foreign currencies for convenience. However, the final payment amount and exchange-rate handling will be confirmed at the time of booking."
        ]
      },
      {
        question: "Will I be charged extra during the trip?",
        answer: [
          "You will not be charged extra for anything already included in your confirmed package.",
          "Extra charges may apply only if you request additional activities, hotel upgrades, extra route extensions, personal purchases, extra pickup/drop-off locations or services outside the confirmed quotation."
        ]
      },
      {
        question: "What is the best way to understand my final cost?",
        answer: [
          "Send us your preferred route, travel date, number of travellers and pickup location. We will then prepare a clear quotation showing the price, inclusions, exclusions and any optional extras before you confirm the booking."
        ]
      }
    ],
    "payment-money": [
      {
        question: "What currency is used in Sri Lanka?",
        answer: [
          "The local currency is the Sri Lankan Rupee, also known as LKR. Most local payments inside Sri Lanka are made in rupees, especially for small shops, local food stops, tips, entrance counters and personal purchases."
        ]
      },
      {
        question: "Should I carry cash during the trip?",
        answer: [
          "Yes. We recommend carrying some local cash in Sri Lankan Rupees, especially for personal expenses, snacks, small purchases, tips or anything outside the confirmed package.",
          "Some remote areas, village shops and small local stops may not accept cards."
        ]
      },
      {
        question: "Are card payments accepted everywhere?",
        answer: [
          "No. Card payments are common in larger hotels, restaurants and cities, but they may not be available in remote areas, estate roads, small villages or local food stops.",
          "For backroad and highland routes, it is safer to carry some cash."
        ]
      },
      {
        question: "Are ATMs available during the route?",
        answer: [
          "ATMs are available in many towns, but they may not be available during remote route sections. Some routes pass through areas where banking facilities are limited.",
          "We recommend withdrawing enough cash before starting the journey."
        ]
      },
      {
        question: "How much spending money should I bring?",
        answer: [
          "This depends on your personal spending style. Since the package already includes the confirmed route services, you mainly need extra money for personal purchases, extra snacks, drinks, hotel extras, optional activities, tips or souvenirs.",
          "We can guide you before the trip based on your route and number of days."
        ]
      },
      {
        question: "Are tips included in the tour price?",
        answer: [
          "Tips are not included unless clearly mentioned in your quotation. Tipping is optional and based on your satisfaction with the service.",
          "Guests may tip the driver, guide, hotel staff or local service providers if they wish."
        ]
      },
      {
        question: "Are hotel extras included?",
        answer: [
          "No. Hotel extras are not included unless clearly mentioned in your package.",
          "Examples of hotel extras include laundry, minibar, room service, spa services, room upgrades, additional food orders and personal purchases."
        ]
      },
      {
        question: "Can I exchange money during the trip?",
        answer: [
          "Currency exchange is easier in major towns, cities and airport areas. It may be difficult during remote route sections.",
          "We recommend exchanging money before the route begins or using ATMs in larger towns when available."
        ]
      },
      {
        question: "Should I bring USD or my own currency?",
        answer: [
          "USD is widely recognised for travel quotations, but you should still carry Sri Lankan Rupees for local spending. Guests from Europe, the UK or Australia may also bring EUR, GBP or AUD and exchange them through authorised money changers or banks."
        ]
      },
      {
        question: "Are there hidden charges?",
        answer: [
          "No. We aim to keep pricing clear before booking. Your quotation will mention what is included, what is not included, and what may cost extra.",
          "Extra charges only apply for services outside the confirmed package, such as personal expenses, hotel extras, extra activities, upgrades or additional route changes."
        ]
      },
      {
        question: "What payment methods do you accept?",
        answer: [
          "Payment methods will be confirmed during booking. Depending on the arrangement, payment may be accepted by bank transfer, cash or another agreed method.",
          "The deposit and balance payment details will be shared with your quotation."
        ]
      },
      {
        question: "When do I pay the balance?",
        answer: [
          "The balance payment can be paid before the trip or on the first day, depending on the agreed booking terms.",
          "This will be clearly confirmed before your route is booked."
        ]
      }
    ],
    "route-experience-itinerary": [
      {
        question: "Can the route change during the trip?",
        answer: [
          "Yes. Routes may change slightly depending on weather, road conditions, landslides, local access, safety concerns or accommodation availability.",
          "Any changes will be made with guest safety, comfort and route quality in mind."
        ]
      },
      {
        question: "What happens if the weather is bad?",
        answer: [
          "If bad weather affects the planned route, we may adjust the timing, change certain stops or use an alternative road where necessary.",
          "Highland and backroad routes can be affected by rain, mist, slippery roads or temporary road conditions, so safety will always come first."
        ]
      },
      {
        question: "Can we stop for photos and videos?",
        answer: [
          "Yes. Photo stops are part of the experience. Our routes include viewpoints, waterfalls, estate roads, rural scenes, mountain landscapes and local stops where guests can enjoy the journey slowly.",
          "However, stops must be managed according to route timing, safety and road conditions."
        ]
      },
      {
        question: "Do your routes include local communities?",
        answer: [
          "Yes, many routes pass through estate communities, rural villages and small local areas.",
          "We encourage respectful travel. Guests should ask before photographing people, avoid entering private property without permission and respect local daily life."
        ]
      },
      {
        question: "Can we change the itinerary after booking?",
        answer: [
          "Minor changes may be possible depending on timing, road conditions, accommodation and safety.",
          "Major changes, extra stops or route extensions may affect the final price and must be agreed in advance where possible."
        ]
      },
      {
        question: "Are the routes suitable during the rainy season?",
        answer: [
          "Some routes are still possible during rainy periods, but road conditions, visibility and safety can change quickly.",
          "If a route is not suitable due to weather, we may recommend an adjusted route, alternative date or safer option."
        ]
      }
    ],
    "vehicles-driver-guide": [
      {
        question: "What type of vehicles do you use?",
        answer: [
          "We use private 4x4 vehicles suitable for Sri Lankan backroads, mountain roads, estate roads and selected rough sections."
        ]
      },
      {
        question: "How many people can travel in one vehicle?",
        answer: [
          "The ideal number is usually up to 4 guests per vehicle for comfort, luggage space and visibility.",
          "Larger groups can be arranged using additional vehicles, depending on availability."
        ]
      },
      {
        question: "Will we have a guide?",
        answer: [
          "Yes. A guide will be provided for the route. Depending on the route and arrangement, the guide may be the driver-guide or a separate guide travelling with the driver."
        ]
      }
    ],
    "accommodation-meals": [
      {
        question: "What kind of accommodation do you use?",
        answer: [
          "Accommodation depends on the route. We generally provide 3-star hotels, but accommodation can be changed as per request.",
          "Some routes pass through remote areas where accommodation choices and facilities may be limited."
        ]
      },
      {
        question: "Can you arrange vegetarian, vegan or special meals?",
        answer: [
          "Yes. We can try to arrange vegetarian, vegan, halal-friendly or other dietary requirements if you inform us before the trip.",
          "Some remote areas may have limited options, so early notice is important."
        ]
      }
    ],
    "safety-medical": [
      {
        question: "Is travel insurance included in the price?",
        answer: [
          "No. Travel insurance is not included.",
          "We recommend that all guests arrange their own travel insurance before travelling, especially for multi-day routes, outdoor activities and adventure-style journeys."
        ]
      },
      {
        question: "Do I need travel insurance?",
        answer: [
          "Yes, we strongly recommend that guests arrange travel insurance before travelling. Travel insurance is not included in our package price.",
          "Insurance may help cover unexpected medical needs, cancellations, lost belongings or travel disruptions, depending on your policy."
        ]
      },
      {
        question: "Should I tell Ceylon Backroads about medical conditions?",
        answer: [
          "Yes. Please inform us before the trip if you have any medical conditions, allergies, mobility limitations, food allergies, asthma, heart conditions, pregnancy-related concerns or regular medication needs.",
          "This helps us plan the route more responsibly, especially when travelling through remote areas where medical facilities may not be immediately available."
        ]
      },
      {
        question: "Should I bring my own medication?",
        answer: [
          "Yes. Guests should bring any personal medication they need for the full journey, plus extra in case of delays.",
          "This includes prescription medicine, allergy medication, inhalers, motion-sickness tablets, pain relief, stomach medicine and any other personal medical items recommended by your doctor."
        ]
      },
      {
        question: "Do you provide first-aid support?",
        answer: [
          "We carry basic first-aid support for the route. However, this is only for minor situations and initial support. It is not a replacement for professional medical care.",
          "Guests with specific health needs should bring their own medication and consult a doctor before travelling."
        ]
      },
      {
        question: "What should I do if I feel unwell during the route?",
        answer: [
          "Please tell your driver or guide immediately. Depending on the situation, we may adjust the route, stop for rest, contact local medical support or travel to the nearest suitable medical facility.",
          "Guests should not ignore fever, severe stomach issues, dehydration, dizziness, allergic reactions or injuries during the trip."
        ]
      },
      {
        question: "Are the routes suitable for travellers with mobility issues?",
        answer: [
          "Some routes may include uneven ground, waterfalls, rough roads, steps, village paths, slippery areas or remote viewpoints. Travellers with mobility concerns should inform us before booking so we can recommend a suitable route or adjust the plan where possible."
        ]
      },
      {
        question: "Are the routes suitable for children or elderly travellers?",
        answer: [
          "Some routes are suitable for children and elderly travellers, while others may be tiring due to long drives, bumpy roads, cold weather, rough sections or remote areas.",
          "Please tell us the age and comfort level of travellers before booking so we can advise whether the route is suitable."
        ]
      },
      {
        question: "Do I need protection from cold weather?",
        answer: [
          "Yes, for highland routes. Areas such as Haputale, Pattipola, Ambewela and Nuwara Eliya can be cold, especially early morning, evening and night.",
          "Bring a warm layer, rain jacket and suitable footwear."
        ]
      },
      {
        question: "Is malaria a risk in Sri Lanka?",
        answer: [
          "Sri Lanka has been recognised as malaria-free, and some travel health sources state that malaria preventive treatment is not generally recommended for the country. However, travellers should still check current medical advice before travel because health guidance can change."
        ]
      },
      {
        question: "Is dengue a risk in Sri Lanka?",
        answer: [
          "Yes. Dengue is a known risk in Sri Lanka, especially during wetter periods and in mosquito-prone areas. There is no standard travel vaccine solution for most visitors, so mosquito-bite prevention is very important.",
          "Guests should use mosquito repellent, wear clothing that covers the body where practical, and take extra care around dawn, dusk and areas with standing water."
        ]
      },
      {
        question: "Is this medical advice?",
        answer: [
          "No. This FAQ is general travel information only and is not a replacement for advice from a qualified doctor, travel clinic or public health authority.",
          "Guests should always check current health guidance before travelling to Sri Lanka."
        ]
      }
    ],
    "power-charging-connectivity": [
      {
        question: "Will there be electricity at the accommodation?",
        answer: [
          "Most overnight stays provide electricity, but some may have limited power supply or occasional interruptions.",
          "We recommend charging your devices whenever power is available on such routes."
        ]
      },
      {
        question: "Can I charge my phone during the trip?",
        answer: [
          "Yes, phone charging is usually possible in the vehicle, depending on the vehicle setup. We still recommend bringing a power bank, especially for multi-day routes, remote areas and heavy camera or phone use."
        ]
      },
      {
        question: "Should I bring a power bank?",
        answer: [
          "Yes. A power bank is strongly recommended.",
          "Some routes pass through remote mountain roads, estate areas and forest sections where charging options may be limited during the day. A power bank is useful for phones, cameras and other small electronics."
        ]
      },
      {
        question: "Can I charge camera batteries or drone batteries?",
        answer: [
          "You can usually charge camera batteries at the accommodation, but charging opportunities during the day may sometimes be limited.",
          "For drones, action cameras or professional camera gear, we recommend bringing extra batteries, a multi-charger and a high-capacity power bank or portable power station if needed."
        ]
      },
      {
        question: "Will mobile signal be available throughout the route?",
        answer: [
          "Mobile signal is not guaranteed throughout the journey. Some areas may have good coverage, while remote valleys, estate roads, forest sections and mountain tracks may have weak signal.",
          "Signal availability can also depend on your mobile network provider."
        ]
      },
      {
        question: "Which mobile network works best?",
        answer: [
          "Coverage can vary by route and region. In general, Sri Lanka's major mobile networks cover many towns and main roads, but remote backroads and highland areas can still have weak signal.",
          "Guests who need better connectivity may consider using a local SIM card with a data package."
        ]
      },
      {
        question: "Can I buy a local SIM card in Sri Lanka?",
        answer: [
          "Yes. Foreign travellers can buy local SIM cards at the airport or from authorised mobile network outlets. A passport is usually required for registration.",
          "A local SIM is recommended if you want mobile data, maps, WhatsApp access and easier communication during your trip."
        ]
      },
      {
        question: "Can I use online maps during the route?",
        answer: [
          "Yes, but we recommend downloading offline maps before the journey because mobile signal may be weak in some areas.",
          "Our driver and guide will handle route navigation, but offline maps are useful if you want to follow the journey yourself."
        ]
      },
      {
        question: "Can I work remotely during the trip?",
        answer: [
          "These routes are not designed as remote-working trips. While you may have signal or Wi-Fi in some locations, connectivity can be unreliable in remote areas.",
          "If you need to attend important meetings or upload large files, please plan those outside the travel hours or before/after the route."
        ]
      },
      {
        question: "Are plug points the same as in my country?",
        answer: [
          "Sri Lanka commonly uses Type D, Type G and Type M plug sockets. Guests should bring a universal travel adapter to avoid issues."
        ]
      },
      {
        question: "Is there power inside the 4x4 vehicle?",
        answer: [
          "Some vehicles may have USB charging or 12V charging options, but this can vary. Please bring your own charging cables and adapters.",
          "For guests carrying cameras, drones or multiple devices, we recommend informing us before the trip so we can advise better."
        ]
      },
      {
        question: "Can I keep my devices safe during outdoor stops?",
        answer: [
          "Guests are responsible for their personal electronics and valuables. We recommend carrying phones, cameras, passports, wallets and important devices with you when leaving the vehicle."
        ]
      }
    ],
    "changes-cancellations-contact": [
      {
        question: "What is your cancellation policy?",
        answer: [
          "Cancellation terms will be shared before booking confirmation.",
          "Because our routes involve vehicle allocation, accommodation reservations, guide planning and local coordination, cancellation fees may apply after the booking is confirmed."
        ]
      },
      {
        question: "How early should we book?",
        answer: [
          "We recommend booking as early as possible, ideally at least one month before travel, especially for multi-day routes, peak travel periods, weekends and routes with limited accommodation options.",
          "Early booking helps us secure the vehicle, guide and accommodation properly."
        ]
      },
      {
        question: "How can I contact Ceylon Backroads?",
        answer: [
          "You can contact us through the website contact form, booking page, WhatsApp, email or social media.",
          "Send your preferred route, travel date, group size and pickup location so we can guide you properly."
        ]
      }
    ]
  };

  document.querySelectorAll("[data-faq-menu]").forEach((control) => {
    const trigger = control.querySelector("[data-faq-trigger]");
    const label = control.querySelector(".faq-menu-label");
    const activeLabel = control.querySelector("[data-faq-active-category]");
    const options = Array.from(control.querySelectorAll("[data-faq-category-option]"));
    const wheel = control.querySelector(".faq-category-list");
    const wheelZone = control.closest(".faq-sidebar") || control;
    const content = document.querySelector("[data-faq-content]");
    if (!trigger || !activeLabel || !options.length) return;
    let selectedIndex = Math.max(0, options.findIndex((option) => option.getAttribute("aria-selected") === "true"));
    let wheelReleaseTimer = null;
    let wheelStepLocked = false;
    let wheelDelta = 0;
    const mobileFaqMenuQuery = window.matchMedia("(max-width: 860px)");

    function updateFaqWheelPreview() {
      options.forEach((option) => {
        delete option.dataset.wheelPosition;
        option.style.removeProperty("order");
      });

      if (!wheel) return;
      const visibleCount = Math.min(5, options.length - selectedIndex - 1);
      for (let position = 1; position <= visibleCount; position += 1) {
        const option = options[selectedIndex + position];
        option.dataset.wheelPosition = String(position);
        option.style.order = String(position);
      }
    }

    function animateFaqContentLoad() {
      if (!content) return;
      content.classList.remove("is-faq-refreshing");
      content.offsetHeight;
      content.classList.add("is-faq-refreshing");
    }

    function setFaqAnswerHeight(item, isOpen) {
      const answer = item.querySelector(".faq-answer");
      if (!answer) return;
      answer.style.maxHeight = isOpen ? `${answer.scrollHeight}px` : "0px";
    }

    function renderFaqCategory(category) {
      if (!content) return;
      const items = faqCategoryContent[category] || [];
      content.replaceChildren();

      items.forEach((entry, index) => {
        const item = document.createElement("article");
        item.className = "faq-item";
        item.style.setProperty("--faq-delay", `${180 + index * 140}ms`);

        const questionId = `faq-question-${category}-${index}`;
        const answerId = `faq-answer-${category}-${index}`;
        const button = document.createElement("button");
        button.className = "faq-question";
        button.type = "button";
        button.id = questionId;
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", answerId);
        button.textContent = entry.question;

        const answer = document.createElement("div");
        answer.className = "faq-answer";
        answer.id = answerId;
        answer.setAttribute("role", "region");
        answer.setAttribute("aria-labelledby", questionId);

        entry.answer.forEach((paragraphText) => {
          const paragraph = document.createElement("p");
          paragraph.textContent = paragraphText;
          answer.appendChild(paragraph);
        });

        button.addEventListener("click", () => {
          const isOpen = item.classList.toggle("is-open");
          button.setAttribute("aria-expanded", String(isOpen));
          setFaqAnswerHeight(item, isOpen);
        });

        item.append(button, answer);
        content.appendChild(item);
        setFaqAnswerHeight(item, false);
      });

      animateFaqContentLoad();
    }

    function queueFaqLock() {
      if (wheelReleaseTimer) window.clearTimeout(wheelReleaseTimer);
      wheelReleaseTimer = window.setTimeout(() => {
        wheelReleaseTimer = null;
      }, 520);
    }

    function setFaqCategory(option, { close = false, center = true, animate = false } = {}) {
      if (!option) return;
      selectedIndex = options.indexOf(option);
      const category = option.dataset.faqCategory || "";
      trigger.dataset.faqCategory = category;
      activeLabel.textContent = option.textContent.trim();
      options.forEach((item) => {
        item.setAttribute("aria-selected", String(item === option));
      });
      if (content) content.dataset.faqCategory = category;
      if (center) updateFaqWheelPreview();
      renderFaqCategory(category);
      if (close) {
        closePreferenceMenu(control);
        trigger.focus({ preventScroll: true });
      }
    }

    function moveFaqSelection(direction) {
      const nextIndex = Math.min(Math.max(selectedIndex + direction, 0), options.length - 1);
      if (nextIndex === selectedIndex) {
        queueFaqLock();
        return;
      }
      setFaqCategory(options[nextIndex], { animate: true });
    }

    function isFaqWheelHit(event) {
      if (event.currentTarget === control) return true;
      const controlRect = control.getBoundingClientRect();
      const zoneRect = wheelZone.getBoundingClientRect();
      const labelRect = label ? label.getBoundingClientRect() : controlRect;
      return (
        event.clientX >= controlRect.left &&
        event.clientX <= controlRect.right &&
        event.clientY >= labelRect.top &&
        event.clientY <= zoneRect.bottom
      );
    }

    function handleFaqWheel(event) {
      if (mobileFaqMenuQuery.matches) return;
      if (Math.abs(event.deltaY) < 2) return;
      if (!isFaqWheelHit(event)) return;
      event.preventDefault();
      if (!control.classList.contains("is-open")) openPreferenceMenu(control);
      if (wheelStepLocked) return;
      wheelDelta += event.deltaY;
      if (Math.abs(wheelDelta) < 16) return;
      wheelStepLocked = true;
      moveFaqSelection(wheelDelta > 0 ? 1 : -1);
      wheelDelta = 0;
      window.setTimeout(() => {
        wheelStepLocked = false;
      }, 260);
    }

    trigger.addEventListener("click", () => {
      togglePreferenceMenu(control);
      if (control.classList.contains("is-open")) {
        updateFaqWheelPreview();
      }
    });
    wheelZone.addEventListener("wheel", handleFaqWheel, { passive: false });
    trigger.addEventListener("keydown", (event) => {
      if (mobileFaqMenuQuery.matches) {
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        openPreferenceMenu(control);
        options.find((option) => option.getAttribute("aria-selected") === "true")?.focus();
        return;
      }

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        openPreferenceMenu(control);
        moveFaqSelection(event.key === "ArrowDown" ? 1 : -1);
        return;
      }

      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      togglePreferenceMenu(control);
      updateFaqWheelPreview();
    });

    options.forEach((option, index) => {
      option.addEventListener("click", () => {
        setFaqCategory(option, { close: true, animate: true });
        trigger.focus({ preventScroll: true });
      });

      option.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closePreferenceMenu(control);
          trigger.focus({ preventScroll: true });
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setFaqCategory(option, { close: true, animate: true });
          return;
        }

        const direction = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
        if (!direction) return;

        event.preventDefault();
        options[(index + direction + options.length) % options.length].focus();
      });
    });

    setFaqCategory(options[selectedIndex] || options[0], { center: false });
    updateFaqWheelPreview();
  });
}

function applyUsdBaseRates(rates) {
  const lkrPerUsd = readCurrencyRate(rates, "LKR");
  if (!Number.isFinite(lkrPerUsd) || lkrPerUsd <= 0) return false;

  Object.keys(currencyRates).forEach((currency) => {
    if (currency === "LKR") {
      currencyRates[currency].rate = 1;
      return;
    }

    const targetPerUsd = currency === "USD" ? 1 : readCurrencyRate(rates, currency);
    if (Number.isFinite(targetPerUsd) && targetPerUsd > 0) {
      currencyRates[currency].rate = targetPerUsd / lkrPerUsd;
    }
  });

  return true;
}

const liveCurrencyRefreshInterval = 30 * 60 * 1000;
let liveCurrencyRefreshTimer = null;

function scheduleLiveCurrencyRefresh(delay = liveCurrencyRefreshInterval) {
  if (!priceConverters.length) return;
  if (liveCurrencyRefreshTimer) window.clearTimeout(liveCurrencyRefreshTimer);
  liveCurrencyRefreshTimer = window.setTimeout(loadLiveCurrencyRates, delay);
}

async function loadLiveCurrencyRates() {
  if (!priceConverters.length) return;

  const endpoints = [
    {
      source: "ExchangeRate-API",
      url: "https://open.er-api.com/v6/latest/USD",
      parse(data) {
        if (data?.result !== "success" || !data?.rates) return null;
        return {
          rates: data.rates,
          updatedAt: data.time_last_update_utc || "",
          nextUpdateAt: Number(data.time_next_update_unix) * 1000
        };
      }
    },
    {
      source: "currency-api",
      url: "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json",
      parse(data) {
        if (!data?.usd) return null;
        return {
          rates: data.usd,
          updatedAt: data.date || "",
          nextUpdateAt: 0
        };
      }
    }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url, { cache: "no-store" });
      if (!response.ok) throw new Error(`Rate source failed: ${endpoint.source}`);
      const data = await response.json();
      const liveRateResult = endpoint.parse(data);
      if (!liveRateResult?.rates || !applyUsdBaseRates(liveRateResult.rates)) continue;

      priceConverters.forEach((converter) => {
        converter.dataset.rateSource = endpoint.source;
        if (liveRateResult.updatedAt) converter.dataset.rateUpdated = liveRateResult.updatedAt;
      });
      updateRoutePrices(activeCurrency, false);
      const nextDelay = liveRateResult.nextUpdateAt > Date.now()
        ? Math.min(Math.max(liveRateResult.nextUpdateAt - Date.now() + 60000, 5 * 60 * 1000), liveCurrencyRefreshInterval)
        : liveCurrencyRefreshInterval;
      scheduleLiveCurrencyRefresh(nextDelay);
      return;
    } catch (error) {}
  }

  scheduleLiveCurrencyRefresh(10 * 60 * 1000);
}

bindCurrencyMenus();
bindFaqMenus();
syncCurrencyMenus(activeCurrency, false);
loadLiveCurrencyRates();

document.addEventListener("click", (event) => {
  document.querySelectorAll(".preference-menu.is-open, .price-currency-control.is-open").forEach((control) => {
    if (!control.contains(event.target)) closePreferenceMenu(control);
  });
});

document.querySelectorAll("[data-language-menu]").forEach((control) => {
  const trigger = control.querySelector("[data-language-trigger]");
  const activeFlag = control.querySelector("[data-language-active-flag]");
  const activeSymbol = control.querySelector("[data-language-active-symbol]");
  const options = Array.from(control.querySelectorAll("[data-language-option]"));
  if (!trigger || !activeFlag || !activeSymbol || !options.length) return;
  const supportedLanguages = new Set(["en", "fr", "ru", "de"]);
  const blogEnglishOnly = body.classList.contains("blog-page");
  let pendingTranslateLanguage = trigger.dataset.language || "en";
  let restoreLanguageChromeTimer = null;

  function restoreLanguageMenuChrome() {
    const selectedLanguage = trigger.dataset.language || "en";
    const selectedOption = options.find((item) => item.dataset.language === selectedLanguage) || options[0];
    const selectedSymbol = selectedOption?.dataset.languageSymbol || selectedLanguage.toUpperCase();
    activeSymbol.textContent = selectedSymbol;
    options.forEach((item) => {
      const symbol = item.dataset.languageSymbol || (item.dataset.language || "").toUpperCase();
      const label = item.querySelector("span:last-child");
      if (label && symbol) label.textContent = symbol;
    });
  }

  function scheduleLanguageChromeRestore() {
    window.clearTimeout(restoreLanguageChromeTimer);
    restoreLanguageMenuChrome();
    restoreLanguageChromeTimer = window.setTimeout(restoreLanguageMenuChrome, 350);
    window.setTimeout(restoreLanguageMenuChrome, 1000);
  }

  function writeTranslateCookie(language) {
    const target = supportedLanguages.has(language) ? language : "en";
    const cookieValue = target === "en" ? "/en/en" : `/en/${target}`;
    const oneYear = 60 * 60 * 24 * 365;
    document.cookie = `googtrans=${cookieValue}; path=/; max-age=${oneYear}`;
    if (location.hostname.includes(".")) {
      document.cookie = `googtrans=${cookieValue}; path=/; domain=.${location.hostname}; max-age=${oneYear}`;
    }
  }

  function setTranslateCombo(language) {
    const combo = document.querySelector(".goog-te-combo");
    if (!combo) return false;
    combo.value = language;
    combo.dispatchEvent(new Event("change"));
    return true;
  }

  function ensureGoogleTranslate(language) {
    pendingTranslateLanguage = language;
    if (blogEnglishOnly || language === "en" || document.querySelector("[data-google-translate-script]")) return;
    if (!document.getElementById("ceylon-google-translate")) {
      const host = document.createElement("div");
      host.id = "ceylon-google-translate";
      host.hidden = true;
      document.body.append(host);
    }
    window.ceylonGoogleTranslateInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,fr,ru,de",
          autoDisplay: false,
        },
        "ceylon-google-translate"
      );
      window.setTimeout(() => {
        setTranslateCombo(pendingTranslateLanguage);
        scheduleLanguageChromeRestore();
      }, 300);
      window.setTimeout(() => {
        setTranslateCombo(pendingTranslateLanguage);
        scheduleLanguageChromeRestore();
      }, 900);
    };
    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=ceylonGoogleTranslateInit";
    script.async = true;
    script.dataset.googleTranslateScript = "true";
    document.head.append(script);
  }

  function applyPageLanguage(language) {
    if (blogEnglishOnly) return;
    writeTranslateCookie(language);
    if (language === "en") {
      setTranslateCombo("en");
      return;
    }
    ensureGoogleTranslate(language);
    setTranslateCombo(language);
  }

  function requestLanguagePageReload(language) {
    if (blogEnglishOnly) return;
    writeTranslateCookie(language);
    try {
      sessionStorage.setItem(LANGUAGE_RELOAD_SESSION_KEY, language);
    } catch (error) {}
    body.classList.remove("loader-done", "site-ready");
    body.classList.add("is-loading");
    window.location.reload();
  }

  if (blogEnglishOnly) {
    options.forEach((option) => {
      const disabled = option.dataset.language !== "en";
      option.disabled = disabled;
      option.setAttribute("aria-disabled", String(disabled));
      if (disabled) option.setAttribute("tabindex", "-1");
    });
  }

  function setLanguage(language, close = false, userInitiated = false) {
    const requestedLanguage = blogEnglishOnly ? "en" : language;
    const option = options.find((item) => item.dataset.language === requestedLanguage) || options[0];
    const nextLanguage = option.dataset.language || "en";
    trigger.dataset.language = nextLanguage;
    if (option.dataset.languageFlagSrc) {
      activeFlag.setAttribute("src", option.dataset.languageFlagSrc);
    } else if (option.dataset.languageFlag) {
      activeFlag.textContent = option.dataset.languageFlag;
    }
    activeSymbol.textContent = option.dataset.languageSymbol || nextLanguage.toUpperCase();
    options.forEach((item) => item.setAttribute("aria-selected", String(item === option)));
    document.documentElement.lang = nextLanguage;
    if (!blogEnglishOnly || userInitiated) setLocalPreference("ceylon-language", nextLanguage);
    if (userInitiated) {
      requestLanguagePageReload(nextLanguage);
      return;
    }
    applyPageLanguage(nextLanguage);
    scheduleLanguageChromeRestore();
    document.dispatchEvent(new CustomEvent("ceylon:languagechange", {
      detail: { language: nextLanguage }
    }));
    if (close) closePreferenceMenu(control);
  }

  trigger.addEventListener("click", () => togglePreferenceMenu(control));
  trigger.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" && event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openPreferenceMenu(control);
    options.find((option) => option.getAttribute("aria-selected") === "true")?.focus();
  });

  options.forEach((option, index) => {
    option.addEventListener("click", () => {
      if (option.disabled) return;
      setLanguage(option.dataset.language || "en", true, true);
      trigger.focus({ preventScroll: true });
    });

    option.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closePreferenceMenu(control);
        trigger.focus({ preventScroll: true });
        return;
      }

      const direction = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
      if (!direction) return;

      event.preventDefault();
      options[(index + direction + options.length) % options.length].focus();
    });
  });

  setLanguage(blogEnglishOnly ? "en" : getLocalPreference("ceylon-language", trigger.dataset.language || "en"));

  document.querySelectorAll('a[href="index.html"]').forEach((link) => {
    link.addEventListener("click", () => {
      if (blogEnglishOnly) return;
      const activeLanguage = trigger.dataset.language || getLocalPreference("ceylon-language", "en");
      if (!activeLanguage || activeLanguage === "en") return;
      writeTranslateCookie(activeLanguage);
      try {
        sessionStorage.setItem(LANGUAGE_RELOAD_SESSION_KEY, activeLanguage);
      } catch (error) {}
    });
  });
});

const blogFilterButtons = Array.from(document.querySelectorAll("[data-blog-filter]"));
const blogProjectCards = Array.from(document.querySelectorAll("[data-blog-category]"));
const blogProjectsStage = document.querySelector("[data-blog-projects-stage]");
let revealBlogProjectCards = null;
let showFilteredBlogCards = null;
if (blogProjectsStage && blogProjectCards.length) {
  const BLOG_GRID_SCROLL_START_STAGE = 0.68;
  const BLOG_GRID_SCROLL_DISTANCE = 0.22;
  const BLOG_GRID_LANDING_BUFFER = 0.035;
  const blogMobileFeedQuery = window.matchMedia("(max-width: 760px)");
  let blogIntroProgress = 0;
  let blogIntroAnimationFrame = null;
  let blogStageUpdateFrame = null;
  let blogIntroCardsRevealed = false;
  let blogGridLandingComplete = false;
  let blogMobileFeedReady = false;
  let blogGridLandingTimer = null;
  let blogProjectRevealTimers = [];
  let mobileBlogRevealObserver = null;

  const clearBlogProjectRevealTimers = () => {
    blogProjectRevealTimers.forEach((timer) => window.clearTimeout(timer));
    blogProjectRevealTimers = [];
  };

  const setupMobileBlogCardReveal = () => {
    if (!blogMobileFeedQuery.matches || reducedMotionQuery.matches || mobileBlogRevealObserver) return;

    blogProjectsStage.classList.add("is-mobile-reveal");
    blogProjectCards.forEach((card) => {
      card.classList.remove("is-mobile-card-visible");
    });

    mobileBlogRevealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-mobile-card-visible");
          mobileBlogRevealObserver?.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    blogProjectCards.forEach((card) => mobileBlogRevealObserver.observe(card));
  };

  const teardownMobileBlogCardReveal = () => {
    mobileBlogRevealObserver?.disconnect();
    mobileBlogRevealObserver = null;
    blogProjectsStage.classList.remove("is-mobile-reveal");
    blogProjectCards.forEach((card) => card.classList.remove("is-mobile-card-visible"));
  };

  revealBlogProjectCards = (cards, options = {}) => {
    const { baseDelay = 220, stagger = 360 } = options;
    clearBlogProjectRevealTimers();

    cards.forEach((card) => {
      card.classList.remove("visible");
      card.style.setProperty("--card-progress", reducedMotionQuery.matches || blogMobileFeedQuery.matches ? "1" : "0");
    });

    if (reducedMotionQuery.matches || blogMobileFeedQuery.matches) {
      cards.forEach((card) => card.classList.add("visible"));
      return;
    }

    requestAnimationFrame(() => {
      cards.forEach((card, index) => {
        const revealDelay = baseDelay + index * stagger;
        blogProjectRevealTimers.push(window.setTimeout(() => {
          card.style.setProperty("--card-progress", "1");
        }, revealDelay));
        blogProjectRevealTimers.push(window.setTimeout(() => {
          card.classList.add("visible");
        }, revealDelay + 1280));
      });
    });
  };

  blogProjectCards.forEach((card) => card.style.setProperty("--card-progress", "0"));

  showFilteredBlogCards = (cards) => {
    clearBlogProjectRevealTimers();
    blogProjectCards.forEach((card) => {
      card.getAnimations?.().forEach((animation) => animation.cancel());
      card.classList.remove("visible");
      card.style.setProperty("--card-progress", "0");
    });

    requestAnimationFrame(() => {
      cards.forEach((card) => {
        card.style.setProperty("--card-progress", "1");
        card.classList.add("visible");
        if (blogMobileFeedQuery.matches) card.classList.add("is-mobile-card-visible");
      });
    });
  };

  const parkBlogGridAtFirstRow = (targetY) => {
    if (blogGridLandingTimer) return;

    blogGridLandingComplete = true;
    const lenis = window.ceylonLenis;
    lenis?.stop?.();

    if (typeof lenis?.scrollTo === "function") {
      lenis.scrollTo(targetY, { immediate: true, force: true });
    }
    window.scrollTo(0, targetY);
    requestBlogProjectsStageUpdate();

    blogGridLandingTimer = window.setTimeout(() => {
      blogGridLandingTimer = null;
      lenis?.start?.();
      requestBlogProjectsStageUpdate();
    }, 320);
  };

  const setBlogGridState = (shouldGrid) => {
    if (blogMobileFeedQuery.matches && !blogProjectsStage.classList.contains("is-filtered-grid")) {
      blogProjectsStage.classList.remove("is-grid");
      return;
    }

    const isGrid = blogProjectsStage.classList.contains("is-grid");
    if (isGrid === shouldGrid) return;

    const previousRects = new Map();
    blogProjectCards.forEach((card) => {
      if (!card.classList.contains("is-filtered-out")) {
        previousRects.set(card, card.getBoundingClientRect());
      }
    });

    blogProjectsStage.classList.toggle("is-grid", shouldGrid);

    if (reducedMotionQuery.matches) return;

    requestAnimationFrame(() => {
      blogProjectCards.forEach((card) => {
        const previousRect = previousRects.get(card);
        if (!previousRect || card.classList.contains("is-filtered-out")) return;

        const nextRect = card.getBoundingClientRect();
        if (!nextRect.width || !nextRect.height) return;

        const deltaX = previousRect.left - nextRect.left;
        const deltaY = previousRect.top - nextRect.top;
        const scaleX = previousRect.width / nextRect.width;
        const scaleY = previousRect.height / nextRect.height;

        card.animate(
          [
            { transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scaleX}, ${scaleY})` },
            { transform: "translate3d(0, 0, 0) scale(1, 1)" },
          ],
          {
            duration: 820,
            easing: "cubic-bezier(0.86, 0, 0.07, 1)",
          },
        );
      });
    });
  };

  const startBlogIntroAnimation = () => {
    if (reducedMotionQuery.matches || blogMobileFeedQuery.matches || blogIntroAnimationFrame) return;

    const duration = 1800;
    const startedAt = performance.now();

    const step = (now) => {
      blogIntroProgress = smoothStep((now - startedAt) / duration);
      updateBlogProjectsStage();
      if (!blogIntroCardsRevealed && blogIntroProgress > 0.38) {
        blogIntroCardsRevealed = true;
        revealBlogProjectCards(blogProjectCards);
      }

      if (blogIntroProgress < 1) {
        blogIntroAnimationFrame = requestAnimationFrame(step);
      } else {
        blogIntroAnimationFrame = null;
      }
    };

    blogIntroAnimationFrame = requestAnimationFrame(step);
  };

  const scheduleBlogIntroAnimation = () => {
    if (blogMobileFeedQuery.matches) return;

    if (body.classList.contains("is-loading")) {
      const observer = new MutationObserver(() => {
        if (!body.classList.contains("is-loading")) {
          observer.disconnect();
          requestAnimationFrame(startBlogIntroAnimation);
        }
      });
      observer.observe(body, { attributes: true, attributeFilter: ["class"] });
      return;
    }

    requestAnimationFrame(startBlogIntroAnimation);
  };

  const setMobileBlogFeedState = () => {
    if (blogMobileFeedReady) return;

    clearBlogProjectRevealTimers();
    if (blogIntroAnimationFrame) {
      cancelAnimationFrame(blogIntroAnimationFrame);
      blogIntroAnimationFrame = null;
    }

    blogIntroProgress = 1;
    blogIntroCardsRevealed = true;
    blogGridLandingComplete = true;

    blogProjectsStage.style.setProperty("--blog-reveal-progress", "1");
    blogProjectsStage.style.setProperty("--blog-title-progress", "1");
    blogProjectsStage.style.setProperty("--blog-tabs-progress", "1");
    blogProjectsStage.style.setProperty("--blog-rail-progress", "1");
    blogProjectsStage.style.setProperty("--blog-grid-progress", "0");
    blogProjectsStage.style.setProperty("--blog-grid-lift", "0");
    blogProjectsStage.style.setProperty("--blog-grid-scroll", "0");
    blogProjectsStage.style.setProperty("--blog-card-progress", "1");
    blogProjectsStage.classList.add("is-cards-ready", "is-gallery-complete");
    if (!blogProjectsStage.classList.contains("is-filtered-grid")) {
      blogProjectsStage.classList.remove("is-grid");
    }

    blogProjectCards.forEach((card) => {
      card.getAnimations?.().forEach((animation) => animation.cancel());
      card.classList.add("visible");
      card.style.setProperty("--card-progress", "1");
    });

    setupMobileBlogCardReveal();
    blogMobileFeedReady = true;
  };

  const updateBlogProjectsStage = () => {
    if (blogMobileFeedQuery.matches) {
      setMobileBlogFeedState();
      return;
    }

    blogMobileFeedReady = false;
    teardownMobileBlogCardReveal();

    if (reducedMotionQuery.matches) {
      blogProjectsStage.style.setProperty("--blog-reveal-progress", "1");
      blogProjectsStage.style.setProperty("--blog-title-progress", "1");
      blogProjectsStage.style.setProperty("--blog-tabs-progress", "1");
      blogProjectsStage.style.setProperty("--blog-rail-progress", "1");
      blogProjectsStage.style.setProperty("--blog-grid-progress", "1");
      blogProjectsStage.style.setProperty("--blog-grid-lift", "1");
      blogProjectsStage.style.setProperty("--blog-grid-scroll", "0");
      blogProjectsStage.style.setProperty("--blog-card-progress", "1");
      blogProjectsStage.classList.add("is-cards-ready", "is-grid");
      blogProjectCards.forEach((card) => {
        card.classList.add("visible");
        card.style.setProperty("--card-progress", "1");
      });
      return;
    }

    const rect = blogProjectsStage.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
    const animationDistance = Math.max(viewportHeight * 3.35, 1);
    const progress = clamp01(-rect.top / animationDistance);
    const scrollableDistance = Math.max(blogProjectsStage.offsetHeight - viewportHeight, 1);
    const stageProgress = clamp01(-rect.top / scrollableDistance);
    if (blogProjectsStage.classList.contains("is-filtered-grid")) return;

    const scrollRevealProgress = smoothStep(progress / 0.22);
    const revealProgress = Math.max(blogIntroProgress, scrollRevealProgress);
    const titleProgress = smoothStep(revealProgress / 0.62);
    const tabsProgress = smoothStep((revealProgress - 0.16) / 0.58);
    const railProgress = smoothStep((revealProgress - 0.25) / 0.6);
    const cardGroupProgress = smoothStep((revealProgress - 0.28) / 0.66);
    const gridProgress = clamp01((progress - 0.34) / 0.24);
    const gridLift = smoothStep((progress - 0.36) / 0.24);
    const stageTop = (window.scrollY || 0) + rect.top;
    const gridLandingY = stageTop + scrollableDistance * BLOG_GRID_SCROLL_START_STAGE;
    if (stageProgress < 0.5) {
      blogGridLandingComplete = false;
    }

    let holdGridFirstRow = !blogGridLandingComplete && gridProgress >= 0.98;
    if (holdGridFirstRow && stageProgress >= BLOG_GRID_SCROLL_START_STAGE - BLOG_GRID_LANDING_BUFFER) {
      parkBlogGridAtFirstRow(gridLandingY);
    }

    const gridScrollRaw = (stageProgress - BLOG_GRID_SCROLL_START_STAGE) / BLOG_GRID_SCROLL_DISTANCE;
    let gridScroll = gridScrollRaw <= 0 ? 0 : gridScrollRaw < 1 ? gridScrollRaw * gridScrollRaw * (2 - gridScrollRaw) : gridScrollRaw;
    if (holdGridFirstRow) {
      gridScroll = 0;
    }

    blogProjectsStage.style.setProperty("--blog-reveal-progress", revealProgress.toFixed(4));
    blogProjectsStage.style.setProperty("--blog-title-progress", titleProgress.toFixed(4));
    blogProjectsStage.style.setProperty("--blog-tabs-progress", tabsProgress.toFixed(4));
    blogProjectsStage.style.setProperty("--blog-rail-progress", railProgress.toFixed(4));
    blogProjectsStage.style.setProperty("--blog-grid-progress", gridProgress.toFixed(4));
    blogProjectsStage.style.setProperty("--blog-grid-lift", gridLift.toFixed(4));
    blogProjectsStage.style.setProperty("--blog-grid-scroll", gridScroll.toFixed(4));
    blogProjectsStage.style.setProperty("--blog-card-progress", cardGroupProgress.toFixed(4));
    blogProjectsStage.classList.toggle("is-cards-ready", railProgress > 0.05);
    blogProjectsStage.classList.toggle("is-gallery-complete", cardGroupProgress > 0.98 && gridProgress < 0.18);
    const gridExitProgress = blogProjectsStage.classList.contains("is-grid") ? 0.04 : 0.16;
    setBlogGridState(gridProgress > gridExitProgress);

    if ((scrollRevealProgress > 0.92 || cardGroupProgress > 0.98) && !blogIntroCardsRevealed) {
      blogIntroCardsRevealed = true;
      revealBlogProjectCards(blogProjectCards);
    }
  };

  const requestBlogProjectsStageUpdate = () => {
    if (blogStageUpdateFrame) return;
    blogStageUpdateFrame = requestAnimationFrame(() => {
      blogStageUpdateFrame = null;
      updateBlogProjectsStage();
    });
  };

  updateBlogProjectsStage();
  scheduleBlogIntroAnimation();
  window.addEventListener("scroll", requestBlogProjectsStageUpdate, { passive: true });
  window.addEventListener("resize", requestBlogProjectsStageUpdate, { passive: true });
  window.addEventListener("load", requestBlogProjectsStageUpdate, { once: true });
  const handleBlogMobileFeedChange = () => {
    blogMobileFeedReady = false;
    requestBlogProjectsStageUpdate();
  };

  if (blogMobileFeedQuery.addEventListener) {
    blogMobileFeedQuery.addEventListener("change", handleBlogMobileFeedChange);
  } else if (blogMobileFeedQuery.addListener) {
    blogMobileFeedQuery.addListener(handleBlogMobileFeedChange);
  }
  if (reducedMotionQuery.addEventListener) {
    reducedMotionQuery.addEventListener("change", requestBlogProjectsStageUpdate);
  }
}

if (blogFilterButtons.length && blogProjectCards.length) {
  blogFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.blogFilter;
      blogFilterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      if (blogProjectsStage) {
        blogProjectsStage.classList.add("is-cards-ready", "is-gallery-complete", "is-grid", "is-filtered-grid");
        blogProjectsStage.style.setProperty("--blog-title-progress", "1");
        blogProjectsStage.style.setProperty("--blog-reveal-progress", "1");
        blogProjectsStage.style.setProperty("--blog-tabs-progress", "1");
        blogProjectsStage.style.setProperty("--blog-rail-progress", "1");
        blogProjectsStage.style.setProperty("--blog-grid-progress", "1");
        blogProjectsStage.style.setProperty("--blog-grid-lift", "1");
        blogProjectsStage.style.setProperty("--blog-grid-scroll", "0");
        blogProjectsStage.style.setProperty("--blog-card-progress", "1");
      }
      const visibleFilteredCards = [];
      blogProjectCards.forEach((card) => {
        const show = card.dataset.blogCategory === filter;
        card.classList.toggle("is-filtered-out", !show);
        if (show) {
          visibleFilteredCards.push(card);
        }
      });

      document.querySelector(".blog-projects-list")?.scrollTo({ top: 0, behavior: "auto" });
      window.scrollTo({ top: 0, behavior: "auto" });
      showFilteredBlogCards?.(visibleFilteredCards);
    });
  });
}

document.querySelectorAll(".route-day-accordion").forEach((details) => {
  const summary = details.querySelector("summary");
  if (!summary) return;

  let accordionAnimation = null;

  const finishAccordionAnimation = (open) => {
    details.open = open;
    details.style.height = "";
    details.style.overflow = "";
    details.classList.remove("is-expanding", "is-collapsing");
    accordionAnimation = null;
  };

  summary.addEventListener("click", (event) => {
    if (reducedMotionQuery.matches) return;

    event.preventDefault();
    const startHeight = `${details.offsetHeight}px`;
    const isOpen = details.open;

    if (accordionAnimation) accordionAnimation.cancel();
    details.style.overflow = "hidden";
    details.style.height = startHeight;

    if (isOpen) {
      details.classList.remove("is-expanding");
      details.classList.add("is-collapsing");
      const endHeight = `${summary.offsetHeight}px`;
      accordionAnimation = details.animate(
        { height: [startHeight, endHeight] },
        { duration: 540, easing: "cubic-bezier(0.7, 0, 0.2, 1)" }
      );
      accordionAnimation.onfinish = () => finishAccordionAnimation(false);
      accordionAnimation.oncancel = () => {
        accordionAnimation = null;
      };
      return;
    }

    details.open = true;
    details.classList.remove("is-collapsing");
    details.classList.add("is-expanding");
    const endHeight = `${details.scrollHeight}px`;
    accordionAnimation = details.animate(
      { height: [startHeight, endHeight] },
      { duration: 680, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
    );
    accordionAnimation.onfinish = () => finishAccordionAnimation(true);
    accordionAnimation.oncancel = () => {
      accordionAnimation = null;
    };
  });
});

const manifestoSection = document.querySelector(".visual-manifest");
const manifestoCopy = document.querySelector(".manifesto-copy");
const manifestoPhotoFrame = document.querySelector(".manifesto-photos");
const manifestoTranslations = {
  en: {
    kicker: "Beauty without the usual queue",
    heading: "The island is bigger than the tourist map.",
    body: "These are the roads we remember by smell, light, dust, water, wind, silence, and the faces that appear when the jeep slows down.",
  },
  fr: {
    kicker: "La beauté sans la file d'attente habituelle",
    heading: "L'île est plus grande que la carte touristique.",
    body: "Ce sont les routes dont nous nous souvenons par l'odeur, la lumière, la poussière, l'eau, le vent, le silence et les visages qui apparaissent quand la jeep ralentit.",
  },
  ru: {
    kicker: "Красота без привычной очереди",
    heading: "Остров больше туристической карты.",
    body: "Это дороги, которые мы помним по запаху, свету, пыли, воде, ветру, тишине и лицам, появляющимся, когда джип замедляется.",
  },
  de: {
    kicker: "Schönheit ohne die übliche Warteschlange",
    heading: "Die Insel ist größer als die Touristenkarte.",
    body: "Das sind die Straßen, an die wir uns durch Geruch, Licht, Staub, Wasser, Wind, Stille und die Gesichter erinnern, die erscheinen, wenn der Jeep langsamer wird.",
  },
};
let manifestoHeadingWords = Array.from(document.querySelectorAll(".manifesto-copy h2.scroll-highlight .highlight-word"));
let manifestoBodyWords = Array.from(document.querySelectorAll(".manifesto-copy .manifesto-body .highlight-word"));
let manifestoWords = [...manifestoHeadingWords, ...manifestoBodyWords];
const manifestoTiles = Array.from(document.querySelectorAll(".manifesto-photos .photo-tile"));
const manifestoImages = Array.from(document.querySelectorAll(".manifesto-photos .photo-tile img"));
const manifestoSlideTitles = Array.from(document.querySelectorAll(".manifesto-slide-title span"));
const parallaxTargets = Array.from(
  document.querySelectorAll(
    ".photo-tile, .cinema-stage, .route-card, .blog-image, .story-photo, .image-panel, .map-panel, .cta-band"
  )
).filter((target) => !target.closest(".manifesto-photos"));
const MANIFESTO_SLIDE_START = 0.5;
const MANIFESTO_SLIDE_LENGTH = 0.44;
const MANIFESTO_SLIDE_END = MANIFESTO_SLIDE_START + MANIFESTO_SLIDE_LENGTH;
const MANIFESTO_COPY_REST_PROGRESS = 0.48;
const MANIFESTO_PHOTO_FADE_STAGE = 0.42;
const MANIFESTO_SNAP_ENTRY_START = 0.42;
const MANIFESTO_SNAP_DURATION = 1120;
const MANIFESTO_LIMITED_SNAP_DURATION = 1160;
const MANIFESTO_SNAP_COOLDOWN = 180;
const MANIFESTO_WHEEL_GESTURE_IDLE = 240;
const MANIFESTO_TOUCH_GESTURE_IDLE = 280;
const MANIFESTO_LIMITED_SNAP_COOLDOWN = 260;
const MANIFESTO_LIMITED_WHEEL_GESTURE_IDLE = 360;
const MANIFESTO_LIMITED_TOUCH_GESTURE_IDLE = 360;
const MANIFESTO_SETTLE_DELAY = 190;
const manifestoLimitedStepQuery = window.matchMedia("(max-width: 1080px), (pointer: coarse)");
let scrollMotionFrame = null;
let manifestoSnapFrame = null;
let manifestoSettledStage = -1;
let manifestoAnimatedStage = null;
let manifestoTouchStartY = null;
let manifestoTouchStartX = null;
let manifestoSnapCooldownUntil = 0;
let manifestoWheelGestureTimer = null;
let manifestoWheelGestureLocked = false;
let manifestoTouchGestureTimer = null;
let manifestoTouchGestureLocked = false;
let manifestoSettleTimer = null;
let manifestoImagesReady = manifestoImages.length === 0;
let manifestoCopyStopSettled = false;
let nativeManifestoStepLocked = false;
let nativeManifestoStepLockTimer = null;

function shouldUseNativeManifestoScroll() {
  return true;
}

function shouldLimitManifestoToSingleStep() {
  return true;
}

function getManifestoSnapCooldown() {
  return shouldLimitManifestoToSingleStep() ? MANIFESTO_LIMITED_SNAP_COOLDOWN : MANIFESTO_SNAP_COOLDOWN;
}

function getManifestoSnapDuration() {
  return shouldLimitManifestoToSingleStep() ? MANIFESTO_LIMITED_SNAP_DURATION : MANIFESTO_SNAP_DURATION;
}

function getManifestoWheelGestureIdle() {
  return shouldLimitManifestoToSingleStep() ? MANIFESTO_LIMITED_WHEEL_GESTURE_IDLE : MANIFESTO_WHEEL_GESTURE_IDLE;
}

function getManifestoTouchGestureIdle() {
  return shouldLimitManifestoToSingleStep() ? MANIFESTO_LIMITED_TOUCH_GESTURE_IDLE : MANIFESTO_TOUCH_GESTURE_IDLE;
}

function animatePageScrollTo(targetY, duration = 680, onFinish) {
  if (heroStripSnapFrame) cancelAnimationFrame(heroStripSnapFrame);

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
  const documentHeight = Math.max(document.documentElement.scrollHeight, body?.scrollHeight || 0);
  const maxScroll = Math.max(0, documentHeight - viewportHeight);
  const startY = window.scrollY || 0;
  const clampedTarget = Math.min(Math.max(targetY, 0), maxScroll);
  const distance = clampedTarget - startY;
  const startedAt = performance.now();

  const tick = (now) => {
    const progress = clamp01((now - startedAt) / duration);
    window.scrollTo(0, startY + distance * smoothSnapEase(progress));
    requestScrollMotion();

    if (progress < 1) {
      heroStripSnapFrame = requestAnimationFrame(tick);
      return;
    }

    heroStripSnapFrame = null;
    window.scrollTo(0, clampedTarget);
    onFinish?.();
    requestScrollMotion();
  };

  heroStripSnapFrame = requestAnimationFrame(tick);
}

function getHeroStripStopScroll() {
  if (!heroStrip) return null;
  const rect = heroStrip.getBoundingClientRect();
  const scrollY = window.scrollY || 0;
  const stripTop = scrollY + rect.top;
  const headerHeight = header ? Math.ceil(header.offsetHeight || header.getBoundingClientRect().height || 64) : 64;
  return Math.max(0, stripTop - headerHeight - 10);
}

function shouldStopAtHeroStrip(direction) {
  if (!heroStrip || direction <= 0 || heroStripInputLocked || heroStripSnapFrame || manifestoSnapFrame) {
    return false;
  }

  const targetY = getHeroStripStopScroll();
  if (targetY === null) return false;

  const scrollY = window.scrollY || 0;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
  if (scrollY < Math.max(0, targetY - viewportHeight * 0.7)) {
    heroStripStopSettled = false;
  }

  if (heroStripStopSettled) return false;

  return scrollY < targetY - 8 && scrollY > targetY - viewportHeight * 1.35;
}

function snapToHeroStripStop() {
  const targetY = getHeroStripStopScroll();
  if (targetY === null) return false;

  heroStripInputLocked = true;
  animatePageScrollTo(targetY, 720, () => {
    heroStripStopSettled = true;
    window.setTimeout(() => {
      heroStripInputLocked = false;
    }, 260);
  });
  return true;
}

function getManifestoLanguage(language = document.documentElement.lang || getLocalPreference("ceylon-language", "en")) {
  const normalized = String(language || "en").slice(0, 2).toLowerCase();
  return manifestoTranslations[normalized] ? normalized : "en";
}

function collectManifestoWords() {
  manifestoHeadingWords = Array.from(document.querySelectorAll(".manifesto-copy h2.scroll-highlight .highlight-word"));
  manifestoBodyWords = Array.from(document.querySelectorAll(".manifesto-copy .manifesto-body .highlight-word"));
  manifestoWords = [...manifestoHeadingWords, ...manifestoBodyWords];
}

function renderManifestoWords(container, text) {
  if (!container) return;
  container.replaceChildren();
  text.split(/\s+/).filter(Boolean).forEach((wordText) => {
    const word = document.createElement("span");
    word.className = "highlight-word";
    word.textContent = wordText;
    word.dataset.highlightText = wordText;
    container.append(word, document.createTextNode(" "));
  });
}

function refreshManifestoHighlightText() {
  manifestoWords.forEach((word) => {
    const translatedText = word.textContent.replace(/\s+/g, " ").trim();
    if (translatedText) word.dataset.highlightText = translatedText;
  });
}

function applyManifestoLanguage(language = document.documentElement.lang || getLocalPreference("ceylon-language", "en")) {
  if (!manifestoCopy) return;
  const copy = manifestoTranslations[getManifestoLanguage(language)] || manifestoTranslations.en;
  const kicker = manifestoCopy.querySelector(".kicker");
  const heading = manifestoCopy.querySelector("h2.scroll-highlight");
  const bodyText = manifestoCopy.querySelector(".manifesto-body.scroll-highlight");

  if (kicker) kicker.textContent = copy.kicker;
  if (heading) {
    heading.setAttribute("aria-label", copy.heading);
    renderManifestoWords(heading, copy.heading);
  }
  if (bodyText) {
    bodyText.setAttribute("aria-label", copy.body);
    renderManifestoWords(bodyText, copy.body);
  }

  collectManifestoWords();
  refreshManifestoHighlightText();
  requestScrollMotion();
}

function scheduleManifestoHighlightTextRefresh(language) {
  applyManifestoLanguage(language);
  window.setTimeout(() => applyManifestoLanguage(language), 250);
  window.setTimeout(() => applyManifestoLanguage(language), 900);
}

applyManifestoLanguage();
document.addEventListener("ceylon:languagechange", (event) => {
  scheduleManifestoHighlightTextRefresh(event.detail?.language);
});

if (manifestoImages.length) {
  const waitForManifestoImage = (image) => {
    if (image.complete && image.naturalWidth > 0) {
      return image.decode ? image.decode().catch(() => undefined) : Promise.resolve();
    }

    return new Promise((resolve) => {
      image.addEventListener("load", resolve, { once: true });
      image.addEventListener("error", resolve, { once: true });
    }).then(() => (image.decode ? image.decode().catch(() => undefined) : undefined));
  };

  const revealManifestoImages = () => {
    if (manifestoImagesReady) return;
    manifestoImagesReady = true;
    document.documentElement.classList.add("manifesto-images-ready");
    requestScrollMotion();
  };

  manifestoImages.forEach((image, index) => {
    image.loading = "eager";
    image.decoding = "async";
    image.fetchPriority = index < 3 ? "high" : "auto";
  });

  Promise.all(manifestoImages.map(waitForManifestoImage)).then(() => {
    revealManifestoImages();
    requestScrollMotion();
  });
}

parallaxTargets.forEach((target) => {
  target.classList.add("parallax-target");
});

function getParallaxDepth(target) {
  if (target.classList.contains("cinema-stage")) return 58;
  if (target.classList.contains("photo-tile")) return target.classList.contains("tall") ? 52 : 34;
  if (target.classList.contains("route-card")) return 28;
  if (target.classList.contains("cta-band")) return 32;
  return 24;
}

function applyManifestoWordSweep(words, progress, startAt, endAt) {
  const count = Math.max(words.length - 1, 1);
  const localProgress = clamp01((progress - startAt) / Math.max(endAt - startAt, 0.01));
  words.forEach((word, index) => {
    const start = (index / count) * 0.74;
    const wordProgress = smoothStep((localProgress - start) / 0.2);
    word.style.setProperty("--word-progress", wordProgress.toFixed(4));
  });
}

function getManifestoMotionMetrics() {
  if (!manifestoSection || !manifestoTiles.length) return null;

  const rect = manifestoSection.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
  const mobileManifest = window.matchMedia("(max-width: 1080px)").matches;
  const stickyOffset = mobileManifest ? 0 : Math.min(112, Math.max(76, viewportHeight * 0.1));
  const travel = Math.max(rect.height - viewportHeight, 1);
  const sectionTop = window.scrollY + rect.top;
  const progress = clamp01((stickyOffset - rect.top) / travel);
  const maxStage = Math.max(manifestoTiles.length - 1, 1);

  return {
    progress,
    sectionTop,
    stickyOffset,
    travel,
    maxStage,
    mobileManifest,
    rectTop: rect.top,
    rectBottom: rect.bottom,
    viewportHeight,
  };
}

function getManifestoScrollForProgress(progress, metrics) {
  return metrics.sectionTop - metrics.stickyOffset + clamp01(progress) * metrics.travel;
}

function getManifestoSlideStage(progress, maxStage) {
  return -1 + clamp01((progress - MANIFESTO_SLIDE_START) / MANIFESTO_SLIDE_LENGTH) * (maxStage + 1);
}

function getEasedManifestoStage(stage, maxStage) {
  const clampedStage = Math.min(maxStage, Math.max(-1, stage));
  if (clampedStage >= maxStage) return maxStage;

  const stageBase = Math.min(Math.floor(clampedStage), maxStage - 1);
  return stageBase + smoothSnapEase(clampedStage - stageBase);
}

function getManifestoProgressForStage(stage, maxStage) {
  const clampedStage = Math.min(maxStage, Math.max(-1, stage));
  if (clampedStage <= -1) return MANIFESTO_COPY_REST_PROGRESS;
  return MANIFESTO_SLIDE_START + ((clampedStage + 1) / Math.max(maxStage + 1, 1)) * MANIFESTO_SLIDE_LENGTH;
}

function getSettledManifestoStage(maxStage) {
  return Math.min(maxStage, Math.max(-1, Math.round(manifestoSettledStage)));
}

function guardHeroStripScrollStop(direction) {
  return false;
}

function guardManifestoStepLimit(direction) {
  if (shouldUseNativeManifestoScroll() || !shouldLimitManifestoToSingleStep() || !manifestoSection || reducedMotionQuery.matches || manifestoSnapFrame || heroStripSnapFrame) {
    return false;
  }

  const metrics = getManifestoMotionMetrics();
  if (!isManifestoSequenceZone(metrics, direction)) return false;

  const currentStage = getManifestoSlideStage(metrics.progress, metrics.maxStage);
  const settledStage = getSettledManifestoStage(metrics.maxStage);
  let targetStage = null;

  if (direction > 0 && !manifestoCopyStopSettled && metrics.progress < MANIFESTO_SLIDE_START + 0.18) {
    targetStage = -1;
  } else if (direction > 0 && currentStage > settledStage + 0.62) {
    targetStage = Math.min(metrics.maxStage, settledStage + 1);
  } else if (direction < 0 && currentStage < settledStage - 0.62) {
    targetStage = Math.max(-1, settledStage - 1);
  }

  if (targetStage === null) return false;

  const targetProgress = getManifestoProgressForStage(targetStage, metrics.maxStage);
  const targetY = getManifestoScrollForProgress(targetProgress, metrics);
  manifestoWheelGestureLocked = true;
  manifestoTouchGestureLocked = true;
  animateManifestoScrollTo(targetY, targetStage);
  releaseManifestoWheelGesture(getManifestoWheelGestureIdle());
  releaseManifestoTouchGesture(getManifestoTouchGestureIdle());
  return true;
}

function animateManifestoScrollTo(targetY, targetStage, forceNativeSnap = false, durationOverride = null) {
  if (shouldUseNativeManifestoScroll() && !forceNativeSnap) return;
  if (manifestoSnapFrame) cancelAnimationFrame(manifestoSnapFrame);
  if (manifestoSettleTimer) {
    window.clearTimeout(manifestoSettleTimer);
    manifestoSettleTimer = null;
  }

  const startY = window.scrollY || 0;
  const distance = targetY - startY;
  const startedAt = performance.now();
  const duration = Number.isFinite(durationOverride) ? durationOverride : getManifestoSnapDuration();
  const lenis = window.ceylonLenis;
  const metrics = getManifestoMotionMetrics();
  const startStage = metrics
    ? getEasedManifestoStage(getManifestoSlideStage(metrics.progress, metrics.maxStage), metrics.maxStage)
    : manifestoSettledStage;

  document.documentElement.classList.add("manifesto-snapping");
  lenis?.stop?.();

  const tick = (now) => {
    const progress = clamp01((now - startedAt) / duration);
    const eased = smoothSnapEase(progress);
    manifestoAnimatedStage = lerp(startStage, targetStage, eased);
    window.scrollTo(0, startY + distance * eased);
    requestScrollMotion();

    if (progress < 1) {
      manifestoSnapFrame = requestAnimationFrame(tick);
      return;
    }

    manifestoSnapFrame = null;
    manifestoAnimatedStage = null;
    manifestoSettledStage = targetStage;
    if (targetStage === -1) manifestoCopyStopSettled = true;
    if (forceNativeSnap) {
      nativeManifestoStepLocked = false;
      if (nativeManifestoStepLockTimer) {
        window.clearTimeout(nativeManifestoStepLockTimer);
        nativeManifestoStepLockTimer = null;
      }
    }
    manifestoSnapCooldownUntil = performance.now() + getManifestoSnapCooldown();
    window.scrollTo(0, targetY);
    lenis?.start?.();
    document.documentElement.classList.remove("manifesto-snapping");
    requestScrollMotion();
  };

  manifestoSnapFrame = requestAnimationFrame(tick);
}

function isNativeManifestoSlideZone(metrics = getManifestoMotionMetrics()) {
  if (!shouldUseNativeManifestoScroll() || !metrics || reducedMotionQuery.matches) return false;

  const stickySceneActive =
    metrics.rectBottom > metrics.stickyOffset + 18 &&
    metrics.rectTop <= metrics.stickyOffset + 4 &&
    metrics.rectTop > -metrics.travel - metrics.viewportHeight * 0.2;

  return (
    stickySceneActive &&
    metrics.progress >= MANIFESTO_COPY_REST_PROGRESS - 0.02 &&
    metrics.progress <= MANIFESTO_SLIDE_END + 0.035
  );
}

function shouldCatchNativeManifestoSlideEntry(metrics, direction, scrollDelta = 0) {
  if (!shouldUseNativeManifestoScroll() || !metrics || reducedMotionQuery.matches || direction <= 0) return false;

  const stickySceneActive =
    metrics.rectBottom > metrics.stickyOffset + 18 &&
    metrics.rectTop <= metrics.stickyOffset + 4 &&
    metrics.rectTop > -metrics.travel - metrics.viewportHeight * 0.2;
  if (!stickySceneActive || metrics.progress >= MANIFESTO_COPY_REST_PROGRESS - 0.02) return false;

  const projectedProgress = metrics.progress + Math.abs(scrollDelta) / Math.max(metrics.travel, 1);
  return projectedProgress >= MANIFESTO_COPY_REST_PROGRESS - 0.02;
}

function getNativeManifestoTargetStage(direction, metrics) {
  const currentStage = getManifestoSlideStage(metrics.progress, metrics.maxStage);
  const stageCursor = manifestoAnimatedStage === null ? currentStage : manifestoAnimatedStage;

  if (direction > 0) {
    if (stageCursor >= metrics.maxStage - 0.08) return null;
    if (stageCursor < -0.5) return 0;
    return Math.min(metrics.maxStage, Math.round(stageCursor) + 1);
  }

  if (direction < 0) {
    if (stageCursor <= -0.86) return null;
    if (stageCursor <= 0.42) return -1;
    return Math.max(0, Math.round(stageCursor) - 1);
  }

  return null;
}

function snapNativeManifestoSlide(direction, forcedTargetStage = null) {
  const metrics = getManifestoMotionMetrics();
  if (!isNativeManifestoSlideZone(metrics) && forcedTargetStage === null) return false;

  const targetStage = forcedTargetStage === null ? getNativeManifestoTargetStage(direction, metrics) : forcedTargetStage;
  if (targetStage === null) return false;

  const targetProgress = getManifestoProgressForStage(targetStage, metrics.maxStage);
  const targetY = getManifestoScrollForProgress(targetProgress, metrics);
  animateManifestoScrollTo(targetY, targetStage, true, 720);
  return true;
}

function isNativeManifestoStepLocked() {
  return manifestoSnapFrame || nativeManifestoStepLocked;
}

function lockNativeManifestoStep() {
  nativeManifestoStepLocked = true;
  if (nativeManifestoStepLockTimer) window.clearTimeout(nativeManifestoStepLockTimer);
  nativeManifestoStepLockTimer = window.setTimeout(() => {
    nativeManifestoStepLocked = false;
    nativeManifestoStepLockTimer = null;
  }, 940);
}

function snapManifestoSlide(direction) {
  if (shouldUseNativeManifestoScroll()) return false;
  if (!manifestoSection || reducedMotionQuery.matches) return false;
  if (manifestoSnapFrame) return true;
  if (performance.now() < manifestoSnapCooldownUntil) return true;

  const metrics = getManifestoMotionMetrics();
  if (!metrics) return false;

  if (!isManifestoSequenceZone(metrics, direction)) return false;

  const currentStage = getManifestoSlideStage(metrics.progress, metrics.maxStage);
  const roundedStage = Math.min(metrics.maxStage, Math.max(-1, Math.round(currentStage)));
  if (Math.abs(currentStage - roundedStage) < 0.16 || currentStage < -0.55 || currentStage > metrics.maxStage - 0.16) {
    manifestoSettledStage = roundedStage;
  }

  let targetStage = null;
  const stageCursor = manifestoAnimatedStage === null ? currentStage : manifestoAnimatedStage;
  const nearestStage = Math.min(metrics.maxStage, Math.max(-1, Math.round(stageCursor)));
  const isNearSettledStage = Math.abs(stageCursor - nearestStage) < 0.12;

  if (direction > 0) {
    if (!manifestoCopyStopSettled && metrics.progress < MANIFESTO_SLIDE_START + 0.18) {
      targetStage = -1;
    } else if (metrics.progress < MANIFESTO_SLIDE_START - 0.012) {
      targetStage = 0;
    } else if (isNearSettledStage && nearestStage >= 0) {
      targetStage = Math.min(metrics.maxStage, nearestStage + 1);
    } else {
      targetStage = Math.min(metrics.maxStage, Math.max(0, Math.floor(stageCursor) + 1));
      if (targetStage <= stageCursor && Math.abs(targetStage - stageCursor) < 0.04) {
        targetStage = Math.min(metrics.maxStage, targetStage + 1);
      }
    }

    if (targetStage > metrics.maxStage || stageCursor >= metrics.maxStage - 0.04) {
      return false;
    }
  } else if (direction < 0) {
    if (metrics.progress >= 1 && metrics.rectBottom < metrics.viewportHeight * 0.28) {
      targetStage = metrics.maxStage;
    } else if (metrics.progress > MANIFESTO_SLIDE_END + 0.025) {
      targetStage = metrics.maxStage;
    } else if (stageCursor <= 0.08 || metrics.progress < MANIFESTO_SLIDE_START + 0.03) {
      targetStage = -1;
    } else {
      targetStage = Math.max(-1, Math.min(metrics.maxStage - 1, Math.ceil(stageCursor) - 1));
      if (targetStage >= stageCursor && Math.abs(targetStage - stageCursor) < 0.04) {
        targetStage = Math.max(-1, targetStage - 1);
      }
    }

    if (targetStage < -1 || stageCursor <= -1 + 0.04) {
      return false;
    }
  }

  if (targetStage === null) return false;

  const targetProgress = getManifestoProgressForStage(targetStage, metrics.maxStage);
  const targetY = getManifestoScrollForProgress(targetProgress, metrics);
  animateManifestoScrollTo(targetY, targetStage);
  return true;
}

function isManifestoSequenceZone(metrics = getManifestoMotionMetrics(), direction = 0) {
  if (!metrics) return false;
  const stickySceneActive =
    metrics.rectBottom > metrics.stickyOffset + 18 &&
    metrics.rectTop < metrics.viewportHeight;
  const inSlideZone =
    stickySceneActive &&
    metrics.progress >= MANIFESTO_SNAP_ENTRY_START &&
    metrics.progress <= MANIFESTO_SLIDE_END + 0.025;
  const approachReach = shouldLimitManifestoToSingleStep() ? 1.65 : 1.15;
  const enteringFromAbove =
    direction > 0 &&
    metrics.progress < MANIFESTO_SNAP_ENTRY_START &&
    metrics.rectTop > metrics.stickyOffset &&
    metrics.rectTop < metrics.viewportHeight * approachReach &&
    metrics.rectBottom > metrics.viewportHeight * 0.4;
  const enteringFromBelow =
    direction < 0 &&
    metrics.progress > MANIFESTO_SLIDE_END &&
    metrics.rectBottom >= metrics.viewportHeight * 0.28 &&
    metrics.rectTop < metrics.viewportHeight * 0.65;
  const approachingFromBelow =
    direction < 0 &&
    metrics.progress > MANIFESTO_SLIDE_END &&
    metrics.rectBottom < metrics.viewportHeight &&
    metrics.rectBottom > -metrics.viewportHeight * approachReach &&
    metrics.rectTop < metrics.viewportHeight;

  return inSlideZone || enteringFromAbove || enteringFromBelow || approachingFromBelow;
}

function isManifestoAutoSettleZone(metrics = getManifestoMotionMetrics()) {
  if (!metrics || !isManifestoSequenceZone(metrics, 0)) return false;

  const currentStage = getManifestoSlideStage(metrics.progress, metrics.maxStage);
  const finalStopProgress = getManifestoProgressForStage(metrics.maxStage, metrics.maxStage);

  return (
    metrics.progress > MANIFESTO_SLIDE_START + 0.015 &&
    metrics.progress < finalStopProgress - 0.045 &&
    currentStage > -0.72 &&
    currentStage < metrics.maxStage - 0.18 &&
    metrics.rectBottom > metrics.viewportHeight * 0.44
  );
}

function getManifestoNearestStage(metrics) {
  const currentStage = getManifestoSlideStage(metrics.progress, metrics.maxStage);
  return Math.min(metrics.maxStage, Math.max(-1, Math.round(currentStage)));
}

function isManifestoBoundaryExit(metrics, direction) {
  if (!metrics || !direction) return false;

  const currentStage = getManifestoSlideStage(metrics.progress, metrics.maxStage);
  const firstStopProgress = getManifestoProgressForStage(-1, metrics.maxStage);
  const finalStopProgress = getManifestoProgressForStage(metrics.maxStage, metrics.maxStage);

  if (direction < 0) {
    return metrics.progress <= firstStopProgress + 0.018 && currentStage <= -0.92;
  }

  return metrics.progress >= finalStopProgress - 0.018 && currentStage >= metrics.maxStage - 0.08;
}

function getManifestoBoundaryExitScroll(metrics, direction) {
  const documentHeight = Math.max(document.documentElement.scrollHeight, body?.scrollHeight || 0);
  const maxScroll = Math.max(0, documentHeight - metrics.viewportHeight);

  if (direction < 0) {
    return Math.max(0, metrics.sectionTop - Math.max(420, metrics.viewportHeight * 0.72));
  }

  return Math.min(maxScroll, metrics.sectionTop + manifestoSection.offsetHeight - metrics.stickyOffset + 2);
}

function animateManifestoBoundaryExit(metrics, direction) {
  const targetStage = direction < 0 ? -1 : metrics.maxStage;
  const targetY = getManifestoBoundaryExitScroll(metrics, direction);
  animateManifestoScrollTo(targetY, targetStage);
}

function settleManifestoSequence() {
  manifestoSettleTimer = null;
  if (shouldUseNativeManifestoScroll()) return;
  if (
    !manifestoSection ||
    reducedMotionQuery.matches ||
    manifestoSnapFrame ||
    manifestoWheelGestureLocked ||
    manifestoTouchGestureLocked
  ) {
    return;
  }
  if (performance.now() < manifestoSnapCooldownUntil) return;

  const metrics = getManifestoMotionMetrics();
  if (!isManifestoAutoSettleZone(metrics)) return;

  const currentStage = getManifestoSlideStage(metrics.progress, metrics.maxStage);
  const targetStage = getManifestoNearestStage(metrics);
  if (Math.abs(currentStage - targetStage) < 0.08) {
    manifestoSettledStage = targetStage;
    return;
  }

  const targetProgress = getManifestoProgressForStage(targetStage, metrics.maxStage);
  const targetY = getManifestoScrollForProgress(targetProgress, metrics);
  animateManifestoScrollTo(targetY, targetStage);
}

function requestManifestoSettle() {
  if (shouldUseNativeManifestoScroll()) return;
  if (
    !manifestoSection ||
    reducedMotionQuery.matches ||
    manifestoSnapFrame ||
    manifestoWheelGestureLocked ||
    manifestoTouchGestureLocked
  ) {
    return;
  }
  if (manifestoSettleTimer) window.clearTimeout(manifestoSettleTimer);
  manifestoSettleTimer = window.setTimeout(settleManifestoSequence, MANIFESTO_SETTLE_DELAY);
}

function releaseManifestoWheelGesture(delay = getManifestoWheelGestureIdle()) {
  if (manifestoWheelGestureTimer) window.clearTimeout(manifestoWheelGestureTimer);
  manifestoWheelGestureTimer = window.setTimeout(() => {
    if (shouldLimitManifestoToSingleStep() && (manifestoSnapFrame || performance.now() < manifestoSnapCooldownUntil)) {
      releaseManifestoWheelGesture(Math.max(180, getManifestoWheelGestureIdle() * 0.45));
      return;
    }

    manifestoWheelGestureLocked = false;
    manifestoWheelGestureTimer = null;
    requestManifestoSettle();
  }, delay);
}

function releaseManifestoTouchGesture(delay = getManifestoTouchGestureIdle()) {
  if (shouldLimitManifestoToSingleStep() && delay > 0 && manifestoTouchStartY !== null) return;
  if (manifestoTouchGestureTimer) window.clearTimeout(manifestoTouchGestureTimer);
  manifestoTouchGestureTimer = window.setTimeout(() => {
    manifestoTouchGestureLocked = false;
    manifestoTouchGestureTimer = null;
    requestManifestoSettle();
  }, delay);
}

function updateManifestoMotion() {
  if (!manifestoSection || reducedMotionQuery.matches) {
    manifestoWords.forEach((word) => word.style.setProperty("--word-progress", "1"));
    manifestoCopy?.style.setProperty("--manifest-copy-opacity", "1");
    manifestoCopy?.style.setProperty("--manifest-copy-x", "0px");
    manifestoCopy?.style.setProperty("--manifest-copy-y", "0px");
    manifestoPhotoFrame?.style.setProperty("--manifest-photo-opacity", "1");
    manifestoTiles.forEach((tile) => {
      tile.style.setProperty("--manifest-tile-x", "0px");
      tile.style.setProperty("--manifest-tile-y", "0px");
      tile.style.setProperty("--manifest-image-y", "0px");
      tile.style.setProperty("--manifest-tile-opacity", "1");
      tile.style.setProperty("--manifest-tile-scale", "1");
      tile.style.setProperty("--manifest-tile-z", "1");
    });
    manifestoSlideTitles.forEach((title, index) => {
      title.style.setProperty("--manifest-title-opacity", index === 0 ? "1" : "0");
      title.style.setProperty("--manifest-title-x", "0px");
      title.style.setProperty("--manifest-title-y", "0px");
      title.style.setProperty("--manifest-title-clip-top", "0%");
      title.style.setProperty("--manifest-title-clip-bottom", "0%");
    });
    return;
  }

  const metrics = getManifestoMotionMetrics();
  if (!metrics) return;
  if (metrics.rectTop > metrics.viewportHeight * 0.72) {
    manifestoCopyStopSettled = false;
  }
  const sectionProgress = metrics.progress;

  applyManifestoWordSweep(manifestoHeadingWords, sectionProgress, 0.04, 0.3);
  applyManifestoWordSweep(manifestoBodyWords, sectionProgress, 0.26, 0.52);

  const tileCount = Math.max(manifestoTiles.length, 1);
  const maxStage = Math.max(tileCount - 1, 1);
  const currentStage = getManifestoSlideStage(sectionProgress, maxStage);
  const stage = manifestoAnimatedStage === null ? getEasedManifestoStage(currentStage, maxStage) : manifestoAnimatedStage;
  const copyExit = smoothSnapEase((sectionProgress - 0.52) / 0.14);
  const photoStageProgress = smoothSnapEase((stage + 1) / MANIFESTO_PHOTO_FADE_STAGE);

  manifestoCopy?.style.setProperty("--manifest-copy-opacity", "1");
  manifestoCopy?.style.setProperty("--manifest-copy-x", `${lerp(0, -window.innerWidth, manifestoImagesReady ? copyExit : 0).toFixed(2)}px`);
  manifestoCopy?.style.setProperty("--manifest-copy-y", "0px");
  manifestoPhotoFrame?.style.setProperty("--manifest-photo-opacity", (manifestoImagesReady ? photoStageProgress : 0).toFixed(4));

  if (!manifestoImagesReady) {
    manifestoTiles.forEach((tile) => {
      tile.style.setProperty("--manifest-tile-x", "0%");
      tile.style.setProperty("--manifest-tile-y", "0px");
      tile.style.setProperty("--manifest-image-y", "0px");
      tile.style.setProperty("--manifest-tile-opacity", "0");
      tile.style.setProperty("--manifest-tile-scale", "1");
      tile.style.setProperty("--manifest-tile-z", "1");
    });
    manifestoSlideTitles.forEach((title) => {
      title.style.setProperty("--manifest-title-opacity", "0");
    });
    return;
  }

  const roundedStage = Math.min(maxStage, Math.max(-1, Math.round(currentStage)));
  const settledDelta = Math.abs(roundedStage - getSettledManifestoStage(maxStage));
  if (!manifestoSnapFrame && Math.abs(currentStage - roundedStage) < 0.08 && (!shouldLimitManifestoToSingleStep() || settledDelta <= 1)) {
    manifestoSettledStage = roundedStage;
  }

  manifestoTiles.forEach((tile, index) => {
    const tileX = (index - stage) * 100;
    const tileOpacity = tileX > -104 && tileX < 104 ? 1 : 0;
    const nearestStage = Math.min(maxStage, Math.max(0, Math.round(stage)));
    const tileZ = Math.max(1, tileCount - Math.abs(index - nearestStage));

    tile.style.setProperty("--manifest-tile-x", `${tileX.toFixed(2)}%`);
    tile.style.setProperty("--manifest-tile-y", "0px");
    tile.style.setProperty("--manifest-image-y", "0px");
    tile.style.setProperty("--manifest-tile-opacity", tileOpacity.toFixed(4));
    tile.style.setProperty("--manifest-tile-scale", "1");
    tile.style.setProperty("--manifest-tile-z", `${tileZ}`);
  });

  manifestoSlideTitles.forEach((title, index) => {
    const titleDelta = index - stage;
    const titleDistance = Math.abs(titleDelta);
    const titleReveal = 1 - smoothSnapEase((titleDistance - 0.02) / 0.24);
    const titleDirection = Math.max(-1, Math.min(1, titleDelta));
    const titleYOffset = titleDirection * 34;
    const titleClipTop = titleDelta > 0 ? lerp(86, 0, titleReveal) : 0;
    const titleClipBottom = titleDelta < 0 ? lerp(86, 0, titleReveal) : 0;

    title.style.setProperty("--manifest-title-opacity", titleReveal.toFixed(4));
    title.style.setProperty("--manifest-title-x", "0px");
    title.style.setProperty("--manifest-title-y", `${titleYOffset.toFixed(2)}px`);
    title.style.setProperty("--manifest-title-clip-top", `${titleClipTop.toFixed(2)}%`);
    title.style.setProperty("--manifest-title-clip-bottom", `${titleClipBottom.toFixed(2)}%`);
  });
}

function handleManifestoWheel(event) {
  if (shouldUseNativeManifestoScroll()) return;
  if (Math.abs(event.deltaY) < 8 || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
  const direction = event.deltaY > 0 ? 1 : -1;
  if (shouldStopAtHeroStrip(direction)) {
    event.preventDefault();
    event.stopImmediatePropagation();
    snapToHeroStripStop();
    return;
  }

  const metrics = getManifestoMotionMetrics();
  if (!isManifestoSequenceZone(metrics, direction) && !manifestoSnapFrame) return;
  if (!manifestoSnapFrame && isManifestoBoundaryExit(metrics, direction)) {
    event.preventDefault();
    event.stopImmediatePropagation();
    releaseManifestoWheelGesture();
    if (manifestoWheelGestureLocked || performance.now() < manifestoSnapCooldownUntil) return;
    manifestoWheelGestureLocked = true;
    animateManifestoBoundaryExit(metrics, direction);
    return;
  }

  event.preventDefault();
  event.stopImmediatePropagation();
  releaseManifestoWheelGesture();

  if (manifestoWheelGestureLocked || manifestoSnapFrame || performance.now() < manifestoSnapCooldownUntil) return;

  const handled = snapManifestoSlide(direction);
  if (handled) {
    manifestoWheelGestureLocked = true;
  }
}

function handleNativeManifestoWheel(event) {
  if (Math.abs(event.deltaY) < 8 || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;

  const direction = event.deltaY > 0 ? 1 : -1;
  const metrics = getManifestoMotionMetrics();
  const shouldCatchEntry = shouldCatchNativeManifestoSlideEntry(metrics, direction, event.deltaY);
  if (!shouldCatchEntry && !isNativeManifestoSlideZone(metrics) && !manifestoSnapFrame) return;

  if (isNativeManifestoStepLocked()) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  if (!snapNativeManifestoSlide(direction, shouldCatchEntry ? 0 : null)) return;

  event.preventDefault();
  event.stopImmediatePropagation();
  lockNativeManifestoStep();
}

function handleHeroStripTouchStart(event) {
  const touch = event.touches?.[0];
  if (!touch) return;
  heroStripTouchStartY = touch.clientY;
  heroStripTouchStartX = touch.clientX;
}

function handleHeroStripTouchMove(event) {
  if (heroStripTouchStartY === null || heroStripTouchStartX === null) return;
  const touch = event.touches?.[0];
  if (!touch) return;

  const deltaY = heroStripTouchStartY - touch.clientY;
  const deltaX = heroStripTouchStartX - touch.clientX;
  if (Math.abs(deltaY) < 14 || Math.abs(deltaY) < Math.abs(deltaX) * 1.2) return;

  const direction = deltaY > 0 ? 1 : -1;
  if (!shouldStopAtHeroStrip(direction)) return;

  event.preventDefault();
  event.stopImmediatePropagation();
  heroStripTouchStartY = null;
  heroStripTouchStartX = null;
  snapToHeroStripStop();
}

function handleHeroStripTouchEnd() {
  heroStripTouchStartY = null;
  heroStripTouchStartX = null;
}

function handleManifestoKeydown(event) {
  const tagName = event.target?.tagName?.toLowerCase();
  if (tagName === "input" || tagName === "select" || tagName === "textarea" || event.target?.isContentEditable) return;

  const downKeys = ["ArrowDown", "PageDown", " "];
  const upKeys = ["ArrowUp", "PageUp"];
  const direction = downKeys.includes(event.key) ? 1 : upKeys.includes(event.key) ? -1 : 0;
  if (!direction) return;

  if (snapManifestoSlide(direction)) event.preventDefault();
}

function handleNativeManifestoKeydown(event) {
  const tagName = event.target?.tagName?.toLowerCase();
  if (tagName === "input" || tagName === "select" || tagName === "textarea" || event.target?.isContentEditable) return;

  const downKeys = ["ArrowDown", "PageDown", " "];
  const upKeys = ["ArrowUp", "PageUp"];
  const direction = downKeys.includes(event.key) ? 1 : upKeys.includes(event.key) ? -1 : 0;
  if (!direction) return;

  if (isNativeManifestoStepLocked()) {
    if (isNativeManifestoSlideZone()) event.preventDefault();
    return;
  }

  if (!snapNativeManifestoSlide(direction)) return;
  event.preventDefault();
  lockNativeManifestoStep();
}

function handleNativeManifestoTouchStart(event) {
  const touch = event.touches?.[0];
  if (!touch) return;
  manifestoTouchStartY = touch.clientY;
  manifestoTouchStartX = touch.clientX;
  if (!manifestoSnapFrame && performance.now() >= manifestoSnapCooldownUntil) {
    manifestoTouchGestureLocked = false;
    if (manifestoTouchGestureTimer) {
      window.clearTimeout(manifestoTouchGestureTimer);
      manifestoTouchGestureTimer = null;
    }
  }
}

function handleNativeManifestoTouchMove(event) {
  if (manifestoTouchStartY === null || manifestoTouchStartX === null) return;

  const touch = event.touches?.[0];
  if (!touch) return;

  const deltaY = manifestoTouchStartY - touch.clientY;
  const deltaX = manifestoTouchStartX - touch.clientX;
  if (Math.abs(deltaY) < 18 || Math.abs(deltaY) < Math.abs(deltaX) * 1.2) return;

  const direction = deltaY > 0 ? 1 : -1;
  const metrics = getManifestoMotionMetrics();
  const shouldCatchEntry = shouldCatchNativeManifestoSlideEntry(metrics, direction, deltaY);
  if (!shouldCatchEntry && !isNativeManifestoSlideZone(metrics) && !manifestoSnapFrame) return;

  event.preventDefault();
  event.stopImmediatePropagation();

  if (isNativeManifestoStepLocked() || manifestoTouchGestureLocked) {
    releaseManifestoTouchGesture(420);
    return;
  }

  if (Math.abs(deltaY) < 42) return;
  manifestoTouchGestureLocked = snapNativeManifestoSlide(direction, shouldCatchEntry ? 0 : null);
  if (manifestoTouchGestureLocked) lockNativeManifestoStep();
  releaseManifestoTouchGesture(420);
}

function handleNativeManifestoTouchEnd(event) {
  if (manifestoTouchStartY === null || manifestoTouchStartX === null) return;

  const touch = event.changedTouches?.[0];
  if (!touch) return;

  const deltaY = manifestoTouchStartY - touch.clientY;
  const deltaX = manifestoTouchStartX - touch.clientX;
  manifestoTouchStartY = null;
  manifestoTouchStartX = null;

  if (manifestoTouchGestureLocked) {
    releaseManifestoTouchGesture(420);
    return;
  }

  if (Math.abs(deltaY) < 34 || Math.abs(deltaY) < Math.abs(deltaX) * 1.2) return;
  const direction = deltaY > 0 ? 1 : -1;
  const metrics = getManifestoMotionMetrics();
  const shouldCatchEntry = shouldCatchNativeManifestoSlideEntry(metrics, direction, deltaY);
  if (!snapNativeManifestoSlide(direction, shouldCatchEntry ? 0 : null)) return;

  manifestoTouchGestureLocked = true;
  lockNativeManifestoStep();
  releaseManifestoTouchGesture(420);
}

function handleNativeManifestoTouchCancel() {
  manifestoTouchStartY = null;
  manifestoTouchStartX = null;
  releaseManifestoTouchGesture(0);
}

function handleManifestoTouchStart(event) {
  if (shouldUseNativeManifestoScroll()) return;
  const touch = event.touches?.[0];
  if (!touch) return;
  manifestoTouchStartY = touch.clientY;
  manifestoTouchStartX = touch.clientX;
  if (!manifestoSnapFrame && performance.now() >= manifestoSnapCooldownUntil) {
    manifestoTouchGestureLocked = false;
    if (manifestoTouchGestureTimer) {
      window.clearTimeout(manifestoTouchGestureTimer);
      manifestoTouchGestureTimer = null;
    }
  }
}

function handleManifestoTouchMove(event) {
  if (shouldUseNativeManifestoScroll()) return;
  if (manifestoTouchStartY === null || manifestoTouchStartX === null) return;

  const touch = event.touches?.[0];
  if (!touch) return;

  const deltaY = manifestoTouchStartY - touch.clientY;
  const deltaX = manifestoTouchStartX - touch.clientX;
  if (Math.abs(deltaY) < 16 || Math.abs(deltaY) < Math.abs(deltaX) * 1.2) return;

  const direction = deltaY > 0 ? 1 : -1;
  const metrics = getManifestoMotionMetrics();
  if (!isManifestoSequenceZone(metrics, direction) && !manifestoSnapFrame) return;
  if (!manifestoSnapFrame && isManifestoBoundaryExit(metrics, direction)) {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (manifestoTouchGestureLocked || performance.now() < manifestoSnapCooldownUntil) return;
    manifestoTouchGestureLocked = true;
    animateManifestoBoundaryExit(metrics, direction);
    releaseManifestoTouchGesture();
    return;
  }

  event.preventDefault();
  event.stopImmediatePropagation();
  if (manifestoTouchGestureLocked || manifestoSnapFrame || performance.now() < manifestoSnapCooldownUntil) return;
  if (Math.abs(deltaY) < 42) return;

  manifestoTouchGestureLocked = snapManifestoSlide(direction);
  releaseManifestoTouchGesture();
}

function handleManifestoTouchEnd(event) {
  if (shouldUseNativeManifestoScroll()) return;
  if (manifestoTouchStartY === null || manifestoTouchStartX === null) return;

  const touch = event.changedTouches?.[0];
  if (!touch) return;

  const deltaY = manifestoTouchStartY - touch.clientY;
  const deltaX = manifestoTouchStartX - touch.clientX;
  manifestoTouchStartY = null;
  manifestoTouchStartX = null;

  if (manifestoTouchGestureLocked) {
    releaseManifestoTouchGesture(shouldLimitManifestoToSingleStep() ? getManifestoTouchGestureIdle() : 0);
    return;
  }

  if (Math.abs(deltaY) < 34 || Math.abs(deltaY) < Math.abs(deltaX) * 1.2) return;
  if (snapManifestoSlide(deltaY > 0 ? 1 : -1)) {
    manifestoTouchGestureLocked = true;
    releaseManifestoTouchGesture(shouldLimitManifestoToSingleStep() ? getManifestoTouchGestureIdle() : 0);
  }
}

function handleManifestoTouchCancel() {
  if (shouldUseNativeManifestoScroll()) return;
  manifestoTouchStartY = null;
  manifestoTouchStartX = null;
  releaseManifestoTouchGesture(0);
}

function updateScrollMotion() {
  scrollMotionFrame = null;
  const currentScrollY = Math.max(0, window.scrollY || 0);
  const scrollDelta = currentScrollY - lastScrollGuardY;
  const scrollDirection = scrollDelta > 0.75 ? 1 : scrollDelta < -0.75 ? -1 : 0;
  lastScrollGuardY = currentScrollY;

  if (reducedMotionQuery.matches) {
    updateManifestoMotion();
    syncManifestoPhotoStageChrome(mobileHeaderQuery.matches && isHomeGalleryPhotoStageActive());
    return;
  }

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
  parallaxTargets.forEach((target) => {
    const rect = target.getBoundingClientRect();
    if (rect.bottom < -160 || rect.top > viewportHeight + 160) return;

    const centerOffset = rect.top + rect.height / 2 - viewportHeight / 2;
    const travel = viewportHeight + rect.height;
    const depth = getParallaxDepth(target);
    const y = clamp01(Math.abs(centerOffset / travel)) * depth * Math.sign(-centerOffset);
    target.style.setProperty("--parallax-y", `${y.toFixed(2)}px`);
  });

  if (guardHeroStripScrollStop(scrollDirection) || guardManifestoStepLimit(scrollDirection)) {
    return;
  }

  updateManifestoMotion();
  syncManifestoPhotoStageChrome(mobileHeaderQuery.matches && isHomeGalleryPhotoStageActive());
  requestManifestoSettle();
}

function requestScrollMotion() {
  if (scrollMotionFrame) return;
  scrollMotionFrame = requestAnimationFrame(updateScrollMotion);
}

requestScrollMotion();
if (!shouldUseNativeManifestoScroll()) {
  window.addEventListener("wheel", handleManifestoWheel, { passive: false, capture: true });
  window.addEventListener("keydown", handleManifestoKeydown);
  window.addEventListener("touchstart", handleHeroStripTouchStart, { passive: true, capture: true });
  window.addEventListener("touchmove", handleHeroStripTouchMove, { passive: false, capture: true });
  window.addEventListener("touchend", handleHeroStripTouchEnd, { passive: true, capture: true });
  window.addEventListener("touchcancel", handleHeroStripTouchEnd, { passive: true, capture: true });
  window.addEventListener("touchstart", handleManifestoTouchStart, { passive: true });
  window.addEventListener("touchmove", handleManifestoTouchMove, { passive: false, capture: true });
  window.addEventListener("touchend", handleManifestoTouchEnd, { passive: true });
  window.addEventListener("touchcancel", handleManifestoTouchCancel, { passive: true });
} else {
  window.addEventListener("wheel", handleNativeManifestoWheel, { passive: false, capture: true });
  window.addEventListener("keydown", handleNativeManifestoKeydown);
  window.addEventListener("touchstart", handleNativeManifestoTouchStart, { passive: true, capture: true });
  window.addEventListener("touchmove", handleNativeManifestoTouchMove, { passive: false, capture: true });
  window.addEventListener("touchend", handleNativeManifestoTouchEnd, { passive: true, capture: true });
  window.addEventListener("touchcancel", handleNativeManifestoTouchCancel, { passive: true, capture: true });
}
window.addEventListener("scroll", requestScrollMotion, { passive: true });
window.addEventListener("resize", requestScrollMotion, { passive: true });
window.addEventListener("load", requestScrollMotion, { once: true });
if (document.fonts) document.fonts.ready.then(requestScrollMotion);

const countEls = document.querySelectorAll("[data-count]");
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const duration = 950;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);

countEls.forEach((el) => countObserver.observe(el));

const bookingTranslations = {
  en: {
    pickup: "Pickup",
    dropoff: "Drop-off",
    estimate: "Estimate",
    totalEstimation: "Total Estimation",
    empty: "N/A",
    requestQuotation: "Request quotation",
    requestSent: "Request sent",
    travelers: (count) => `${count} traveler${count === 1 ? "" : "s"}`,
    days: (count) => `${count} day${count === 1 ? "" : "s"}`,
    routeDescriptions: [
      "A highland backroad journey through remote estate roads, waterfall country and dramatic mountain bends.",
      "A cooler central highlands route with misty roads, tea country, reservoirs and quiet village scenery.",
      "A coastal backroad experience built around salt flats, fishing villages, open skies and slow scenic stops.",
      "A flexible private loop shaped around your interests, pickup point, pace and the road conditions for your date."
    ]
  },
  fr: {
    pickup: "Prise en charge",
    dropoff: "Dépose",
    estimate: "Estimation",
    totalEstimation: "Estimation totale",
    empty: "N/A",
    requestQuotation: "Demander un devis",
    requestSent: "Demande envoyée",
    travelers: (count) => `${count} voyageur${count === 1 ? "" : "s"}`,
    days: (count) => `${count} jour${count === 1 ? "" : "s"}`,
    routeDescriptions: [
      "Un itinéraire de montagne par des routes de plantation isolées, des cascades et des virages spectaculaires.",
      "Un parcours plus frais dans les hauts plateaux, avec routes brumeuses, plantations de thé, réservoirs et villages calmes.",
      "Une route côtière lente autour des salines, des villages de pêcheurs, des grands ciels et des arrêts panoramiques.",
      "Une boucle privée flexible adaptée à vos centres d'intérêt, au lieu de prise en charge, au rythme et aux conditions de route."
    ]
  },
  de: {
    pickup: "Abholung",
    dropoff: "Zielort",
    estimate: "Schätzung",
    totalEstimation: "Gesamtschätzung",
    empty: "N/A",
    requestQuotation: "Angebot anfragen",
    requestSent: "Anfrage gesendet",
    travelers: (count) => `${count} Reisende${count === 1 ? "r" : ""}`,
    days: (count) => `${count} Tag${count === 1 ? "" : "e"}`,
    routeDescriptions: [
      "Eine Hochlandreise über abgelegene Plantagenstraßen, durch Wasserfallland und dramatische Bergkurven.",
      "Eine kühlere Route im zentralen Hochland mit nebligen Straßen, Teeland, Stauseen und ruhigen Dörfern.",
      "Eine Küstenroute mit Salzfeldern, Fischerdörfern, weitem Himmel und entspannten Aussichtspausen.",
      "Eine flexible private Runde, abgestimmt auf Interessen, Abholort, Tempo und Straßenbedingungen am Reisedatum."
    ]
  },
  ru: {
    pickup: "Место подачи",
    dropoff: "Место высадки",
    estimate: "Оценка",
    totalEstimation: "Общая оценка",
    empty: "N/A",
    requestQuotation: "Запросить расчет",
    requestSent: "Запрос отправлен",
    travelers: (count) => `${count} ${count === 1 ? "путешественник" : "путешественника"}`,
    days: (count) => `${count} ${count === 1 ? "день" : "дня"}`,
    routeDescriptions: [
      "Горный маршрут по удаленным дорогам плантаций, краю водопадов и выразительным серпантинам.",
      "Более прохладный маршрут по центральному нагорью с туманными дорогами, чайными пейзажами, водохранилищами и тихими деревнями.",
      "Прибрежный маршрут среди солончаков, рыбацких деревень, открытого неба и неспешных живописных остановок.",
      "Гибкая частная петля под ваши интересы, место подачи, темп поездки и дорожные условия на выбранную дату."
    ]
  }
};

function getBookingCopy() {
  const language = (document.documentElement.lang || getLocalPreference("ceylon-language", "en") || "en").slice(0, 2);
  return bookingTranslations[language] || bookingTranslations.en;
}

function formatBookingLkrAmount(amountLkr, currency = activeCurrency) {
  const normalizedCurrency = currencyRates[currency] ? currency : "USD";
  const config = currencyRates[normalizedCurrency] || currencyRates.USD;
  const symbol = currencySymbols[normalizedCurrency] || currencySymbols.USD;
  const convertedAmount = amountLkr * config.rate;
  const formattedNumber = new Intl.NumberFormat(symbol.locale, {
    maximumFractionDigits: 0
  }).format(convertedAmount);

  return {
    code: normalizedCurrency,
    text: `${symbol.prefix}${formattedNumber}`
  };
}

function getRequiredBookingVehicles(travelerCount) {
  if (travelerCount <= 5) return 1;
  if (travelerCount <= 9) return 2;
  return 3 + Math.floor((travelerCount - 10) / 8);
}

function clampBookingQuantity(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function readBookingQuantity(input) {
  if (!input) return 0;
  const min = Number(input.min || 0);
  const max = Number(input.max || 99);
  const fallback = Number(input.dataset.default || min);
  const match = String(input.value || "").match(/\d+/);
  const rawValue = match ? Number(match[0]) : fallback;
  const nextValue = Number.isFinite(rawValue) ? rawValue : fallback;
  return clampBookingQuantity(Math.round(nextValue), min, max);
}

function initBookingQuantityInput(input, singularLabel, pluralLabel) {
  if (!input) return null;

  const format = (count) => `${count} ${count === 1 ? singularLabel : pluralLabel}`;
  const write = (count, dispatch = false) => {
    const previous = readBookingQuantity(input);
    const min = Number(input.min || 0);
    const max = Number(input.max || 99);
    const fallback = Number(input.dataset.default || min);
    const numericCount = Number.isFinite(Number(count)) ? Number(count) : fallback;
    const next = clampBookingQuantity(Math.round(numericCount), min, max);

    input.value = format(next);
    input.dataset.quantityValue = String(next);
    input.setAttribute("aria-label", format(next));
    if (dispatch && previous !== next) input.dispatchEvent(new Event("change", { bubbles: true }));
  };

  input.addEventListener("focus", () => {
    input.value = String(readBookingQuantity(input));
    window.requestAnimationFrame(() => input.select?.());
  });

  input.addEventListener("input", () => {
    const numericValue = input.value.replace(/\D/g, "");
    if (input.value !== numericValue) input.value = numericValue;
  });

  input.addEventListener("blur", () => {
    write(readBookingQuantity(input), true);
  });

  input.addEventListener("change", () => {
    if (document.activeElement !== input) write(readBookingQuantity(input));
  });

  write(readBookingQuantity(input));
  return {
    read: () => readBookingQuantity(input),
    write
  };
}

function initBookingPassengerMenu(form, peopleInput) {
  const menu = form.querySelector("[data-passenger-menu]");
  if (!menu || !peopleInput) return null;

  const trigger = menu.querySelector("[data-passenger-trigger]");
  const label = menu.querySelector("[data-passenger-label]");
  const adultsInput = menu.querySelector("[data-passenger-adults]");
  const childrenInput = menu.querySelector("[data-passenger-children]");
  const adultOutput = menu.querySelector('[data-passenger-count="adults"]');
  const childOutput = menu.querySelector('[data-passenger-count="children"]');
  const stepButtons = Array.from(menu.querySelectorAll("[data-passenger-action]"));
  if (!trigger || !label || !adultsInput || !childrenInput || !adultOutput || !childOutput) return null;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const readTravelerTotal = () => {
    return readBookingQuantity(peopleInput);
  };

  const writePassengerState = (adults, children) => {
    const total = readTravelerTotal();
    const minimumAdults = total > 0 ? 1 : 0;
    const nextAdults = clamp(Math.round(Number(adults) || 0), minimumAdults, total);
    const nextChildren = clamp(total - nextAdults, 0, Math.max(total - minimumAdults, 0));

    adultsInput.value = String(nextAdults);
    childrenInput.value = String(nextChildren);
    adultOutput.textContent = String(nextAdults);
    childOutput.textContent = String(nextChildren);
    label.textContent = `${nextAdults} adult${nextAdults === 1 ? "" : "s"}, ${nextChildren} child${nextChildren === 1 ? "" : "ren"}`;

    stepButtons.forEach((button) => {
      const action = button.dataset.passengerAction;
      const kind = button.dataset.passengerKind;
      let disabled = false;
      if (kind === "adults" && action === "decrease") disabled = nextAdults <= minimumAdults;
      if (kind === "adults" && action === "increase") disabled = nextChildren <= 0;
      if (kind === "children" && action === "decrease") disabled = nextChildren <= 0;
      if (kind === "children" && action === "increase") disabled = nextAdults <= minimumAdults;
      button.disabled = disabled;
    });

    adultsInput.dispatchEvent(new Event("change", { bubbles: true }));
    childrenInput.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const syncToTravelerTotal = () => {
    const total = readTravelerTotal();
    const minimumAdults = total > 0 ? 1 : 0;
    const children = clamp(Number(childrenInput.value || 0), 0, Math.max(total - minimumAdults, 0));
    writePassengerState(total - children, children);
  };

  const closeMenu = () => {
    menu.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    document.querySelectorAll("[data-passenger-menu].is-open").forEach((openMenu) => {
      if (openMenu !== menu) {
        openMenu.classList.remove("is-open");
        openMenu.querySelector("[data-passenger-trigger]")?.setAttribute("aria-expanded", "false");
      }
    });
    menu.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
  };

  trigger.addEventListener("click", () => {
    if (menu.classList.contains("is-open")) closeMenu();
    else openMenu();
  });

  trigger.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" && event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openMenu();
    stepButtons.find((button) => !button.disabled)?.focus();
  });

  stepButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const adults = Number(adultsInput.value || 0);
      const children = Number(childrenInput.value || 0);
      const action = button.dataset.passengerAction;
      const kind = button.dataset.passengerKind;

      if (kind === "adults" && action === "increase") writePassengerState(adults + 1, children - 1);
      if (kind === "adults" && action === "decrease") writePassengerState(adults - 1, children + 1);
      if (kind === "children" && action === "increase") writePassengerState(adults - 1, children + 1);
      if (kind === "children" && action === "decrease") writePassengerState(adults + 1, children - 1);
    });

    button.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      closeMenu();
      trigger.focus({ preventScroll: true });
    });
  });

  peopleInput.addEventListener("input", syncToTravelerTotal);
  peopleInput.addEventListener("change", syncToTravelerTotal);

  document.addEventListener("click", (event) => {
    if (menu.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  syncToTravelerTotal();
  return syncToTravelerTotal;
}

function initBookingCalendar(form) {
  const calendar = form.querySelector("[data-booking-calendar]");
  if (!calendar) return null;

  const display = calendar.querySelector("[data-booking-date-display]");
  const startInput = calendar.querySelector("[data-booking-date-start]");
  const endInput = calendar.querySelector("[data-booking-date-end]");
  const popover = calendar.querySelector("[data-booking-calendar-popover]");
  const monthLabel = calendar.querySelector("[data-calendar-month]");
  const grid = calendar.querySelector("[data-calendar-grid]");
  const prevButton = calendar.querySelector("[data-calendar-prev]");
  const nextButton = calendar.querySelector("[data-calendar-next]");
  const calendarStep = calendar.closest(".booking-step");
  const routeSelect = form.querySelector("#route");
  if (!display || !startInput || !endInput || !popover || !monthLabel || !grid) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  let startDate = null;
  let endDate = null;

  const monthFormatter = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" });
  const displayFormatter = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" });
  const compactDayFormatter = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });
  const compactMonthDayFormatter = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });
  const toIsoDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
  };
  const sameDay = (first, second) => Boolean(first && second && first.getTime() === second.getTime());
  const isBeforeDay = (first, second) => first.getTime() < second.getTime();
  const isAfterDay = (first, second) => first.getTime() > second.getTime();
  const addDays = (date, days) => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + days);
    nextDate.setHours(0, 0, 0, 0);
    return nextDate;
  };
  const getFixedRouteDays = () => {
    const selectedIndex = routeSelect ? routeSelect.selectedIndex : -1;
    if (selectedIndex === 0) return 3;
    if (selectedIndex === 1) return 4;
    return null;
  };
  const inSelectedRange = (date) => {
    if (!startDate) return false;
    const rangeEnd = endDate || startDate;
    return !isBeforeDay(date, startDate) && !isAfterDay(date, rangeEnd);
  };
  const formatDisplayRange = (first, last) => {
    if (sameDay(first, last)) return displayFormatter.format(first);
    if (first.getFullYear() === last.getFullYear() && first.getMonth() === last.getMonth()) {
      return `${compactMonthDayFormatter.format(first)} to ${last.getDate()}, ${last.getFullYear()}`;
    }
    if (first.getFullYear() === last.getFullYear()) {
      return `${compactDayFormatter.format(first)} to ${displayFormatter.format(last)}`;
    }
    return `${displayFormatter.format(first)} to ${displayFormatter.format(last)}`;
  };

  function syncDisplay() {
    if (!startDate) {
      display.value = "";
      startInput.value = "";
      endInput.value = "";
      return;
    }

    const rangeEnd = endDate || startDate;
    startInput.value = toIsoDate(startDate);
    endInput.value = toIsoDate(rangeEnd);
    display.value = formatDisplayRange(startDate, rangeEnd);
    display.dispatchEvent(new Event("input", { bubbles: true }));
    display.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function renderCalendar() {
    grid.innerHTML = "";
    monthLabel.textContent = monthFormatter.format(visibleMonth);
    if (prevButton) {
      prevButton.disabled = visibleMonth.getFullYear() === today.getFullYear() && visibleMonth.getMonth() === today.getMonth();
    }

    const firstOfMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
    const leadingBlanks = (firstOfMonth.getDay() + 6) % 7;

    for (let index = 0; index < leadingBlanks; index += 1) {
      const blank = document.createElement("span");
      blank.className = "booking-calendar-blank";
      blank.setAttribute("aria-hidden", "true");
      grid.appendChild(blank);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
      date.setHours(0, 0, 0, 0);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "booking-calendar-day";
      button.textContent = String(day);
      button.dataset.date = toIsoDate(date);
      button.setAttribute("aria-label", displayFormatter.format(date));

      if (isBeforeDay(date, today)) {
        button.disabled = true;
      }
      if (sameDay(date, startDate)) {
        button.classList.add("is-start");
        button.setAttribute("aria-pressed", "true");
      } else {
        button.setAttribute("aria-pressed", "false");
      }
      if (inSelectedRange(date)) {
        button.classList.add("is-in-range");
      }
      if (endDate && sameDay(date, endDate)) {
        button.classList.add("is-end");
      }

      grid.appendChild(button);
    }
  }

  function openCalendar() {
    calendar.classList.add("is-open");
    calendarStep?.classList.add("has-open-calendar");
    display.setAttribute("aria-expanded", "true");
    renderCalendar();
  }

  function closeCalendar() {
    calendar.classList.remove("is-open");
    calendarStep?.classList.remove("has-open-calendar");
    display.setAttribute("aria-expanded", "false");
  }

  function selectDate(date) {
    const fixedDays = getFixedRouteDays();
    if (fixedDays) {
      startDate = date;
      endDate = addDays(date, fixedDays - 1);
      visibleMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      syncDisplay();
      renderCalendar();
      return;
    }

    if (!startDate || isBeforeDay(date, startDate)) {
      startDate = date;
      endDate = null;
    } else {
      endDate = date;
    }

    syncDisplay();
    renderCalendar();
  }

  display.setAttribute("aria-haspopup", "dialog");
  display.setAttribute("aria-expanded", "false");
  display.addEventListener("click", openCalendar);
  display.addEventListener("focus", openCalendar);

  grid.addEventListener("click", (event) => {
    event.stopPropagation();
    const button = event.target.closest(".booking-calendar-day");
    if (!button || button.disabled) return;
    const [year, month, day] = button.dataset.date.split("-").map(Number);
    selectDate(new Date(year, month - 1, day));
  });

  prevButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
    renderCalendar();
  });

  nextButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
    renderCalendar();
  });

  routeSelect?.addEventListener("change", () => {
    const fixedDays = getFixedRouteDays();
    if (fixedDays && startDate) {
      endDate = addDays(startDate, fixedDays - 1);
      syncDisplay();
      renderCalendar();
    }
  });

  document.addEventListener("click", (event) => {
    if (calendar.contains(event.target)) return;
    closeCalendar();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCalendar();
  });

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      startDate = null;
      endDate = null;
      visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      syncDisplay();
      renderCalendar();
      closeCalendar();
    });
  });

  renderCalendar();
  return { close: closeCalendar, reset: () => form.reset() };
}

const bookingForm = document.querySelector("#bookingForm");
if (bookingForm) {
  enhanceBookingSelectMenus(bookingForm);
  initBookingCalendar(bookingForm);

  const people = bookingForm.querySelector("#people");
  const vehicles = bookingForm.querySelector("#vehicles");
  const travelerQuantity = initBookingQuantityInput(people, "traveller", "travellers");
  const vehicleQuantity = initBookingQuantityInput(vehicles, "vehicle", "vehicles");
  const syncPassengerTotals = initBookingPassengerMenu(bookingForm, people);
  const route = bookingForm.querySelector("#route");
  const total = document.querySelector("#bookingTotal");
  const summaryCard = document.querySelector(".booking-summary-card");
  const summaryRoute = document.querySelector("#summaryRoute");
  const summaryRouteDescription = document.querySelector("#summaryRouteDescription");
  const summaryImage = document.querySelector("#bookingRouteImage");
  const productPrice = document.querySelector("#bookingProductPrice");
  const pickup = bookingForm.querySelector("#pickupLocation");
  const dropoff = bookingForm.querySelector("#dropoffLocation");
  const pickupLabel = document.querySelector("#summaryPickupLabel");
  const dropoffLabel = document.querySelector("#summaryDropoffLabel");
  const estimateLabel = document.querySelector("#bookingEstimateLabel");
  const currencyCode = document.querySelector("#bookingCurrencyCode");
  const ppPriceLabel = document.querySelector("#bookingPpPriceLabel");
  const ppCurrencyCode = document.querySelector("#bookingPpCurrencyCode");
  const ppPrice = document.querySelector("#bookingPpPrice");
  const summaryPickup = document.querySelector("#summaryPickup");
  const summaryDropoff = document.querySelector("#summaryDropoff");
  const mobileTotal = document.querySelector("[data-booking-mobile-total]");
  const mobileTotalToggle = document.querySelector("[data-booking-mobile-total-toggle]");
  const mobileSummaryPanel = document.querySelector("[data-booking-mobile-summary-panel]");
  const mobileSummaryImage = document.querySelector("[data-booking-mobile-image]");
  const mobileFields = {
    totalLabel: document.querySelector("[data-booking-mobile-total-label]"),
    currency: document.querySelector("[data-booking-mobile-currency]"),
    price: document.querySelector("[data-booking-mobile-price]"),
    route: document.querySelector("[data-booking-mobile-route]"),
    description: document.querySelector("[data-booking-mobile-description]"),
    productPrice: document.querySelector("[data-booking-mobile-product-price]"),
    pickupLabel: document.querySelector("[data-booking-mobile-pickup-label]"),
    pickup: document.querySelector("[data-booking-mobile-pickup]"),
    dropoffLabel: document.querySelector("[data-booking-mobile-dropoff-label]"),
    dropoff: document.querySelector("[data-booking-mobile-dropoff]"),
    estimateLabel: document.querySelector("[data-booking-mobile-estimate-label]"),
    estimateCurrency: document.querySelector("[data-booking-mobile-estimate-currency]"),
    estimatePrice: document.querySelector("[data-booking-mobile-estimate-price]"),
    ppLabel: document.querySelector("[data-booking-mobile-pp-label]"),
    ppCurrency: document.querySelector("[data-booking-mobile-pp-currency]"),
    ppPrice: document.querySelector("[data-booking-mobile-pp-price]"),
  };
  let routeRefreshTimer;

  mobileTotalToggle?.addEventListener("click", () => {
    const isOpen = mobileTotal?.classList.toggle("is-open");
    mobileTotalToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  const requestedRoute = getCanonicalBookingRouteSlug(new URLSearchParams(window.location.search).get("route") || "");
  if (requestedRoute && route) {
    const requestedOption = Array.from(route.options).find((option) => {
      const optionRoute = option.dataset.routeSlug || option.value || option.textContent || "";
      return getCanonicalBookingRouteSlug(optionRoute) === requestedRoute;
    });
    if (requestedOption) {
      route.value = requestedOption.value;
      route.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  function replayRouteSummaryAnimation() {
    if (!summaryCard || reducedMotionQuery.matches || !body.classList.contains("site-ready")) return;
    window.clearTimeout(routeRefreshTimer);
    summaryCard.classList.remove("is-route-refreshing", "is-route-refresh-complete");
    void summaryCard.offsetWidth;
    summaryCard.classList.add("is-route-refreshing");
    routeRefreshTimer = window.setTimeout(() => {
      summaryCard.classList.remove("is-route-refreshing");
      summaryCard.classList.add("is-route-refresh-complete");
    }, 2400);
  }
  const readTravelerCount = () => {
    return Math.max(travelerQuantity?.read() ?? readBookingQuantity(people), 0);
  };
  const syncVehicleCountToTravelers = () => {
    const requiredVehicles = getRequiredBookingVehicles(readTravelerCount());
    const currentVehicles = Math.max(vehicleQuantity?.read() ?? readBookingQuantity(vehicles), 1);
    if (vehicleQuantity) vehicleQuantity.write(requiredVehicles);
    else vehicles.value = String(requiredVehicles);
    if (currentVehicles !== requiredVehicles) {
      vehicles.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };

  function updateQuote() {
    const selectedRoute = route.selectedOptions[0];
    const selectedRouteIndex = selectedRoute ? Array.from(route.options).indexOf(selectedRoute) : 0;
    const vehicleCount = Math.max(vehicleQuantity?.read() ?? readBookingQuantity(vehicles), getRequiredBookingVehicles(readTravelerCount()), 1);
    const adultCount = Math.max(Number(bookingForm.querySelector("[data-passenger-adults]")?.value || 0), 0);
    const estimateLkr = vehicleCount * 240000;
    const ppPriceLkr = adultCount > 0 ? estimateLkr / adultCount : null;
    const copy = getBookingCopy();
    const formattedEstimate = formatBookingLkrAmount(estimateLkr, activeCurrency);
    const routeName = selectedRoute?.textContent || "Custom route";
    const routeDescription = copy.routeDescriptions[selectedRouteIndex] || selectedRoute?.dataset.description || "";
    const pickupText = pickup?.value?.trim() || copy.empty;
    const dropoffText = dropoff?.value?.trim() || copy.empty;
    const formattedPpPrice = ppPriceLkr === null ? copy.empty : formatBookingLkrAmount(ppPriceLkr, activeCurrency).text;

    total.textContent = formattedEstimate.text;
    if (currencyCode) currencyCode.textContent = formattedEstimate.code;
    if (productPrice) productPrice.textContent = formattedEstimate.text;
    if (ppPriceLabel) ppPriceLabel.textContent = copy.ppPrice || "per person";
    if (ppCurrencyCode) ppCurrencyCode.textContent = ppPriceLkr === null ? "" : formattedEstimate.code;
    if (ppPrice) ppPrice.textContent = formattedPpPrice;
    if (pickupLabel) pickupLabel.innerHTML = `${copy.pickup} <small aria-hidden="true">?</small>`;
    if (dropoffLabel) dropoffLabel.textContent = copy.dropoff;
    if (estimateLabel) estimateLabel.textContent = copy.estimate;
    summaryRoute.textContent = routeName;
    if (summaryRouteDescription) {
      summaryRouteDescription.textContent = routeDescription;
    }
    if (summaryPickup) summaryPickup.textContent = pickupText;
    if (summaryDropoff) summaryDropoff.textContent = dropoffText;

    if (mobileFields.totalLabel) mobileFields.totalLabel.textContent = copy.totalEstimation || "Total Estimation";
    if (mobileFields.currency) mobileFields.currency.textContent = formattedEstimate.code;
    if (mobileFields.price) mobileFields.price.textContent = formattedEstimate.text;
    if (mobileFields.route) mobileFields.route.textContent = routeName;
    if (mobileFields.description) mobileFields.description.textContent = routeDescription;
    if (mobileFields.productPrice) mobileFields.productPrice.textContent = formattedEstimate.text;
    if (mobileFields.pickupLabel) mobileFields.pickupLabel.innerHTML = `${copy.pickup} <small aria-hidden="true">?</small>`;
    if (mobileFields.pickup) mobileFields.pickup.textContent = pickupText;
    if (mobileFields.dropoffLabel) mobileFields.dropoffLabel.textContent = copy.dropoff;
    if (mobileFields.dropoff) mobileFields.dropoff.textContent = dropoffText;
    if (mobileFields.estimateLabel) mobileFields.estimateLabel.textContent = copy.estimate;
    if (mobileFields.estimateCurrency) mobileFields.estimateCurrency.textContent = formattedEstimate.code;
    if (mobileFields.estimatePrice) mobileFields.estimatePrice.textContent = formattedEstimate.text;
    if (mobileFields.ppLabel) mobileFields.ppLabel.textContent = copy.ppPrice || "per person";
    if (mobileFields.ppCurrency) mobileFields.ppCurrency.textContent = ppPriceLkr === null ? "" : formattedEstimate.code;
    if (mobileFields.ppPrice) mobileFields.ppPrice.textContent = formattedPpPrice;

    if (summaryImage && selectedRoute?.dataset.image && summaryImage.getAttribute("src") !== selectedRoute.dataset.image) {
      summaryImage.classList.add("is-switching");
      window.setTimeout(() => {
        summaryImage.src = selectedRoute.dataset.image;
        summaryImage.alt = selectedRoute.dataset.imageAlt || selectedRoute.textContent || "Selected Ceylon Backroads route";
        summaryImage.addEventListener("load", () => summaryImage.classList.remove("is-switching"), { once: true });
        if (summaryImage.complete) summaryImage.classList.remove("is-switching");
      }, reducedMotionQuery.matches ? 0 : 120);
    }

    if (mobileSummaryImage && selectedRoute?.dataset.image && mobileSummaryImage.getAttribute("src") !== selectedRoute.dataset.image) {
      mobileSummaryImage.classList.add("is-switching");
      window.setTimeout(() => {
        mobileSummaryImage.src = selectedRoute.dataset.image;
        mobileSummaryImage.alt = selectedRoute.dataset.imageAlt || routeName || "Selected Ceylon Backroads route";
        mobileSummaryImage.addEventListener("load", () => mobileSummaryImage.classList.remove("is-switching"), { once: true });
        if (mobileSummaryImage.complete) mobileSummaryImage.classList.remove("is-switching");
      }, reducedMotionQuery.matches ? 0 : 120);
    } else if (mobileSummaryImage && selectedRoute?.dataset.imageAlt) {
      mobileSummaryImage.alt = selectedRoute.dataset.imageAlt;
    }
  }

  ["input", "change"].forEach((eventName) => {
    bookingForm.addEventListener(eventName, updateQuote);
  });
  route.addEventListener("change", () => {
    window.requestAnimationFrame(replayRouteSummaryAnimation);
  });
  ["input", "change"].forEach((eventName) => {
    people.addEventListener(eventName, syncVehicleCountToTravelers);
  });
  document.addEventListener("ceylon:currencychange", updateQuote);
  document.addEventListener("ceylon:languagechange", updateQuote);
  syncVehicleCountToTravelers();
  updateQuote();

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const submit = bookingForm.querySelector("button[type='submit']");
    submit.textContent = getBookingCopy().requestSent;
    submit.disabled = true;
    setTimeout(() => {
      submit.textContent = getBookingCopy().requestQuotation;
      submit.disabled = false;
      bookingForm.reset();
      bookingForm.querySelectorAll("select").forEach((select) => {
        select.dispatchEvent(new Event("change", { bubbles: true }));
      });
      travelerQuantity?.write(readTravelerCount());
      syncPassengerTotals?.();
      syncVehicleCountToTravelers();
      updateQuote();
    }, 1800);
  });
}

function closeBookingSelectMenu(menu) {
  const trigger = menu.querySelector("[data-booking-select-trigger]");
  menu.classList.remove("is-open");
  if (trigger) trigger.setAttribute("aria-expanded", "false");
}

function openBookingSelectMenu(menu) {
  document.querySelectorAll("[data-booking-select-menu].is-open").forEach((openMenu) => {
    if (openMenu !== menu) closeBookingSelectMenu(openMenu);
  });

  const trigger = menu.querySelector("[data-booking-select-trigger]");
  menu.classList.add("is-open");
  if (trigger) trigger.setAttribute("aria-expanded", "true");
}

function toggleBookingSelectMenu(menu) {
  if (menu.classList.contains("is-open")) closeBookingSelectMenu(menu);
  else openBookingSelectMenu(menu);
}

function enhanceBookingSelectMenus(form) {
  const selects = Array.from(form.querySelectorAll("select"));
  if (!selects.length) return;

  selects.forEach((select, selectIndex) => {
    if (select.dataset.bookingSelectEnhanced === "true") return;

    const menuId = `bookingSelect${selectIndex}`;
    const optionsId = `${menuId}Options`;
    const menu = document.createElement("div");
    menu.className = "booking-select-menu";
    menu.dataset.bookingSelectMenu = "";

    const trigger = document.createElement("button");
    trigger.className = "booking-select-trigger";
    trigger.type = "button";
    trigger.dataset.bookingSelectTrigger = "";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", optionsId);

    const value = document.createElement("span");
    value.className = "booking-select-value";
    value.dataset.bookingSelectValue = "";

    const chevron = document.createElement("span");
    chevron.className = "booking-select-chevron";
    chevron.setAttribute("aria-hidden", "true");

    trigger.append(value, chevron);

    const optionList = document.createElement("div");
    optionList.className = "booking-select-options";
    optionList.id = optionsId;
    optionList.role = "listbox";

    const updateSelectedOption = () => {
      const selectedOption = select.selectedOptions[0] || select.options[0];
      value.replaceChildren(...createBookingSelectContent(selectedOption, true));
      Array.from(optionList.querySelectorAll("[data-booking-select-option]")).forEach((button) => {
        button.setAttribute("aria-selected", String(Number(button.dataset.optionIndex) === select.selectedIndex));
      });
    };

    Array.from(select.options).forEach((option, optionIndex) => {
      if (!option.value) option.value = option.textContent;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "booking-select-option";
      button.role = "option";
      button.dataset.bookingSelectOption = "";
      button.dataset.optionIndex = String(optionIndex);
      button.dataset.value = option.value;
      button.dataset.optionLabel = option.textContent;
      button.replaceChildren(...createBookingSelectContent(option, false));

      button.addEventListener("click", () => {
        select.selectedIndex = optionIndex;
        updateSelectedOption();
        select.dispatchEvent(new Event("change", { bubbles: true }));
        closeBookingSelectMenu(menu);
        trigger.focus({ preventScroll: true });
      });

      button.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeBookingSelectMenu(menu);
          trigger.focus({ preventScroll: true });
          return;
        }

        const direction = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
        if (!direction) return;

        event.preventDefault();
        const optionButtons = Array.from(optionList.querySelectorAll("[data-booking-select-option]"));
        optionButtons[(optionIndex + direction + optionButtons.length) % optionButtons.length]?.focus();
      });

      optionList.append(button);
    });

    trigger.addEventListener("click", () => toggleBookingSelectMenu(menu));
    trigger.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowDown" && event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openBookingSelectMenu(menu);
      optionList.querySelector('[aria-selected="true"]')?.focus();
    });

    select.addEventListener("change", updateSelectedOption);
    select.classList.add("booking-select-native");
    select.dataset.bookingSelectEnhanced = "true";
    menu.append(trigger, optionList);
    select.insertAdjacentElement("afterend", menu);
    updateSelectedOption();
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-booking-select-menu]")) return;
    document.querySelectorAll("[data-booking-select-menu].is-open").forEach(closeBookingSelectMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    document.querySelectorAll("[data-booking-select-menu].is-open").forEach(closeBookingSelectMenu);
  });
}

function createBookingSelectContent(option, compact = false) {
  const label = compact ? option?.dataset.shortLabel || option?.textContent || "" : option?.textContent || "";
  if (!option?.dataset.country) return [document.createTextNode(label)];

  const flagCode = option.dataset.country.toLowerCase();
  const flag = document.createElement("img");
  flag.className = "booking-country-flag";
  flag.dataset.country = flagCode;
  flag.src = `https://flagcdn.com/w40/${flagCode}.png`;
  flag.srcset = `https://flagcdn.com/w80/${flagCode}.png 2x`;
  flag.width = 22;
  flag.height = 16;
  flag.alt = "";
  flag.decoding = "async";
  flag.loading = "lazy";
  flag.addEventListener("error", () => {
    flag.removeAttribute("src");
    flag.removeAttribute("srcset");
  }, { once: true });
  flag.setAttribute("aria-hidden", "true");

  const text = document.createElement("span");
  text.className = "booking-select-label";
  text.dataset.optionLabel = label;
  text.textContent = label;

  return [flag, text];
}

const filterButtons = document.querySelectorAll("[data-filter]");
if (filterButtons.length) {
  const cards = document.querySelectorAll("[data-route-type]");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      cards.forEach((card) => {
        const show = filter === "all" || card.dataset.routeType === filter;
        card.classList.toggle("hidden-date", !show);
      });
    });
  });
}

const contactForm = document.querySelector("#contactForm");
if (contactForm) {
  document.querySelectorAll("[data-contact-topic-menu]").forEach((control) => {
    const trigger = control.querySelector("[data-contact-topic-trigger]");
    const activeLabel = control.querySelector("[data-contact-topic-active]");
    const hiddenInput = control.querySelector("[data-contact-topic-value]");
    const options = Array.from(control.querySelectorAll("[data-contact-topic-option]"));
    if (!trigger || !activeLabel || !hiddenInput || !options.length) return;

    function setContactTopic(option, close = false) {
      const nextValue = option.dataset.topicValue || option.textContent.trim();
      activeLabel.textContent = nextValue;
      hiddenInput.value = nextValue;
      options.forEach((item) => item.setAttribute("aria-selected", String(item === option)));
      if (close) closePreferenceMenu(control);
    }

    trigger.addEventListener("click", () => togglePreferenceMenu(control));
    trigger.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowDown" && event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openPreferenceMenu(control);
      options.find((option) => option.getAttribute("aria-selected") === "true")?.focus();
    });

    options.forEach((option, index) => {
      option.addEventListener("click", () => {
        setContactTopic(option, true);
        trigger.focus({ preventScroll: true });
      });

      option.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closePreferenceMenu(control);
          trigger.focus({ preventScroll: true });
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setContactTopic(option, true);
          trigger.focus({ preventScroll: true });
          return;
        }

        const direction = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
        if (!direction) return;

        event.preventDefault();
        options[(index + direction + options.length) % options.length].focus();
      });
    });

    setContactTopic(options.find((option) => option.getAttribute("aria-selected") === "true") || options[0]);
  });

  const contactSubmitButton = contactForm.querySelector(".wild-contact-submit");
  const contactSubmitLabel = contactSubmitButton?.querySelector(".wild-contact-submit-label");
  const setContactSubmitLabel = (text) => {
    if (contactSubmitLabel) contactSubmitLabel.textContent = text;
    else if (contactSubmitButton) contactSubmitButton.textContent = text;
  };
  const resetContactSubmit = () => {
    setContactSubmitLabel("Send Message");
    if (contactSubmitButton) contactSubmitButton.disabled = false;
  };
  const resetContactTopicMenus = () => {
    document.querySelectorAll("[data-contact-topic-menu]").forEach((control) => {
      const activeLabel = control.querySelector("[data-contact-topic-active]");
      const hiddenInput = control.querySelector("[data-contact-topic-value]");
      const options = Array.from(control.querySelectorAll("[data-contact-topic-option]"));
      if (!activeLabel || !hiddenInput || !options.length) return;

      const nextValue = hiddenInput.value || options[0].dataset.topicValue || options[0].textContent.trim();
      const selectedOption = options.find((option) => (option.dataset.topicValue || option.textContent.trim()) === nextValue) || options[0];
      const selectedValue = selectedOption.dataset.topicValue || selectedOption.textContent.trim();

      activeLabel.textContent = selectedValue;
      hiddenInput.value = selectedValue;
      options.forEach((option) => option.setAttribute("aria-selected", String(option === selectedOption)));
      closePreferenceMenu(control);
    });
  };

  contactForm.addEventListener("input", resetContactSubmit);
  contactForm.addEventListener("change", resetContactSubmit);
  contactForm.addEventListener("click", (event) => {
    if (event.target.closest("[data-contact-topic-option]")) resetContactSubmit();
  });
  contactForm.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && event.target.closest("[data-contact-topic-option]")) {
      resetContactSubmit();
    }
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (contactSubmitButton?.disabled) return;

    const formData = new FormData(contactForm);
    if (String(formData.get("_honey") || "").trim()) return;

    if (contactSubmitButton) contactSubmitButton.disabled = true;
    setContactSubmitLabel("Sending...");

    const topic = String(formData.get("topic") || "Contact message").trim();
    const senderEmail = String(formData.get("email") || "").trim();
    formData.set("_subject", `Ceylon Backroads contact: ${topic}`);
    formData.set("_replyto", senderEmail);
    formData.set("_url", window.location.href);

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body: formData
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || String(result.success).toLowerCase() === "false") {
        throw new Error(result.message || "Contact form submission failed");
      }
      contactForm.reset();
      resetContactTopicMenus();
      setContactSubmitLabel("Message Sent");
    } catch (error) {
      console.error(error);
      setContactSubmitLabel("Try Again");
      if (contactSubmitButton) contactSubmitButton.disabled = false;
    }
  });
}
