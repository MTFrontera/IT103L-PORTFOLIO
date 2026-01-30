const body = document.body;
const themeButton = document.getElementById('theme-toggle');
const wallpaperButton = document.getElementById('wallpaper-toggle');

themeButton.addEventListener('click', () => {
  body.classList.toggle('dark');
});

const wallpapers = [
  "images/wallpaper1.jpg",
  "images/wallpaper2.jpg",
  "images/wallpaper5.jpg",
  "images/wallpaper6.jpg",
];

let currentWallpaperIndex = 0;

body.style.backgroundImage = `url('${wallpapers[currentWallpaperIndex]}')`;
body.style.backgroundSize = "cover";
body.style.backgroundPosition = "center";
body.style.backgroundAttachment = "fixed";

wallpaperButton.addEventListener('click', () => {
  currentWallpaperIndex = (currentWallpaperIndex + 1) % wallpapers.length;
  body.style.backgroundImage = `url('${wallpapers[currentWallpaperIndex]}')`;
});

function displayGreeting() {
  const name = document.getElementById("userInput").value;
  const result = document.getElementById("result");
  
  if (name.trim() !== "") {
    result.textContent = "Hello, " + name + "! Welcome to JavaScript Programming.";
    result.style.color = "var(--primary)";
    result.style.fontWeight = "bold";
    result.style.marginTop = "10px";
  } else {
    result.textContent = "Please enter a name first.";
    result.style.color = "red";
  }
}