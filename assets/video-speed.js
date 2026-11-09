/* School of Financial Fitness — playback speed for lesson videos.
 *
 * Adds a visible "Speed: 1x" button under every lesson video on course
 * pages. Tap cycles 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x. The choice is
 * remembered (localStorage) and applied to every lesson video, including
 * ones the admin view injects later.
 *
 * ADDITIVE ONLY: it never touches the video tags, the headings, or the
 * progress tracking in progress.js — it only appends one button per
 * .lesson-video block.
 */
(function () {
    'use strict';

    var SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
    var STORE_KEY = 'finfit-playback-speed';

    function savedSpeed() {
        try {
            var v = parseFloat(localStorage.getItem(STORE_KEY));
            if (SPEEDS.indexOf(v) !== -1) return v;
        } catch (e) {}
        return 1;
    }

    function saveSpeed(v) {
        try { localStorage.setItem(STORE_KEY, String(v)); } catch (e) {}
    }

    function label(v) { return 'Speed: ' + v + 'x'; }

    function setAll(rate) {
        document.querySelectorAll('.lesson-video video').forEach(function (v) {
            v.playbackRate = rate;
        });
        document.querySelectorAll('.finfit-speed-btn').forEach(function (b) {
            b.textContent = label(rate);
        });
    }

    function attach(block) {
        var video = block.querySelector('video');
        if (!video) return;
        if (block.querySelector('.finfit-speed-btn')) return;

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'finfit-speed-btn';
        btn.setAttribute('aria-label', 'Change video playback speed');
        btn.textContent = label(savedSpeed());
        btn.addEventListener('click', function () {
            var i = SPEEDS.indexOf(video.playbackRate);
            var next = SPEEDS[(i + 1) % SPEEDS.length];
            saveSpeed(next);
            setAll(next);
        });

        video.playbackRate = savedSpeed();
        video.insertAdjacentElement('afterend', btn);
    }

    function scan() {
        document.querySelectorAll('.lesson-video').forEach(attach);
    }

    var style = document.createElement('style');
    style.textContent =
        '.finfit-speed-btn{margin-top:8px;padding:6px 14px;background:transparent;' +
        'border:1px solid #D4AF37;color:#D4AF37;border-radius:999px;' +
        'font:600 13px Inter,system-ui,sans-serif;cursor:pointer}' +
        '.finfit-speed-btn:hover{background:rgba(212,175,55,.12)}';
    document.head.appendChild(style);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scan);
    } else {
        scan();
    }

    /* Admin view injects paid-module videos after unlock — catch those too. */
    if (document.body) {
        new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
    }
})();
