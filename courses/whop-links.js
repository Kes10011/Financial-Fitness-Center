// Whop checkout links — SINGLE CONFIG for all course purchase buttons.
// How to go live: paste a real Whop checkout URL in place of null for that
// module/bundle (one line per button). While a value is null, the button keeps
// its WhatsApp purchase-intent fallback (already in the page HTML), so no button
// is ever dead. NEVER invent or hardcode a Whop URL that Kester did not supply.
const WHOP_LINKS = {
    "ai-fundamentals": { "2": "https://whop.com/checkout/plan_MTkpmA8YWHREc", "3": "https://whop.com/checkout/plan_J4uSUIc1UPD6Z", "4": "https://whop.com/checkout/plan_jfhYYKvnp3K6l", "5": "https://whop.com/checkout/plan_gKe96lSjxzzfy", "6": "https://whop.com/checkout/plan_TsZUXwwaybrEO", "bundle": "https://whop.com/checkout/plan_W7W9wj5sCMg6o" },
    "complete-financial-literacy": { "2": "https://whop.com/checkout/plan_LbLMnH4uksZRm", "3": "https://whop.com/checkout/plan_VFZjkO4KWhy5r", "4": "https://whop.com/checkout/plan_8ZfRzK7Ff6mog", "5": "https://whop.com/checkout/plan_3aFkC4laxIcdi", "bundle": "https://whop.com/checkout/plan_WOKuO0zA62GLi" },
    "cryptocurrency-fundamentals": { "2": "https://whop.com/checkout/plan_hR0n7qv4BPBdk", "3": "https://whop.com/checkout/plan_zZDYTJ8UZFt9b", "4": "https://whop.com/checkout/plan_3kjx8GSpt6hH9", "5": "https://whop.com/checkout/plan_riI3uZw503BxT", "bundle": "https://whop.com/checkout/plan_cRWWmNKVjbMEb" },
    "day-trading-mastery": { "2": "https://whop.com/checkout/plan_VD9SRARUpzV8k", "3": "https://whop.com/checkout/plan_dpyUF6ra0L2Qf", "4": "https://whop.com/checkout/plan_NEGHQy1cUqAqO", "5": "https://whop.com/checkout/plan_ueoPLWS3eMung", "6": "https://whop.com/checkout/plan_AgZiTlkhV4wJp", "bundle": "https://whop.com/checkout/plan_wvrJEQpZGuNfL" },
    "defi-advanced-crypto": { "2": "https://whop.com/checkout/plan_XEe3Yn35jcA8D", "3": "https://whop.com/checkout/plan_q0m34EU7NXSKF", "4": "https://whop.com/checkout/plan_ymVUcqJ0vR2Af", "5": "https://whop.com/checkout/plan_0V17Zfx8YbIms", "6": "https://whop.com/checkout/plan_FmS3rnqXGrqIn", "bundle": "https://whop.com/checkout/plan_fiZ9eZwixXigl" },
    "financial-literacy-for-kids": { "2": "https://whop.com/checkout/plan_yHDirneY1uD7V", "3": "https://whop.com/checkout/plan_WK8wfiYDMrw62", "4": "https://whop.com/checkout/plan_3K8eALiwRlLp4", "5": "https://whop.com/checkout/plan_MJxDYIRTOcX6R", "bundle": "https://whop.com/checkout/plan_lAobWz88SioDq" },
    "financial-literacy-for-teenagers": { "2": "https://whop.com/checkout/plan_KQfHy9EyZZOpL", "3": "https://whop.com/checkout/plan_uwaDOg5oYbDIK", "4": "https://whop.com/checkout/plan_hAhmeOATeGcRw", "5": "https://whop.com/checkout/plan_iEOASLgEoUsBE", "bundle": "https://whop.com/checkout/plan_dCwzntNcpemZc" },
    "stock-market-investing-101": { "2": "https://whop.com/checkout/plan_M6IQJ3rZ6AoUk", "3": "https://whop.com/checkout/plan_KqulS9jelEjO9", "4": "https://whop.com/checkout/plan_tpmBIiYN00Cnp", "5": "https://whop.com/checkout/plan_PpFhrvdkXWV8u", "bundle": "https://whop.com/checkout/plan_AaW9j8xWlOZtc" },
};
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("a[data-whop-course][data-whop-item]").forEach(a => {
        const url = (WHOP_LINKS[a.dataset.whopCourse] || {})[a.dataset.whopItem];
        if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
    });
});
