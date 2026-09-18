with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

trophy_icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2"/><path d="M6 5h12"/><path d="M12 5v12"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>'

for garbled in ['??', '?????', '??????']:
    content = content.replace(
        '<div class="director-achievement-icon">' + garbled + '</div>',
        '<div class="director-achievement-icon">' + trophy_icon + '</div>'
    )

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Replaced all garbled achievement icons with trophy SVGs in director popups')
