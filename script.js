fetch('news/index.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('announcements');
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
  });
