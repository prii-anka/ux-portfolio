/* Shows the visitor's own city next to the clock. The clock itself already uses the visitor's local time.
   1. Instant guess from the browser's time zone (no network).
   2. Refined from an IP lookup, cached for the session. Falls back silently. */
(function () {
  var KEY = 'visitorCity';
  var ALIAS = { Calcutta: 'Kolkata', Kiev: 'Kyiv', Saigon: 'Ho Chi Minh City', Rangoon: 'Yangon', Katmandu: 'Kathmandu' };

  function paint(city) {
    if (!city) return;
    document.querySelectorAll('[data-visitor-city]').forEach(function (el) { el.textContent = city; });
  }

  function fromTimeZone() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      var c = tz.split('/').pop().replace(/_/g, ' ');
      if (!c || /^(UTC|GMT|Etc)/.test(c)) return '';
      return ALIAS[c] || c;
    } catch (e) { return ''; }
  }

  function cached() { try { return sessionStorage.getItem(KEY) || ''; } catch (e) { return ''; } }
  function save(c) { try { sessionStorage.setItem(KEY, c); } catch (e) {} }

  function run() {
    var c = cached();
    paint(c || fromTimeZone());
    if (c || !window.fetch) return;
    var ctrl = window.AbortController ? new AbortController() : null;
    var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, 4000);
    fetch('https://get.geojs.io/v1/ip/geo.json', ctrl ? { signal: ctrl.signal } : {})
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        clearTimeout(t);
        var city = d && d.city ? String(d.city).trim() : '';
        if (city && city.length < 40) { save(city); paint(city); }
      })
      .catch(function () { clearTimeout(t); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
