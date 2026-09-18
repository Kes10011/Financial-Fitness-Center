import re

file_path = r'C:\Users\Sessi\Desktop\ANTIGRAVITY\School WEBSITE\index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace About Us section
old_about = """    <section id="about">
        <div class="section-header reveal">
            <div class="section-tag">About Us</div>
            <h2 class="section-title">Who We <span style="color: #D4AF37;">Are</span></h2>
        </div>
        <div class="about-section reveal">
            <p>School of Financial Fitness is dedicated to empowering individuals with the knowledge and skills needed to navigate the complex world of finance. From cryptocurrency to traditional investing, our courses are designed to provide practical, actionable education that transforms lives.</p>
            <p>Our mission is to make financial literacy accessible to everyone, regardless of their background or experience level. We believe that everyone deserves the opportunity to build wealth and achieve financial freedom.</p>
        </div>
    </section>"""

new_about = """    <section id="about" class="about-digital">
        <div class="section-header reveal">
            <div class="section-tag">About Us</div>
            <h2 class="section-title">Who We <span style="color: #D4AF37;">Are</span></h2>
        </div>

        <!-- INTRO -->
        <div class="about-intro reveal">
            <div class="about-kinetic" aria-hidden="true">
                <span class="about-letter">F</span><span class="about-letter">I</span><span class="about-letter">N</span><span class="about-letter">A</span><span class="about-letter">N</span><span class="about-letter">C</span><span class="about-letter">I</span><span class="about-letter">A</span><span class="about-letter">L</span>
                <span class="about-letter-space"></span>
                <span class="about-letter">F</span><span class="about-letter">I</span><span class="about-letter">T</span><span class="about-letter">N</span><span class="about-letter">E</span><span class="about-letter">S</span><span class="about-letter">S</span>
            </div>
            <p class="about-tagline">Transitioning People Into The Digital Economy.</p>
            <div class="about-grid-bg" aria-hidden="true"></div>
        </div>

        <!-- MISSION -->
        <div class="about-mission reveal">
            <div class="about-label">MISSION</div>
            <div class="mission-cards">
                <div class="mission-card">
                    <div class="mission-line" aria-hidden="true"></div>
                    <div class="mission-node" aria-hidden="true"></div>
                    <span class="mission-num">01</span>
                    <h4>DIGITAL TRANSITION</h4>
                    <p>\"To provide families and individuals with the right tools needed to transition into the Digital Environment.\"</p>
                </div>
                <div class="mission-card">
                    <div class="mission-line" aria-hidden="true"></div>
                    <div class="mission-node" aria-hidden="true"></div>
                    <span class="mission-num">02</span>
                    <h4>TWO ECONOMIES</h4>
                    <p>\"To provide comprehensive understanding to effectively function in these 2 economies simultaneously.\"</p>
                </div>
                <div class="mission-card">
                    <div class="mission-line" aria-hidden="true"></div>
                    <div class="mission-node" aria-hidden="true"></div>
                    <span class="mission-num">03</span>
                    <h4>DIGITAL WEALTH</h4>
                    <p>\"To adequately explore all opportunities to expand and secure stakeholders wealth Digitally.\"</p>
                </div>
            </div>
        </div>

        <!-- VISION -->
        <div class="about-vision reveal">
            <div class="about-label">OUR VISION</div>
            <div class="vision-pathway" aria-hidden="true">
                <div class="vision-line"></div>
                <div class="vision-dot"></div>
                <div class="vision-dot"></div>
                <div class="vision-dot"></div>
                <div class="vision-destination"></div>
            </div>
            <p class="vision-text">\"To be the number one resource for digital economy transition.\"</p>
        </div>

        <!-- ECOSYSTEM -->
        <div class="about-ecosystem reveal">
            <div class="about-label">FINANCIAL FITNESS CENTRE</div>
            <div class="ecosystem-wrap">
                <div class="eco-center">
                    <div class="eco-pulse" aria-hidden="true"></div>
                    <span>Financial Fitness Centre</span>
                </div>
                <div class="eco-orbit" aria-hidden="true">
                    <div class="eco-ring"></div>
                </div>
                <div class="eco-nodes">
                    <div class="eco-node" data-index="0">
                        <div class="eco-dot"></div>
                        <span>Personal Financial Coaching</span>
                    </div>
                    <div class="eco-node" data-index="1">
                        <div class="eco-dot"></div>
                        <span>Children's Financial Literacy</span>
                    </div>
                    <div class="eco-node" data-index="2">
                        <div class="eco-dot"></div>
                        <span>Business Digital Transition</span>
                    </div>
                    <div class="eco-node" data-index="3">
                        <div class="eco-dot"></div>
                        <span>Digital Portfolio Management</span>
                    </div>
                    <div class="eco-node" data-index="4">
                        <div class="eco-dot"></div>
                        <span>Web 3 Integration</span>
                    </div>
                </div>
            </div>
        </div>
    </section>"""

