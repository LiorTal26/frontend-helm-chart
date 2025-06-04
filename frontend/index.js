/* ---------- run once on page load ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // show backend “hello”
  fetch('/api/info')
    .then(r => r.json())
    .then(({ message }) => {
      document.getElementById('api-response').textContent = message;
    })
    .catch(err => console.error('Error fetching /api/info:', err));

  // initialise click counter display
  document.querySelector('.click-counter').textContent =
    `Click Counter: ${btnCounter}`;
});

/* ---------- brain‑rot button ---------- */
async function getBrainrot() {
  clickCounter();

  try {
    // *** use ASCII hyphen ***
    const res = await fetch('/api/random-brainrot', { cache: 'no-store' });
    if (!res.ok) throw new Error(res.status);

    // backend returns { word: "Tralalero Tralala" }
    const { word } = await res.json();

    // update text
    document.getElementById('random-brainrot').textContent =
      `🧠 Your Italian Brainrot: ${word}`;

    // update image
    const img = document.getElementById('brainrot-img');
    img.src = `/images/${encodeURIComponent(word)}.jpg`;
    img.alt = word;

  } catch (err) {
    console.error('Error fetching brainrot:', err);
  }
}

/* ---------- shimi button ---------- */
function getShimi() {
  clickCounter();

  const container = document.getElementById('shimi-container');
  const button    = document.querySelector('.shimi-btn');

  button.disabled = true;
  container.innerHTML = '';            // clear previous Shimi

  const img = new Image();
  img.src  = '/images/shimi.jpg';
  img.alt  = 'Shimi';
  img.className = 'shimi-image';
  container.appendChild(img);

  const audio = new Audio('/audio/swalla.mp3');
  audio.volume = 0.5;
  audio.play();

  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
    img.remove();
    button.disabled = false;
  }, 5000);
}

/* ---------- click counter & easter‑egg ---------- */
let btnCounter = parseInt(localStorage.getItem('btnCounter')) || 0;

function clickCounter() {
  const display   = document.querySelector('.click-counter');
  const easterEgg = document.querySelector('.easter-egg');

  if (btnCounter === 69) {
    btnCounter = 0;                                // reset
    easterEgg.classList.remove('hidden');
    easterEgg.classList.add('animate');

    setTimeout(() => {
      easterEgg.classList.add('hidden');
      easterEgg.classList.remove('animate');
    }, 5000);
  } else {
    btnCounter++;
  }

  display.textContent = `Click Counter: ${btnCounter}`;
  localStorage.setItem('btnCounter', btnCounter);
}
