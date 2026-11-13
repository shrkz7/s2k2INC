/**
 * S2K2 Inc. — Enterprise Client-Side Router
 * Supports HTML5 PushState, Browser Back/Forward History, Subdirectory Hosting, and File:// Hash Fallback
 */

(function () {
  'use strict';

  const ROUTES = {
    HOME: 'home',
    FIBER: 'fibre-optic',
    WEB: 'web-design',
    CREATIVE: 'creative-marketing'
  };

  const TITLES = {
    [ROUTES.HOME]: 'S2K2 Inc. | Optical Fiber Infrastructure, Web Systems & Creative Media',
    [ROUTES.FIBER]: 'Underground & Aerial Fiber Laying | S2K2 Inc.',
    [ROUTES.WEB]: 'Web Designing & Business Integrations | S2K2 Inc.',
    [ROUTES.CREATIVE]: 'Social Media & Creative Management | S2K2 Inc.'
  };

  const isFileProtocol = window.location.protocol === 'file:';

  // Compute clean application root directory once on initial script execution
  const APP_ROOT = (function () {
    let path = window.location.pathname;
    // Strip trailing file names or known route slugs if user landed directly on one
    path = path.replace(/(index\.html?|fibre-optic|fiber-optic|web-design|web-designing|creative-marketing|marketing|\/)+$/i, '');
    return path ? (path + '/') : '/';
  })();

  /**
   * Normalize path or hash into a recognized route key
   */
  function resolveRoute() {
    // 1. Check Hash first (e.g. #fibre-optic, #/fibre-optic, #home/fibre-optic)
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    if (hash.includes('fibre-optic') || hash.includes('fiber-optic') || hash === 'fiber') {
      return ROUTES.FIBER;
    }
    if (hash.includes('web-design') || hash.includes('web-designing') || hash === 'web') {
      return ROUTES.WEB;
    }
    if (hash.includes('creative') || hash.includes('marketing') || hash.includes('social') || hash.includes('poster')) {
      return ROUTES.CREATIVE;
    }
    if (hash === 'home' || hash === 'hub') {
      return ROUTES.HOME;
    }

    // 2. Check Pathname (e.g. /fibre-optic, /web-design)
    const pathname = window.location.pathname.toLowerCase();
    if (pathname.includes('fibre-optic') || pathname.includes('fiber-optic')) {
      return ROUTES.FIBER;
    }
    if (pathname.includes('web-design') || pathname.includes('web-designing')) {
      return ROUTES.WEB;
    }
    if (pathname.includes('creative-marketing') || pathname.includes('marketing') || pathname.includes('social-media')) {
      return ROUTES.CREATIVE;
    }

    return ROUTES.HOME;
  }

  /**
   * Render view based on route key
   */
  function renderView(routeKey, shouldScrollTop = true) {
    const views = {
      [ROUTES.HOME]: document.getElementById('view-home'),
      [ROUTES.FIBER]: document.getElementById('view-fiber'),
      [ROUTES.WEB]: document.getElementById('view-web'),
      [ROUTES.CREATIVE]: document.getElementById('view-creative')
    };

    // Hide all views
    Object.values(views).forEach(view => {
      if (view) {
        view.classList.remove('active');
      }
    });

    // Activate target view
    const targetView = views[routeKey] || views[ROUTES.HOME];
    if (targetView) {
      targetView.classList.add('active');
    }

    // Update document title
    document.title = TITLES[routeKey] || TITLES[ROUTES.HOME];

    // Update Header Active Links
    document.querySelectorAll('.nav-link-btn').forEach(btn => {
      const target = btn.getAttribute('data-route');
      if (target === routeKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Mobile Nav Tiles Active State
    document.querySelectorAll('.mobile-nav-tile').forEach(tile => {
      const target = tile.getAttribute('data-route');
      if (target === routeKey) {
        tile.classList.add('active');
      } else {
        tile.classList.remove('active');
      }
    });

    // Update Persistent Floating Dock Active State
    document.querySelectorAll('.dock-item-btn').forEach(btn => {
      const target = btn.getAttribute('data-route');
      if (target === routeKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Scroll to top smoothly if navigated
    if (shouldScrollTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Public navigation method
   */
  window.navigateTo = function (routeKey) {
    let cleanRoute = ROUTES.HOME;
    let urlSlug = '';

    if (routeKey === 'fibre-optic' || routeKey === 'fiber-optic' || routeKey === ROUTES.FIBER) {
      cleanRoute = ROUTES.FIBER;
      urlSlug = 'fibre-optic';
    } else if (routeKey === 'web-design' || routeKey === 'web-designing' || routeKey === ROUTES.WEB) {
      cleanRoute = ROUTES.WEB;
      urlSlug = 'web-design';
    } else if (routeKey === 'creative-marketing' || routeKey === 'marketing' || routeKey === 'creative' || routeKey === ROUTES.CREATIVE) {
      cleanRoute = ROUTES.CREATIVE;
      urlSlug = 'creative-marketing';
    } else {
      cleanRoute = ROUTES.HOME;
      urlSlug = '';
    }

    if (!isFileProtocol) {
      try {
        const targetUrl = urlSlug ? (APP_ROOT + urlSlug) : APP_ROOT;
        window.history.pushState({ route: cleanRoute }, TITLES[cleanRoute], targetUrl);
      } catch (e) {
        // Fallback to hash if pushState is restricted
        window.location.hash = '#' + (urlSlug || 'home');
      }
    } else {
      // Local file preview - hash update
      window.location.hash = '#' + (urlSlug || 'home');
    }

    renderView(cleanRoute, true);
  };

  // Listen to browser Back/Forward navigation
  window.addEventListener('popstate', (e) => {
    const route = resolveRoute();
    renderView(route, false);
  });

  // Listen to hash changes (for hash navigation or file preview)
  window.addEventListener('hashchange', () => {
    const route = resolveRoute();
    renderView(route, false);
  });

  // Handle all route links with data-route attribute
  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (e) => {
      const routeTrigger = e.target.closest('[data-route]');
      if (routeTrigger) {
        e.preventDefault();
        const targetRoute = routeTrigger.getAttribute('data-route');
        window.navigateTo(targetRoute);
      }
    });

    // Initial render based on starting URL
    const initialRoute = resolveRoute();
    renderView(initialRoute, false);
  });

})();
