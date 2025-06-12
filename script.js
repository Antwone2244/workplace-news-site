async function loadNews() {
  try {
    // 1. Get list of .md files from /news directory
    const response = await fetch('news/');
    if (!response.ok) throw new Error('Failed to fetch news directory');
    
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // 2. Extract all .md file links
    const links = [...doc.querySelectorAll('a')]
      .map(a => a.href)
      .filter(href => href.endsWith('.md'));
    
    // 3. Process each .md file
    const newsItems = await Promise.all(
      links.map(async link => {
        const res = await fetch(link);
        const text = await res.text();
        
        // Extract frontmatter (metadata between ---)
        const metaMatch = text.match(/^---\n([\s\S]*?)\n---/);
        if (!metaMatch) throw new Error('Invalid frontmatter');
        
        const meta = metaMatch[1];
        const getField = (name) => meta.match(new RegExp(`${name}:\\s*(.*)`))?.[1]?.trim() || '';
        
        return {
          title: getField('title'),
          description: getField('description'),
          image: getField('image'),
          link: getField('link')
        };
      })
    );
    
    renderNews(newsItems);
  } catch (error) {
    console.error('Error loading news:', error);
    // Fallback to JSON if .md parsing fails
    fetch('news/index.json')
      .then(res => res.json())
      .then(renderNews)
      .catch(() => renderNews([{
        title: "Default News",
        description: "Failed to load news updates",
        image: "images/uploads/default.jpg",
        link: "#"
      }]));
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
      <a href="${item.link}" target="_blank">Read More</a>
    </div>
  `).join('');
}

// Initialize
loadNews();
