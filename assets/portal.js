/* School of Financial Fitness — Student Portal logic (vanilla JS).
 *
 * What it does, in order:
 *   1. Checks the student's session via FinFitAuth (assets/auth.js).
 *      Logged out  -> friendly gate screen + login modal buttons.
 *      Logged in   -> the portal: Continue hero, My Courses grid with
 *                     progress bars, expandable lesson lists for
 *                     reviewing past lessons, and Study Guides.
 *   2. Reads lesson_progress rows (see progress.sql) for the student
 *      and matches them to the catalog lesson list below.
 *
 * HONEST ACCESS RULE: this portal NEVER unlocks paid content. Every
 * link goes to a course page, where the existing gating applies:
 * Module 1 is free everywhere; modules 2+ stay locked with their
 * price/unlock buttons until the student unlocks them there. The
 * portal shows progress only for courses the student started, and
 * never claims a course is "purchased" — no purchase record exists
 * yet (Whop checkout links are still null; purchases currently go
 * through the WhatsApp intent flow on the course pages).
 *
 * Lesson totals below are VERIFIED against course-catalog.md (3
 * lessons per module): FL 15, Crypto 15, Stock 15, Day Trading 18,
 * AI 18, DeFi 18, Kids 15 = 114 lessons. An earlier draft said 10/12
 * (2 per module) — that was wrong; the catalog is 3 per module.
 *
 * Lesson anchors match progress.js exactly: a lesson video file
 * "<prefix>-m<M>l<L>.mp4" is recorded as lesson_id
 * "lesson-<prefix>-m<M>l<L>" and linked as
 * "courses/<slug>.html#lesson-<prefix>-m<M>l<L>".
 * Matching a progress row to a catalog lesson uses only the m<M>l<L>
 * part of the lesson_id, so it works for any video prefix, including
 * courses whose videos have not landed yet.
 */

