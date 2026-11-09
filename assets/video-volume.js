/* School of Financial Fitness — adjustable volume for lesson videos.
 *
 * The native video controls on phones only give mute on / mute off, no
 * in-between. This adds a real volume slider under every lesson video:
 * a speaker button (tap to mute / unmute) plus a slider from silent to
 * full. The choice is remembered (localStorage) and applied to every
 * lesson video, including ones the admin view injects later.
 *
 * ADDITIVE ONLY: it never touches the video tags, the headings, the
 * speed button, or the progress tracking in progress.js — it only
 * appends one volume row per .lesson-video block.
 */
(function () {
    'use strict';

    var VOL_KEY = 'finfit-volume';
    var MUTE_KEY = 'finfit-muted';

    function savedVolume() {
        try {
            var v = parseFloat(localStorage.getItem(VOL_KEY));
            if (!isNaN(v) && v >= 0 && v <= 1) return v;
        } catch (e) {}
        return 1;
    }

    function savedMuted() {
        try { return localStorage.getItem(MUTE_KEY) === '1'; } catch (e) { return false; }
    }

    function saveVolume(v) {
        try { localStorage.setItem(VOL_KEY, String(v)); } catch (e) {}
    }

    function saveMuted(m) {
        try { localStorage.setItem(MUTE_KEY, m ? '1' : '0'); } catch (e) {}
    }

    function applyToAll(volume, muted) {
        document.querySelectorAll('.lesson-video video').forEach(function (v) {
            v.volume = volume;
            v.muted = muted;
        });
        document.querySelectorAll('.finfit-vol-row').forEach(function (row) {
            var slider = row.querySelector('.finfit-vol-slider');
            var btn = row.querySelector('.finfit-vol-mute');
            if (slider) slider.value = Math.round(volume * 100);
            if (btn) btn.textContent = (muted || volume === 0) ? '🔇' : '🔊';
        });
    }

    function attach(block) {
        var video = block.querySelector('video');
        if (!video) return;
        if (block.querySelector('.finfit-vol-row')) return;

        var row = document.createElement('div');
        row.className = 'finfit-vol-row';

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'finfit-vol-mute';
        btn.setAttribute('aria-label', 'Mute or unmute video');

        var slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'finfit-vol-slider';
        slider.min = '0';
        slider.max = '100';
        slider.step = '5';
        slider.setAttribute('aria-label', 'Video volume');

        var vol = savedVolume();
        var muted = savedMuted();
        video.volume = vol;
        video.muted = muted;
        slider.value = Math.round(vol * 100);
        btn.textContent = (muted || vol === 0) ? '🔇' : '🔊';

        btn.addEventListener('click', function () {
            var next = !video.muted;
            saveMuted(next);
            applyToAll(video.volume, next);
        });

        slider.addEventListener('input', function () {
            var next = parseInt(slider.value, 10) / 100;
            saveVolume(next);
            if (next > 0) saveMuted(false);
            applyToAll(next, next === 0 ? video.muted : false);
        });

        row.appendChild(btn);
        row.appendChild(slider);

        /* Sit under the speed button when there is one, else under the video. */
        var speedBtn = block.querySelector('.finfit-speed-btn');
        if (speedBtn) {
            speedBtn.insertAdjacentElement('afterend', row);
        } else {
            video.insertAdjacentElement('afterend', row);
        }
    }

    function scan() {
        document.querySelectorAll('.lesson-video').forEach(attach);
    }

    var style = document.createElement('style');
    style.textContent =
        '.finfit-vol-row{display:flex;align-items:center;gap:8px;margin-top:8px}' +
        '.finfit-vol-mute{padding:4px 10px;background:transparent;border:1px solid #D4AF37;' +
        'color:#D4AF37;border-radius:999px;font:600 13px Inter,system-ui,sans-serif;cursor:pointer}' +
        '.finfit-vol-mute:hover{background:rgba(212,175,55,.12)}' +
        '.finfit-vol-slider{flex:1;max-width:220px;accent-color:#D4AF37;cursor:pointer}';
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
