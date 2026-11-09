// One video at a time: when any lesson video starts playing, pause all others.
// Uses a capture-phase 'play' listener on the document, so it covers videos
// added later too (admin mode injects lesson videos after load).
// Fix for 2026-11-09: students heard two voices at once because the page
// never stopped the first lesson when a second one started.
(function () {
  document.addEventListener('play', function (event) {
    var playing = event.target;
    if (!playing || playing.tagName !== 'VIDEO') return;
    document.querySelectorAll('video').forEach(function (v) {
      if (v !== playing && !v.paused) v.pause();
    });
  }, true);
})();
