/* FinFit admin access — password gate, no username.
 *
 * - Any of the three admin passwords unlocks admin mode for this
 *   browser tab only (sessionStorage). Closing the tab locks it again.
 * - Passwords are stored ONLY as SHA-256 hashes — never as plain text
 *   in this file, in memory notes, or anywhere else in the repo.
 * - In admin mode, course pages open up: the "Unlock Module" payment
 *   buttons are hidden and every lesson video plays where its file
 *   exists on the site; lessons with no video file yet show a
 *   "coming soon" note instead of a broken player.
 * - HONEST LIMIT (read before relying on this): this is a courtesy
 *   gate on a static site, not a vault. Anyone who opens the browser's
 *   developer tools can flip the flag, and short predictable
 *   passwords can be brute-forced from their hashes. It keeps casual
 *   visitors out. Real enforcement would need a server-side check.
 */
(function () {
    'use strict';

    // SHA-256 hashes of the three admin passwords (Kester, Ivan, Michelle).
    var HASHES = {
        '7fc831a8f8557be7bcbd1ad57ce77e3eb4f842e6296c5c779af5222aa2f6bf83': true,
        '4a578c9056a3e88099b1b254c6285d1b24bcfe84ffc49826aee961e778c17ea1': true,
        '31348b748445feb49252955ab7be744712abb9314c8c327b65a830c37101ddc9': true
    };
    var FLAG = 'finfit-admin';

    function isAdmin() {
        try { return sessionStorage.getItem(FLAG) === '1'; } catch (e) { return false; }
    }
    function setAdmin(on) {
        try {
            if (on) { sessionStorage.setItem(FLAG, '1'); }
            else { sessionStorage.removeItem(FLAG); }
        } catch (e) { /* storage unavailable: admin lasts for this page only */ }
    }

    function sha256Hex(text) {
        if (!window.crypto || !window.crypto.subtle) {
            return Promise.resolve(null);
        }
        var data = new TextEncoder().encode(text);
        return window.crypto.subtle.digest('SHA-256', data).then(function (buf) {
            var bytes = new Uint8Array(buf);
            var out = '';
            for (var i = 0; i < bytes.length; i++) {
                out += ('0' + bytes[i].toString(16)).slice(-2);
            }
            return out;
        });
    }

    /* ---------- course-page unlock transform ---------- */

    function findLessonPrefix() {
        var videos = document.querySelectorAll('video[src]');
        for (var i = 0; i < videos.length; i++) {
            var m = videos[i].getAttribute('src').match(/assets\/lessons\/(.+)-m1-l\d+\.mp4$/);
            if (m) { return m[1]; }
        }
        return null;
    }

    function moduleNumber(modEl) {
        var numEl = modEl.querySelector('.mod-num');
        if (!numEl) { return null; }
        var m = numEl.textContent.match(/(\d+)/);
        return m ? parseInt(m[1], 10) : null;
    }

    function injectLessonVideos() {
        var prefix = findLessonPrefix();
        var lockedMods = document.querySelectorAll('.mod.locked');
        lockedMods.forEach(function (modEl) {
            modEl.classList.add('admin-open');
            var modNum = moduleNumber(modEl);
            var list = modEl.querySelector('ul');
            if (!list || modNum === null || !prefix) { return; }
            var items = list.querySelectorAll('li');
            var html = '';
            items.forEach(function (li, idx) {
                var n = idx + 1;
                var title = li.textContent.trim();
                var src = '../assets/lessons/' + prefix + '-m' + modNum + 'l' + n + '.mp4';
                html += '<div class="lesson-video admin-lesson">' +
                    '<h4>Lesson ' + n + ': ' + title.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</h4>' +
                    '<video controls preload="metadata" src="' + src + '"></video>' +
                    '<p class="admin-coming-soon" hidden>Lesson video coming soon — it appears here automatically once it lands on the site.</p>' +
                    '</div>';
            });
            list.insertAdjacentHTML('afterend', html);
            modEl.querySelectorAll('.admin-lesson video').forEach(function (vid) {
                vid.addEventListener('error', function () {
                    vid.style.display = 'none';
                    var note = vid.parentNode.querySelector('.admin-coming-soon');
                    if (note) { note.hidden = false; }
                });
            });
        });
    }

    function removeInjectedVideos() {
        document.querySelectorAll('.admin-lesson').forEach(function (el) { el.remove(); });
        document.querySelectorAll('.mod.locked.admin-open').forEach(function (el) {
            el.classList.remove('admin-open');
        });
    }

    /* ---------- banner (pages without an Admin nav button) ---------- */

    function showBanner() {
        if (document.getElementById('adminNavBtn')) { return; }
        if (document.getElementById('finfit-admin-banner')) { return; }
        var bar = document.createElement('div');
        bar.id = 'finfit-admin-banner';
        bar.innerHTML = '<span>Admin access on — every course is open</span>' +
            '<button type="button" id="finfit-admin-lock">Lock</button>';
        document.body.appendChild(bar);
        document.getElementById('finfit-admin-lock').addEventListener('click', function () {
            lock();
        });
    }

    function hideBanner() {
        var bar = document.getElementById('finfit-admin-banner');
        if (bar) { bar.remove(); }
    }

    function syncNavButton() {
        var btn = document.getElementById('adminNavBtn');
        if (btn) { btn.textContent = isAdmin() ? 'Admin ✓' : 'Admin'; }
    }

    function applyAdminMode() {
        if (document.body.classList.contains('finfit-admin-on')) { return; }
        document.body.classList.add('finfit-admin-on');
        injectLessonVideos();
        showBanner();
        syncNavButton();
    }

    function removeAdminMode() {
        document.body.classList.remove('finfit-admin-on');
        removeInjectedVideos();
        hideBanner();
        syncNavButton();
    }

    function lock() {
        setAdmin(false);
        removeAdminMode();
        closeModal();
    }

    /* ---------- modal ---------- */

    function buildModal() {
        var existing = document.getElementById('finfit-admin-modal');
        if (existing) { return existing; }
        var overlay = document.createElement('div');
        overlay.id = 'finfit-admin-modal';
        overlay.className = 'finfit-admin-overlay';
        overlay.hidden = true;
        overlay.innerHTML =
            '<div class="finfit-admin-card" role="dialog" aria-modal="true" aria-label="Admin access">' +
            '<button type="button" class="finfit-admin-close" aria-label="Close">&times;</button>' +
            '<div id="finfit-admin-prompt">' +
            '<h3>Admin access</h3>' +
            '<p>Enter the admin password to open all courses. No username needed.</p>' +
            '<form id="finfit-admin-form">' +
            '<label for="finfit-admin-pass">Admin password</label>' +
            '<input id="finfit-admin-pass" type="password" placeholder="Admin password" autocomplete="off">' +
            '<p class="finfit-admin-error" id="finfit-admin-error" hidden></p>' +
            '<button type="submit">Unlock</button>' +
            '</form>' +
            '</div>' +
            '<div id="finfit-admin-open" hidden>' +
            '<h3>Admin access is on</h3>' +
            '<p>Every course is open on this tab. Closing the tab locks it again.</p>' +
            '<button type="button" id="finfit-admin-lock-btn">Lock admin access</button>' +
            '</div>' +
            '</div>';
        document.body.appendChild(overlay);
        overlay.querySelector('.finfit-admin-close').addEventListener('click', closeModal);
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) { closeModal(); }
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') { closeModal(); }
        });
        overlay.querySelector('#finfit-admin-form').addEventListener('submit', function (e) {
            e.preventDefault();
            var input = document.getElementById('finfit-admin-pass');
            var err = document.getElementById('finfit-admin-error');
            var value = input.value.trim();
            if (!value) {
                err.textContent = 'Enter the admin password.';
                err.hidden = false;
                input.focus();
                return;
            }
            sha256Hex(value).then(function (hash) {
                if (hash && HASHES[hash]) {
                    setAdmin(true);
                    applyAdminMode();
                    showOpenState();
                } else if (hash === null) {
                    err.textContent = 'This connection cannot check the password. Please open the site over a secure connection and try again.';
                    err.hidden = false;
                } else {
                    err.textContent = 'That password isn\u2019t right. Try again.';
                    err.hidden = false;
                    input.value = '';
                    input.focus();
                }
            });
        });
        overlay.querySelector('#finfit-admin-lock-btn').addEventListener('click', lock);
        return overlay;
    }

    function showOpenState() {
        var overlay = document.getElementById('finfit-admin-modal');
        if (!overlay) { return; }
        overlay.querySelector('#finfit-admin-prompt').hidden = true;
        overlay.querySelector('#finfit-admin-open').hidden = false;
    }

    function showPromptState() {
        var overlay = document.getElementById('finfit-admin-modal');
        if (!overlay) { return; }
        overlay.querySelector('#finfit-admin-prompt').hidden = false;
        overlay.querySelector('#finfit-admin-open').hidden = true;
        var err = document.getElementById('finfit-admin-error');
        if (err) { err.hidden = true; }
        var input = document.getElementById('finfit-admin-pass');
        if (input) { input.value = ''; }
    }

    function openModal() {
        var overlay = buildModal();
        if (isAdmin()) { showOpenState(); } else { showPromptState(); }
        overlay.hidden = false;
        var input = document.getElementById('finfit-admin-pass');
        if (input && !isAdmin()) { input.focus(); }
    }

    function closeModal() {
        var overlay = document.getElementById('finfit-admin-modal');
        if (overlay) { overlay.hidden = true; }
    }

    /* ---------- init ---------- */

    document.addEventListener('DOMContentLoaded', function () {
        if (isAdmin()) { applyAdminMode(); }
        var btn = document.getElementById('adminNavBtn');
        if (btn) {
            syncNavButton();
            btn.addEventListener('click', openModal);
        }
    });
})();
