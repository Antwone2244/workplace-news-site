document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('announcements');
  if (!container) {
    alert('Error: Cannot find announcements container!');
    return;
  }
  
  // TEMPORARY: Hardcoded test data
  container.innerHTML = `
    <div class="announcement">
      <img src="/images/uploads/flood.jpg" alt="Test Image">
      <h3>TEST: Flood Watch</h3>
      <p>If this appears, your HTML/CSS works</p>
      <a href="#">Read More</a>
    </div>
  `;
});
