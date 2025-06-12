// First try to load from JSON
fetch('news/index.json')
  .then(res => res.json())
  .then(data => renderNews(data))
  .catch(() => {
    // Fallback to hardcoded data if fetch fails
    renderNews([
      {
        title: "Welcome!",
        description: "First post!",
        image: "images/uploads/default.jpg",
        link: "#"
      }
    ]);
  });

function renderNews(data) {
  const container = document.getElementById('announcements');
  if (!container) return;
  
  container.innerHTML = ''; // Clear existing content
  
  data.forEach(item => {
    const div = document.createElement('div');
    div.className = 'announcement';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.title}" />
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <a href="${item.link}" target="_blank">Read More</a>
    `;
    container.appendChild(div);
  });
}
