document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('announcements');
  if (!container) {
    console.error('Error: Announcements container not found');
    return;
  }

  try {
    // Try loading from JSON first
    const response = await fetch('news/index.json');
    if (!response.ok) throw new Error('JSON load failed');
    
    const newsItems = await response.json();
    renderNews(newsItems);
    
  } catch (jsonError) {
    console.warn('JSON load failed, trying markdown files:', jsonError);
    
    try {
      // Fallback to markdown files
      const mdFiles = ['flood-watch.md', 'flood-watch-update.md'];
      const newsItems = [];
      
      for (const file of mdFiles) {
        const res = await fetch(`news/${file}`);
        if (!res.ok) continue;
        
        const text = await res.text();
        const meta = text.match(/---\n([\s\S]*?)\n---/)?.[1] || '';
        
        newsItems.push({
          title: meta.match(/title: (.*)/)?.[1]?.trim() || 'Untitled',
          description: meta.match(/description: (.*)/)?.[1]?.trim() || '',
          image: meta.match(/image: (.*)/)?.[1]?.trim() || '/images/uploads/default.jpg',
          link: meta.match(/link: (.*)/)?.[1]?.trim() || '#'
        });
      }
      
      renderNews(newsItems.length ? newsItems : [{
        title: "Default News",
        description: "Check your news markdown files",
        image: "/images/uploads/default.jpg",
        link: "#"
      }]);
      
    } catch (mdError) {
      console.error('Markdown load failed:', mdError);
      renderNews([{
        title: "Error Loading News",
        description: "Please try again later",
        image: "/images/uploads/error.jpg",
        link: "#"
      }]);
    }
  }
});

function renderNews(items) {
  const container = document.getElementById('announcements');
  container.innerHTML = items.map(item => `
    <div class="announcement">
      <img src="${item.image}" alt="${item.title}">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <a href="${item.link}">Read More</a>
    </div>
  `).join('');
}