if old_about in content:
    content = content.replace(old_about, new_about)
    print('About Us section replaced successfully')
else:
    print('ERROR: Could not find old About Us section')
    exit(1)

# 2. Insert CSS before </style>
css_block = """/* ========== ABOUT US — DIGITAL MOTION ========== */
.about-digital {
    position: relative;
    padding: 120px 40px;
}

.about-intro {
    text-align: center;
    margin-bottom: 100px;
    position: relative;
    overflow: hidden;
}

.about-kinetic {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-bottom: 24px;
    flex-wrap: wrap;
}

.about-letter {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(36px, 6vw, 72px);
    font-weight: 700;
    color: #D4AF37;
    opacity: 0;
    transform: translateY(30px);
    animation: kineticIn 0.6s ease-out forwards;
    text-shadow: 0 0 30px rgba(212, 175, 55, 0.4);
}

.about-letter-space {
    width: 20px;
}

.about-tagline {
    font-size: 18px;
    color: #a1a1aa;
    letter-spacing: 2px;
    text-transform: uppercase;
    opacity: 0;
    animation: fadeInUp 0.8s ease-out 1.2s forwards;
}

.about-grid-bg {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image:
        linear-gradient(rgba(212, 175, 55, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(212, 175, 55, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
    z-index: 0;
}

@keyframes kineticIn {
    to { opacity: 1; transform: translateY(0); }
}

/* MISSION */
.about-mission {
    margin-bottom: 100px;
}

.mission-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 32px;
    max-width: 1200px;
    margin: 40px auto 0;
}

.mission-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 40px 32px;
    position: relative;
    overflow: hidden;
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.mission-card.visible {
    opacity: 1;
    transform: translateY(0);
}

.mission-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #D4AF37, transparent);
    opacity: 0;
    transition: opacity 0.4s;
}

.mission-card:hover::before {
    opacity: 1;
}

.mission-card:hover {
    border-color: rgba(212, 175, 55, 0.2);
    transform: translateY(-8px);
}

.mission-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: #D4AF37;
    letter-spacing: 2px;
    display: block;
    margin-bottom: 16px;
}

.mission-card h4 {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 16px;
    color: #fff;
}

.mission-card p {
    font-size: 14px;
    color: #a1a1aa;
    line-height: 1.7;
    font-style: italic;
}

/* VISION */
.about-vision {
    text-align: center;
    margin-bottom: 100px;
    padding: 80px 20px;
    position: relative;
}

.vision-pathway {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin: 40px 0;
    position: relative;
    height: 60px;
}

.vision-line {
    position: absolute;
    top: 50%;
    left: 10%;
    right: 10%;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent);
    transform: translateY(-50%);
}

.vision-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #D4AF37;
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
    animation: visionPulse 2s ease-in-out infinite;
    position: relative;
    z-index: 2;
}

.vision-dot:nth-child(3) { animation-delay: 0.3s; }
.vision-dot:nth-child(4) { animation-delay: 0.6s; }

.vision-destination {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #D4AF37;
    box-shadow: 0 0 40px rgba(212, 175, 55, 0.8);
    animation: visionPulse 2s ease-in-out infinite;
    position: relative;
    z-index: 2;
}

@keyframes visionPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.3); opacity: 0.7; }
}

.vision-text {
    font-size: clamp(20px, 3vw, 32px);
    font-weight: 600;
    color: #fff;
    line-height: 1.4;
    font-style: italic;
    opacity: 0;
    animation: fadeInUp 1s ease-out forwards;
}

/* ECOSYSTEM */
.about-ecosystem {
    text-align: center;
    padding: 80px 20px;
    position: relative;
}

.ecosystem-wrap {
    position: relative;
    max-width: 900px;
    margin: 60px auto 0;
    min-height: 500px;
}

.eco-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 180px;
    height: 180px;
    background: rgba(212, 175, 55, 0.1);
    border: 2px solid rgba(212, 175, 55, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    color: #D4AF37;
    z-index: 3;
    box-shadow: 0 0 60px rgba(212, 175, 55, 0.2);
}

.eco-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 180px;
    height: 180px;
    border-radius: 50%;
    border: 1px solid rgba(212, 175, 55, 0.2);
    animation: ecoPulse 3s ease-out infinite;
}

@keyframes ecoPulse {
    0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
}

.eco-orbit {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 400px;
    border: 1px dashed rgba(212, 175, 55, 0.15);
    border-radius: 50%;
    animation: ecoRotate 30s linear infinite;
}

@keyframes ecoRotate {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
}

.eco-nodes {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.eco-node {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.4s;
    opacity: 0.7;
}

.eco-node:hover, .eco-node.active {
    opacity: 1;
    transform: scale(1.1);
}

.eco-node:hover .eco-dot, .eco-node.active .eco-dot {
    box-shadow: 0 0 30px rgba(212, 175, 55, 0.8);
}

.eco-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #D4AF37;
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
    transition: all 0.4s;
}

.eco-node span {
    font-size: 12px;
    color: #a1a1aa;
    max-width: 140px;
    text-align: center;
    line-height: 1.4;
    transition: color 0.4s;
}

.eco-node:hover span, .eco-node.active span {
    color: #fff;
}

/* Position 5 nodes around the circle */
.eco-node[data-index="0"] { top: 10%; left: 50%; transform: translateX(-50%); }
.eco-node[data-index="1"] { top: 35%; right: 5%; }
.eco-node[data-index="2"] { bottom: 25%; right: 10%; }
.eco-node[data-index="3"] { bottom: 10%; left: 50%; transform: translateX(-50%); }
.eco-node[data-index="4"] { top: 35%; left: 5%; }

.eco-node[data-index="0"]:hover { transform: translateX(-50%) scale(1.1); }

/* Label style */
.about-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 600;
    color: #D4AF37;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
}

.about-label::before, .about-label::after {
    content: '';
    width: 40px;
    height: 1px;
    background: rgba(212, 175, 55, 0.3);
}

/* RESPONSIVE */
@media (max-width: 768px) {
    .about-digital {
        padding: 80px 20px;
    }
    .mission-cards {
        grid-template-columns: 1fr;
    }
    .ecosystem-wrap {
        min-height: 400px;
    }
    .eco-center {
        width: 140px;
        height: 140px;
        font-size: 12px;
    }
    .eco-orbit {
        width: 300px;
        height: 300px;
    }
    .eco-pulse {
        width: 140px;
        height: 140px;
    }
    .eco-node span {
        font-size: 11px;
        max-width: 100px;
    }
    .eco-node[data-index="0"] { top: 5%; }
    .eco-node[data-index="1"] { top: 30%; right: 0; }
    .eco-node[data-index="2"] { bottom: 20%; right: 5%; }
    .eco-node[data-index="3"] { bottom: 5%; }
    .eco-node[data-index="4"] { top: 30%; left: 0; }
}

/* REDUCED MOTION */
@media (prefers-reduced-motion: reduce) {
    .about-letter, .mission-card, .vision-text {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
    }
    .eco-orbit, .eco-pulse, .vision-dot, .vision-destination {
        animation: none !important;
    }
    .mission-card {
        transition: none !important;
    }
}

.eco-node.dim {
    opacity: 0.3;
    transform: scale(0.95);
}
.eco-node[data-index="0"].dim { transform: translateX(-50%) scale(0.95); }
"""

