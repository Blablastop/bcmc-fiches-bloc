"use strict";
const normalize = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const search = document.querySelector("#recherche");
if (search) {
  document.querySelector(".search-box").hidden = false;
  const cards = [...document.querySelectorAll(".zone-card")];
  const status = document.querySelector("#search-status");
  search.addEventListener("input", () => {
    const words = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    let count = 0;
    cards.forEach(card => {
      const match = words.every(word => normalize(card.dataset.search).includes(word));
      card.hidden = !match;
      if (match) count++;
    });
    status.textContent = words.length ? `${count} zone${count > 1 ? "s" : ""} trouvée${count > 1 ? "s" : ""}` : "";
    document.querySelector("#no-results").hidden = count !== 0;
  });
}
const printButton = document.querySelector("[data-print]");
if (printButton) {
  printButton.hidden = false;
  printButton.addEventListener("click", () => window.print());
}
const copyButton = document.querySelector("[data-copy]");
if (copyButton && /^https?:$/.test(location.protocol)) {
  copyButton.hidden = false;
  copyButton.addEventListener("click", async () => {
    const status = document.querySelector(".copy-status");
    try {
      await navigator.clipboard.writeText(location.href);
      status.textContent = "Lien copié. Vous pouvez le coller dans Discord.";
    } catch {
      status.textContent = `Lien de la fiche : ${location.href}`;
    }
  });
}
