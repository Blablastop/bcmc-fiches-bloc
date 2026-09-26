"use strict";
const normalize = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
document.documentElement.classList.add("js-ready");
const themeButton = document.querySelector("[data-theme-toggle]");
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (themeButton) themeButton.textContent = theme === "dark" ? "Mode clair" : "Mode sombre";
}
let savedTheme;
try { savedTheme = localStorage.getItem("bcmc-theme"); } catch {}
applyTheme(savedTheme === "light" ? "light" : "dark");
if (themeButton) {
  themeButton.hidden = false;
  themeButton.addEventListener("click", () => {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(theme);
    try { localStorage.setItem("bcmc-theme", theme); } catch {}
  });
}
const menuButton = document.querySelector("[data-menu]");
if (menuButton) {
  menuButton.hidden = false;
  menuButton.addEventListener("click", () => {
    const opened = document.body.dataset.menuOpen !== "true";
    document.body.dataset.menuOpen = String(opened);
    menuButton.setAttribute("aria-expanded", String(opened));
    menuButton.textContent = opened ? "Fermer les fiches" : "Fiches";
  });
}
const search = document.querySelector("#recherche");
if (search) {
  document.querySelector(".search-box").hidden = false;
  const files = [...document.querySelectorAll(".file-link[data-search]")];
  const folders = [...document.querySelectorAll(".folder")];
  const initialOpen = folders.map(folder => folder.open);
  search.addEventListener("input", () => {
    const words = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    let count = 0;
    files.forEach(file => {
      const match = words.every(word => normalize(file.dataset.search).includes(word));
      file.hidden = !match;
      if (match) count++;
    });
    folders.forEach((folder, index) => {
      const match = [...folder.querySelectorAll(".file-link")].some(file => !file.hidden);
      folder.hidden = !match;
      folder.open = words.length ? match : initialOpen[index];
    });
    document.querySelector("#search-status").textContent = words.length ? `${count} fiche${count > 1 ? "s" : ""} trouvée${count > 1 ? "s" : ""}` : "";
    document.querySelector("#no-results").hidden = count !== 0;
  });
}
const printButton = document.querySelector("[data-print]");
if (printButton) {
  printButton.hidden = false;
  printButton.addEventListener("click", () => window.print());
}
const copyButton = document.querySelector("[data-copy]");
const copyStatus = document.querySelector(".copy-status");
if (copyButton && copyStatus && /^https?:$/.test(location.protocol)) {
  copyButton.hidden = false;
  copyButton.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(location.href); copyStatus.textContent = "Lien copié."; }
    catch { copyStatus.textContent = `Lien de la fiche : ${location.href}`; }
  });
}