(function () {
    'use strict';

    /* ------------------------------------------------------------------
       Catalog: course order, titles, pages, and module/lesson titles
       (verified against ~/workspace/finfit-build/course-catalog.md).
       ------------------------------------------------------------------ */
    var COURSES = [
        {
            slug: 'complete-financial-literacy',
            title: 'Complete Financial Literacy',
            page: 'courses/complete-financial-literacy.html',
            modules: [
                { title: 'Understanding Personal Finance', lessons: ['What Financial Fitness Really Means', 'Know Your Numbers: Your Personal Money Snapshot', 'The Pay-Yourself-First System'] },
                { title: 'Budgeting & Cash Flow Management', lessons: ['Building a Budget That Fits Your Real Life', 'Tracking Cash Flow Without the Overwhelm', 'Planning for Irregular Income and Big Expenses'] },
                { title: 'Debt Management Strategies', lessons: ['Know Exactly What You Owe', 'Avalanche vs. Snowball: Choosing Your Payoff Plan', 'Talking to Lenders and Avoiding New Debt Traps'] },
                { title: 'Introduction to Investing', lessons: ['Saving vs. Investing: What Is the Difference?', 'Risk, Return, and Time Horizon Explained Simply', 'Your First Investment Options in Trinidad & Tobago'] },
                { title: 'Building Wealth Over Time', lessons: ['The Power of Consistency and Compound Growth', 'Protecting What You Build: Insurance, NIS, and Estate Basics', 'Your 12-Month Financial Fitness Plan'] }
            ]
        },
        {
            slug: 'cryptocurrency-fundamentals',
            title: 'Cryptocurrency Fundamentals',
            page: 'courses/cryptocurrency-fundamentals.html',
            modules: [
                { title: 'Introduction to Blockchain Technology', lessons: ['What a Blockchain Actually Is', 'Blocks, Chains, and Consensus', 'Why Blockchain Matters Beyond Crypto'] },
                { title: 'How Cryptocurrencies Work', lessons: ['Coins, Tokens, and Digital Ownership', 'How Transactions Move From Sender to Receiver', 'Public Keys, Private Keys, and Addresses'] },
                { title: 'Setting Up Your First Wallet', lessons: ['Choosing Between Hot, Cold, and Custodial Wallets', 'Creating and Backing Up Your Wallet', 'Securing Your Wallet Against Common Threats'] },
                { title: 'Buying & Selling Crypto Safely', lessons: ['Choosing a Reputable Exchange', 'Placing Your First Buy and Sell Orders', 'Spotting Scams, Fees, and Hidden Costs'] },
                { title: 'Understanding Market Trends', lessons: ['Reading Price Charts and Market Data', 'Trends, Support, and Resistance', 'Building a Calm, Informed Approach'] }
            ]
        },
        {
            slug: 'stock-market-investing-101',
            title: 'Stock Market Investing 101',
            page: 'courses/stock-market-investing-101.html',
            modules: [
                { title: 'Stock Market Basics', lessons: ['How Stock Markets Actually Work', 'Brokers, Accounts, and Placing Your First Order', 'Market Indexes and What Moves Prices'] },
                { title: 'Fundamental Analysis', lessons: ["Reading a Company's Financial Statements", 'Key Ratios Every Investor Should Know', 'Judging Value and Business Quality'] },
                { title: 'Technical Analysis Essentials', lessons: ['Reading Price Charts with Confidence', 'Core Indicators: Moving Averages, RSI, and Volume', 'Entry, Exit, and Risk Rules'] },
                { title: 'Portfolio Diversification', lessons: ['Why Diversification Protects You', 'Building a Balanced Sample Portfolio', 'Rebalancing and Reviewing Your Portfolio'] },
                { title: 'Long-Term Investment Strategies', lessons: ['Buy-and-Hold and Dividend Investing', 'Dollar-Cost Averaging in Practice', 'Staying Disciplined Through Market Cycles'] }
            ]
        },
        {
            slug: 'day-trading-mastery',
            title: 'Day Trading Mastery',
            page: 'courses/day-trading-mastery.html',
            modules: [
                { title: 'Day Trading Fundamentals', lessons: ['What Day Trading Is — and Is Not', 'Markets, Sessions, and Liquidity', 'Setting Up Your Workspace and Tools'] },
                { title: 'Technical Analysis Deep Dive', lessons: ['Chart Types, Timeframes, and Trend Structure', 'Indicators That Earn Their Place', 'Combining Signals Into a Read'] },
                { title: 'Reading Candlestick Patterns', lessons: ['Anatomy of a Candlestick', 'Key Single and Double Candle Patterns', 'Multi-Candle Patterns in Live Conditions'] },
                { title: 'Risk Management Strategies', lessons: ['Position Sizing and the Risk-Per-Trade Rule', 'Stop Losses, Targets, and Risk-to-Reward', 'Daily Limits and Drawdown Control'] },
                { title: 'Building a Trading Plan', lessons: ['Defining Your Strategy and Entry Rules', 'Creating Your Pre-Market and Post-Market Routines', 'Journaling and Measuring Your Performance'] },
                { title: 'Psychology of Trading', lessons: ['Recognising Emotional Triggers in Trading', 'Building Discipline and Patience', 'Reviewing Setbacks and Trading Sustainably'] }
            ]
        },
        {
            slug: 'ai-fundamentals',
            title: 'A.I Fundamentals',
            page: 'courses/ai-fundamentals.html',
            modules: [
                { title: 'Introduction to Artificial Intelligence', lessons: ["What AI Is — and What It Isn't", 'A Brief History That Explains Today', 'AI in Your Daily Life and Finances'] },
                { title: 'Machine Learning Basics', lessons: ['How Machines Learn From Data', 'Supervised, Unsupervised, and Reinforcement Learning', 'When Models Get It Wrong'] },
                { title: 'Neural Networks & Deep Learning', lessons: ['Inside a Neural Network', 'Deep Learning in Practice', 'Generative AI and Large Language Models'] },
                { title: 'AI in Financial Services', lessons: ['Banking, Payments, and Customer Service', 'Fraud Detection and Credit Decisions', 'Personal Finance and Wealth Tools'] },
                { title: 'Automated Trading & Risk Analysis', lessons: ['Algorithmic and Automated Trading Explained', 'AI for Risk Analysis', 'Limits, Ethics, and Human Oversight'] },
                { title: 'Future of AI in Finance', lessons: ["What's Coming Next", 'Skills and Careers in an AI Economy', 'Your Responsible AI Action Plan'] }
            ]
        },
        {
            slug: 'defi-advanced-crypto',
            title: 'DeFi & Advanced Crypto',
            page: 'courses/defi-advanced-crypto.html',
            modules: [
                { title: 'DeFi Ecosystem Overview', lessons: ["What DeFi Actually Is (and Isn't)", 'Mapping the DeFi Stack', 'Reading a Protocol Before You Touch It'] },
                { title: 'Smart Contracts & dApps', lessons: ['How Smart Contracts Execute', 'Using dApps Safely, Step by Step', 'Spotting Contract Risk and Audits'] },
                { title: 'Yield Farming & Staking', lessons: ['Staking Fundamentals', 'Liquidity Pools and Impermanent Loss', 'Evaluating Yield Without Chasing It'] },
                { title: 'Advanced Trading Strategies', lessons: ['Reading On-Chain and Market Signals Together', 'Structured Strategies: DCA, Ranges, and Hedging', 'Position Sizing and Trade Journaling'] },
                { title: 'Risk Management in DeFi', lessons: ['The DeFi Risk Map', 'Scam, Phishing, and Rug-Pull Defence', 'Building Your Personal Safety System'] },
                { title: 'Future of Decentralized Finance', lessons: ['Layer 2s, Interoperability, and Real-World Assets', 'Regulation and the Caribbean Context', 'Building Your Long-Term DeFi Learning Plan'] }
            ]
        },
        {
            slug: 'financial-literacy-for-kids',
            title: 'Financial Literacy for Kids',
            page: 'courses/financial-literacy-for-kids.html',
            modules: [
                { title: 'What Is Money?', lessons: ['The Barter Days: Swapping Milk for Hammers', 'Coins, Kings, and Paper Promises', 'Cards, Phones, and Money Today'] },
                { title: 'Saving Like a Superhero', lessons: ['Set a Goal, Save the Day', 'The Piggy Bank Power-Up', 'Patience, Hero!'] },
                { title: 'Needs vs Wants', lessons: ['Needs Keep Us Going, Wants Make Us Smile', 'The Supermarket Quest', 'Choose Your Treasure'] },
                { title: 'Banks Keep Money Safe', lessons: ['What Is a Bank, Really?', 'Your Very Own Account', 'Cards Are Keys, Not Magic'] },
                { title: 'Growing & Sharing Money', lessons: ['Money Seeds: How Savings Grow', 'Earn by Helping', 'Sharing Is a Superpower'] }
            ]
        }
    ];

    function courseBySlug(slug) {
        for (var i = 0; i < COURSES.length; i++) {
            if (COURSES[i].slug === slug) return COURSES[i];
        }
        return null;
    }

    function totalLessons(course) {
        var n = 0;
        course.modules.forEach(function (m) { n += m.lessons.length; });
        return n;
    }

    /* "lesson-kids-m1-l1" -> { module: 1, lesson: 1 }; anything else -> null. */
    function parseLessonId(lessonId) {
        var m = (lessonId || '').match(/m(\d+)l(\d+)/i);
        if (!m) return null;
        return { module: parseInt(m[1], 10), lesson: parseInt(m[2], 10) };
    }

    function esc(s) {
        return String(s == null ? '' : s).replace(/&/g, '&amp;')
            .replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function $(id) { return document.getElementById(id); }

    function show(el) { if (el) el.hidden = false; }
    function hide(el) { if (el) el.hidden = true; }

    function showError(msg) {
        var el = $('portal-error');
        if (el) { el.textContent = msg; show(el); }
    }

    function openModal(view) {
        if (window.FinFitAuthUI && window.FinFitAuthUI.open) {
            window.FinFitAuthUI.open(view);
        } else {
            showError('Student login is being connected — check back soon.');
        }
    }

    /* ------------------------------------------------------------------
       Rendering
       ------------------------------------------------------------------ */

    function renderHero(rows) {
        var hero = $('continue-hero');
        if (!hero) return;
        if (!rows.length) {
            hero.innerHTML =
                '<p class="hero-kicker">Start here</p>' +
                '<h2>Start your first lesson</h2>' +
                '<p class="hero-line">New here? Begin with Complete Financial ' +
                'Literacy, the foundation course. Module 1 is free.</p>' +
                '<a class="hero-btn" href="courses/complete-financial-literacy.html">' +
                'Start for Free &rarr;</a>';
            return;
        }
        var latest = rows[0];
        var course = courseBySlug(latest.course_slug);
        var page = course ? course.page : ('courses/' + latest.course_slug + '.html');
        var title = latest.course_title || (course ? course.title : latest.course_slug);
        var statusText = latest.status === 'completed'
            ? 'Completed — review it again any time.'
            : 'In progress — pick up right where you stopped.';
        hero.innerHTML =
            '<p class="hero-kicker">Continue learning</p>' +
            '<h2>' + esc(title) + '</h2>' +
            '<p class="hero-line">' + esc(latest.lesson_title) + '</p>' +
            '<p class="hero-status">' + esc(statusText) + '</p>' +
            '<a class="hero-btn" href="' + esc(page) + '#' + esc(latest.lesson_id) + '">' +
            'Continue &rarr;</a>';
    }

    function renderCourses(rows) {
        var grid = $('courses-grid');
        if (!grid) return;
        var byCourse = {};
        rows.forEach(function (r) {
            (byCourse[r.course_slug] = byCourse[r.course_slug] || []).push(r);
        });

        grid.innerHTML = '';
        COURSES.forEach(function (course) {
            var list = byCourse[course.slug] || [];
            var completed = list.filter(function (r) { return r.status === 'completed'; }).length;
            var total = totalLessons(course);
            var pct = total ? Math.round((completed / total) * 100) : 0;
            var status, btnLabel, btnHref;
            if (completed >= total && total > 0) {
                status = 'Completed';
                btnLabel = 'Review course';
                btnHref = course.page;
            } else if (list.length) {
                status = 'In progress';
                btnLabel = 'Continue';
                btnHref = course.page + '#' + list[0].lesson_id;
            } else {
                status = 'Not started';
                btnLabel = 'Start';
                btnHref = course.page;
            }

            var card = document.createElement('article');
            card.className = 'portal-course';
            var html = '<h3>' + esc(course.title) + '</h3>' +
                '<p class="portal-status"><span class="badge badge-' +
                status.toLowerCase().replace(' ', '-') + '">' + status + '</span></p>' +
                '<div class="progress-track" role="progressbar" aria-valuenow="' + pct +
                '" aria-valuemin="0" aria-valuemax="100"><div class="progress-fill" ' +
                'style="width:' + pct + '%"></div></div>' +
                '<p class="progress-text">' + completed + ' / ' + total +
                ' lessons completed</p>';
            if (status === 'Completed') {
                html += '<p class="cert-note">Certificate earned — see your ' +
                    'course page for details.</p>';
            }
            html += '<div class="portal-actions">' +
                '<a class="portal-btn" href="' + esc(btnHref) + '">' + btnLabel + '</a>' +
                '<button type="button" class="portal-toggle" aria-expanded="false">' +
                'Show lessons</button></div>' +
                '<div class="lesson-list" hidden></div>';
            card.innerHTML = html;

            var toggle = card.querySelector('.portal-toggle');
            var listEl = card.querySelector('.lesson-list');
            toggle.addEventListener('click', function () {
                var open = listEl.hidden;
                if (open && !listEl.dataset.built) {
                    listEl.innerHTML = renderLessonList(course, list);
                    listEl.dataset.built = '1';
                }
                listEl.hidden = !open;
                toggle.textContent = open ? 'Hide lessons' : 'Show lessons';
                toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            });

            grid.appendChild(card);
        });
    }

    /* Lesson list for one course: catalog lessons grouped by module,
       each row marked from the student's progress rows. Rows the
       catalog does not cover (a progress row whose module/lesson
       falls outside the list) are appended with their recorded title
       so nothing the student did ever disappears from view. */
    function renderLessonList(course, rows) {
        var byKey = {};
        var extras = [];
        rows.forEach(function (r) {
            var p = parseLessonId(r.lesson_id);
            if (p && course.modules[p.module - 1] &&
                course.modules[p.module - 1].lessons[p.lesson - 1]) {
                byKey[p.module + ':' + p.lesson] = r;
            } else {
                extras.push(r);
            }
        });

        var html = '';
        course.modules.forEach(function (mod, mi) {
            html += '<h4>Module ' + (mi + 1) + ' — ' + esc(mod.title) + '</h4><ul>';
            mod.lessons.forEach(function (lesson, li) {
                var row = byKey[(mi + 1) + ':' + (li + 1)];
                var label = 'Lesson ' + (li + 1) + ': ' + lesson;
                if (row && row.status === 'completed') {
                    html += '<li class="done"><span class="check" aria-label="Completed">&#10003;</span> ' +
                        '<a href="' + esc(course.page) + '#' + esc(row.lesson_id) + '">' +
                        esc(label) + '</a> <span class="row-action">Review</span></li>';
                } else if (row) {
                    html += '<li class="started"><span class="dot"></span> ' +
                        '<a href="' + esc(course.page) + '#' + esc(row.lesson_id) + '">' +
                        esc(label) + '</a> <span class="row-action">Continue</span></li>';
                } else {
                    html += '<li class="todo">' + esc(label) + '</li>';
                }
            });
            html += '</ul>';
        });
        if (extras.length) {
            html += '<h4>More from this course</h4><ul>';
            extras.forEach(function (r) {
                var action = r.status === 'completed' ? 'Review' : 'Continue';
                html += '<li class="' + (r.status === 'completed' ? 'done' : 'started') + '">' +
                    '<a href="' + esc(course.page) + '#' + esc(r.lesson_id) + '">' +
                    esc(r.lesson_title) + '</a> <span class="row-action">' + action + '</span></li>';
            });
            html += '</ul>';
        }
        return html;
    }

    /* Study Guides, unlocked by MODULE COMPLETION (Kester's rule):
       a module's guide unlocks for a student exactly when every lesson
       of that module is marked completed in lesson_progress. Completed
       module + guide PDF in the manifest -> download link. Completed
       module + no PDF yet -> honest "being prepared" row, never a
       broken link (the PDF is a build-step artifact, created by
       build_study_guide.py during production). Incomplete module ->
       locked row. Only courses the student has started are listed;
       a student with no progress yet keeps the plain empty state. */
    function renderGuides(rows) {
        var box = $('guides-list');
        if (!box) return;
        rows = rows || [];
        var guides = window.PORTAL_GUIDES || [];

        function guideFor(course, moduleNo) {
            for (var i = 0; i < guides.length; i++) {
                var g = guides[i];
                if (g.slug === course.slug && parseInt(g.module, 10) === moduleNo) return g;
            }
            return null;
        }

        function moduleCompleted(course, moduleNo) {
            var done = {};
            rows.forEach(function (r) {
                if (r.course_slug !== course.slug || r.status !== 'completed') return;
                var p = parseLessonId(r.lesson_id);
                if (p && p.module === moduleNo) done[p.lesson] = true;
            });
            var total = course.modules[moduleNo - 1].lessons.length;
            for (var li = 1; li <= total; li++) if (!done[li]) return false;
            return true;
        }

        var html = '';
        var anyCourse = false;
        COURSES.forEach(function (course) {
            var started = rows.some(function (r) { return r.course_slug === course.slug; });
            if (!started) return;
            anyCourse = true;
            html += '<h4 class="guides-course-head">' + esc(course.title) + '</h4><ul class="guides-ul">';
            course.modules.forEach(function (mod, mi) {
                var moduleNo = mi + 1;
                if (moduleCompleted(course, moduleNo)) {
                    var g = guideFor(course, moduleNo);
                    if (g) {
                        html += '<li><a href="' + esc(g.file) + '">' + esc(g.title) + '</a>' +
                            '<span class="guides-course">Download PDF</span></li>';
                    } else {
                        html += '<li class="guides-prep">Module ' + moduleNo + ' Study Guide — ' + esc(mod.title) +
                            '<span class="guides-course">Your Module ' + moduleNo + ' guide is being prepared — it lands here as soon as it\'s ready</span></li>';
                    }
                } else {
                    html += '<li class="guides-locked">Module ' + moduleNo + ' Study Guide — ' + esc(mod.title) +
                        '<span class="guides-course">Complete Module ' + moduleNo + ' to unlock its study guide</span></li>';
                }
            });
            html += '</ul>';
        });

        /* Legacy manifest entries without slug/module still render as
           plain downloads, so old entries never silently vanish. */
        var legacy = guides.filter(function (g) { return !g.slug || g.module == null; });
        if (legacy.length) {
            html += '<ul class="guides-ul">';
            legacy.forEach(function (g) {
                html += '<li><a href="' + esc(g.file) + '">' + esc(g.title) + '</a>' +
                    '<span class="guides-course">' + esc(g.course) + '</span></li>';
            });
            html += '</ul>';
        }

        if (!anyCourse && !legacy.length) {
            box.innerHTML = '<p class="guides-empty">Study guides land here as ' +
                'each module finishes — your first guides arrive with the ' +
                'launch batch.</p>';
            return;
        }
        box.innerHTML = html;
    }

    /* ------------------------------------------------------------------
       Boot
       ------------------------------------------------------------------ */
    function init() {
        var gate = $('portal-gate');
        var main = $('portal-main');
        var Auth = window.FinFitAuth;

        var loginBtn = $('portal-login-btn');
        var signupBtn = $('portal-signup-btn');
        var logoutBtn = $('portal-logout-btn');
        if (loginBtn) loginBtn.addEventListener('click', function () { openModal('login'); });
        if (signupBtn) signupBtn.addEventListener('click', function () { openModal('signup'); });
        if (logoutBtn) logoutBtn.addEventListener('click', function () {
            if (Auth) Auth.signOut().then(function () { window.location.reload(); });
        });

        if (!Auth || !Auth.configured) {
            var note = $('gate-note');
            if (note) note.textContent = 'Student login is being connected — check back soon. You can still browse the courses below.';
            show(gate);
            hide(main);
            return;
        }

        Auth.getUser().then(function (user) {
            if (!user) {
                show(gate);
                hide(main);
                return;
            }
            hide(gate);
            show(main);
            show(logoutBtn);
            var name = (user.user_metadata && user.user_metadata.full_name) || '';
            var first = name ? name.trim().split(' ')[0] : (user.email || '').split('@')[0];
            var hello = $('portal-hello');
            if (hello) hello.textContent = 'Welcome back, ' + first + '.';
            var emailEl = $('portal-email');
            if (emailEl) emailEl.textContent = user.email || '';

            var client = Auth._client;
            if (!client) { showError('Can\u2019t reach the login service right now. Check your connection and try again.'); return; }
            client.from('lesson_progress')
                .select('course_slug, course_title, lesson_id, lesson_title, status, updated_at')
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false })
                .then(function (res) {
                    if (res.error) {
                        showError('Can\u2019t load your progress right now. Check your connection and try again.');
                        return;
                    }
                    var rows = res.data || [];
                    renderHero(rows);
                    renderCourses(rows);
                    renderGuides(rows);
                });
        }).catch(function () {
            showError('Can\u2019t reach the login service right now. Check your connection and try again.');
            show(gate);
            hide(main);
        });

        /* After a login/logout in the modal, re-render from scratch. */
        if (Auth.onAuthChange) {
            Auth.onAuthChange(function (event) {
                if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                    window.location.reload();
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
