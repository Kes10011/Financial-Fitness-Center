with open(r"C:\Users\Sessi\Desktop\ANTIGRAVITY\School WEBSITE\index.html", "rb") as f:
    content = f.read()

# Find more context for DeFi Protocol and Economy
for term in [b"DeFi Protocol", b"blog-thumb-icon", b"thumb-icon"]:
    idx = content.find(term)
    while idx >= 0:
        start = max(0, idx - 80)
        end = min(len(content), idx + 80)
        snippet = content[start:end]
        print(f"Found {term} at {idx}:")
        print(snippet.hex())
        print(snippet)
        print("---")
        idx = content.find(term, idx + 1)
