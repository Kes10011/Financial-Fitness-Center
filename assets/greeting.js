/* School of Financial Fitness — Personalized Module 1 greeting (vanilla JS, no dependencies).
 *
 * What it does: when a student completes the Module 1 registration form on a
 * course page, they get a personalized greeting before the Module 1 videos:
 * a greeting card in text ("Hi {FirstName}, welcome to {Course}!") plus a
 * spoken greeting in the lesson narrator's voice, then the videos. First
 * visit only per course; returning students see a short "Welcome back,
 * {FirstName}" line instead.
 *
 * VOICE (Kester's call, 2026-10-24): the spoken greeting is a PRE-RECORDED
 * clip per course in the lesson narrator's voice — the name is shown on
 * the card, not spoken, because names are unbounded and per-student
 * synthesis would need a backend voice endpoint and a paid-tier key.
 * The student's DEVICE voice is NEVER used (Kester rejected it as
 * terrible). If a clip fails to load, the card still shows and no voice
 * plays — a silent card beats a bad voice, always.
 *
 * ADDITIVE ONLY: this file never touches the page's own registration submit
 * handler. It adds a second submit listener (this script loads last, so it
 * runs after the page's handler) that only reads the submitted name and
 * course and shows the greeting. The WhatsApp prefilled routing and the
 * sheet-logging placeholder in the page's own handler keep working exactly
 * as they do today.
 *
 * Course name comes from the page itself (#f-course value). The per-course
 * localStorage key is derived from the page filename (e.g. greeted_
 * financial-literacy-for-kids), falling back to a slug of the course name.
 */

