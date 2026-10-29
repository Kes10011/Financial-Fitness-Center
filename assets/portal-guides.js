/* School of Financial Fitness — Student Portal study-guide manifest.
 *
 * HOW TO ADD A GUIDE (one line per guide, nothing else to change):
 *   { course: 'Financial Literacy for Kids',
 *     slug: 'financial-literacy-for-kids',
 *     module: 1,
 *     title: 'Module 1 Study Guide — What Is Money?',
 *     file: 'assets/guides/financial-literacy-for-kids-m1-study-guide.pdf' }
 *
 * The portal renders one row per guide, grouped under its course, and
 * unlocks a guide for a student only when that student has completed
 * every lesson of that module (see portal.js renderGuides). Files live
 * in assets/guides/ and are linked exactly as written here.
 *
 * HONEST EMPTY STATE: a completed module with no entry here shows a
 * "being prepared" row in the portal, never a broken link. Never add an
 * entry for a file that is not actually in the repo. Guides are created
 * by the build step ~/workspace/finfit-build/work-v2/build_study_guide.py
 * (the browser cannot generate PDFs).
 */


window.PORTAL_GUIDES = [
    { course: 'Financial Literacy for Kids', slug: 'financial-literacy-for-kids', module: 1, title: 'Module 1 Study Guide — What Is Money?', file: 'assets/guides/financial-literacy-for-kids-m1-study-guide.pdf' },
    { course: 'Complete Financial Literacy', slug: 'complete-financial-literacy', module: 2, title: 'Module 2 Study Guide — Budgeting & Cash Flow Management', file: 'assets/guides/complete-financial-literacy-m2-study-guide.pdf' },
    { course: 'Complete Financial Literacy', slug: 'complete-financial-literacy', module: 3, title: 'Module 3 Study Guide — Debt Management Strategies', file: 'assets/guides/complete-financial-literacy-m3-study-guide.pdf' },
    { course: 'Complete Financial Literacy', slug: 'complete-financial-literacy', module: 4, title: 'Module 4 Study Guide — Introduction to Investing', file: 'assets/guides/complete-financial-literacy-m4-study-guide.pdf' },
    { course: 'Complete Financial Literacy', slug: 'complete-financial-literacy', module: 5, title: 'Module 5 Study Guide — Building Wealth Over Time', file: 'assets/guides/complete-financial-literacy-m5-study-guide.pdf' },
    { course: 'Cryptocurrency Fundamentals', slug: 'cryptocurrency-fundamentals', module: 1, title: 'Module 1 Study Guide — Introduction to Blockchain Technology', file: 'assets/guides/cryptocurrency-fundamentals-m1-study-guide.pdf' },
    { course: 'Cryptocurrency Fundamentals', slug: 'cryptocurrency-fundamentals', module: 2, title: 'Module 2 Study Guide — How Cryptocurrencies Work', file: 'assets/guides/cryptocurrency-fundamentals-m2-study-guide.pdf' },
    { course: 'Cryptocurrency Fundamentals', slug: 'cryptocurrency-fundamentals', module: 3, title: 'Module 3 Study Guide — Setting Up Your First Wallet', file: 'assets/guides/cryptocurrency-fundamentals-m3-study-guide.pdf' },
    { course: 'Cryptocurrency Fundamentals', slug: 'cryptocurrency-fundamentals', module: 4, title: 'Module 4 Study Guide — Buying & Selling Crypto Safely', file: 'assets/guides/cryptocurrency-fundamentals-m4-study-guide.pdf' },
    { course: 'Cryptocurrency Fundamentals', slug: 'cryptocurrency-fundamentals', module: 5, title: 'Module 5 Study Guide — Understanding Market Trends', file: 'assets/guides/cryptocurrency-fundamentals-m5-study-guide.pdf' },
    { course: 'Stock Market Investing 101', slug: 'stock-market-investing-101', module: 1, title: 'Module 1 Study Guide — Stock Market Basics', file: 'assets/guides/stock-market-investing-101-m1-study-guide.pdf' },
    { course: 'Stock Market Investing 101', slug: 'stock-market-investing-101', module: 2, title: 'Module 2 Study Guide — Fundamental Analysis', file: 'assets/guides/stock-market-investing-101-m2-study-guide.pdf' },
    { course: 'Stock Market Investing 101', slug: 'stock-market-investing-101', module: 3, title: 'Module 3 Study Guide — Technical Analysis Essentials', file: 'assets/guides/stock-market-investing-101-m3-study-guide.pdf' },
    { course: 'Day Trading Mastery', slug: 'day-trading-mastery', module: 1, title: 'Module 1 Study Guide — Day Trading Fundamentals', file: 'assets/guides/day-trading-mastery-m1-study-guide.pdf' },
    { course: 'Day Trading Mastery', slug: 'day-trading-mastery', module: 2, title: 'Module 2 Study Guide — Technical Analysis Deep Dive', file: 'assets/guides/day-trading-mastery-m2-study-guide.pdf' },
    { course: 'Day Trading Mastery', slug: 'day-trading-mastery', module: 3, title: 'Module 3 Study Guide — Reading Candlestick Patterns', file: 'assets/guides/day-trading-mastery-m3-study-guide.pdf' },
    { course: 'Day Trading Mastery', slug: 'day-trading-mastery', module: 4, title: 'Module 4 Study Guide — Risk Management Strategies', file: 'assets/guides/day-trading-mastery-m4-study-guide.pdf' },
    { course: 'Day Trading Mastery', slug: 'day-trading-mastery', module: 5, title: 'Module 5 Study Guide — Building a Trading Plan', file: 'assets/guides/day-trading-mastery-m5-study-guide.pdf' },
    { course: 'A.I Fundamentals', slug: 'ai-fundamentals', module: 1, title: 'Module 1 Study Guide — Introduction to Artificial Intelligence', file: 'assets/guides/ai-fundamentals-m1-study-guide.pdf' },
    { course: 'A.I Fundamentals', slug: 'ai-fundamentals', module: 2, title: 'Module 2 Study Guide — Machine Learning Basics', file: 'assets/guides/ai-fundamentals-m2-study-guide.pdf' },
    { course: 'A.I Fundamentals', slug: 'ai-fundamentals', module: 4, title: 'Module 4 Study Guide — AI in Financial Services', file: 'assets/guides/ai-fundamentals-m4-study-guide.pdf' },
    { course: 'A.I Fundamentals', slug: 'ai-fundamentals', module: 6, title: 'Module 6 Study Guide — Future of AI in Finance', file: 'assets/guides/ai-fundamentals-m6-study-guide.pdf' },
    { course: 'DeFi & Advanced Crypto', slug: 'defi-advanced-crypto', module: 1, title: 'Module 1 Study Guide — DeFi Ecosystem Overview', file: 'assets/guides/defi-advanced-crypto-m1-study-guide.pdf' },
    { course: 'DeFi & Advanced Crypto', slug: 'defi-advanced-crypto', module: 2, title: 'Module 2 Study Guide — Smart Contracts & dApps', file: 'assets/guides/defi-advanced-crypto-m2-study-guide.pdf' },
    { course: 'DeFi & Advanced Crypto', slug: 'defi-advanced-crypto', module: 3, title: 'Module 3 Study Guide — Yield Farming & Staking', file: 'assets/guides/defi-advanced-crypto-m3-study-guide.pdf' },
    { course: 'DeFi & Advanced Crypto', slug: 'defi-advanced-crypto', module: 4, title: 'Module 4 Study Guide — Advanced Trading Strategies', file: 'assets/guides/defi-advanced-crypto-m4-study-guide.pdf' },
    { course: 'DeFi & Advanced Crypto', slug: 'defi-advanced-crypto', module: 5, title: 'Module 5 Study Guide — Risk Management in DeFi', file: 'assets/guides/defi-advanced-crypto-m5-study-guide.pdf' },
    { course: 'DeFi & Advanced Crypto', slug: 'defi-advanced-crypto', module: 6, title: 'Module 6 Study Guide — Future of Decentralized Finance', file: 'assets/guides/defi-advanced-crypto-m6-study-guide.pdf' },
    { course: 'Financial Literacy for Kids', slug: 'financial-literacy-for-kids', module: 2, title: 'Module 2 Study Guide — Saving Like a Superhero', file: 'assets/guides/financial-literacy-for-kids-m2-study-guide.pdf' },
    { course: 'Financial Literacy for Kids', slug: 'financial-literacy-for-kids', module: 3, title: 'Module 3 Study Guide — Needs vs Wants', file: 'assets/guides/financial-literacy-for-kids-m3-study-guide.pdf' },
    { course: 'Financial Literacy for Kids', slug: 'financial-literacy-for-kids', module: 4, title: 'Module 4 Study Guide — Banks Keep Money Safe', file: 'assets/guides/financial-literacy-for-kids-m4-study-guide.pdf' },
    { course: 'Financial Literacy for Kids', slug: 'financial-literacy-for-kids', module: 5, title: 'Module 5 Study Guide — Growing & Sharing Money', file: 'assets/guides/financial-literacy-for-kids-m5-study-guide.pdf' },
    { course: 'Complete Financial Literacy', slug: 'complete-financial-literacy', module: 1, title: 'Module 1 Study Guide — Understanding Personal Finance', file: 'assets/guides/complete-financial-literacy-m1-study-guide.pdf' },
    { course: 'Stock Market Investing 101', slug: 'stock-market-investing-101', module: 4, title: 'Module 4 Study Guide — Portfolio Diversification', file: 'assets/guides/stock-market-investing-101-m4-study-guide.pdf' },
    { course: 'Stock Market Investing 101', slug: 'stock-market-investing-101', module: 5, title: 'Module 5 Study Guide — Long-Term Investment Strategies', file: 'assets/guides/stock-market-investing-101-m5-study-guide.pdf' },
    { course: 'Day Trading Mastery', slug: 'day-trading-mastery', module: 6, title: 'Module 6 Study Guide — Psychology of Trading', file: 'assets/guides/day-trading-mastery-m6-study-guide.pdf' },
    { course: 'A.I Fundamentals', slug: 'ai-fundamentals', module: 3, title: 'Module 3 Study Guide — Neural Networks & Deep Learning', file: 'assets/guides/ai-fundamentals-m3-study-guide.pdf' },
    { course: 'A.I Fundamentals', slug: 'ai-fundamentals', module: 5, title: 'Module 5 Study Guide — Automated Trading & Risk Analysis', file: 'assets/guides/ai-fundamentals-m5-study-guide.pdf' },
];
