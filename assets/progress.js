/* School of Financial Fitness — "Continue where you left off".
 *
 * When a student is LOGGED IN, this records their lesson progress to
 * Supabase (table: lesson_progress — see progress.sql) and renders a
 * Continue card at the top of the course page:
 *   - video 'play'  → lesson marked "started" (last-viewed lesson)
 *   - video 'ended' → lesson marked "completed"
 *   - a lesson quiz showing "Quiz complete!" → that lesson "completed"
 *     (observed, never by touching quiz-widget.js)
 *
 * When LOGGED OUT, or when Supabase is not wired yet, this file does
 * NOTHING at all — no DOM changes, no card, page exactly as today.
 * Any save failure is silent: progress must never break a lesson.
 */

(function () {
    'use strict';

    var Auth = window.FinFitAuth;
    if (!Auth || !Auth.configured) return;

    var TABLE = 'lesson_progress';

    /* Course identity comes from the page itself: the URL slug and
       the page's own <h1>. Lesson identity comes from each video's
       file name (stable, unique per lesson) and its <h4> title. */
    function courseSlug() {
        var path = window.location.pathname.replace(/\/$/, '');
        var base = path.split('/').pop() || '';
        return base.replace(/\.html?$/i, '');
    }

    function courseTitle() {
        var h1 = document.querySelector('h1');
        return h1 ? h1.textContent.trim() : courseSlug();
    }

    /* "kids-m1-l1" → "Module 1 · Lesson 1"; anything else → ''. */
    function moduleLabel(lessonId) {
        var m = lessonId.match(/m(\d+)l(\d+)/i);
        if (!m) return '';
        return 'Module ' + parseInt(m[1], 10) +
            ' · Lesson ' + parseInt(m[2], 10);
    }

    function save(userId, lesson, status) {
        var client = Auth._client;
        if (!client) return;
        var row = {
            user_id: userId,
            course_slug: courseSlug(),
            course_title: courseTitle(),
            lesson_id: lesson.id,
            lesson_title: lesson.title,
            status: status,
            updated_at: new Date().toISOString()
        };
        client.from(TABLE).upsert(row, {
            onConflict: 'user_id,course_slug,lesson_id'
        }).then(function (res) {
            /* Silent by design: a failed save must never interrupt
               a lesson. (Only logged to console for debugging.) */
            if (res.error && window.console) {
                console.warn('[progress] save failed:', res.error.message);
            }
        });
    }

    function renderContinueCard(lesson) {
        var wrap = document.querySelector('.wrap');
        var topnav = wrap ? wrap.querySelector('.topnav') : null;
        if (!wrap || !topnav) return;
        if (document.querySelector('.continue-card')) return;

        var label = moduleLabel(lesson.lesson_id);
        var card = document.createElement('div');
        card.className = 'continue-card';
        var line = lesson.course_title;
        if (label) line += ' · ' + label;
        line += ' — ' + lesson.lesson_title;
        card.innerHTML =
            '<h3>Continue where you left off</h3>' +
            '<p></p>' +
            '<a></a>';
        card.querySelector('p').textContent = line;
        var link = card.querySelector('a');
        link.textContent = 'Resume lesson →';
        link.href = '#' + lesson.lesson_id;
        topnav.insertAdjacentElement('afterend', card);
    }

    Auth.getUser().then(function (user) {
        if (!user) return; /* logged out: page stays exactly as-is */

        var lessons = [];
        document.querySelectorAll('.lesson-video').forEach(function (block) {
            var video = block.querySelector('video');
            var heading = block.querySelector('h4');
            if (!video || !video.getAttribute('src')) return;
            var src = video.getAttribute('src');
            var id = 'lesson-' + src.split('/').pop()
                .replace(/\.[a-z0-9]+$/i, '');
            /* Runtime anchor for the resume link — no lesson markup
               is edited; the id is only added for logged-in students. */
            if (!block.id) block.id = id;
            var lesson = {
                id: id,
                title: heading ? heading.textContent.trim() : id,
                block: block,
                video: video
            };
            lessons.push(lesson);

            video.addEventListener('play', function () {
                save(user.id, lesson, 'started');
            });
            video.addEventListener('ended', function () {
                save(user.id, lesson, 'completed');
            });

            /* Quiz completion: quiz-widget.js replaces its panel with
               a "Quiz complete!" tag when a quiz finishes. Watching
               for that tag marks the lesson complete without ever
               touching the quiz code. */
            var quizMount = block.querySelector('[data-quiz]');
            if (quizMount && 'MutationObserver' in window) {
                var seen = false;
                new MutationObserver(function () {
                    if (seen) return;
                    var tag = quizMount.querySelector('.quiz-tag');
                    if (tag && tag.textContent.indexOf('Quiz complete!') !== -1) {
                        seen = true;
                        save(user.id, lesson, 'completed');
                    }
                }).observe(quizMount, { childList: true, subtree: true });
            }
        });

        /* Continue card: the student's most recently touched lesson
           in THIS course, if any. */
        var client = Auth._client;
        if (!client) return;
        client.from(TABLE)
            .select('lesson_id, lesson_title, course_title')
            .eq('user_id', user.id)
            .eq('course_slug', courseSlug())
            .order('updated_at', { ascending: false })
            .limit(1)
            .then(function (res) {
                if (res.error || !res.data || !res.data.length) return;
                renderContinueCard(res.data[0]);
            });
    });
})();
