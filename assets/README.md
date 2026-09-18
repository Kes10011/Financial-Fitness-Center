# School of Financial Fitness — Icon Pack

A 30-icon set built for a modern, techie, gamified finance-education site.
One consistent line-icon style, so it works for page headings, nav, lesson
cards, badges, and progress states without ever feeling mismatched.

## What's in here

```
icons/            30 individual .svg files — drop any one straight into HTML/CSS/React
sprite.svg        all 30 icons bundled as <symbol> elements, for a single-request sprite
manifest.json     machine-readable index (name, file path, tags, description) — built for AI agents to query
preview.html      open in any browser: a searchable visual gallery, click an icon to copy its SVG
README.md         this file
```

## Design spec

- **Grid:** 24×24 viewBox
- **Stroke:** 1.75px, round caps, round joins, no fill (except a few small solid accents: coin dots, badge stars, arrowheads)
- **Color:** every icon uses `stroke="currentColor"` — recolor by setting the CSS `color` property on the icon or its parent, no editing the SVG needed
- **Sizing:** scale freely; icons stay crisp from 16px (dense nav) up to 96px (hero/empty-state use)

## Quick usage

**Plain HTML / inline:**
```html
<img src="icons/flame-streak.svg" width="24" height="24" alt="">
```

**Inline SVG (so `currentColor` picks up your text/link color):**
```html
<span style="color:#c3ff3d">
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
       stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <!-- paste the icon's inner markup from icons/*.svg here -->
  </svg>
</span>
```

**Sprite (best for a whole site — one file, many uses):**
```html
<!-- load once, anywhere in the page -->
<svg style="display:none"><use href="sprite.svg"/></svg>

<!-- then reuse anywhere -->
<svg width="24" height="24"><use href="sprite.svg#icon-trophy"/></svg>
```

**React component:**
```jsx
function Icon({ name, size = 24, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <use href={`/icons/sprite.svg#icon-${name}`} />
    </svg>
  );
}
// <Icon name="badge-star" className="text-lime-400 w-8 h-8" />
```

## For an AI coding agent

`manifest.json` is the fastest way to hand this pack to an agent — it lists every
icon's name, file path, short description, and search tags (e.g. `"streak"`,
`"goal"`, `"gamification"`) so the agent can pick the right icon for a given
heading or feature without guessing from filenames alone.

## Icon index

| Icon | Suggested use |
|---|---|
| `piggy-bank` | Savings, budgeting sections |
| `dumbbell-coin` | Signature "financial fitness" mark — hero, logo lockup, brand moments |
| `growth-chart` | Investing, portfolio growth |
| `coin-stack` | Money, wealth-building |
| `wallet` | Spending, cash flow |
| `credit-card` | Payments, banking basics |
| `target-goal` | Goal-setting, milestones |
| `trophy` | Course completion, big wins |
| `badge-star` | Earned achievements |
| `flame-streak` | Daily login / study streaks |
| `level-up-chevrons` | Level-up moments, rank progress |
| `xp-bolt` | XP gained, energy, quick wins |
| `quiz-bubble` | Quizzes, knowledge checks |
| `calculator` | Budgeting tools, calculators |
| `budget-calendar` | Bills, budget planning calendar |
| `compass-direction` | Financial planning, strategy |
| `shield-lock` | Security, insurance, fraud protection |
| `rocket-launch` | Getting started, fast progress |
| `roadmap-flag` | Learning path, curriculum roadmap |
| `checklist-task` | Lesson steps, to-dos |
| `gift-reward` | Rewards, unlockables |
| `pie-chart` | Portfolio allocation, budget splits |
| `receipt-invoice` | Expense tracking |
| `book-education` | Courses, curriculum, lessons |
| `lightbulb-idea` | Money tips, insights |
| `plant-growth` | Compound interest, investing early |
| `scale-balance` | Budget trade-offs, balance |
| `gauge-score` | Credit score, ratings |
| `leaderboard-podium` | Leaderboards, rankings, competitions |
| `heartbeat-pulse` | "Financial health" check-ins |

## Extending the set

`build.py` (Python) generated every file in this pack from one source of
truth — a dict of icon name → SVG path data. To add a new icon in the same
style, add an entry there and rerun it; every output (individual files,
sprite, manifest, and the preview page) regenerates in sync.
