/* Plays muted videos marked data-autoplay only while at least 40% is on screen.
   Skips autoplay entirely for visitors who prefer reduced motion. */
(function () {
  var vids = Array.prototype.slice.call(document.querySelectorAll('video[data-autoplay]'));
  if (!vids.length) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  function play(v) {
    if (v.preload === 'none') v.preload = 'auto';
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }

  if (!('IntersectionObserver' in window)) {
    vids.forEach(play);
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var v = entry.target;
      if (entry.isIntersecting && entry.intersectionRatio >= 0.4) play(v);
      else if (!v.paused) v.pause();
    });
  }, { threshold: [0, 0.4] });

  vids.forEach(function (v) { io.observe(v); });
})();
