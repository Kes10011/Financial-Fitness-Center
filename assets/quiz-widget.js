/* School of Financial Fitness — Interactive Quiz Widget (vanilla JS, no dependencies).
 *
 * Usage: drop a mount element on any course page and point it at a quiz JSON file:
 *   <div data-quiz="quizzes/financial-literacy-for-kids-m1-l1.json"></div>
 * The JSON lives in courses/quizzes/ and follows this schema:
 *   { id, title, questions: [ { type: "mcq"|"tf", text, audio, options[], answer, explanation } ] }
 * Audio paths inside the JSON are resolved relative to the PAGE (e.g. "../assets/...").
 *
 * Behaviour (Kester's spec):
 *  - Every question is asked in text AND voice. Audio starts only after the student
 *    presses Start (browsers block autoplay before a user gesture); a replay button
 *    re-plays the current question's audio at any time.
 *  - Options are clickable buttons (4 for MCQ, 2 for true/false).
 *  - The quiz NEVER advances on a wrong answer: a wrong click shows encouraging
 *    feedback and disables only that button; the student stays on the question.
 *  - A right click turns the button green, shows the one-line explanation, and
 *    reveals a Next button (or "See my score" on the last question).
 *  - Score counts questions answered correctly on the FIRST try, so "X of Y"
 *    stays meaningful even though every student eventually gets every answer.
 *  - Completion shows the score plus a small confetti burst inside the panel.
 */
