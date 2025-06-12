// New function to fetch and parse .md files
async function loadNews() {
  try {
    // Get list of .md files
    const response = await fetch('news/');
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const links = [...doc.querySelectorAll('a')]
      .map(a => a.href)
      .filter(href => href.endsWith('.md'));
    
    // Parse each .md file
    const newsItems = await Promise.all(
      links.map(async link => {
        const res = await fetch(link);
        const text = await res.text();
        const meta = text.match(/^---\n([\s\S]*?)\n---/)[1];
        return {
          title: meta.match(/title: (.*)/)[1],
          description: meta.match(/description: (.*)/)[1],
          image: meta.match(/image: (.*)/)[1],
          link: meta.match(/link: (.*)/)[1]
        };
      })
    );
    
    renderNews(newsItems);
  } catch (error) {
    console.error('Error loading news:', error);
    // Fallback to JSON
    fetch('news/index.json')
      .then(res => res.json())
      .then(renderNews)
      .catch(() => renderNews([/* default items */]));
  }
}

loadNews();
