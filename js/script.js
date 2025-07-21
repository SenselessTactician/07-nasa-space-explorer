// script.js
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const button = document.querySelector('button');
const gallery = document.getElementById('gallery');
const API_KEY = 'uMKTtsZ8hxzcJNcDhbqUDMAqE92wWIprIpawHYQ4';
const NASA_APOD_URL = 'https://api.nasa.gov/planetary/apod';

// Fun space facts
const spaceFacts = [
  "Venus is the hottest planet in the solar system.",
  "A day on Venus is longer than a year on Venus.",
  "There are more stars in the universe than grains of sand on Earth.",
  "Saturn could float in water because it's mostly made of gas.",
  "Neutron stars can spin at a rate of 600 rotations per second."
];

function showRandomFact() {
  const fact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
  const factElem = document.createElement('div');
  factElem.textContent = `✨ Did You Know? ${fact}`;
  factElem.style.padding = '10px';
  factElem.style.textAlign = 'center';
  factElem.style.fontStyle = 'italic';
  gallery.parentNode.insertBefore(factElem, gallery);
}

function showLoading() {
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">\uD83D\uDD04</div>
      <p>Loading space photos…</p>
    </div>
  `;
}

function showGallery(items) {
  gallery.innerHTML = '';
  items.forEach(item => {
    if (item.media_type !== 'image') return;

    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.innerHTML = `
      <img src="${item.url}" alt="${item.title}" />
      <p><strong>${item.title}</strong><br>${item.date}</p>
    `;
    div.addEventListener('click', () => showModal(item));
    div.querySelector('img').style.transition = 'transform 0.3s';
    div.querySelector('img').addEventListener('mouseover', e => e.target.style.transform = 'scale(1.05)');
    div.querySelector('img').addEventListener('mouseout', e => e.target.style.transform = 'scale(1)');
    gallery.appendChild(div);
  });
}

function showModal(item) {
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.padding = '20px';
  modal.style.zIndex = '9999';

  modal.innerHTML = `
    <div style="background: white; max-width: 800px; width: 100%; padding: 20px; border-radius: 10px; overflow-y: auto; max-height: 90%">
      <img src="${item.hdurl || item.url}" alt="${item.title}" style="width: 100%; height: auto; border-radius: 6px; margin-bottom: 10px;" />
      <h2>${item.title}</h2>
      <p><em>${item.date}</em></p>
      <p>${item.explanation}</p>
      <button style="margin-top: 10px; padding: 10px 20px; cursor: pointer;">Close</button>
    </div>
  `;

  modal.querySelector('button').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
  document.body.appendChild(modal);
}

async function fetchImages(start, end) {
  showLoading();
  const url = `${NASA_APOD_URL}?api_key=${API_KEY}&start_date=${start}&end_date=${end}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (Array.isArray(data)) {
      showGallery(data);
    } else {
      gallery.innerHTML = `<p style="text-align: center;">Error fetching data: ${data.msg}</p>`;
    }
  } catch (err) {
    gallery.innerHTML = `<p style="text-align: center; color: red;">Failed to fetch data. Please try again later.</p>`;
  }
}

button.addEventListener('click', () => {
  const start = startDateInput.value;
  const end = endDateInput.value;
  if (!start || !end || start > end) {
    alert('Please select a valid date range.');
    return;
  }
  fetchImages(start, end);
});

// On page load
setupDateInputs(startDateInput, endDateInput);
showRandomFact();
fetchImages(startDateInput.value, endDateInput.value);
function setupDateInputs(startInput, endInput) {
  // Get today's date
  const today = new Date();

  // Get the date 7 days ago
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6); // Show 7 days including today

  // Set input values using YYYY-MM-DD format
  startInput.value = sevenDaysAgo.toISOString().split('T')[0];
  endInput.value = today.toISOString().split('T')[0];

  // Set allowed min/max for inputs
  startInput.min = '1995-06-16'; // APOD start date
  endInput.max = today.toISOString().split('T')[0];
}