(function () {
    'use strict';

    /* ------------------------------------------------------------------
     * Voice: one pre-recorded narrator clip per course, keyed by the
     * exact #f-course value on the page. Clips live in
     * assets/greeting-audio/ (same narrator voice as the lessons).
     * Audio is an enhancement only: any failure must never break the
     * greeting card or the videos, and there is NO device-voice fallback.
     * ------------------------------------------------------------------ */
    var GREETING_AUDIO = {
        'A.I Fundamentals': 'ai-fundamentals.mp3',
        'Complete Financial Literacy': 'complete-financial-literacy.mp3',
        'Cryptocurrency Fundamentals': 'cryptocurrency-fundamentals.mp3',
        'Day Trading Mastery': 'day-trading-mastery.mp3',
        'DeFi & Advanced Crypto': 'defi-advanced-crypto.mp3',
        'Financial Literacy for Kids': 'financial-literacy-for-kids.mp3',
        'Stock Market Investing 101': 'stock-market-investing.mp3'
    };

    var currentAudio = null;

    function playGreeting(course) {
        try {
            stopGreeting();
            var file = GREETING_AUDIO[course];
            if (!file || typeof Audio === 'undefined') return;
            /* Resolved against the page URL: from courses/*.html this
               lands on assets/greeting-audio/; from the site root it
               lands on the same folder. */
            var url = new URL('../assets/greeting-audio/' + file, window.location.href).toString();
            currentAudio = new Audio(url);
            var play = currentAudio.play();
            if (play && play.catch) play.catch(function () { /* autoplay blocked: card still shows */ });
        } catch (e) { /* audio must never break the card */ }
    }

    function stopGreeting() {
        try {
            if (currentAudio) { currentAudio.pause(); currentAudio = null; }
        } catch (e) { /* ignore */ }
    }

    function firstNameOf(fullName) {
        var parts = (fullName || '').trim().split(/\s+/);
        return parts[0] || '';
    }

    /* Greeting names are spoken-friendly, not catalog titles: the stock
       course greets as "Investing in the Stock Market", never with the
       "101" tag. Every other course greets under its own name. */
    function greetingCourseName(course) {
        if ((course || '').indexOf('Stock Market Investing 101') !== -1) {
            return 'Investing in the Stock Market';
        }
        return course;
    }

    function slugify(text) {
        return (text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

    function courseId(courseName) {
        var path = (window.location.pathname || '').split('/').pop() || '';
        var fromFile = path.replace(/\.html?$/i, '');
        return slugify(fromFile) || slugify(courseName) || 'course';
    }

    function storeGet(key) {
        try { return window.localStorage.getItem(key); } catch (e) { return null; }
    }

    function storeSet(key, value) {
        try { window.localStorage.setItem(key, value); } catch (e) { /* private mode: greeting still shows, just not remembered */ }
    }

    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text !== undefined && text !== null) n.textContent = text;
        return n;
    }

    /* Greeting card. All student data goes through textContent, never
       innerHTML, so a name can never inject markup. */
    function buildCard(first, full, course) {
        var card = el('div', 'finfit-greeting');
        card.appendChild(el('div', 'finfit-greeting-tag', 'Welcome!'));
        card.appendChild(el('h3', 'finfit-greeting-title',
            'Hi ' + first + ', welcome to ' + course + '!'));
        card.appendChild(el('p', 'finfit-greeting-sub',
            full + ' — great to have you here. Hope you enjoy it!'));
        var row = el('div', 'finfit-greeting-row');
        var cont = el('button', 'finfit-greeting-btn', 'Continue to Module 1');
        cont.type = 'button';
        var skip = el('button', 'finfit-greeting-skip', 'Skip');
        skip.type = 'button';
        var dismiss = function () { stopGreeting(); if (card.parentNode) card.parentNode.removeChild(card); };
        cont.addEventListener('click', dismiss);
        skip.addEventListener('click', dismiss);
        row.appendChild(cont);
        row.appendChild(skip);
        card.appendChild(row);
        return card;
    }

    function buildWelcomeBack(first) {
        return el('p', 'finfit-welcome-back', 'Welcome back, ' + first + '!');
    }

    function init() {
        var form = document.getElementById('reg-form');
        var courseInput = document.getElementById('f-course');
        var course = courseInput ? courseInput.value.trim() : '';
        var id = courseId(course);
        var key = 'greeted_' + id;

        /* Registration section: the form's parent is the .reg block on
           every course page. The greeting card goes right after it, which
           is directly above the Module 1 videos (or, on courses whose
           Module 1 lands with the launch batch, directly above the
           "Continue the course" section). */
        var regBlock = form ? form.parentElement : null;

        /* Return visit: short text line only, above the registration
           section, no audio, nothing blocking the videos. */
        var remembered = storeGet(key);
        if (remembered && regBlock && regBlock.parentNode) {
            regBlock.parentNode.insertBefore(buildWelcomeBack(remembered), regBlock);
        }

        if (!form) return;

        /* Second submit listener — additive only. It runs after the
           page's own handler (this script loads last), re-validates the
           same required fields, and only then shows the greeting. It
           never prevents, stops, or alters the page's own submit work
           (WhatsApp routing, sheet logging, revealing the videos). */
        form.addEventListener('submit', function () {
            var nameEl = document.getElementById('f-name');
            var emailEl = document.getElementById('f-email');
            var waEl = document.getElementById('f-wa');
            var full = nameEl ? nameEl.value.trim() : '';
            var email = emailEl ? emailEl.value.trim() : '';
            var wa = waEl ? waEl.value.trim() : '';
            if (!full || !email || !wa || !course) return;

            var first = firstNameOf(full);
            if (!first) return;

            /* First-visit only, per student: a stored name that matches
               this student means they were already greeted — skip the
               card and audio. A different name is a different student on
               a shared device, so they get their own first greeting. */
            var previous = storeGet(key);
            if (previous && previous.toLowerCase() === first.toLowerCase()) return;

            var old = document.querySelector('.finfit-greeting');
            if (old && old.parentNode) old.parentNode.removeChild(old);

            if (regBlock && regBlock.parentNode) {
                var greetCourse = greetingCourseName(course);
                var card = buildCard(first, full, greetCourse);
                regBlock.parentNode.insertBefore(card, regBlock.nextSibling);
                storeSet(key, first);
                if (card.scrollIntoView) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
                playGreeting(course);
            }
        });
    }

    /* Exposed for reuse: the same voice function and name helpers the
       course pages use. */
    window.FinFitGreeting = {
        playGreeting: playGreeting,
        stopGreeting: stopGreeting,
        greetingCourseName: greetingCourseName,
        firstNameOf: firstNameOf
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
