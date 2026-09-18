import re

with open(r"C:\Users\Sessi\Desktop\ANTIGRAVITY\School WEBSITE\index.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. crypto - BTC
content = content.replace("<span class=\"thumb-icon\">\u20bf</span>", "<span class=\"thumb-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#D4AF37\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"></path><polyline points=\"3.27 6.96 12 12.01 20.73 6.96\"></polyline><line x1=\"12\" y1=\"22.08\" x2=\"12\" y2=\"12\"></line></svg></span>")

# 2. trading - chart up
content = content.replace("<span class=\"thumb-icon\">\ud83d\udcc8</span>", "<span class=\"thumb-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#D4AF37\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"23 6 13.5 15.5 8.5 10.5 1 18\"></polyline><polyline points=\"17 6 23 6 23 12\"></polyline></svg></span>")

# 3. finance - bar chart
content = content.replace("<span class=\"thumb-icon\">\ud83d\udcca</span>", "<span class=\"thumb-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#D4AF37\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"18\" y1=\"20\" x2=\"18\" y2=\"10\"></line><line x1=\"12\" y1=\"20\" x2=\"12\" y2=\"4\"></line><line x1=\"6\" y1=\"20\" x2=\"6\" y2=\"16\"></line></svg></span>")

# 4. stocks - chart down
content = content.replace("<span class=\"thumb-icon\">\ud83d\udcc9</span>", "<span class=\"thumb-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#D4AF37\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"1 6 8.5 10.5 13.5 6 23 18\"></polyline><polyline points=\"17 18 23 18 23 12\"></polyline></svg></span>")

# 5. DeFi - link
content = content.replace("<span class=\"thumb-icon\">\ud83d\udd17</span>", "<span class=\"thumb-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#D4AF37\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"></path><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"></path></svg></span>")

# 6. blog market - bar chart
content = content.replace("<span class=\"blog-thumb-icon\">\ud83d\udcca</span>", "<span class=\"blog-thumb-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#D4AF37\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"18\" y1=\"20\" x2=\"18\" y2=\"10\"></line><line x1=\"12\" y1=\"20\" x2=\"12\" y2=\"4\"></line><line x1=\"6\" y1=\"20\" x2=\"6\" y2=\"16\"></line></svg></span>")

# 7. blog crypto - BTC
content = content.replace("<span class=\"blog-thumb-icon\">\u20bf</span>", "<span class=\"blog-thumb-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#D4AF37\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"></path><polyline points=\"3.27 6.96 12 12.01 20.73 6.96\"></polyline><line x1=\"12\" y1=\"22.08\" x2=\"12\" y2=\"12\"></line></svg></span>")

# 8. blog economy - chart with trend
content = content.replace("<span class=\"blog-thumb-icon\">\ud83d\udcb9</span>", "<span class=\"blog-thumb-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#D4AF37\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"1 22 13 9 18 14 23 4\"></polyline><line x1=\"8\" y1=\"16\" x2=\"8\" y2=\"6\"></line><line x1=\"16\" y1=\"16\" x2=\"16\" y2=\"10\"></line></svg></span>")

# 9. contact address - location pin
content = content.replace("<div class=\"contact-icon\">\ud83d\udccd</div>", "<div class=\"contact-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#D4AF37\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z\"></path><circle cx=\"12\" cy=\"10\" r=\"3\"></circle></svg></div>")

# 10. contact phone - phone
content = content.replace("<div class=\"contact-icon\">\ud83d\udce3</div>", "<div class=\"contact-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#D4AF37\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"></path></svg></div>")

# 11. contact WhatsApp - message
content = content.replace("<div class=\"contact-icon\">\ud83d\udcac</div>", "<div class=\"contact-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#D4AF37\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"></path></svg></div>")

# 12. footer heart
content = content.replace("<span>Built with \u2764\ufe0f for financial freedom</span>", "<span>Built with <svg viewBox=\"0 0 24 24\" fill=\"#D4AF37\" stroke=\"#D4AF37\" stroke-width=\"1.5\" style=\"width:16px;height:16px;vertical-align:middle;\"><path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"></path></svg> for financial freedom</span>")

# Add CSS
css = """
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
"""
content = content.replace("</style>", css + "</style>")

with open(r"C:\Users\Sessi\Desktop\ANTIGRAVITY\School WEBSITE\index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("All replacements completed and CSS added.")
