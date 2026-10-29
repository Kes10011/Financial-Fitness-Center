/* School of Financial Fitness — login/account modal + nav button.
 *
 * ADDITIVE ONLY: builds its own modal DOM on load and only ever touches
 * elements carrying [data-auth-nav] (the "Log in" buttons added to the
 * nav/topnav). It never touches the registration form, the WhatsApp
 * routing, the greeting, the quizzes, pricing, or Whop buttons.
 *
 * Views: login | signup | magic | forgot | account (signed in) |
 * connecting (Supabase not wired yet — forms hidden, page unaffected).
 *
 * Keyboard + readability: Escape closes, focus moves into the modal on
 * open and returns to the button that opened it on close, clicking the
 * backdrop closes, all messages live in an aria-live region, and the
 * palette is the site's navy + gold at high contrast (no light-on-light).
 *
 * Exposes: window.FinFitAuthUI = { open(view, prefill), close() }
 *   view: 'login' | 'signup' | 'magic' | 'forgot' | 'account'
 *   prefill: { name, email } — used by reg-account.js after registration.
 */

(function () {
    'use strict';

    var Auth = window.FinFitAuth;
    var lastFocus = null;

    /* ------------------------------------------------------------------
       Modal DOM (built once, hidden until opened)
       ------------------------------------------------------------------ */
    var overlay = document.createElement('div');
    overlay.className = 'auth-overlay';
    overlay.hidden = true;
    overlay.innerHTML =
        '<div class="auth-modal" role="dialog" aria-modal="true" ' +
        'aria-labelledby="auth-modal-title">' +
        '<button type="button" class="auth-close" aria-label="Close">×</button>' +
        '<h3 id="auth-modal-title" class="auth-title">Log in</h3>' +
        '<p class="auth-sub" id="auth-sub"></p>' +
        '<div class="auth-msg" id="auth-msg" aria-live="polite"></div>' +
        '<div id="auth-connecting" class="auth-connecting" hidden>' +
        '<p>Student login is being connected — check back soon.</p>' +
        '<p class="auth-fine">You can still register and watch Module 1 ' +
        'free today; your login will be ready here when the school ' +
        'switches it on.</p></div>' +
        '<form id="auth-form-login" class="auth-view" novalidate>' +
        '<label for="auth-login-email">Email</label>' +
        '<input id="auth-login-email" type="email" required autocomplete="email">' +
        '<label for="auth-login-pass">Password</label>' +
        '<input id="auth-login-pass" type="password" required ' +
        'autocomplete="current-password">' +
        '<button type="submit" class="auth-submit">Log in</button>' +
        '<p class="auth-links"><button type="button" data-auth-view="forgot">' +
        'Forgot password?</button> · ' +
        '<button type="button" data-auth-view="magic">' +
        'Email me a login link instead</button></p>' +
        '<p class="auth-links">New here? ' +
        '<button type="button" data-auth-view="signup">Create an account</button></p>' +
        '</form>' +
        '<form id="auth-form-signup" class="auth-view" novalidate hidden>' +
        '<label for="auth-signup-name">Full name</label>' +
        '<input id="auth-signup-name" type="text" required autocomplete="name">' +
        '<label for="auth-signup-email">Email</label>' +
        '<input id="auth-signup-email" type="email" required autocomplete="email">' +
        '<label for="auth-signup-pass">Password</label>' +
        '<input id="auth-signup-pass" type="password" required minlength="6" ' +
        'autocomplete="new-password">' +
        '<p class="auth-fine">At least 6 characters. This is the login ' +
        'you\u2019ll use to pick up where you left off.</p>' +
        '<button type="submit" class="auth-submit">Create account</button>' +
        '<p class="auth-links">Already have one? ' +
        '<button type="button" data-auth-view="login">Log in</button></p>' +
        '</form>' +
        '<form id="auth-form-magic" class="auth-view" novalidate hidden>' +
        '<label for="auth-magic-email">Email</label>' +
        '<input id="auth-magic-email" type="email" required autocomplete="email">' +
        '<button type="submit" class="auth-submit">Email me a login link</button>' +
        '<p class="auth-fine">No password needed — tap the link in the ' +
        'email and you\u2019re in.</p>' +
        '<p class="auth-links"><button type="button" data-auth-view="login">' +
        'Back to log in</button></p>' +
        '</form>' +
        '<form id="auth-form-forgot" class="auth-view" novalidate hidden>' +
        '<label for="auth-forgot-email">Email</label>' +
        '<input id="auth-forgot-email" type="email" required autocomplete="email">' +
        '<button type="submit" class="auth-submit">Send reset link</button>' +
        '<p class="auth-links"><button type="button" data-auth-view="login">' +
        'Back to log in</button></p>' +
        '</form>' +
        '<div id="auth-view-account" class="auth-view" hidden>' +
        '<p class="auth-account-line">Signed in as <strong id="auth-account-email"></strong></p>' +
        '<p class="auth-fine">Your lesson progress is saved to this account, ' +
        'so you can pick up where you left off on any device.</p>' +
        '<button type="button" class="auth-submit" id="auth-logout-btn">Log out</button>' +
        '</div>' +
        '</div>';
    document.body.appendChild(overlay);

    var titleEl = overlay.querySelector('#auth-modal-title');
    var subEl = overlay.querySelector('#auth-sub');
    var msgEl = overlay.querySelector('#auth-msg');
    var connectingEl = overlay.querySelector('#auth-connecting');

    var VIEWS = {
        login: {
            title: 'Log in',
            sub: 'Welcome back — pick up where you left off.',
            form: 'auth-form-login', focus: 'auth-login-email'
        },
        signup: {
            title: 'Create your account',
            sub: 'One login for every course, on any device.',
            form: 'auth-form-signup', focus: 'auth-signup-name'
        },
        magic: {
            title: 'Log in with an email link',
            sub: 'No password needed for this one.',
            form: 'auth-form-magic', focus: 'auth-magic-email'
        },
        forgot: {
            title: 'Reset your password',
            sub: 'We\u2019ll email you a link to set a new one.',
            form: 'auth-form-forgot', focus: 'auth-forgot-email'
        },
        account: {
            title: 'Your account',
            sub: '',
            form: 'auth-view-account', focus: 'auth-logout-btn'
        }
    };

    function showMsg(text, kind) {
        msgEl.textContent = text || '';
        msgEl.className = 'auth-msg' + (kind ? ' ' + kind : '');
    }

    function showView(view, prefill) {
        var v = VIEWS[view] || VIEWS.login;
        Object.keys(VIEWS).forEach(function (k) {
            var el = document.getElementById(VIEWS[k].form);
            if (el) el.hidden = (k !== view);
        });
        titleEl.textContent = v.title;
        subEl.textContent = v.sub;
        showMsg('');
        if (!Auth || !Auth.configured) {
            /* Unconfigured: hide every form, show the honest state. */
            Object.keys(VIEWS).forEach(function (k) {
                var el = document.getElementById(VIEWS[k].form);
                if (el) el.hidden = true;
            });
            connectingEl.hidden = false;
            titleEl.textContent = 'Student login';
            subEl.textContent = '';
            return;
        }
        connectingEl.hidden = true;
        if (prefill) {
            if (prefill.name) {
                var n = document.getElementById('auth-signup-name');
                if (n) n.value = prefill.name;
            }
            if (prefill.email) {
                ['auth-login-email', 'auth-signup-email',
                 'auth-magic-email', 'auth-forgot-email'].forEach(function (id) {
                    var inp = document.getElementById(id);
                    if (inp) inp.value = prefill.email;
                });
            }
        }
        var focusEl = document.getElementById(v.focus);
        if (focusEl) focusEl.focus();
    }

    function open(view, prefill) {
        lastFocus = document.activeElement;
        overlay.hidden = false;
        document.body.classList.add('auth-open');
        showView(view || 'login', prefill);
    }

    function close() {
        overlay.hidden = true;
        document.body.classList.remove('auth-open');
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    overlay.querySelector('.auth-close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) close();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !overlay.hidden) close();
    });
    overlay.querySelectorAll('[data-auth-view]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            showView(btn.getAttribute('data-auth-view'));
        });
    });

    /* ------------------------------------------------------------------
       Form submits — every failure shows the plain-language message
       from auth.js; the modal never closes on an error.
       ------------------------------------------------------------------ */
    function busy(btn, on) {
        btn.disabled = on;
        if (on) btn.dataset.label = btn.textContent;
        btn.textContent = on ? 'Please wait…' : (btn.dataset.label || btn.textContent);
    }

    function wire(formId, handler) {
        var form = document.getElementById(formId);
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn = form.querySelector('.auth-submit');
            busy(btn, true);
            showMsg('');
            handler(form).then(function () {
                busy(btn, false);
            });
        });
    }

    wire('auth-form-login', function (form) {
        var email = form.querySelector('#auth-login-email').value.trim();
        var pass = form.querySelector('#auth-login-pass').value;
        if (!email || !pass) {
            showMsg('Enter your email and password.', 'error');
            return Promise.resolve();
        }
        return Auth.signIn(email, pass).then(function (res) {
            if (!res.ok) { showMsg(res.message, 'error'); return; }
            showMsg('Welcome back! You\u2019re logged in.', 'success');
            setTimeout(close, 900);
        });
    });

    wire('auth-form-signup', function (form) {
        var name = form.querySelector('#auth-signup-name').value.trim();
        var email = form.querySelector('#auth-signup-email').value.trim();
        var pass = form.querySelector('#auth-signup-pass').value;
        if (!name || !email || pass.length < 6) {
            showMsg('Fill in your name, email, and a password of at least 6 characters.', 'error');
            return Promise.resolve();
        }
        return Auth.signUp(email, pass, name).then(function (res) {
            if (!res.ok) { showMsg(res.message, 'error'); return; }
            if (res.needsConfirmation) {
                showMsg('Account created! Check your inbox to confirm your email, then log in.', 'success');
            } else {
                showMsg('Account created — welcome! You\u2019re logged in.', 'success');
                setTimeout(close, 900);
            }
        });
    });

    wire('auth-form-magic', function (form) {
        var email = form.querySelector('#auth-magic-email').value.trim();
        if (!email) {
            showMsg('Enter your email first.', 'error');
            return Promise.resolve();
        }
        return Auth.signInWithMagicLink(email).then(function (res) {
            if (!res.ok) { showMsg(res.message, 'error'); return; }
            showMsg('Login link sent! Check your inbox and tap the link to sign in.', 'success');
        });
    });

    wire('auth-form-forgot', function (form) {
        var email = form.querySelector('#auth-forgot-email').value.trim();
        if (!email) {
            showMsg('Enter your email first.', 'error');
            return Promise.resolve();
        }
        return Auth.sendPasswordReset(email).then(function (res) {
            if (!res.ok) { showMsg(res.message, 'error'); return; }
            showMsg('Reset link sent! Check your inbox to set a new password.', 'success');
        });
    });

    overlay.querySelector('#auth-logout-btn').addEventListener('click', function () {
        Auth.signOut().then(function () { close(); });
    });

    /* ------------------------------------------------------------------
       Nav button: "Log in" when signed out; first name when signed in
       (clicking it then opens the account view with a Log out option).
       ------------------------------------------------------------------ */
    function firstName(user) {
        if (!user) return '';
        var meta = user.user_metadata || {};
        if (meta.full_name) return meta.full_name.trim().split(/\s+/)[0];
        if (user.email) return user.email.split('@')[0];
        return '';
    }

    function syncNav(user) {
        document.querySelectorAll('[data-auth-nav]').forEach(function (btn) {
            if (user) {
                btn.textContent = firstName(user) || 'My account';
                btn.setAttribute('aria-label', 'Your account — open account options');
                btn.onclick = function () { open('account'); };
            } else {
                btn.textContent = 'Log in';
                btn.setAttribute('aria-label', 'Log in or create an account');
                btn.onclick = function () { open('login'); };
            }
        });
        var acctEmail = document.getElementById('auth-account-email');
        if (acctEmail && user) acctEmail.textContent = user.email || '';
    }

    if (Auth) {
        Auth.getUser().then(syncNav);
        Auth.onAuthChange(function (event, session) {
            syncNav(session ? session.user : null);
            /* Magic-link / reset redirects land back here with a fresh
               session: greet briefly, then let the student carry on. */
            if ((event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY') &&
                session && session.user) {
                showMsg('', '');
            }
        });
    } else {
        syncNav(null);
    }

    window.FinFitAuthUI = { open: open, close: close, showView: showView };
})();