if content.count('<style>') == 1:
    content = content.replace('</style>', css_block + '</style>')
    print('CSS inserted before </style>')
else:
    print('ERROR: Could not find </style> or multiple found')
    exit(1)

# 3. Append JS after the existing </script> before </body>
js_block = """
/* ========== ABOUT US ANIMATIONS ========== */
(function() {
    // Stagger kinetic text letters
    document.querySelectorAll('.about-letter').forEach(function(el, i) {
        el.style.animationDelay = (0.1 + i * 0.05) + 's';
    });

    // Intersection Observer for mission cards
    var missionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var cards = entry.target.querySelectorAll('.mission-card');
                cards.forEach(function(card, i) {
                    setTimeout(function() {
                        card.classList.add('visible');
                    }, i * 200);
                });
                missionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    var missionSection = document.querySelector('.mission-cards');
    if (missionSection) missionObserver.observe(missionSection);

    // Ecosystem node interaction
    var ecoNodes = document.querySelectorAll('.eco-node');
    ecoNodes.forEach(function(node) {
        node.addEventListener('mouseenter', function() {
            ecoNodes.forEach(function(n) {
                if (n !== node) n.classList.add('dim');
            });
            node.classList.add('active');
        });
        node.addEventListener('mouseleave', function() {
            ecoNodes.forEach(function(n) {
                n.classList.remove('dim', 'active');
            });
        });
    });
})();
"""

if content.count('<script>') == 1:
    content = content.replace('</script>', '</script>' + js_block)
    print('JS appended after existing script')
else:
    print('ERROR: Could not find existing <script> or multiple found')
    exit(1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('All edits completed successfully')
