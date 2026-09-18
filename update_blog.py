#!/usr/bin/env python3
"""
Blog Updater Cron Script
Updates the index.html blog section to show only the 3 most recent articles
from the last 3 weeks based on blog_manifest.json

Usage: python update_blog.py
Schedule: Run weekly via cron/scheduled task
"""

import json
import re
from datetime import datetime, timedelta
from pathlib import Path

def load_manifest():
    """Load blog manifest and filter articles"""
    manifest_path = Path(__file__).parent / 'blog_manifest.json'
    with open(manifest_path, 'r') as f:
        manifest = json.load(f)
    
    articles = manifest['articles']
    max_articles = manifest['settings']['max_articles']
    lookback_weeks = manifest['settings']['lookback_weeks']
    
    # Parse dates and filter to last N weeks
    cutoff_date = datetime.now() - timedelta(weeks=lookback_weeks)
    recent_articles = []
    
    for article in articles:
        article_date = datetime.strptime(article['date'], '%Y-%m-%d')
        if article_date >= cutoff_date:
            recent_articles.append(article)
    
    # Sort by date descending and take top N
    recent_articles.sort(key=lambda x: x['date'], reverse=True)
    return recent_articles[:max_articles]

def generate_blog_card(article):
    """Generate HTML for a single blog card"""
    return f'''            <article class="blog-card reveal">
                <div class="blog-thumb {article['thumb_class']}">
                    <div class="blog-thumb-inner">
                        <span class="blog-thumb-icon">{article['thumb_icon']}</span>
                        <span class="blog-thumb-label">{article['thumb_label']}</span>
                    </div>
                </div>
                <div class="blog-content">
                    <div class="blog-meta">
                        <span class="blog-date">{article['date']}</span>
                        <span class="blog-read">{article['read_time']}</span>
                    </div>
                    <h3>{article['title']}</h3>
                    <p>{article['description']}</p>
                    <a href="{article['file']}" class="blog-link">Read Article</a>
                </div>
            </article>'''

def update_index_html(articles):
    """Update the blog section in index.html"""
    index_path = Path(__file__).parent / 'index.html'
    with open(index_path, 'r') as f:
        content = f.read()
    
    # Find the blog section
    blog_section_start = content.find('<section id="blog">')
    blog_section_end = content.find('</section>', blog_section_start) + len('</section>')
    
    if blog_section_start == -1 or blog_section_end == -1:
        print('ERROR: Could not find blog section in index.html')
        return False
    
    # Generate new blog cards HTML
    new_cards = '\n'.join([generate_blog_card(article) for article in articles])
    
    # Build replacement blog section
    new_blog_section = f'''    <section id="blog">
        <div class="section-header reveal">
            <div class="section-tag">Finance Weekly</div>
            <h2 class="section-title">Latest <span style="color: #D4AF37;">Finance News</span></h2>
            <p class="section-subtitle">Stay ahead with our weekly roundup of market insights, crypto updates, and economic trends.</p>
        </div>
        <div class="blog-grid">
{new_cards}
        </div>
    </section>'''
    
    # Replace old blog section with new one
    old_blog_section = content[blog_section_start:blog_section_end]
    content = content.replace(old_blog_section, new_blog_section)
    
    with open(index_path, 'w') as f:
        f.write(content)
    
    return True

def main():
    """Main execution"""
    print(f"Updating blog section at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}...")
    
    try:
        articles = load_manifest()
        print(f"Found {len(articles)} articles to display (max 3, last 3 weeks)")
        
        if not articles:
            print('WARNING: No articles found in the last 3 weeks')
            return
        
        if update_index_html(articles):
            print('Successfully updated index.html')
            for i, article in enumerate(articles, 1):
                print(f"  {i}. {article['date']} - {article['title']}")
        else:
            print('ERROR: Failed to update index.html')
    
    except Exception as e:
        print(f'ERROR: {e}')
        raise

if __name__ == '__main__':
    main()
