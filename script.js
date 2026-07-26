/* 
© 2026 Not Found Pages · 404-retro-macos-desktop-remastered
Released under the MIT License

Repository → https://github.com/notfoundpages/404-retro-macos-desktop-remastered
Live Preview → https://notfoundpages.github.io/404-retro-macos-desktop-remastered

Discover the full collection → https://notfoundpages.github.io
*/

// --- Clock Logic ---
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  document.getElementById('clock').textContent = `${hours}:${minutes} ${ampm}`;
}
setInterval(updateClock, 1000);
updateClock();

// --- Window Dragging Logic ---
const windowEl = document.getElementById('main-window');
const dragHandle = document.getElementById('drag-handle');
let isDragging = false, isMaximized = false;
let startX, startY, initialLeft, initialTop;

// Center window on load
function centerWindow() {
  if (isMaximized) return;
  const rect = windowEl.getBoundingClientRect();
  windowEl.style.left = (window.innerWidth / 2 - rect.width / 2) + 'px';
  windowEl.style.top = (window.innerHeight / 2 - rect.height / 2) + 'px';
}
window.addEventListener('load', centerWindow);
window.addEventListener('resize', () => { if (!isDragging && !isMaximized) centerWindow(); });

dragHandle.addEventListener('mousedown', dragStart);
dragHandle.addEventListener('touchstart', dragStart, { passive: false });

function dragStart(e) {
  if (isMaximized) return; // Prevent drag if full screen
  if (e.target.classList.contains('color-dot')) return; // Ignore buttons

  isDragging = true;
  const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
  const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

  startX = clientX;
  startY = clientY;

  const rect = windowEl.getBoundingClientRect();
  initialLeft = rect.left;
  initialTop = rect.top;

  document.addEventListener('mousemove', drag);
  document.addEventListener('touchmove', drag, { passive: false });
  document.addEventListener('mouseup', dragEnd);
  document.addEventListener('touchend', dragEnd);
}

function drag(e) {
  if (!isDragging) return;
  e.preventDefault(); // prevent scrolling on touch
  const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
  const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

  const dx = clientX - startX;
  const dy = clientY - startY;

  windowEl.style.left = `${initialLeft + dx}px`;
  windowEl.style.top = `${initialTop + dy}px`;
}

function dragEnd() {
  isDragging = false;
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('touchmove', drag);
  document.removeEventListener('mouseup', dragEnd);
  document.removeEventListener('touchend', dragEnd);
}

// --- Window Controls ---
function closeWindow() {
  windowEl.style.display = 'none';
  setTimeout(() => {
    document.getElementById('reboot').style.display = 'flex';
  }, 500);
}

// Listen for keypress to reboot
document.addEventListener('keydown', (e) => {
  if (document.getElementById('reboot').style.display === 'flex') {
    location.reload();
  }
});

function toggleMinimize() {
  if (isMaximized) return; // Don't minimize if maximized
  windowEl.classList.toggle('minimized');
}

function toggleMaximize() {
  isMaximized = !isMaximized;
  windowEl.classList.toggle('maximized');
  if (!isMaximized) centerWindow();
}

// --- Theme Changing ---
function changeTheme(color) {
  document.body.style.backgroundColor = color;
  document.documentElement.style.setProperty('--bg-color', color);
}

// --- Boot Sequence Typing Effect ---
const bootText = [
  "INIT: Starting kernel process...",
  "Mounting local file systems... OK.",
  "Loading UI drivers... OK.",
  "Searching for destination URI...",
  "ERROR: Directory index absent.",
  "FATAL: PAGE_NOT_FOUND (404)."
];

let textIndex = 0;
let charIndex = 0;
const outputEl = document.getElementById('typed-output');

function typeWriter() {
  if (textIndex < bootText.length) {
    if (charIndex < bootText[textIndex].length) {
      outputEl.innerHTML += bootText[textIndex].charAt(charIndex);
      charIndex++;
      setTimeout(typeWriter, Math.random() * 30 + 20); // typing speed
    } else {
      outputEl.innerHTML += "<br>";
      textIndex++;
      charIndex = 0;
      setTimeout(typeWriter, 300); // delay between lines

      // Auto-scroll terminal
      const terminal = document.getElementById('terminal');
      terminal.scrollTop = terminal.scrollHeight;
    }
  }
}

setTimeout(typeWriter, 800); // initial delay

// Retry Button glitch
function retryConnection() {
  outputEl.innerHTML += "> Retrying connection...<br>";
  setTimeout(() => {
    outputEl.innerHTML += "<span style='color:red'>> ERROR: Still missing. Give up.</span><br>";
    const terminal = document.getElementById('terminal');
    terminal.scrollTop = terminal.scrollHeight;
  }, 1000);
}