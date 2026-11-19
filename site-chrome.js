/* Shared header clock + footer "back to top" for case study pages. */
(function () {
  function tick() {
    var d = new Date(), h = d.getHours(), m = String(d.getMinutes()).padStart(2, '0');
    var t = ((h % 12) || 12) + ':' + m + ' ' + (h >= 12 ? 'PM' : 'AM');
    document.querySelectorAll('[data-sc-time]').forEach(function (el) { el.textContent = t; });
  }
  tick();
  setInterval(tick, 30000);

  document.querySelectorAll('[data-sc-top]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var opts = { top: 0, behavior: reduce ? 'auto' : 'smooth' };
      // Scroll whichever container is actually scrolling (the graphics page scrolls a panel, not the window)
      var el = a.parentElement;
      while (el && el !== document.body) {
        var oy = getComputedStyle(el).overflowY;
        if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight) { el.scrollTo(opts); return; }
        el = el.parentElement;
      }
      window.scrollTo(opts);
    });
  });
})();
