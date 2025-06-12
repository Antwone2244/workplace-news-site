// Hardcoded list of .md files (avoid directory listing)
const NEWS_FILES = ['flood-watch.md', 'welcome.md'];

async function loadNews() {
  try {
    const newsItems = [];
    
    // Process each .md file
    for (const file of NEWS_FILES) {
      try {
        const res = await fetch(`news/${file}`);
        if (!res.ok) continue; // Skip missing files
        
        const text = await res.text();
        const meta = text.match(/---\n([\s\S]*?)\n---/)?.[1] || '';
        
        newsItems.push({
          title: meta.match(/title: (.*)/)?.[1]?.trim() || 'Untitled',
          description: meta.match(/description: (.*)/)?.[1]?.trim() || '',
          image: meta.match(/image: (.*)/)?.[1]?.trim() || 'images/uploads/default.jpg',
          link: meta.match(/link: (.*)/)?.[1]?.trim() || '#'
        });
      } catch (e) {
        console.warn(`Failed to load ${file}:`, e);
      }
    }

    renderNews(newsItems.length ? newsItems : [{
      title: "No News Found",
      description: "Check your .md files in /news",
      image: "images/uploads/default.jpg",
      link: "#"
    }]);
    
  } catch (error) {
    console.error('Critical error:', error);
  }
}

function renderNews(items) {
  const container = document.getElementById('announcements');
  if (!container) return;
  
  container.innerHTML = items.map(item => `
    <div class="announcement">
      <img src="${item.image}" alt="${item.title}">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <a href="${item.link}">Read More</a>
    </div>
  `).join('');
}

// Initialize
loadNews();
