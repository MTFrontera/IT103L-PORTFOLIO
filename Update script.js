const body = document.body;
const themeButton = document.getElementById('theme-toggle');
const wallpaperButton = document.getElementById('wallpaper-toggle');

themeButton.addEventListener('click', () => {
  body.classList.toggle('dark');
});

const wallpapers = [
  "images/wallpaper1.jpg",
  "images/wallpaper2.jpg",
  "images/wallpaper3.jpg",
  "images/wallpaper4.jpg",
];

let currentWallpaperIndex = 0;

body.style.backgroundImage = `url('${wallpapers[currentWallpaperIndex]}')`;
body.style.backgroundSize = "cover";
body.style.backgroundPosition = "center";

wallpaperButton.addEventListener('click', () => {
  currentWallpaperIndex = (currentWallpaperIndex + 1) % wallpapers.length;
  body.style.backgroundImage = `url('${wallpapers[currentWallpaperIndex]}')`;
});
