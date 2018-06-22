/* eslint-disable func-names */

/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can
 * always reference jQuery with $, even when in .noConflict() mode.
 * ======================================================================== */

(function ($) {
  let UTIL;

  /*
   * History HTML5 API
   */
  const History = {
    pushState(title, href, containerSelector = null) {
      window.history.pushState(null, title, href);
      document.title = `${title}`;
      if (containerSelector !== null) {
        $('body').attr('class', containerSelector);
      }
      window.onpopstate = function () {
        window.history.go(0);
      };
    },
    pushStateQueryParam(key, value) {
      window.history.pushState(null, document.title, `${key}=${value}`);
    },
  };

  /*
   *  Helpers functions
   */
  const Helpers = {
    isMobile() {
      return /palm|blackberry|nokia|phone|midp|mobi|symbian|chtml|ericsson|minimo|audiovox|motorola|samsung|telit|upg1|windows ce|ucweb|astel|plucker|x320|x240|j2me|sgh|portable|sprint|docomo|kddi|softbank|android|mmp|pdxgw|netfront|xiino|vodafone|portalmmm|sagem|mot-|sie-|webos|amoi|noconstra|cdm|alcatel|pocket|ipad|iphone|mobileexplorer|mobile/i.test(navigator.userAgent);
    },
    isXs() {
      return window.innerWidth < 768;
    },
    isSm() {
      return window.innerWidth >= 768 && window.innerWidth < 992;
    },
    isMd() {
      return window.innerWidth >= 992 && window.innerWidth < 1200;
    },
    isLg() {
      return window.innerWidth >= 1200;
    },
    cleanState() {
      $(window).unbind('scroll');
      $(window).unbind('resize');
      window.google = undefined;

      $(window).scrollTop(0);
      $('html, body').animate({ scrollTop: 0 }, 1);
    },
  };

  /*
   * JQuery extensions
   */
  const Extends = {
    init() {
      $.fn.extend({
        pjax() {
          $.ajax($(this).attr('href'))
            .done((res) => {
              $.each($(res), (index, elem) => {
                if (`#${elem.id}` !== '#wrap') {
                  return;
                }
                History.pushState($(this).text(), $(this).attr('href'), $(this).data('page'));
                Helpers.cleanState();
                $('#wrap').html($(elem).html());

                const classnm = $(this)
                  .data('page')
                  .replace(/-/g, '_');
                UTIL.fire(classnm);
                UTIL.fire(classnm, 'finalize');
              });
            })
            .fail(() => {
              window.location = $(this).attr('href');
            });
        },
        exists() {
          return $(this).length > 0;
        },
      });
    },
  };

  // Use this constiable to set up the common and page specific functions. If you
  // rename this constiable, you will also need to rename the namespace below.
  const Router = {
    // All pages
    common: {
      init() {
        // JavaScript to be fired on all pages
        Extends.init();
      },
      finalize() {
        // JavaScript to be fired on all pages, after page specific JS is fired
      },
    },
    // Home page
    home: {
      init() {
        // JavaScript to be fired on the home page
      },
      finalize() {
        // JavaScript to be fired on the home page, after the init JS
      },
    },
    // About us page, note the change from about-us to about_us.
    about_us: {
      init() {
        // JavaScript to be fired on the about us page
      },
    },
  };

  // The routing fires all common scripts, followed by the page specific scripts.
  // Add additional events for more control over timing e.g. a finalize event
  UTIL = {
    fire(func, funcname, args) {
      let fire;
      const namespace = Router;
      const funcnameArg = funcname === undefined ? 'init' : funcname;
      fire = func !== '';
      fire = fire && namespace[func];
      fire = fire && typeof namespace[func][funcnameArg] === 'function';

      if (fire) {
        namespace[func][funcnameArg](args);
      }
    },
    loadEvents() {
      // Fire common init JS
      UTIL.fire('common');

      // Fire page-specific init JS, and then finalize JS
      $.each(document.body.className.replace(/-/g, '_').split(/\s+/), (i, classnm) => {
        UTIL.fire(classnm);
        UTIL.fire(classnm, 'finalize');
      });

      // Fire common finalize JS
      UTIL.fire('common', 'finalize');
    },
  };

  // Load Events
  $(document).ready(UTIL.loadEvents);
  /* eslint-disable no-undef */
}(jQuery)); // Fully reference jQuery after this point.
