/* School of Financial Fitness — remember a free Module 1 registration.
 *
 * Problem: the registration gate revealed the Module 1 videos on submit,
 * but on the next visit the videos were hidden again and the student had
 * to fill the form a second time — even though the page already greeted
 * them with "Welcome back".
 *
 * Fix: remember the registration per course (localStorage). On a return
 * visit the form stays hidden, the confirmation shows, and the videos
 * are visible straight away. No WhatsApp tab opens on a return visit,
 * and no account or password is involved.
 *
 * ADDITIVE ONLY, same pattern as reg-account.js: this file adds a SECOND
 * submit listener to #reg-form (it loads after the page's own handler)
 * and never touches the page's handler, the WhatsApp routing, the sheet
 * placeholder, or the greeting card.
 */
(function () {
    'use strict';

    var form = document.getElementById('reg-form');
    var done = document.getElementById('reg-done');
    var vids = document.getElementById('m1-videos');
    if (!form || !done || !vids) return;

    var KEY = 'finfit-m1-registered:' + location.pathname;

    function remembered() {
        try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; }
    }

    function remember() {
        try { localStorage.setItem(KEY, '1'); } catch (e) {}
    }

    function reveal() {
        form.style.display = 'none';
        done.style.display = 'block';
        vids.hidden = false;
    }

    /* Return visit: skip the form, show the lessons. */
    if (remembered()) reveal();

    /* Fresh registration: the page's own handler reveals the videos and
       routes to WhatsApp; this only records that it happened. */
    form.addEventListener('submit', remember);
})();
