$content = Get-Content "C:\Users\Sessi\Desktop\ANTIGRAVITY\School WEBSITE\index.html" -Raw

# Add CSS before </style>
$cssAddition = @"
.thumb-icon svg, .blog-thumb-icon svg {
    width: 48px;
    height: 48px;
    display: block;
}
.contact-icon svg {
    width: 28px;
    height: 28px;
    display: block;
}
.icon-svg {
    width: 1em;
    height: 1em;
    vertical-align: -0.125em;
    stroke: #D4AF37;
    stroke-width: 2;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
}
.icon-svg.large { width: 1.5em; height: 1.5em; }
.icon-svg.small { width: 0.875em; height: 0.875em; }
.footer-bottom .icon-svg { width: 1.2em; height: 1.2em; }
"@

$content = $content -replace '(?s)\.contact-icon svg \{[^}]+\}\s*</style>', $cssAddition + "`n</style>"

# Replace emojis with inline SVGs
$btcSvg = '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
$chartUpSvg = '<svg class="icon-svg" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>'
$barChartSvg = '<svg class="icon-svg" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>'
$chartDownSvg = '<svg class="icon-svg" viewBox="0 0 24 24"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>'
$linkSvg = '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
$locationSvg = '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'
$phoneSvg = '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'
$messageSvg = '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
$heartSvg = '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'

# Use the actual garbled characters from the file
$content = $content -replace [char]0xE2][char]0x82][char]0xBF, $btcSvg        # â‚¿ (₿)
$content = $content -replace [char]0xF0][char]0x9F][char]0x93][char]0x86, $chartUpSvg   # 📈
$content = $content -replace [char]0xF0][char]0x9F][char]0x93][char]0x8A, $barChartSvg  # 📊
$content = $content -replace [char]0xF0][char]0x9F][char]0x93][char]0x89, $chartDownSvg  # 📉
$content = $content -replace [char]0xF0][char]0x9F][char]0x93][char]0x97, $linkSvg       # 🔗
$content = $content -replace [char]0xF0][char]0x9F][char]0x93][char]0x8D, $locationSvg   # 📍
$content = $content -replace [char]0xF0][char]0x9F][char]0x93][char]0x9E, $phoneSvg      # 📞
$content = $content -replace [char]0xF0][char]0x9F][char]0x92][char]0xAC, $messageSvg    # 💬
$content = $content -replace [char]0xF0][char]0x9F][char]0x92][char]0xB9, $chartUpSvg    # 💹
$content = $content -replace [char]0xF0][char]0x9F][char]0x92][char]0x9A, $heartSvg       # ❤️

$content | Set-Content "C:\Users\Sessi\Desktop\ANTIGRAVITY\School WEBSITE\index.html" -Encoding UTF8
"Done"
