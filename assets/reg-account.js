/* School of Financial Fitness — registration → account bridge.
 *
 * ADDITIVE ONLY, same pattern as greeting.js: this file adds a SECOND
 * submit listener to #reg-form (it loads last, so it runs after the
 * page's own handler). It never touches the page's handler, the
 * WhatsApp routing, the sheet placeholder, or the greeting card.
 *
 * Behaviour:
 *   - Student typed a password into the optional "Create a password"
 *     field → create their Supabase account from the form's name /
 *     email / password, then append one short line to the on-page
 *     confirmation (#reg-done) saying the login is ready (or, if email
 *     confirmation is on, to check their inbox first).
 *   - Student left the password blank and is not already signed in →
 *     open the account modal on the Create account view with their
 *     name and email prefilled: "Want a login so you can pick up where
 *     you left off?"
 *   - Login not wired yet (placeholder config) → do nothing at all:
 *     the registration, greeting, and WhatsApp flow carry on exactly
 *     as today, with no dead-end popup.
 *   - Already signed in → do nothing; they have a login already.
 *
 * SAFETY: the password is read only to hand it to Supabase Auth. It is
 * never written to the page, never logged, and never sent to WhatsApp —
 * the page's own handler reads its fields by id and never sees it.
 */

(function () {
    'use strict';

    var form = document.getElementById('reg-form');
    if (!form) return;

    var Auth = window.FinFitAuth;
    var UI = window.FinFitAuthUI;

    function note(text) {
        /* Append (never replace) one line to the page's own
           confirmation block, which is visible by the time this
           listener runs. */
        var done = document.getElementById('reg-done');
        if (!done) return;
        var p = document.createElement('p');
        p.className = 'auth-reg-note';
        p.style.cssText = 'color:#D4AF37;font-weight:600;margin-top:10px;';
        p.textContent = text;
        done.appendChild(p);
    }

    form.addEventListener('submit', function () {
        if (!Auth || !Auth.configured) return;

        Auth.getUser().then(function (user) {
            if (user) return; /* already logged in — nothing to offer */

            var nameEl = document.getElementById('f-name');
            var emailEl = document.getElementById('f-email');
            var passEl = document.getElementById('f-password');
            if (!emailEl) return;

            var name = nameEl ? nameEl.value.trim() : '';
            var email = emailEl.value.trim();
            var password = passEl ? passEl.value : '';

            if (password) {
                if (password.length < 6) {
                    note('Your password needs at least 6 characters — ' +
                        'no login was created. Use "Log in" at the top ' +
                        'of the page to create one.');
                    return;
                }
                Auth.signUp(email, password, name).then(function (res) {
                    if (!res.ok) {
                        note(res.message + ' Use "Log in" at the top ' +
                            'of the page to try again.');
                        return;
                    }
                    if (res.needsConfirmation) {
                        note('Account created! Check your inbox to ' +
                            'confirm your email, then log in any time ' +
                            'to pick up where you left off.');
                    } else {
                        note('Your login is ready — next time, use ' +
                            '"Log in" at the top of the page with this ' +
                            'email and password to pick up where you ' +
                            'left off.');
                    }
                });
            } else if (UI) {
                /* No password: offer the login, prefilled, after the
                   page's own registration + greeting have run. */
                setTimeout(function () {
                    UI.open('signup', { name: name, email: email });
                }, 400);
            }
        });
    });
})();
