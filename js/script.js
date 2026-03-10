function changeColor(color) {
  document.body.style.backgroundColor = color;
  document.documentElement.style.setProperty('--bg-color', color);
}