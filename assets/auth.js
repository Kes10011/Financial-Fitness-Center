/* School of Financial Fitness — student accounts (vanilla JS).
 *
 * Wraps Supabase Auth (email + password, with magic-link login as the
 * backup). Sessions persist with Supabase's default storage, so a page
 * reload does NOT log a student out, and magic-link / password-reset
 * redirects back to the same page are picked up automatically
 * (Supabase JS v2 detects the session in the URL by default).
 *
 * FAIL-SAFE BY DESIGN: if the Supabase CDN failed to load, or if
 * assets/supabase-config.js still holds the PASTE_… placeholders, every
 * function below resolves with { ok: false } and a plain-language
 * message instead of throwing — the page, the registration form, the
 * WhatsApp flow, the greeting, and the quizzes all keep working.
 * No raw error object is ever shown to a student.
 *
 * Exposes: window.FinFitAuth = {
 *   configured, signUp, signIn, signInWithMagicLink, signOut,
 *   sendPasswordReset, getSession, getUser, onAuthChange
 * }
 */

(function () {
    'use strict';

    var cfg = window.FINFIT_SUPABASE || {};
    var PLACEHOLDER = function (v) {
        return !v || v.indexOf('PASTE_') === 0;
    };

    var client = null;
    var configured = false;

    /* The Supabase JS v2 client is loaded from CDN by a <script> tag in
       each page, before this file. If it never arrived (offline, blocked
       CDN), we stay unconfigured rather than crash. */
    if (typeof window.supabase !== 'undefined' &&
        window.supabase.createClient &&
        !PLACEHOLDER(cfg.url) && !PLACEHOLDER(cfg.anonKey)) {
        try {
            /* Default options on purpose: persistSession keeps the
               student logged in across reloads, and detectSessionInUrl
               picks up magic-link / reset-password redirects. */
            client = window.supabase.createClient(cfg.url, cfg.anonKey);
            configured = true;
        } catch (e) {
            client = null;
            configured = false;
        }
    }

    /* Plain-language versions of the errors students actually hit.
       Anything unmapped falls back to a generic line — never the raw
       Supabase message, which can leak internals or read like jargon. */
    function friendly(err) {
        if (!err) return 'Something went wrong. Please try again.';
        var m = (err.message || '').toLowerCase();
        if (m.indexOf('invalid login credentials') !== -1)
            return 'That email or password doesn\u2019t match our records. Try again, or use \u201cForgot password\u201d.';
        if (m.indexOf('user already registered') !== -1)
            return 'There\u2019s already an account for that email. Try logging in instead.';
        if (m.indexOf('password should be at least') !== -1)
            return 'Passwords need at least 6 characters.';
        if (m.indexOf('email link is invalid or has expired') !== -1)
            return 'That login link expired or was already used. Ask for a new one.';
        if (m.indexOf('email rate limit exceeded') !== -1)
            return 'Too many tries just now \u2014 wait a minute and try again.';
        if (m.indexOf('failed to fetch') !== -1 || m.indexOf('network') !== -1)
            return 'Can\u2019t reach the login service. Check your connection and try again.';
        if (m.indexOf('email not confirmed') !== -1)
            return 'Please confirm your email first \u2014 check your inbox for the confirmation link.';
        return 'Something went wrong. Please try again.';
    }

    function notConfigured() {
        return {
            ok: false,
            message: 'Student login is being connected \u2014 check back soon.'
        };
    }

    function here() {
        /* Redirects return to the exact page the student started on,
           so a magic link sent from a course page lands back there. */
        return window.location.href.split('#')[0];
    }

    var Auth = {
        configured: configured,

        /* Create an account. The student's name is stored as profile
           metadata on the account (no separate table needed). Returns
           { ok, needsConfirmation } — when email confirmation is on,
           there is no session yet and the student must confirm first. */
        signUp: function (email, password, fullName) {
            if (!configured)
                return Promise.resolve(notConfigured());
            return client.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: { full_name: fullName || '' },
                    emailRedirectTo: here()
                }
            }).then(function (res) {
                if (res.error) return { ok: false, message: friendly(res.error) };
                return {
                    ok: true,
                    needsConfirmation: !res.data.session,
                    user: res.data.user
                };
            }).catch(function (e) {
                return { ok: false, message: friendly(e) };
            });
        },

        signIn: function (email, password) {
            if (!configured)
                return Promise.resolve(notConfigured());
            return client.auth.signInWithPassword({
                email: email,
                password: password
            }).then(function (res) {
                if (res.error) return { ok: false, message: friendly(res.error) };
                return { ok: true, user: res.data.user };
            }).catch(function (e) {
                return { ok: false, message: friendly(e) };
            });
        },

        /* Password-free backup: emails the student a one-time login
           link that lands back on this page and signs them in. */
        signInWithMagicLink: function (email) {
            if (!configured)
                return Promise.resolve(notConfigured());
            return client.auth.signInWithOtp({
                email: email,
                options: { emailRedirectTo: here() }
            }).then(function (res) {
                if (res.error) return { ok: false, message: friendly(res.error) };
                return { ok: true };
            }).catch(function (e) {
                return { ok: false, message: friendly(e) };
            });
        },

        signOut: function () {
            if (!configured)
                return Promise.resolve(notConfigured());
            return client.auth.signOut().then(function (res) {
                if (res.error) return { ok: false, message: friendly(res.error) };
                return { ok: true };
            }).catch(function (e) {
                return { ok: false, message: friendly(e) };
            });
        },

        sendPasswordReset: function (email) {
            if (!configured)
                return Promise.resolve(notConfigured());
            return client.auth.resetPasswordForEmail(email, {
                redirectTo: here()
            }).then(function (res) {
                if (res.error) return { ok: false, message: friendly(res.error) };
                return { ok: true };
            }).catch(function (e) {
                return { ok: false, message: friendly(e) };
            });
        },

        getSession: function () {
            if (!configured)
                return Promise.resolve(null);
            return client.auth.getSession().then(function (res) {
                return res.data.session || null;
            }).catch(function () {
                return null;
            });
        },

        getUser: function () {
            if (!configured)
                return Promise.resolve(null);
            return client.auth.getUser().then(function (res) {
                return res.data.user || null;
            }).catch(function () {
                return null;
            });
        },

        /* Subscribe to sign-in / sign-out so the nav button and the
           Continue card can update without a reload. Returns the
           subscription; callers need not unsubscribe on this site. */
        onAuthChange: function (cb) {
            if (!configured) return null;
            return client.auth.onAuthStateChange(function (event, session) {
                cb(event, session);
            });
        },

        /* Raw client for progress.js. Null when unconfigured — callers
           must check FinFitAuth.configured first. */
        _client: client
    };

    window.FinFitAuth = Auth;
})();