(function () {
    'use strict';

    var CONFETTI_COLORS = ['#D4AF37', '#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#a8e6cf'];

    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text !== undefined && text !== null) n.textContent = text;
        return n;
    }

    function burstConfetti(panel) {
        var layer = el('div', 'quiz-confetti');
        panel.appendChild(layer);
        for (var i = 0; i < 42; i++) {
            var p = el('div', 'quiz-confetti-piece');
            p.style.left = (8 + Math.random() * 84) + '%';
            p.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
            p.style.animationDelay = (Math.random() * 0.35).toFixed(2) + 's';
            p.style.animationDuration = (1.6 + Math.random() * 1.2).toFixed(2) + 's';
            p.style.transform = 'rotate(' + Math.floor(Math.random() * 360) + 'deg)';
            layer.appendChild(p);
        }
        setTimeout(function () { if (layer.parentNode) layer.parentNode.removeChild(layer); }, 3400);
    }

    function mountQuiz(mount) {
        var url = mount.getAttribute('data-quiz');
        var nextLabel = mount.getAttribute('data-next-label') || 'Next lesson';
        var nextTitle = mount.getAttribute('data-next-title') || '';
        var nextTarget = mount.getAttribute('data-next-target') || '';
        if (!url) return;
        mount.innerHTML = '';
        var panel = el('div', 'quiz-widget');
        mount.appendChild(panel);

        var state = { data: null, index: 0, firstTryCorrect: 0, tried: false, answered: false, audio: null };

        function showError(msg) {
            panel.innerHTML = '';
            panel.appendChild(el('p', 'quiz-error', msg));
        }

        function playAudio(src) {
            if (!src) return;
            if (!state.audio) {
                state.audio = new Audio();
                state.audio.preload = 'auto';
            }
            if (state.audio.src !== new URL(src, window.location.href).href) {
                state.audio.src = src;
            }
            state.audio.currentTime = 0; // replay always restarts from the beginning
            var p = state.audio.play();
            if (p && p.catch) p.catch(function () { /* autoplay blocked: replay button remains */ });
        }

        function renderStart() {
            panel.innerHTML = '';
            panel.appendChild(el('div', 'quiz-tag', 'Quiz time!'));
            panel.appendChild(el('h3', 'quiz-title', state.data.title));
            panel.appendChild(el('p', 'quiz-intro',
                'Listen to each question, then click the right answer. ' +
                'You move on only when you get it right — so take your time! (' +
                state.data.questions.length + ' questions)'));
            var btn = el('button', 'quiz-start-btn', 'Start Quiz');
            btn.type = 'button';
            btn.addEventListener('click', function () {
                state.index = 0; state.firstTryCorrect = 0;
                renderQuestion(true);
            });
            panel.appendChild(btn);
        }

        function renderQuestion(autoplay) {
            state.tried = false; state.answered = false;
            var q = state.data.questions[state.index];
            panel.innerHTML = '';

            panel.appendChild(el('div', 'quiz-progress',
                'Question ' + (state.index + 1) + ' of ' + state.data.questions.length));
            panel.appendChild(el('p', 'quiz-question', q.text));

            var audioRow = el('div', 'quiz-audio-row');
            var replay = el('button', 'quiz-replay-btn', 'Hear the question again');
            replay.type = 'button';
            replay.addEventListener('click', function () { playAudio(q.audio); });
            audioRow.appendChild(replay);
            panel.appendChild(audioRow);

            var opts = el('div', 'quiz-options');
            q.options.forEach(function (opt, i) {
                var b = el('button', 'quiz-option');
                b.type = 'button';
                // Letter label (A, B, C, D) shown next to every option, matching
                // the letters the voice reads aloud.
                b.appendChild(el('span', 'quiz-option-letter', String.fromCharCode(65 + i)));
                b.appendChild(document.createTextNode(opt));
                b.addEventListener('click', function () { onOption(i, b, q); });
                opts.appendChild(b);
            });
            panel.appendChild(opts);

            var fb = el('p', 'quiz-feedback');
            fb.setAttribute('aria-live', 'polite');
            panel.appendChild(fb);

            if (autoplay) playAudio(q.audio);
        }

        function onOption(i, btn, q) {
            if (state.answered) return;
            var fb = panel.querySelector('.quiz-feedback');
            if (i === q.answer) {
                state.answered = true;
                if (!state.tried) state.firstTryCorrect++;
                btn.classList.add('correct');
                panel.querySelectorAll('.quiz-option').forEach(function (o) { o.disabled = true; });
                var expl = el('div', 'quiz-explanation', q.explanation);
                panel.insertBefore(expl, fb);
                fb.textContent = '';
                var next = el('button', 'quiz-next-btn',
                    state.index + 1 < state.data.questions.length ? 'Next question' : 'See my score');
                next.type = 'button';
                next.addEventListener('click', function () {
                    state.index++;
                    if (state.index < state.data.questions.length) renderQuestion(true);
                    else renderDone();
                });
                panel.appendChild(next);
            } else {
                state.tried = true;
                btn.classList.add('wrong');
                btn.disabled = true;
                fb.textContent = 'Not quite — try again! You have got this.';
                fb.className = 'quiz-feedback wrong';
            }
        }

        function renderDone() {
            // Kester's completion rule: confetti + move on ONLY on a perfect
            // first-try score; anything less shows Try again and nothing else.
            var perfect = state.firstTryCorrect === state.data.questions.length;
            panel.innerHTML = '';
            panel.appendChild(el('div', 'quiz-tag', 'Quiz complete!'));
            panel.appendChild(el('h3', 'quiz-title',
                'You got ' + state.firstTryCorrect + ' of ' + state.data.questions.length +
                ' right on your first try!'));
            if (perfect) {
                panel.appendChild(el('p', 'quiz-intro',
                    'Perfect score, hero! Every answer right the first time.'));
                burstConfetti(panel);
                var next = el('button', 'quiz-start-btn', nextLabel + ' →');
                next.type = 'button';
                next.addEventListener('click', function () {
                    var target = nextTarget ? document.querySelector(nextTarget) : null;
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        var vid = target.querySelector('video');
                        if (vid && vid.play) vid.play().catch(function () {});
                    } else if (nextTitle) {
                        panel.appendChild(el('p', 'quiz-intro', 'Next up: ' + nextTitle));
                        next.disabled = true;
                    }
                });
                panel.appendChild(next);
            } else {
                panel.appendChild(el('p', 'quiz-intro',
                    'Good effort — try again and see if you can get them all right!'));
                var again = el('button', 'quiz-start-btn', 'Try again');
                again.type = 'button';
                again.addEventListener('click', renderStart);
                panel.appendChild(again);
            }
        }

        fetch(url).then(function (r) {
            if (!r.ok) throw new Error('Quiz file not found: ' + url);
            return r.json();
        }).then(function (data) {
            if (!data || !Array.isArray(data.questions) || data.questions.length === 0) {
                throw new Error('Quiz file has no questions: ' + url);
            }
            data.questions.forEach(function (q, qi) {
                if (!Array.isArray(q.options) || q.options.length < 2 ||
                    typeof q.answer !== 'number' || q.answer < 0 || q.answer >= q.options.length ||
                    typeof q.text !== 'string' || !q.text) {
                    throw new Error('Bad question ' + (qi + 1) + ' in ' + url);
                }
            });
            state.data = data;
            renderStart();
        }).catch(function (err) {
            showError('This quiz could not be loaded. Please refresh the page and try again.');
            if (window.console) console.error(err);
        });
    }

    function init() {
        document.querySelectorAll('[data-quiz]').forEach(mountQuiz);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
